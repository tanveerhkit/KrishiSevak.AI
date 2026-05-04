from flask import Flask, render_template, request
import requests

app = Flask(__name__)

# Predefined crop water requirements (liters per day)
crop_water_requirements = {
    "Wheat": {
        "Seedling": (2000, 2400),
        "Vegetative": (5000, 6000),
        "Flowering": (6000, 7000),
        "Maturity": (5500, 6500)
    },
    "Rice": {
        "Seedling": (3200, 4000),
        "Vegetative": (6500, 8000),
        "Flowering": (8000, 9000),
        "Maturity": (6500, 8000)
    },
    "Corn": {
        "Seedling": (2800, 3600),
        "Vegetative": (5500, 7000),
        "Flowering": (7000, 8500),
        "Maturity": (6000, 7500)
    }
}

# Predefined States and Cities (For Location Dropdown)
locations = {
    "Uttar Pradesh": ["Kanpur", "Lucknow", "Varanasi", "Agra"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Punjab": ["Amritsar", "Ludhiana", "Chandigarh"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"]
}

# Function to get weather data from OpenWeatherMap API
def get_weather_data(location):
    api_key = '54805b96f0dad7aea6aed3484b9d508a'  # Your OpenWeatherMap API key
    url = f'http://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric'
    response = requests.get(url)
    data = response.json()

    if data["cod"] != 200:
        return None
    return data["main"]["temp"], data["weather"][0]["description"]

# Route to handle the form and display irrigation level
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get user input from the form
        crop_name = request.form['crop']
        stage_name = request.form['stage']
        field_size = float(request.form['field_size'])  # in acres
        emitter_type = request.form['emitter']
        emitter_flow_rate = float(request.form['emitter_flow_rate'])  # in liters per hour
        location = request.form['location']

        # Get the water requirement for the selected crop and stage
        min_water, max_water = crop_water_requirements[crop_name][stage_name]

        # Adjust water requirement based on emitter type (e.g., drip irrigation)
        if emitter_type == "Drip":
            water_factor = 0.9  # 10% water saving with drip irrigation
        else:
            water_factor = 1.0  # No change for other emitters (e.g., sprinkler)

        # Total water requirement (liters per day) for the selected crop and stage
        total_water = (min_water + max_water) / 2 * field_size * water_factor

        # Calculate the time required based on the emitter flow rate
        hours_needed = total_water / emitter_flow_rate

        # Get weather data for the location (temperature and weather description)
        weather_data = get_weather_data(location)
        if weather_data is None:
            return render_template('index.html', error="Location not found!")

        temp, weather = weather_data

        # Return the result to be displayed in the template
        return render_template('index.html', total_water=total_water, temp=temp, weather=weather,
                               crops=crop_water_requirements.keys(), stages=["Seedling", "Vegetative", "Flowering", "Maturity"],
                               locations=locations, hours_needed=hours_needed, selected_location=location,
                               emitter_flow_rate=emitter_flow_rate)

    # Render the form initially
    return render_template('index.html', crops=crop_water_requirements.keys(), stages=["Seedling", "Vegetative", "Flowering", "Maturity"], locations=locations)

app.run(debug=True, host="127.0.0.1", port=8081)


