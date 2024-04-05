from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from bs4 import BeautifulSoup
from datetime import datetime
import json
from dotenv import load_dotenv
import os
load_dotenv("./env")
DATABASE_URL = os.environ.get("VITE_REACT_APP_DATABASE_URL")
API_KEY = os.environ.get("VITE_REACT_APP_FIREBASE_API_KEY")
def get_main_page_content(url):
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument("--headless") 
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    capabilities = webdriver.DesiredCapabilities.CHROME.copy()
    capabilities['acceptInsecureCerts'] = True
    options.add_argument('--ignore-certificate-errors')
    with webdriver.Chrome(service=service, options=options) as browser:
        browser.get(url)
        try:
            WebDriverWait(browser, 20).until(
                EC.presence_of_element_located((By.ID, "widget-jobsearch-results-list"))
            )
        except TimeoutException as e:
            print("The element was not loaded within the given time.")
            print(browser.page_source)
            raise e
        return browser.page_source

def get_job_page_content(url):
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--ignore-certificate-errors')

    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    options.set_capability('goog:loggingPrefs', {'browser': 'SEVERE'})
    with webdriver.Chrome(service=service, options=options) as browser:
        browser.get(url)
        try:
            WebDriverWait(browser, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
        except TimeoutException:
            print("Timed out waiting for page to load")
            return None
        return browser.page_source

def extract_links(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    entry_content_wrappers = soup.find_all('div', class_='entry-content-wrapper clearfix')
    
    hrefs = set()
    for wrapper in entry_content_wrappers:
        links = wrapper.find_all('a', href=True)
        for link in links:
            hrefs.add(link['href'])
    return list(hrefs)

def extract_job_info(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')

    job_info = {
        "title":"",
        "company": " CVS Pharmacy",
        "location": "New York, NY",
        "position_summary": "",
        "required_qualifications": "",
        "preferred_qualifications": "",
        "education": "",
        "pay_range": ""
    }
    title_heading = soup.find('h1')
    job_info["title"] = title_heading.get_text(strip=True) if title_heading else ""

    pos_summary_heading = soup.find(string="Position Summary")
    if pos_summary_heading:
        pos_summary_text = pos_summary_heading.find_next('p')
        pos_summary_text = pos_summary_text.find_next('p')
        job_info["position_summary"] = pos_summary_text.get_text(strip=True) if pos_summary_text else ""

    req_qual_heading = soup.find(string="Required Qualifications")
    if req_qual_heading:
        parent = req_qual_heading.find_parent()
        qualifications_list = parent.find_next_sibling(['ul', 'ol'])
        print(qualifications_list)
        if qualifications_list:
            list_items = qualifications_list.find_all('li')
            job_info["required_qualifications"] = [li.get_text(strip=True) for li in list_items if li.text.strip()]

    pref_qual_heading = soup.find(string="Preferred Qualifications")
    if pref_qual_heading:
        parent = pref_qual_heading.find_parent()
        pref_qualifications_list = parent.find_next_sibling(['ul', 'ol'])
        if pref_qualifications_list:
            list_items = pref_qualifications_list.find_all('li')
            job_info["preferred_qualifications"] = [li.get_text(strip=True) for li in list_items if li.text.strip()]

    edu_heading = soup.find(string="Education")
    if edu_heading:
        parent = edu_heading.parent
        edu_text = parent.find_next_sibling('p')
        job_info["education"] = edu_text.get_text(strip=True) if edu_text else ""

    pay_range_heading = soup.find(string="Pay Range")
    if pay_range_heading:
        pay_range_text = pay_range_heading.find_next('p')
        pay_range_text = pay_range_text.find_next('p')
        pay_range_text = pay_range_text.find_next('p')
        job_info["pay_range"] = pay_range_text.get_text(strip=True) if pay_range_text else ""
    return job_info

def job_exists(url):
    query = {
        "structuredQuery": {
            "where": {
                "fieldFilter": {
                    "field": {"fieldPath": "url"},
                    "op": "EQUAL",
                    "value": {"stringValue": url}
                }
            },
            "from": [{"collectionId": "Jobs"}],
            "limit": 1
        }
    }
    response = requests.post(f"{DATABASE_URL}:runQuery?key={API_KEY}", json=query)
    result = response.json()
    return bool(result and result[0] and 'document' in result[0])

def store_job_posting(job, url):
    if not job_exists(url):
            print("Storing Jobs...")
            data = {
                "fields": {
                        "title": {"stringValue": job["title"]},
                        "company": {"stringValue": job["company"]},
                        "location": {"stringValue": job["location"]},
                        "position_summary": {"stringValue": job["position_summary"]},
                        "required_qualifications": {
                            "arrayValue": {
                                "values": [{"stringValue": qual} for qual in job["required_qualifications"]]
                            }
                        },
                        "preferred_qualifications": {
                            "arrayValue": {
                                "values": [{"stringValue": qual} for qual in job["preferred_qualifications"]]
                            }
                        },
                        "education": {"stringValue": job["education"]},
                        "pay_range": {"stringValue": job["pay_range"]},
                        "url": {"stringValue": url},
                    }
            }
            
            response = requests.post(f"{DATABASE_URL}?key={API_KEY}", json=data)
            return response.json()
       
def fetch_job_postings():
    print("Fetching job postings...")
    page_number = 1
    base_url = "https://jobs.cvshealth.com/job-search-results/?parent_category=Stores&location=NYC%2C%20NY%2C%20USA&latitude=40.7127753&longitude=-74.0059728&radius=25&pg={}"
    base_job_url = "https://jobs.cvshealth.com"
    
    while page_number < 5:
        page_url = base_url.format(page_number)
        print(f"Accessing page: {page_url}")
        content = get_main_page_content(page_url)
        
        if not content or "no jobs found" in content.lower():
            print("No more job postings found, ending search.")
            break
        
        links = extract_links(content)
        if not links:
            print("No more job postings found, ending search.")
            break

        print("Extracting job info...")
        for link in links:
            full_url = base_job_url + link
            job_page_content = get_job_page_content(full_url)
            job_data = extract_job_info(job_page_content)
            store_job_posting(job_data, full_url)
        
        page_number += 1

    print("Job scraping concluded.")

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

def localTest(info):
    with open('./soup_content.txt', 'a', encoding='utf-8') as file:
        file.write(json.dumps(info, ensure_ascii=False, indent=2))
        file.write("\n\n")

if __name__ == "__main__":
    print("Starting job scraping...")
    fetch_job_postings()
    print("Job Scraping Concluded.")