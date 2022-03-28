import './weather/weatherstyles.css'
import React, { useEffect, useState } from 'react'

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

const Weather = ({ backendData }) => {
	const [tempScale, setTempScale] = useState('Celsius');
	const [todayData, setTodayData] = useState({
		city: backendData.weatherToday.timezone,
		temp: backendData.weatherToday.current.temp
	});
	

	useEffect(() => {
		const convertedTemperature = convert_temp_to(backendData.weatherToday.current.temp, tempScale);
		setTodayData({
			city: backendData.weatherToday.timezone,
			temp: convertedTemperature
		});
	}, [backendData]);

	return (
		<div className='weather-container'>
			<h1 className="weather-target-city">{todayData.city}</h1>
			<p className="weather-target-country"></p>
			<div className="current-weather">
				<div className='current-weather__main-temp'>
					<h1>{todayData.temp}°</h1>
					<h3>Celsius</h3>
				</div>
			</div>

		</div>
	)
}

export default Weather