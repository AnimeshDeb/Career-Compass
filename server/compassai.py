# import io
import os
import time
from typing import List

from modal import Image, Secret, Stub, enter, exit, gpu, method

MODEL_DIR = "/model"
BASE_MODEL = "google/gemma-7b-it"

model_config = """
You are an AI assistant that should be able to provide users with information on how to navigate through the website and offer general career advice. Here are some key points about the website's structure and the assistant's responsibilities:

The website has a landing page where users can either log in or sign up. After logging in, users are directed to their user page.
The website has a navigation bar at the top with four icons on the right side:
A magnifying glass icon for searching and finding other users on the platform.
A suitcase icon that leads users to the job page where they can view and apply for jobs.
An icon with two users that takes users to the groups page, allowing them to view their groups and chat with mentors/mentees within their groups.
An exit icon with an arrow on the rightmost side for users to log out of their account.
The AI assistant should be able to provide general career advice, including tips on job search, resume writing, cover letter preparation, and other related topics.
For more specific or personalized questions, the assistant should guide users to reach out to mentors who can offer tailored advice and support.
The assistant should have a friendly and professional tone, encouraging users to explore the website's features and resources.
Please create a persona for this AI assistant, defining its character traits, knowledge base, and communication style. The assistant should be able to engage in conversational interactions with users, understanding their queries and providing helpful responses based on the website's structure and career guidance topics.

Try to avoid sending messages that are too long. If a question may warrant a long response ask the user if they would like you to clarify some more before doing so.


Just to clairfy you are an AI assistant, created to help users navigate a career advice website and offer general guidance. 

Traits:
- Friendly, approachable, and professional 
- Knowledgeable about job search, resumes, cover letters, and interviews
- Encourages users to utilize site features and resources
- Refers users to mentors for personalized advice
- Responds concisely, asking for clarification if needed to avoid overly long messages

Website Details: 
- Landing page to log in or sign up
- User page after login 
- Nav bar with search, jobs, groups/chat, and logout
- Job page to view and apply to postings
- Groups page to interact with mentors/mentees

Provide helpful information to guide users through the site and offer general career tips. Keep responses focused while maintaining a warm, supportive tone.
"""

def download_model_to_folder():
    from huggingface_hub import snapshot_download
    from transformers.utils import move_cache

    os.makedirs(MODEL_DIR, exist_ok=True)

    snapshot_download(
        BASE_MODEL,
        local_dir=MODEL_DIR,
        token=os.environ["HF_TOKEN"],
        ignore_patterns=["*.pt", "*.gguf"],
    )
    move_cache()

image = (
    Image.from_registry(
        "nvidia/cuda:12.1.1-devel-ubuntu22.04", add_python="3.10"
    )
    .pip_install(
        "vllm==0.3.2",
        "huggingface_hub==0.19.4",
        "hf-transfer==0.1.4",
        "torch==2.1.2",
    )
    # modal documentation:
    # Use the barebones hf-transfer package for maximum download speeds. Varies from 100MB/s to 1.5 GB/s,
    # so download times can vary from under a minute to tens of minutes.
    # If your download slows down or times out, try interrupting and restarting.
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
    .run_function(
        download_model_to_folder,
        secrets=[Secret.from_name("my-huggingface-secret")],
        timeout=60 * 20,
    )
)

stub = Stub(f"compassai_gemma", image=image)


GPU_CONFIG = gpu.H100(count=1)


@stub.cls(gpu=GPU_CONFIG, secrets=[Secret.from_name("my-huggingface-secret")])
class Model:
    @enter()
    def load(self):
        from vllm import LLM

        if GPU_CONFIG.count > 1:
            import ray
            ray.shutdown()
            ray.init(num_gpus=GPU_CONFIG.count)

        self.llm = LLM(
            MODEL_DIR,
            enforce_eager=True, 
            tensor_parallel_size=GPU_CONFIG.count,
        )
        self.prompt = model_config

    @method()
    def generate(self, query: str) -> str:
        from vllm import SamplingParams

        prompt = f"{self.prompt}\nuser: {query}\nassistant:"
        sampling_params = SamplingParams(
            temperature=0.75,
            top_p=0.99, 
            max_tokens=256,
            presence_penalty=1.15,
        )
        result = self.llm.generate([prompt], sampling_params)
        return result[0].outputs[0].text.split("assistant:")[-1].strip()
    
    @exit()
    def stop_engine(self):
        if GPU_CONFIG.count > 1:
            import ray
            ray.shutdown()

@stub.local_entrypoint()
def main(test_queries=[]):
    compass = Model()
    if test_queries:
        for query in test_queries:
            print(f"Query: {query}")
            print(f"Response: {compass.generate(query)}\n")
    else:
        print("CompassAI deployed. Ready to handle queries.")

        # testing in terminal

        # while True:
        #     user_query = input("Enter your query (or 'quit' to exit): ")
        #     if user_query.lower() == 'quit':
        #         break

        #     start_time = time.time()
        #     # call the generate method through the model object not the class
        #     response = compass.generate(user_query)
        #     end_time = time.time()
        #     execution_time = end_time - start_time

        #     print(f"Response: {response}")
        #     print(f"Execution Time: {execution_time:.2f} seconds\n")