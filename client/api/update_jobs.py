from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
from dotenv import load_dotenv
import os
load_dotenv("./env")
print("Starting job scraping...")

def fetch_job_postings():
    print("Fetching job postings...")
    base_url = "https://www.google.com/about/careers/applications/jobs/results?page={}"
    response = requests.get(base_url.format())
    if response.status_code == 200:
        print("Successfully fetched job postings.")
    else:
        print(f"Failed to fetch job postings. Status code: {response.status_code}")
    soup = BeautifulSoup(response.content, 'html.parser')
    job_cards = soup.find_all('div', class_='Ln1EL')  # Example class, adjust as needed
    FIRESTORE_URL = "https://firestore.googleapis.com/v1/projects/career-compass-77175/databases/(default)/documents/Jobs"
    API_KEY = os.environ.get("VITE_REACT_APP_FIREBASE_API_KEY")

    def store_job_posting(job):
        data = {
            "fields": {
                "title": {"stringValue": job["title"]},
                "company": {"stringValue": job["company"]},
                "location": {"stringValue": job["location"]},
                "link": {"stringValue": job["link"]}
            }
        }
        response = requests.post(f"{FIRESTORE_URL}?key={API_KEY}", json=data)
        return response.json()
    jobs = []
    jobs_stored = 0
    for job in job_cards:
        if jobs_stored >= 10:
            break;
        title_tag = job.find('h3', class_='QJPWVe')  # Example class, adjust as needed
        title = title_tag.text if title_tag else "No Title"
        company_tag = job.find('span', class_='RP7SMd')  # Example class, adjust as needed
        company = company_tag.text if company_tag else "No Company"
        location_tag = job.find('span', class_='pwO9Dc vo5qdf')  # Example class, adjust as needed
        location = location_tag.text if location_tag else "No Location"
        link = "https://www.google.com/about/careers/applications/jobs/results"  # Example link
        job_data = {"title": title, "company": company, "location": location, "link": link}
        store_job_posting(job_data)
        jobs_stored += 1
        

class handler(BaseHTTPRequestHandler):
    
    def do_GET(self):
        # Parse query parameters
        query_components = parse_qs(urlparse(self.path).query)
        page_number = query_components.get("page", [1])[0]  # Default to page 1 if not specified
        
        try:
            # Convert page_number to int, fetch job postings, and encode the result as JSON
            job_postings = fetch_job_postings(int(page_number))
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(job_postings).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(str(e).encode())

if __name__ == "__main__":
    fetch_job_postings()