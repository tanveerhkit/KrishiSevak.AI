#include <esp_now.h>
#include <WiFi.h>
#include <DHT.h>

#define DHTPIN 4         // Pin connected to DHT22
#define DHTTYPE DHT22    // DHT 22 (AM2302), AM2321
DHT dht(DHTPIN, DHTTYPE);

const int waterSensorPin = 32;      // Pin connected to water sensor
const int moistureSensorPin = 34;   // Analog pin connected to soil moisture sensor
const int dryThreshold = 4050;      // Threshold value for dry soil (adjust as needed)

// Replace with the MAC Address of the Solenoid Valve ESP32
uint8_t broadcastAddress[] = {0xD4, 0x8A, 0xFC, 0xCE, 0xA6, 0x40};

typedef struct struct_message {
  bool state;       // true = soil wet, false = soil dry
  float temperature; // DHT22 temperature
  float humidity;    // DHT22 humidity
  int waterLevel;    // Water sensor reading
  int soilMoisture;  // Soil moisture sensor reading
} struct_message;

struct_message StateOut;
esp_now_peer_info_t peerInfo;

void setup() {
  // Initialize Serial Monitor
  Serial.begin(115200);

  // Initialize DHT22
  dht.begin();

  // Initialize pins
  pinMode(moistureSensorPin, INPUT);
  pinMode(waterSensorPin, INPUT);

  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Register peer
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;

  // Add peer
  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }
}

void loop() {
  // Read Soil Moisture Sensor
  int soilMoistureValue = analogRead(moistureSensorPin);
  Serial.print("Soil Moisture Level: ");
  Serial.println(soilMoistureValue);

  // Read DHT22 Sensor
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    temperature = humidity = 0;
  } else {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C, Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
  }

  // Read Water Sensor
  int waterLevel = digitalRead(waterSensorPin);
  Serial.print("Water Sensor: ");
  Serial.println(waterLevel);

  // Prepare data to send via ESP-NOW
  StateOut.temperature = temperature;
  StateOut.humidity = humidity;
  StateOut.waterLevel = waterLevel;
  StateOut.soilMoisture = soilMoistureValue;

  // Determine if the soil is wet or dry based on the moisture sensor
  StateOut.state = (soilMoistureValue >= dryThreshold); // true if soil is wet, false if dry

  // Send moisture state and sensor data via ESP-NOW
  esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *)&StateOut, sizeof(StateOut));
  if (result == ESP_OK) {
    Serial.println("Data sent successfully");
  } else {
    Serial.println("Error sending data");
  }

  delay(1000); // Wait before next reading
}
