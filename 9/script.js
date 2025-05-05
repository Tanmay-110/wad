function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    const resultDiv = document.getElementById('result');
  
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'weather.json', true);
  
    xhr.onload = function () {
      if (this.status === 200) {
        const data = JSON.parse(this.responseText);
  
        if (data[city]) {
          const weather = data[city];
          resultDiv.innerHTML = `
            <strong>Weather in ${city}</strong><br>
            Temperature: ${weather.temperature}<br>
            Humidity: ${weather.humidity}<br>
            Condition: ${weather.condition}
          `;
        } else {
          resultDiv.innerHTML = `<span style="color:red;">City not found in local data.</span>`;
        }
      } else {
        resultDiv.innerHTML = `Failed to load weather data.`;
      }
    };
  
    xhr.send();
  }
  