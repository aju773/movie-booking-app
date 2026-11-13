# 🎬 Movie Booking App

A full-stack movie booking platform built with **Django REST Framework**, **React.js**, and **MySQL**.
This project was created after learning Django, React, and MySQL.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#1-clone-the-repository)
  - [Backend Setup](#2-backend-setup-django)
  - [Frontend Setup](#3-frontend-setup-react)

---

## ✨ Features

- 🔑 **Authentication**
  - JWT login & signup
- 🎥 **Movie Discovery**
  - Browse movies from the TMDB API
  - Search and view movie details
- 🎟 **Booking System**
  - Theater & showtime selection
  - Booking confirmation and history

---

## 🛠 Tech Stack

| Layer         | Technology                        |
| ------------- | --------------------------------- |
| Backend       | Django REST Framework, MySQL, JWT |
| Frontend      | React 18, Vite                    |
| External APIs | TMDB (movie data)                 |

---

## 📁 Project Structure

```
movie-booking-app/
├── client/              # React + Vite frontend
├── server/              # Django REST Framework backend
├── docker-compose.yml   # MySQL, backend and frontend services
└── .github/workflows/   # Deployment workflow
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- MySQL 8.0

### 1. Clone the Repository

```bash
git clone https://github.com/aju773/movie-booking-app.git
cd movie-booking-app
```

### 2. Backend Setup (Django)

```bash
cd server
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create an admin user
python manage.py createsuperuser

# Start the Django server
python manage.py runserver
```

### 3. Frontend Setup (React)

```bash
cd ../client
npm install
cp .env.example .env   # Add API URL + TMDB keys
npm run dev
```
