import { useState, useEffect } from "react";
import axios from "axios";
import {
  IoMdSunny, IoMdRainy, IoMdCloud, IoMdSnow, IoMdThunderstorm, IoMdSearch
} from "react-icons/io";
import {
  BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsWind, BsThermometer
} from "react-icons/bs";
import { TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

// API Key
const API_KEY = "439f4c10d56f42ed81a140548252504";

// Icon mapping
const weatherIcons = {
  "Cloudy": <IoMdCloud />,
  "Haze": <BsCloudHaze2Fill />,
  "Rain": <IoMdRainy />,
  "Clear": <IoMdSunny />,
  "Drizzle": <BsCloudDrizzleFill />,
  "Snow": <IoMdSnow />,
  "Thunderstorm": <IoMdThunderstorm />,
};

const App = () => {
  const [data, setData] = useState(null);
  const [city, setCity] = useState("Kratie");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);

  // Fetch Weather Data
  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError("");
      const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
      const response = await axios.get(url);

      // Fake loading for better UX
      setTimeout(() => {
        setData(response.data);
        setLoading(false);
      }, 1200);

    } catch (err) {
      setLoading(false);
      setError("City not found. Try again!");
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  // Remove error after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim() === "") {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);
    } else {
      setCity(input);
      setInput("");
    }
  };

  const today = new Date();
  const weatherCondition = data?.current?.condition?.text;
  const icon = weatherIcons[weatherCondition] || <IoMdCloud />;

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-indigo-500 to-teal-400 flex flex-col items-center justify-center p-6">

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/80 text-white px-4 py-2 rounded mb-6 animate-pulse">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className={`flex items-center bg-white/30 backdrop-blur-md rounded-full overflow-hidden w-full max-w-md mb-8 ${animate ? "animate-shake" : ""}`}
      >
        <input
          type="text"
          placeholder="Search city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-white p-4 text-base outline-none"
        />
        <button
          type="submit"
          className="p-4 text-white hover:bg-white/20 transition"
        >
          <IoMdSearch size={24} />
        </button>
      </form>

      {/* Loading Spinner */}
      {loading ? (
        <ImSpinner8 className="text-white text-6xl animate-spin" />
      ) : (
        data && (
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 w-full max-w-md text-white space-y-8 shadow-2xl">

            {/* Weather Main Info */}
            <div className="flex flex-col items-center space-y-2">
              <div className="text-7xl">{icon}</div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">{data.location.name}, {data.location.country}</h2>
                <p className="text-sm opacity-80">{today.toLocaleDateString()}</p>
              </div>
            </div>

            {/* Temperature */}
            <div className="flex justify-center items-center space-x-2">
              <h1 className="text-7xl font-extralight">{data.current.temp_c}</h1>
              <TbTemperatureCelsius className="text-4xl" />
            </div>

            {/* Condition */}
            <div className="text-center text-lg capitalize tracking-wide font-medium">
              {data.current.condition.text}
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4 text-sm opacity-90">
              <WeatherDetail icon={<BsEye size={20} />} label="Visibility" value={`${data.current.vis_km} km`} />
              <WeatherDetail icon={<BsThermometer size={20} />} label="Feels Like" value={`${data.current.feelslike_c}°C`} />
              <WeatherDetail icon={<BsWater size={20} />} label="Humidity" value={`${data.current.humidity}%`} />
              <WeatherDetail icon={<BsWind size={20} />} label="Wind" value={`${data.current.wind_kph} km/h`} />
            </div>

          </div>
        )
      )}
    </div>
  );
};

// Subcomponent for better structure
const WeatherDetail = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span>{label}:</span>
    <span className="ml-auto font-semibold">{value}</span>
  </div>
);

export default App;
