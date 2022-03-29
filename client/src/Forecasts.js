import React, { useEffect, useState } from 'react'
import './forecasts/forecaststyles.css'

const Forecasts = ({ backendData, tempScale, convert_temp_to, convert_from_unix_time }) => {
	const [forecastData, setForecastData] = useState(backendData.nextDaysWeather);

	useEffect(() => {
		setForecastData(backendData.nextDaysWeather);
	}, [backendData]);


	return (
		<div className='forecasts-container'>
			<h1 className="the-forecasts">The next days</h1>

			{
				forecastData.list.map(day => {
					const temperature = convert_temp_to(day.main.temp, tempScale);
					const tempSensation = convert_temp_to(day.main.feels_like, tempScale);
					const time = convert_from_unix_time(day.dt);

					return(
						<div className="daily-info-container" key={day.dt}>
							<h3 className='week-day'>{time.weekDay}, {time.month}  {time.dayNumber}  at  {time.hour}</h3>
							<div className="forecast-info">
								<h2 className="forecast-info-temp">
									{temperature}{tempScale === 'Celsius' ?'°C' :'°F'}
								</h2>
								<p className="forecast-info-weatherDesc">{day.weather[0].description}</p>
								<p className="forecast-info-feesLike">Feels like: {tempSensation}{tempScale === 'Celsius' ?'°C' :'°F'}</p>
							</div>
						</div>
					)
				})
			}

			{/* <div className="daily-info-container">
				<h3 className='week-day'>Thursday</h3>
				<div className="forecast-info">
					<h2 className="forecast-info-temp">
						55° {tempScale === 'Celsius' ?'C' :'F'}
					</h2>
					<p className="forecast-info-weatherDesc">Rainny day</p>
					<p className="forecast-info-feesLike">Feels like: 55° C</p>
				</div>
			</div> */}
			
		</div>
	)
}

export default Forecasts