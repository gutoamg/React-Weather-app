import './app/appstyles.css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import UserLocation from './UserLocation';
import Weather from './Weather';








function App() {
	var firstRenderApp = useRef(true);
	const [userLocation, setUserLocation] = useState({
		lat: undefined,
		lon: undefined
	});
	const [cityName, setCityName] = useState('London');
	const[backendData, setBackendData] = useState({
		weatherToday: undefined,
		nextDaysWeather: undefined
	});

	
	
	// useEffect(() => {

	// 	const getData = async () => {
	// 		const data = await axios.get('http://localhost:7600/', { mode: 'cors' });
	// 		console.log(data.data);

	// 		// const datahover = await axios.get('http://api.openweathermap.org/data/2.5/weather?q=London', {
	// 		//   mode: 'cors',
	// 		//   headers: {
	// 		//     Authorization: 'afdc57a19766650b6ba9459fa9606f37'
	// 		// }
	// 		// })
	// 		// console.log(datahover);
	// 	}
	// 	getData();
	// 	get_current_location();


	// 	const send_city_info = async dataOrigin => {
	// 		const fetchOptions = {
	// 			method: "POST",
	// 			withCredentials: true,
	// 			mode: 'cors',
	// 			headers: {
	// 				'Access-Control-Allow-Origin': '*',
	// 				'Content-Type': 'application/json',
	// 				'Accept': 'application/json'
	// 			},
	// 			body: JSON.stringify({
	// 				coordinates: userLocation, 
	// 				city: cityName
	// 			})
	// 		};
	// 		const sendData = await axios.post(`http://localhost:7600/?dataOrigin=${dataOrigin}`, fetchOptions);
	// 		// var receiveData = await sendData.json();
	// 		console.log(sendData.data);
	// 		return sendData;
	// 	};
	// 	console.log(cityName, userLocation);
	// }, [cityName]);

	// Send data to backend and retrieve information
	// Only runs from second render on
	useEffect(() => {
		const make_backend_request = async (userLocation, cityName) => {
			const fetchOptions = {
				method: "POST",
				withCredentials: true,
				mode: 'cors',
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				data: {
					coordinates: userLocation, 
					city: cityName
				}
			};
			const returnedBackData = await axios.post(`http://localhost:7600/`, fetchOptions);
			// console.log(returnedBackData.data);
			return returnedBackData.data;
		};

		const update_backend_data = async () => {
			const responseFromBackend = await make_backend_request(userLocation, cityName);
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
			<UserLocation 
				geolocation_update={ newLocation => setUserLocation(newLocation) } 
				update_city_name={ newName => setCityName(newName) } 
				backendData={backendData}
			/> 
			{
				(backendData.weatherToday !==  undefined 
				&& backendData.weatherToday !== 'Strange name input' 
				&& backendData.weatherToday !== 'Server error')
				?<Weather backendData={backendData} />
				:''
			}
			{/* <Weather backendData={backendData} /> */}
		</div>
	);
}

export default App;
