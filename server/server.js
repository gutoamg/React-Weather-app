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

// app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(cors());



const get_current_weather = async (coordinates) => {
    var currentW = false;
    var currentDayWeather = false;

    try {
        currentW = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${process.env.API_KEY}`);
        currentDayWeather = await currentW.json();
    } catch (err) { // If there was some server error
        currentDayWeather = err;
        return currentDayWeather;
    }
    return currentDayWeather;
};

const get_forecast = async (coordinates) => {
    var forecast = false;
    var forecastWeather = false;

    try {
        forecast = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${process.env.API_KEY}`);
        forecastWeather = await forecast.json();
    } catch (err) { // If there was some server error
        forecastWeather = err;
        return forecastWeather;
    }
    return forecastWeather;
};

const get_coords_by_cityname = async (cityName) => {
    var coordinates = false;
    var cityCoordinates = false;

    try {
        coordinates = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${process.env.API_KEY}`);
        cityCoordinates = await coordinates.json();
    } catch (err) { // If there was some server error
        cityCoordinates = err;
        return cityCoordinates;
    }
    cityCoordinates = {
        city: cityCoordinates[0].name,
        country: cityCoordinates[0].country,
        lat: cityCoordinates[0].lat,
        lon: cityCoordinates[0].lon
    }

    return cityCoordinates;
};

// MAKE UPDATE EVERY 3 HOURS - THATS WHEN THEIR DATABASE UPDATES

// Forecast by city name
// api.openweathermap.org/data/2.5/forecast?q={CITY_NAME}?units=metric,us&appid={API_ID}




app.post('/', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    // if (req.query.dataOrigin === 'input') {
    //     const cityCoords = get_coords_by_cityname(req.city);
    //     console.log(req);
    // } else if (req.query.dataOrigin === 'geolocation') {
    //     console.log(req);
    //     const weatherToday = await get_current_weather(req.coordinates);   // info = coordinates
    //     const nextDaysWeather = await get_forecast(req.coordinates);
    //     res.json({ weatherToday, nextDaysWeather });
    // }
    const { coordinates, city } = req.body.data;
    console.log(req.body.data);
    res.json({coordinates, city});
    res.end();
});

app.get('/', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    // if (req.query.dataOrirgin === 'input') {

    // } else if (req.query.dataOrirgin === 'geolocation') {
    //     req.data
    // }


    // res.set('Access-Control-Allow-Origin', '*');
    // const weatherData = await get_current_weather();
    res.json({loal: 'hkjhskdf'});
});

app.listen(PORT, (req, res) => {
    console.log("Weather server running");
});