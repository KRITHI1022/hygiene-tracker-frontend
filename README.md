# Hygiene Monitoring System — Frontend

A smart city hygiene monitoring web application frontend built with HTML, Bootstrap 5, and Vanilla JavaScript.

## Features

- Citizen registration and login with JWT authentication
- Citizen dashboard to raise hygiene complaints with GPS location
- Official dashboard to view, assign and resolve ward complaints
- Real-time bin level monitoring with notification bell
- Interactive Leaflet.js map showing complaint locations
- Role-based access — Citizen and Official views
- Responsive design with Bootstrap 5

## Tech Stack

- HTML5, CSS3, Bootstrap 5
- Vanilla JavaScript (Fetch API)
- Leaflet.js for maps
- Bootstrap Icons

## Pages

| Page | Description |
|------|-------------|
| landing.html | Landing page |
| index.html | Login page |
| register.html | Registration page |
| citizen-dashboard.html | Citizen complaint submission and tracking |
| official-dashboard.html | Official incident management |
| user-profile.html | Citizen profile page |
| official-profile.html | Official profile page |

## Setup Instructions

1. Clone the repository: `git clone https://github.com/KRITHI1022/hygiene-tracker-frontend.git`
2. Make sure the backend is running on `http://localhost:8080`
3. Open with Live Server in VS Code
4. Navigate to `landing.html` to start

## Backend Repository

[hygiene-tracker-backend](https://github.com/KRITHI1022/hygiene-tracker-backend)