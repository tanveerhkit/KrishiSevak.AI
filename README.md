# KRISHISEVAK.AI – AI–IoT Hybrid Fusion System

**KRISHISEVAK.AI** is a state-of-the-art AI-IoT Hybrid Fusion System designed for Smart Irrigation and Crop Health Prediction. It leverages Vision-Based Environmental Analytics and Adaptive Reinforcement Control to empower farmers with data-driven insights and automated precision agriculture tools.

## Project Structure

This repository contains several interconnected modules that form the KrishiSevak ecosystem:

### 1. 🤖 Harvestify (AI/ML Module)
- **Purpose**: Crop recommendation and plant disease prediction.
- **Tech Stack**: Python, Flask, Machine Learning (Scikit-learn/TensorFlow).
- **Features**: Analyzes soil parameters (N, P, K, pH, rainfall) to suggest the best crops and identifies plant diseases from images.

### 2. 💧 Irrigation Project (Smart Control)
- **Purpose**: Automated irrigation management.
- **Tech Stack**: Python, Flask.
- **Features**: Monitors soil moisture levels and controls water pumps based on environmental data and predictive models.

### 3. 🔌 Hardware Code (IoT Layer)
- **Purpose**: Firmware for sensors and actuators.
- **Tech Stack**: C++ (Arduino/ESP8266/ESP32).
- **Features**: Real-time data collection from DHT11/22 sensors, Soil Moisture sensors, and relay control for water pumps.

### 4. 🛒 AgriTechWeb & KrishiSeva (Marketplace & Portal)
- **Purpose**: Farmer-facing web interfaces.
- **Tech Stack**: HTML, Javascript, PHP, Node.js, Firebase.
- **Features**: A platform for buying/selling agricultural products, chatting with experts, and managing profiles.

### 5. 🌐 BasedSmiles (Modern Frontend)
- **Purpose**: Modernized user interface.
- **Tech Stack**: Next.js, Tailwind CSS, TypeScript.
- **Features**: Premium dashboard for data visualization and system control.

### 6. 📜 Farmers Schemes
- **Purpose**: Information portal for government aid.
- **Tech Stack**: HTML, CSS, JS.
- **Features**: Provides a curated list of government schemes and subsidies available to farmers.

---

## Getting Started

### Prerequisites
- Python 3.x
- Node.js & npm
- Arduino IDE (for hardware code)
- PHP Server (for AgriTechWeb)

### Installation & Setup
Each subdirectory contains its own specific instructions for setup. 
- For Flask apps: `pip install -r requirements.txt`
- For Node apps: `npm install`
- For Hardware: Flash `.ino` files to your ESP8266/ESP32.

---

## 📸 Media
Included in the root directory are:
- `krishisevak.ai ppt.pptx`: Project presentation.
- Demonstration videos (`VID-...mp4`) and screenshots showing the system in action.

---

## Team
Developed as part of the KRISHISEVAK.AI initiative to bridge the gap between technology and traditional farming.
