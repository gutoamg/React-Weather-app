import './weather/weatherstyles.css'
import React, { useEffect, useState } from 'react'
import Forecasts from './Forecasts';

const convert_temp_to = (kelvinTemp, convertTo) => {
	var convertedTemp = 0;
	switch (convertTo) {
		case 'Celsius':
			convertedTemp = kelvinTemp - 273.15;
			break;

		case 'Fahrenheit':
			convertedTemp = ((kelvinTemp - 273.15) * 9 / 5) + 32;
			break;
	
		default:
			break;
	}
	return Math.floor(convertedTemp);
}

// Receives time in Unix type and returns
// object with time converted to hours,
// minutes and minutes.
const convert_from_unix_time = unixTime => {
	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds.
	var date = new Date(unixTime * 1000);
	// Hours part from the timestamp
	let hourFormat = new Intl.DateTimeFormat("en" , {
		timeStyle: "short"
	});
	var hours = hourFormat.format(date);
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + date.getSeconds();

	var humanFormat = date.toLocaleString(); //2019-12-9 10:30:15 format
	var weekDay = date.toLocaleString("en-US", {weekday: "long"}) // Monday
	var month = date.toLocaleString("en-US", {month: "long"}) // December
	var dayNumber = date.toLocaleString("en-US", {day: "numeric"}) // 9

	// Will display time in 10:30:23 format
	// var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	return {
		weekDay: weekDay,
		month: month,
		dayNumber: dayNumber,
		hour: hours
	}
}

const Weather = ({ backendData }) => {
	const [tempScale, setTempScale] = useState('Celsius');
	const [todayData, setTodayData] = useState({
		city: backendData.nextDaysWeather.city.name,
		country: backendData.nextDaysWeather.city.country,
		temp: backendData.weatherToday.current.temp,
		specificDescription: backendData.weatherToday.current.weather[0].description
	});
	

	useEffect(() => {
		const convertedTemperature = convert_temp_to(backendData.weatherToday.current.temp, tempScale);
		setTodayData({
			city: backendData.nextDaysWeather.city.name,
			country: backendData.nextDaysWeather.city.country,
			temp: convertedTemperature,
			specificDescription: backendData.weatherToday.current.weather[0].description
		});
	}, [backendData]);

	return (
		<div className='weather-container'>
			<h1 className="weather-target-city">{todayData.city}</h1>
			<p className="weather-target-country">{todayData.country}</p>
			<div className="current-weather">
				<div className='current-weather__main-temp'>
					<h1>{todayData.temp}°</h1>
					<h3>Celsius</h3>
					<h2>{todayData.specificDescription}</h2>
				</div>
			</div>

			<Forecasts 
				backendData={ backendData } 
				tempScale={ tempScale } 
				convert_temp_to={ convert_temp_to } 
				convert_from_unix_time={ convert_from_unix_time } 
			/>
		</div>
	)
}

export default Weather