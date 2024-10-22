# Weather App

This repository contains both the backend and frontend components of the Weather App. Follow the instructions below to set up and run the application.


## How to Run the Application Using Docker

Prerequisites

- Docker

1. First, clone this repository:

   - `git clone https://github.com/kaustubh619/IPGAutomotiveChallenge`
   - Navigate to the cloned directory:
     - `cd IPGAutomotiveChallenge`

2. Run the application with Docker Compose:

   - Open a command prompt and run:
     - `docker-compose up`

   This command will start both the backend and frontend services using Docker.

3. Access the Application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://127.0.0.1:8000/admin`

## How to Run the Application Without Docker

Prerequisites

- Python 3.6.x
- Node.js and npm
- Git

1. First, clone this repository:

   - `git clone https://github.com/kaustubh619/IPGAutomotiveChallenge`
   - `cd IPGAutomotiveChallenge`

2. Backend Setup:

   - Navigate to the `BackendDjango` directory: `cd BackendDjango`
   - Open a command prompt inside this directory and create a virtual environment: `virtualenv venv`
   - Activate the virtual environment:
     - On Windows: `venv\Scripts\activate`
     - On macOS/Linux: `source venv/bin/activate`
   - Install the required dependencies: `pip install -r requirements.txt`
   - Now, go inside the `weather_app_backend` directory:
     - `cd weather_app_backend`
   - Run the backend server using the command:
     - `python manage.py runserver`

   The backend will be running on `http://127.0.0.1:8000/admin`.

3. Frontend Setup:

   - Navigate to the `FrontendReact` directory
   - Inside `FrontendReact`, go to the `weather_app_frontend` directory:
     - `cd weather_app_frontend`
   - Open a command prompt inside this directory and install the frontend dependencies (this might take some time):
     - `npm install`
   - Start the frontend application:
     - `npm start`

   The frontend will be accessible on `http://localhost:3000`.

4. Access the Application:
   Once both the backend and frontend are running, you can open your browser and navigate to:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://127.0.0.1:8000/admin`


## Login Credentials
Use the following credentials to log in to the application:

- Username: ipgautomotive
- Password: carmaker