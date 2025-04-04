require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3001; 

const API_KEY = process.env.API_KEY;

app.get('/api/stations_list', async (req, res) => {
    try {
        const response = await axios.get('https://api.rasp.yandex.net/v3.0/stations_list/', {
            params: {
                apikey: API_KEY,
                lang: 'ru_RU',
                format: 'json',
            }
        });

        const samaraStations = response.data.countries
            .filter(country => country.title === 'Россия')
            .map(country => country.regions)
            .flat()
            .map(region => region.settlements)
            .flat()
            .map(settlement => settlement.stations)
            .flat();

        const trainStations = samaraStations.filter(station => station.station_type === 'train_station');
        res.json(trainStations);
    } catch (error) {
        console.error('Ошибка при получении списка станций:', error);
        res.status(500).send('Ошибка сервера');
    }
});
app.get('/api/schedule', async (req, res) => {
    const { station1, station2, date } = req.query;
    try {
        const response = await axios.get('https://api.rasp.yandex.net/v3.0/search/', {
            params: {
                apikey: API_KEY,
                from: station1,
                to: station2,
                date: date || new Date().toISOString().split('T')[0],
                lang: 'ru_RU',
                show_systems: 'yandex',
                format: 'json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Ошибка при получении расписания:', error);
        res.status(500).json({ error: 'Ошибка сервера', details: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
