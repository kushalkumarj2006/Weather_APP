const APIKEY = "5d8227f1161e43a189d33628240210";

const elements = {
    form: document.getElementById('searchForm'),
    cityInput: document.getElementById('cityInput'),
    cityName: document.getElementById('cityName'),
    error: document.getElementById('error'),
    loading: document.getElementById('loading'),
    weatherInfo: document.getElementById('weatherInfo'),
    region: document.getElementById('region'),
    coordinates: document.getElementById('coordinates'),
    localTime: document.getElementById('localTime'),
    weatherIcon: document.getElementById('weatherIcon'),
    weatherCondition: document.getElementById('weatherCondition'),
    temp: document.getElementById('temp'),
    tempF: document.getElementById('tempF'),
    lastUpdated: document.getElementById('lastUpdated'),
    lastUpdatedEpoch: document.getElementById('lastUpdatedEpoch'),
    localTimeEpoch: document.getElementById('localTimeEpoch'),
    wind: document.getElementById('wind'),
    windDir: document.getElementById('windDir'),
    windDegree: document.getElementById('windDegree'),
    gustSpeed: document.getElementById('gustSpeed'),
    humidity: document.getElementById('humidity'),
    humidityLevel: document.getElementById('humidityLevel'),
    precipitation: document.getElementById('precipitation'),
    precipIn: document.getElementById('precipIn'),
    pressure: document.getElementById('pressure'),
    pressureIn: document.getElementById('pressureIn'),
    visibility: document.getElementById('visibility'),
    visibilityMiles: document.getElementById('visibilityMiles'),
    feelsLike: document.getElementById('feelsLike'),
    feelsLikeF: document.getElementById('feelsLikeF'),
    uvIndex: document.getElementById('uvIndex'),
    uvLevel: document.getElementById('uvLevel'),
    cloudCover: document.getElementById('cloudCover')
};

async function fetchWeather(city) {
    try {
        showLoading(true);
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${APIKEY}&q=${city}&aqi=no`
        );
        const data = await response.json();
        
        if (data.error) {
            showError(data.error.message);
            return;
        }
        
        updateWeatherUI(data);
    } catch (err) {
        showError('Failed to fetch weather data');
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    elements.loading.classList.toggle('hidden', !show);
    elements.weatherInfo.classList.toggle('hidden', show);
}

function showError(message) {
    elements.error.textContent = message;
    elements.weatherInfo.classList.add('hidden');
}

function getUVDescription(uv) {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
}

function formatTime(epoch) {
    return new Date(epoch * 1000).toLocaleString();
}

function updateWeatherUI(data) {
    const { location, current } = data;
    
    // Location Information
    elements.cityName.textContent = location.name;
    elements.region.textContent = `${location.region}, ${location.country}`;
    elements.coordinates.textContent = `Coordinates: ${location.lat}°, ${location.lon}°`;
    elements.localTime.textContent = `Local Time: ${location.localtime}`;
    
    // Main Weather Display
    elements.weatherIcon.src = current.condition.icon.replace('64x64', '128x128');
    elements.weatherIcon.alt = current.condition.text;
    elements.weatherCondition.textContent = current.condition.text;
    
    // Temperature Information
    elements.temp.textContent = `${Math.round(current.temp_c)}°C`;
    elements.tempF.textContent = `${Math.round(current.temp_f)}°F`;
    elements.lastUpdated.textContent = `Last updated: ${current.last_updated}`;
    
    // Wind Information
    elements.wind.textContent = `Wind Speed: ${current.wind_kph} km/h (${current.wind_mph} mph)`;
    elements.windDir.textContent = `Wind Direction: ${current.wind_dir}`;
    elements.windDegree.textContent = `Wind Degree: ${current.wind_degree}°`;
    elements.gustSpeed.textContent = `Wind Gust: ${current.gust_kph} km/h (${current.gust_mph} mph)`;
    
    // Humidity and Precipitation
    elements.humidity.textContent = `Humidity: ${current.humidity}%`;
    elements.humidityLevel.style.width = `${current.humidity}%`;
    elements.precipitation.textContent = `Precipitation: ${current.precip_mm} mm`;
    elements.precipIn.textContent = `Precipitation: ${current.precip_in} in`;
    
    // Pressure Information
    elements.pressure.textContent = `Pressure: ${current.pressure_mb} mb`;
    elements.pressureIn.textContent = `Pressure: ${current.pressure_in} in`;
    elements.visibility.textContent = `Visibility: ${current.vis_km} km`;
    elements.visibilityMiles.textContent = `Visibility: ${current.vis_miles} miles`;
    
    // Temperature Feel and UV Index
    elements.feelsLike.textContent = `Feels Like: ${Math.round(current.feelslike_c)}°C`;
    elements.feelsLikeF.textContent = `Feels Like: ${Math.round(current.feelslike_f)}°F`;
    
    // UV Index
    const uvDescription = getUVDescription(current.uv);
    elements.uvIndex.textContent = `UV Index: ${current.uv} (${uvDescription})`;
    elements.uvLevel.style.width = `${(current.uv / 11) * 100}%`;
    
    // Cloud Cover
    elements.cloudCover.textContent = `Cloud Cover: ${current.cloud}%`;
    
    // Timestamps
    elements.lastUpdatedEpoch.textContent = `Last Updated: ${formatTime(current.last_updated_epoch)}`;
    elements.localTimeEpoch.textContent = `Local Time: ${formatTime(location.localtime_epoch)}`;
    
    // Clear any errors and show the weather info
    elements.error.textContent = '';
    elements.weatherInfo.classList.remove('hidden');
}

elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = elements.cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

// Initial weather fetch for London
fetchWeather('London');