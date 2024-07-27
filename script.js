
let weatherData = {};

const weather = {
    apiKey: "3ee7fdb817cf0e1b6851f241ac257770",
    fetchWeather: function(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`)
            .then(response => response.json())
            .then(data => {
                weatherData = data;
                this.displayWeather();
                this.speakWeather();
            })
            .catch(error => console.error('Error fetching weather:', error));
    },
    displayWeather: function() {
        const { name } = weatherData;
        const { icon, description } = weatherData.weather[0];
        const { temp, humidity } = weatherData.main;
        const { speed } = weatherData.wind;
        
        document.querySelector(".city").innerText = `Weather in ${name}`;
        document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = `${temp}°C`;
        document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
        document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;
        document.querySelector(".weather").classList.remove("loading");
    },
    speakWeather: function() {
        const { name } = weatherData;
        const { icon, description } = weatherData.weather[0];
        const { temp, humidity } = weatherData.main;
        const { speed } = weatherData.wind;
        
        const message = `The weather in ${name} is ${description}. The temperature is ${temp} degrees Celsius with ${humidity}% humidity. The wind speed is ${speed} kilometers per hour.`;
        
        const speech = new SpeechSynthesisUtterance(message);
        speech.lang = 'en-US';
        speech.volume = 1; 
        speech.rate = 1.2;
        speech.pitch = 1.2; 
        window.speechSynthesis.speak(speech);
    },
    search: function() {
        const city = document.querySelector(".search-bar").value;
        if (city) {
            this.fetchWeather(city);
        } else {
            alert("Please enter a city name.");
        }
    },
    voiceSearch: function() {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.querySelector(".search-bar").value = transcript;
            weather.search();
        };
        recognition.start();
    }
};


document.querySelector(".search button").addEventListener("click", () => {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        weather.search();
    }
});

document.querySelector(".voice-search").addEventListener("click", () => {
    weather.voiceSearch();
});
document.addEventListener("keyup", (event) => {
    if (event.key === " ") {
        weather.voiceSearch();
    }
    
});


weather.fetchWeather("trivandrum");
