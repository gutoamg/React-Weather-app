import './app/appstyles.css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import UserLocation from './UserLocation';
import Weather from './Weather';
import backgroundImage from './images/noaa-ZVhm6rEKEX8-unsplash.jpg'


function App() {
	var firstRenderApp = useRef(true);
	const [userLocation, setUserLocation] = useState({
		lat: undefined,
		lon: undefined
	});
	const [cityName, setCityName] = useState('');
	const[backendData, setBackendData] = useState({
		weatherToday: undefined,
		nextDaysWeather: undefined
	});
	

	// Send data to backend and retrieve information
	// Only runs from second render on
	useEffect(() => {
		const make_backend_request = async (userLocation, cityName) => {
			const fetchOptions = {
				method: "POST",
				withCredentials: true,
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				data: {
					coordinates: userLocation, 
					city: cityName
				}
			};

			let returnedBackData = {};
			try {
				returnedBackData = await axios.post(`/`, fetchOptions);
				// returnedBackData = returnedBackData.json();
			} catch (error) { // If there is an error in the POST process
				returnedBackData = { 
					data: { 
						weatherToday: 'Post request error', 
						nextDaysWeather: 'Post request error' 
					}
				};
			}
			
			return returnedBackData.data;
		};

		const update_backend_data = async () => {
			const responseFromBackend = await make_backend_request(userLocation, cityName);
			console.log(responseFromBackend);
			// if (responseFromBackend.status)
			setBackendData(responseFromBackend);
		}
		
		if (firstRenderApp.current === true) {
			firstRenderApp.current = false;
			return;
		}
		
		// If there is no data to send to backend, return to avoid new http requests
		if (cityName === "" && userLocation.lat === undefined && userLocation.lon === undefined)
			return;
		
		update_backend_data();

		console.log(`Fake backend request with location:`, userLocation, `and city: ${cityName}`, `and backendData ${backendData}`);
	}, [userLocation, cityName]);



	return (
		<div className="App">
			<img className='background-image' src={backgroundImage} alt="Background image" />
			<UserLocation 
				geolocation_update={ newLocation => setUserLocation(newLocation) } 
				update_city_name={ newName => setCityName(newName) } 
				backendData={backendData}
			/> 
			{
				(backendData.weatherToday !==  undefined 
				&& backendData.weatherToday !== 'Strange name input' 
				&& backendData.weatherToday !== 'Server error'
				&& backendData.weatherToday !== 'Post request error'
				&& backendData.nextDaysWeather !==  undefined 
				&& backendData.nextDaysWeather !== 'Strange name input' 
				&& backendData.nextDaysWeather !== 'Server error'
				&& backendData.nextDaysWeather !== 'Post request error')
				?<Weather backendData={backendData} />
				:''
			}
			{/* <Weather backendData={backendData} /> */}
		</div>
	);
}

export default App;
