import express from "express";
import path from "path";
import fetch from 'node-fetch';
import {fileURLToPath} from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 4000;




const get_current_weather = async () => {
    var response = false;
    var treatedResponse;
    try {
        response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&appid=${process.env.API_KEY}`);
        treatedResponse = await response.json();
    } catch (err) { // If there was some server error
        return treatedResponse = err;
    }
    // const resultsCount = treatedResponse.page * treatedResponse.per_page;
    // if (treatedResponse.total_results === 0 || resultsCount > treatedResponse.total_results) // If there are no results
    //     return false;
    return treatedResponse;
};

// MAKE UPDATE EVERY 3 HOURS - THATS WHEN THEIR DATABASE UPDATES

// Forecast by city name
// api.openweathermap.org/data/2.5/forecast?q=London,us&appid=afdc57a19766650b6ba9459fa9606f37





// app.use(express.static(`${__dirname}/public`));
app.use(express.json());

// app.post('/', async (req, res) => {
    
// });

app.get('/', async (req, res) => {
    const weatherData = await get_current_weather();
    res.set('Access-Control-Allow-Origin', '*');
    res.json({...weatherData});
});

app.listen(PORT, (req, res) => {
    console.log("Weather server running");
});