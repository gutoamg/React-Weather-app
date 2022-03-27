import React, { useEffect, useRef, useState } from 'react'
import './styles.css'







const UserLocation = ({ geolocation_update, update_city_name }) => {
	var firstRender = useRef(true);
	const [inputValue, setInputValue] = useState('');
	const [geolocationClassName, setGeolocationClassName] = useState('geoloc-err-hidden');
	const [userUpdatedLocation, setUserUpdatedLocation] = useState({
		lat: undefined,
		lon: undefined
	});
	const [updater, setUpdater] = useState(1);

	const update_input_value = (event) => {
		setInputValue(event.target.value);
	}

	// Makes geolocation error appear and disappear after 4 seconds
	const geolocation_error_anim = () => {
		setGeolocationClassName('geoloc-err-showing');
		setTimeout(() => {
			setGeolocationClassName('geoloc-err-hidden');
		}, 6000);
	}

	// If enter is pressed and there is an input,
	// the input value is searched
	const search_input_value = (event) => {
		if (event.keyCode === 13 && inputValue === '') {
			return;
		}
		
		if (event.keyCode === 13) { // Enter pressed
			update_city_name(inputValue);
			geolocation_update({
				lat: undefined,
				long: undefined
			});
		}
	}
	// Get new geolocation except for the first render
	useEffect(() => {
		// const get_current_location = () => {
		// 	return new Promise((resolve, reject) => {
		// 		const location__success = (userPosition) => {
		// 			const coordinates = userPosition.coords;
		// 			const userCoordinates = {
		// 				lat: coordinates.latitude,
		// 				lon: coordinates.longitude
		// 			}
		// 			console.log('Your current position is:');
		// 			console.log(`Latitude : ${coordinates.latitude}`);
		// 			console.log(`Longitude: ${coordinates.longitude}`);
		// 			console.log(`More or less ${coordinates.accuracy} meters.`);
		// 			resolve(userCoordinates);
		// 		}
		// 		const location__failure = (err) => {
		// 			console.warn(`ERROR(${err.code}): ${err.message}`);
		// 			const userCoordinates = {
		// 				lat: undefined,
		// 				lon: undefined
		// 			}
		// 			resolve(userCoordinates);
		// 		}
		// 		const locationOptions = {
		// 			timeout: 20000 // The response can take up to 20 seconds
		// 		}
		
		// 		navigator.geolocation.getCurrentPosition(location__success, location__failure, locationOptions);
		// 	});
		// }
		if (firstRender.current) return;

		const location__success = (userPosition) => {
			const coordinates = userPosition.coords;
			const userCoordinates = {
				lat: coordinates.latitude,
				lon: coordinates.longitude
			}
			console.log('Your current position is:');
			console.log(`Latitude : ${coordinates.latitude}`);
			console.log(`Longitude: ${coordinates.longitude}`);
			console.log(`More or less ${coordinates.accuracy} meters.`);
			setUserUpdatedLocation(userCoordinates);
		}
		const location__failure = (err) => {
			console.warn(`ERROR(${err.code}): ${err.message}`);
			const userCoordinates = {
				lat: undefined,
				lon: undefined
			}
			setUserUpdatedLocation(userCoordinates);
			update_city_name("");
			geolocation_error_anim();
		}
		const locationOptions = {
			timeout: 20000 // The response can take up to 20 seconds
		}
		navigator.geolocation.getCurrentPosition(location__success, location__failure, locationOptions);
	}, [updater]);

	// Do not update values in the first render
	// Only updates when the location value changes
	useEffect(() => {
		if (!firstRender.current) {
			geolocation_update(userUpdatedLocation);
			update_city_name("");
		}
		firstRender.current = false
	}, [userUpdatedLocation]);
	

	return (
		<div>
			<h1>Type a city</h1>
			<div className="search-bar">
					<input 
						type="text" 
						name="Search image" 
						placeholder="Search image" 
						id="search-input"
						className="search-bar__input"
						onChange={update_input_value}
						onKeyUp={search_input_value}
					/>
                <label className="search-bar__label" htmlFor="search-input">
				</label>
                <button className="search-bar__search" type="submit"></button>
                <button className="search-bar__clear" type="submit"></button>
            </div>
			<h3>OR</h3>
			<p className={geolocationClassName}>Your browser blocked location tracking, please check your permissions and settings or type city above</p> 
			<button style={{width: '200px', height: '40px', backgroundColor: 'lightblue'}} onClick={ () => setUpdater(updater + 1) }>Get your location</button>
		</div>
	)
}

export default UserLocation