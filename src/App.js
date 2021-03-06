import React from "react";
import "./App.css";

import "weather-icons/css/weather-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Weather from "./component/weather.component";
import Form from "./component/form.component";
import LoginPage from "./component/login";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      tempMax: undefined,
      tempMin: undefined,
      celsius: undefined,
      description: "",
      error: false,
      cod: undefined,
    };

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Rain: "wi-storm-showers",
      Clouds: "wi-day-fog",
      Clear: "wi-day-sunny",
      Atmosphere: "wi-fog",
      Snow: "wi-snow",
      Drizzle: "wi-sleet",
    };
  }

  getWeatherIcon(icons, rangeid) {
    switch (true) {
      case rangeid >= 200 && rangeid <= 232:
        this.setState({ icon: this.weatherIcon.Thunderstorm });
        break;

      case rangeid >= 300 && rangeid <= 321:
        this.setState({ icon: this.weatherIcon.Drizzle });
        break;

      case rangeid >= 500 && rangeid <= 531:
        this.setState({ icon: this.weatherIcon.Rain });
        break;

      case rangeid >= 600 && rangeid <= 622:
        this.setState({ icon: this.weatherIcon.Snow });
        break;

      case rangeid >= 701 && rangeid <= 781:
        this.setState({ icon: this.weatherIcon.Atmosphere });
        break;

      case rangeid >= 800:
        this.setState({ icon: this.weatherIcon.Clear });
        break;

      case rangeid >= 801 && rangeid <= 804:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;

      default:
        this.setState({ icon: this.weatherIcon.Clouds });
    }
  }

  calCelsius(temp) {
    return Math.floor(temp - 273.15);
  }

  getWeather = async (e) => {
    e.preventDefault();

    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;
    const apikey = process.env.REACT_APP_API_KEY;

    if (city && country) {
      const api_call = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apikey}`
      );

      const response = await api_call.json();

      console.log(response);

      this.setState({
        city: `${response.name},${response.sys.country}`,
        celsius: this.calCelsius(response.main.temp),
        tempMax: this.calCelsius(response.main.temp_max),
        tempMin: this.calCelsius(response.main.temp_min),
        description: response.weather[0].description,
        error: false,
        cod: response.cod,
      });

      this.getWeatherIcon(this.weatherIcon, response.weather[0].id);
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    return (
      <div className="App">
        <LoginPage />
        <Form loadweather={this.getWeather} error={this.state.error} />
        <Weather
          city={this.state.city}
          country={this.state.country}
          tempCelsius={this.state.celsius}
          tempMin={this.state.tempMin}
          tempMax={this.state.tempMax}
          description={this.state.description}
          weatherIcon={this.state.icon}
        />
      </div>
    );
  }
}

export default App;
