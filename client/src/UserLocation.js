import React, { useEffect, useRef, useState } from 'react'
import './typecity/typecitystyles.css'
import loadingIcon from "./Loading_icon.png";

const UserLocation = ({ geolocation_update, update_city_name, backendData }) => {
	var firstRender = useRef(true);
	var textInput = useRef(null);
	const [inputValue, setInputValue] = useState('');
	const [geolocationClassName, setGeolocationClassName] = useState('geoloc-err-hidden');
	const [userUpdatedLocation, setUserUpdatedLocation] = useState({
		lat: undefined,
		lon: undefined
	});
	const [updater, setUpdater] = useState(1);
	const [subtitleColor, setSubtitleColor] = useState('white');
	const [isLoading, setIsLoading] = useState(false);
	const [httpPostReqStatus, setHttpPostReqStatus] = useState('success');

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
		if (event.keyCode === 13 && event.target.value === '') {
			setInputValue("");
			textInput.current.value = "";
			return;
		}
		
		if (event.keyCode === 13) { // Enter pressed
			update_city_name(inputValue);
			geolocation_update({
				lat: undefined,
				long: undefined
			});
			setIsLoading(true);
		}
	}

	// Clears input field or search what's already there
	const input_clicked = (event) => {
		if (event.target.className === "get-location__search-bar__search") {
			if (textInput.current.value === "")
				return;
			update_city_name(inputValue);
			geolocation_update({
				lat: undefined,
				long: undefined
			});
			setIsLoading(true);
		} else if (event.target.className === "get-location__search-bar__clear") {
			textInput.current.focus();
			textInput.current.value = "";
			setInputValue("");
			update_city_name("");
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
			textInput.current.focus();
			setTimeout(() => {// Make loading button disappear
				setIsLoading(false);
			}, 5000);
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
			setIsLoading(true);
		}
		firstRender.current = false
	}, [userUpdatedLocation]);


	// When backend data changes
	useEffect(() => {
		if (backendData.weatherToday === 'Strange name input' || backendData.nextDaysWeather === 'Strange name input')
			setSubtitleColor('rgb(248, 79, 79)');
		else
			setSubtitleColor('white');
		if (backendData.weatherToday === 'Post request error' || backendData.nextDaysWeather === 'Post request error')
			setHttpPostReqStatus('failure');
		else
			setHttpPostReqStatus('success');
		setIsLoading(false);
	}, [backendData]);
	

	return (
		<div className="get-location">
			<h1 className="get-location__type-city">Type a city</h1>
			<p className="get-location__follow-model" style={{color: subtitleColor}}>
				Follow the model 'São Paulo', including capital letters, spaces and accents
			</p>
			<div className="get-location__search-bar" onClick={input_clicked}>
					<input 
						id="search-input"
						ref={textInput}
						type="text" 
						name="Discover city weather" 
						placeholder="Type a city name" 
						className="get-location__search-bar__input"
						onChange={update_input_value}
						onKeyUp={search_input_value}
					/>
                <label className="get-location__search-bar__label" htmlFor="search-input">
				</label>
                <button className="get-location__search-bar__search" type="submit"></button>
                <button className="get-location__search-bar__clear" type="submit"></button>
            </div>
			<h3 className='get-location__or'>or instead...</h3>
			<button className='get-location__button' onClick={ () => setUpdater(updater + 1) }>From your location</button>
			<p className={geolocationClassName}>Your browser blocked location tracking, please check your permissions and settings or type city above</p> 
			<p className={httpPostReqStatus === 'success' ? 'geoloc-err-hidden' : 'geoloc-err-showing'}>Server error, try again :(</p> 
			{
				isLoading
				? <div className="get-location__loading-icon-container">
					  <img src={loadingIcon} alt="Loading icon" className="get-location__loading-icon" />
				  </div> 
				:<p style={{display: 'none'}}></p>
			}
		</div>
	)
}

export default UserLocation