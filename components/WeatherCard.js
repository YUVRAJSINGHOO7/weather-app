'use client';

export default function WeatherCard({ weatherData }) {
  if (!weatherData) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{weatherData.city}</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold text-gray-900">{weatherData.temperature}°C</p>
          <p className="text-gray-600 capitalize">{weatherData.description}</p>
        </div>
        <img
          src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
          alt={weatherData.condition}
          className="w-16 h-16"
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-gray-600 text-sm">Humidity</p>
          <p className="font-semibold text-gray-800">{weatherData.humidity}%</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-gray-600 text-sm">Wind Speed</p>
          <p className="font-semibold text-gray-800">{weatherData.windSpeed} m/s</p>
        </div>
      </div>
    </div>
  );
} 