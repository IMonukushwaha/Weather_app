# Smart Weather

A personal weather companion web app built with **Node.js**, **Express**, **EJS**, and **SQLite**. Search real-time weather for any city and keep a persistent history of all your searches stored in a local SQL database.

---

## Features

- Live clock and date on the Home screen
- Real-time weather data from OpenWeatherMap API
- Displays temperature, feels like, humidity, and wind speed
- Search history stored persistently in a SQLite database
- Clear all history from the database via the History tab

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Node.js, Express.js                 |
| Templating | EJS                                 |
| Frontend   | Vanilla JS, CSS                     |
| Database   | SQLite via `better-sqlite3`         |
| Weather API| OpenWeatherMap                      |

---

## Project Structure

```
Weather-app/
├── public/
│   ├── app.js          # Frontend JavaScript
│   └── style.css       # Stylesheet
├── views/
│   └── index.ejs       # Main HTML template
├── db.js               # SQLite connection & table setup
├── server.js           # Express server & API routes
├── weather.db          # SQLite database (auto-created)
├── package.json
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get an OpenWeatherMap API key

- Sign up at [https://openweathermap.org/api](https://openweathermap.org/api)
- Copy your API key
- Replace the key in `public/app.js`:

```js
const API_KEY = 'your_api_key_here';
```

### 4. Run the app

```bash
nodemon server.js
# or
node server.js
```

### 5. Open in browser

```
http://localhost:1000
```
