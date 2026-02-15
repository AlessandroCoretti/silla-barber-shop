
import json
import urllib.request
import urllib.error
from datetime import datetime, timedelta

API_URL = "http://localhost:8081/api"

def get_json(url):
    try:
        with urllib.request.urlopen(url, timeout=2) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def post_json(url, data):
    try:
        req = urllib.request.Request(url, method="POST")
        req.add_header('Content-Type', 'application/json')
        jsondata = json.dumps(data).encode()
        with urllib.request.urlopen(req, jsondata, timeout=2) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error posting to {url}: {e}")
        return None

def create_test_booking(barber_id):
    today = datetime.now().strftime('%Y-%m-%d')
    booking = {
        "barber": barber_id,
        "service": "cut",
        "date": today,
        "time": "10:00",
        "name": "Test",
        "surname": "User",
        "email": "test@example.com",
        "phone": "1234567890",
        "price": 30.0
    }
    print(f"Creating booking: {booking}")
    return post_json(f"{API_URL}/bookings", booking)

def get_data():
    print(f"Connecting to {API_URL}...")
    barbers = get_json(f'{API_URL}/barbers')
    if barbers is not None:
        bookings = get_json(f'{API_URL}/bookings')
        return barbers, bookings
    return [], []

def calculate_stats(barbers, bookings):
    if not barbers:
        print("No barbers found.")
        return

    # print(f"Barbers found: {len(barbers)}")
    barber_ids = [b['id'] for b in barbers]
    # print(f"Barber IDs: {barber_ids}")

    now = datetime.now()
    start_of_day = datetime(now.year, now.month, now.day)
    
    current_day = now.weekday() 
    start_of_week_date = now - timedelta(days=current_day)
    start_of_week = datetime(start_of_week_date.year, start_of_week_date.month, start_of_week_date.day)
    
    start_of_month = datetime(now.year, now.month, 1)

    print(f"Start of Day: {start_of_day}")

    stats = {bid: {'daily': 0, 'weekly': 0, 'monthly': 0} for bid in barber_ids}

    print(f"\nProcessing {len(bookings)} bookings...")
    for b in bookings:
        if not b.get('date'):
            continue
            
        try:
            b_date_str = b['date']
            b_date = datetime.strptime(b_date_str, '%Y-%m-%d')
        except ValueError:
            continue
            
        price = 0
        if b.get('price'):
            try:
                price = float(b['price'])
            except:
                price = 0

        barber = b.get('barber')

        if barber not in stats:
            print(f"WARNING: Booking {b.get('id')} has unknown barber ID '{barber}'")
            continue
        
        is_daily = b_date >= start_of_day
        is_weekly = b_date >= start_of_week
        is_monthly = b_date >= start_of_month
        
        if is_daily:
            stats[barber]['daily'] += price
        if is_weekly:
            stats[barber]['weekly'] += price
        if is_monthly:
            stats[barber]['monthly'] += price
    
    print("\nCalculated Stats Results:")
    print(json.dumps(stats, indent=2))

if __name__ == "__main__":
    # Check if we need to seed data
    barbers, bookings = get_data()
    if barbers and not bookings:
        print("No bookings found. Creating test booking...")
        create_test_booking(barbers[0]['id']) # Use first barber
        # Fetch again
        barbers, bookings = get_data()
    
    if barbers:
        calculate_stats(barbers, bookings)
