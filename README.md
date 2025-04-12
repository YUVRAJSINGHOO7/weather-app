# Weather Dashboard

A real-time weather dashboard built with Next.js, MongoDB, and OpenWeatherMap API.

## Features

- Real-time weather data for any city
- Clean and responsive UI
- Error handling and loading states
- MongoDB integration for future features

## Prerequisites

- Node.js (v14 or later)
- MongoDB Atlas account
- OpenWeatherMap API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_atlas_connection_string
OPENWEATHER_API_KEY=your_openweather_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a city name in the search bar
2. Click the Search button or press Enter
3. View the current weather conditions for the specified city

## Technologies Used

- Next.js
- React
- MongoDB
- OpenWeatherMap API
- Tailwind CSS

## License

MIT
