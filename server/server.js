import express from "express";
import path from "path";
import fetch from 'node-fetch';
import {fileURLToPath} from 'url';
import cors from 'cors';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// app.use(function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,OPTIONS,POST,PUT,DELETE"
//     );
//     res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin,Cache-Control,Accept,X-Access-Token ,X-Requested-With, Content-Type, Access-Control-Request-Method"
//     );
//     if (req.method === "OPTIONS") {
//     return res.status(200).end();
//     }
//     next();
//     });


const get_current_weather = async (coordinates) => {
    var curResponse = false;
    var currentDayWeather = false;

    try {
        curResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${process.env.API_KEY}`);
        currentDayWeather = await curResponse.json();

        if (curResponse.status < 200 || curResponse.status > 299)// Outside this scope is an error
            throw new HttpError(curResponse);
        if (currentDayWeather === undefined)
            return undefined;
    } catch (err) { // If there was some http openWeather server error
        return 'Server error';
    }

    return currentDayWeather;
};

const get_forecast = async (coordinates) => {
    var forResponse = false;
    var forecastWeather = false;

    try {
        forResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${process.env.API_KEY}`);
        forecastWeather = await forResponse.json();

        if (forResponse.status < 200 || forResponse.status > 299)// Outside this scope is an error
            throw new HttpError(forResponse);
        if (forecastWeather === undefined)   
            return undefined;
    } catch (err) { // If there was some http openWeather server error
        return 'Server error';
    }
    
    return forecastWeather;
};

const get_coords_by_cityname = async (cityName) => {
    var response = false;
    var cityCoordinates = false;
    
    try {
        response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${process.env.API_KEY}`);
        cityCoordinates = await response.json();

        if (response.status < 200 || response.status > 299)
            throw new HttpError(response);
        if (cityCoordinates[0] === undefined) { // Strange name input
            cityCoordinates = { // Impossible values, indicating there was an error
                lat: 300,
                lon: 300
            }
        } else {
            cityCoordinates = {
                // city: cityCoordinates[0].name,
                // country: cityCoordinates[0].country,
                // localNames: cityCoordinates[0].local_names, // Future possibilities
                lat: cityCoordinates[0].lat,
                lon: cityCoordinates[0].lon
            }
        }
    } catch (err) { // If there was some server error
        // cityCoordinates = 'http req problem';
        // console.log("DAMN ERROR:", err);
        // return err;
        cityCoordinates = { // Impossible values, indicating there was an error
            lat: 400,
            lon: 400
        }
    }

    return cityCoordinates;
};


app.post('/', async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');

    const { coordinates, city } = req.body.data;
    var weatherToday = undefined;
    var nextDaysWeather = undefined;

    if (city !== "") { // Search by city name
        const cityInfo = await get_coords_by_cityname(city);
        if (cityInfo.lat <= 90 && cityInfo.lon <= 180) {
            weatherToday = await get_current_weather(cityInfo);
            nextDaysWeather = await get_forecast(cityInfo);
        } else if (cityInfo.lat === 300) { // The city name did not generate valid response
            weatherToday = 'Strange name input';
            nextDaysWeather = 'Strange name input';
        } else { // There was a major http error in the name request
            weatherToday = 'Server error';
            nextDaysWeather = 'Server error';
        }
    } else { // Search directly by coordinates
        weatherToday = await get_current_weather(coordinates);
        nextDaysWeather = await get_forecast(coordinates);
    }

    // If weatherToday or nextDaysWeather are undefined,
    // there was an error trying to get their values.
    // If any of them are equal to 'Strange name input' it
    // means the user should type in the right format or 
    // type a valid city name.
    // If any of them are equal to 'Server error', the
    // response was undefined or http error happened  
    res.json({ 
        weatherToday: weatherToday, 
        nextDaysWeather: nextDaysWeather 
    });

    res.end();
});

app.get('/', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({loal: 'hkjhskdf'});
});

app.listen(PORT, (req, res) => {
    console.log("Weather server running");
});

// OBS:
// Implement Promises.all to request weather