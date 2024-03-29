from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
from dotenv import load_dotenv
import os
load_dotenv("./env")
FIRESTORE_URL = "https://firestore.googleapis.com/v1/projects/career-compass-77175/databases/(default)/documents/Jobs"
API_KEY = os.environ.get("VITE_REACT_APP_FIREBASE_API_KEY")

def get_page_content(url):
    try:
        response = requests.get(url)
        response.raise_for_status() 
        return response.content
    except requests.HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'An error occurred: {err}')
      
        
def extract_links(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    # Find the container with the 'search-results-table' class
    table = soup.find('div', class_='search-results-table')
    
    links = [a.get('href') for a in table.find_all('a', href=True) if a.get('href')]
    print("LINKS:",links)
    return links


def store_job_posting(job):
        print("Storing Jobs...")
        data = {
            "fields": {
                "title": {"stringValue": job["title"]},
                "company": {"stringValue": job["company"]},
                "location": {"stringValue": job["location"]},
                "minimum_qualifications": {
                    "arrayValue": {
                        "values": [{"stringValue": qual} for qual in job["minimum_qualifications"]]
                    }
                }
            }
        }
        response = requests.post(f"{FIRESTORE_URL}?key={API_KEY}", json=data)
        return response.json()
    
    
def fetch_job_postings():
    
    print("Fetching job postings...")
    base_url = "https://jobs.cvshealth.com/job-search-results/?pg={}"
    content = get_page_content(base_url.format(2))
    print("Extracting links...")
    links = extract_links(content)
    jobs_stored = 0

    base_job_url = "https://jobs.cvshealth.com"
    job_cards = []
    print("Obtaining Job Cards...")
    for link in links:
        if jobs_stored >= 10:
            break
        full_url = base_job_url + link  # Concatenate the base URL with the relative link
        job_page_content = get_page_content(full_url)
        print(job_page_content)
        soup = BeautifulSoup(job_page_content, 'html.parser')
        title = soup.find('h1').text  # Modify with correct selectors
        job_data = {"title": title}
        store_job_posting(job_data)  # Define job_data with all necessary details
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
    print("Starting job scraping...")
    fetch_job_postings()
    print("Job Scraping Concluded.")