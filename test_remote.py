
import json
import urllib.request
import urllib.error
import sys

# URL provided by user (adding https://)
API_URL = "https://net-quentin-alessandrocoretti-69422591.koyeb.app/api"

def get_json(url):
    print(f"Fetching {url}...")
    try:
        # User agent sometimes helps if WAF blocks requests
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}")
        return None
    except urllib.error.URLError as e:
        print(f"URL Error: {e.reason}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    print(f"Testing connection to: {API_URL}")
    barbers = get_json(f'{API_URL}/barbers')
    
    if barbers:
        print(f"\nSUCCESS! Found {len(barbers)} barbers.")
        print("The URL is correct and the backend is online.")
    else:
        print("\nFAILURE. Could not connect or retrieve data.")
