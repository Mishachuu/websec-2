import React, { useState, useEffect } from 'react';
import './App.css';
import StationSelect from './StationSelect';
import Map from './Map';
import Schedule from './Schedule';

function App() {
  const [stations, setStations] = useState([]);
  const [station1, setStation1] = useState(null);
  const [station2, setStation2] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStationsOnMap, setSelectedStationsOnMap] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stationToFocus, setStationToFocus] = useState(null);

  const [showAd, setShowAd] = useState(true);

  
  useEffect(() => {
    fetch('/api/stations_list')
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error('Ошибка при получении станций:', error));
  }, []);

  const handleStationSelect = (station, stationIndex) => {
    if (stationIndex === 1) {
      setStation1(station);
    } else {
      setStation2(station);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleShowOnMap = (station) => {
    setSelectedStationsOnMap(prevStations => {
      if (!prevStations.some(s => s.codes.esr_code === station.codes.esr_code)) {
        return [...prevStations, station];
      }
      return prevStations;
    });

    setStationToFocus(station);
  };

  const toggleFavorite = (station) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.some(fav => fav.codes.esr_code === station.codes.esr_code)) {
        return prevFavorites.filter(fav => fav.codes.esr_code !== station.codes.esr_code);
      }
      return [...prevFavorites, station];
    });
  };

  const sortedStations = [
    ...favorites,
    ...stations.filter(station => !favorites.some(fav => fav.codes.esr_code === station.codes.esr_code))
  ];

  return (
    <div className="container">
      <h1>Прибывалка для электричек</h1>

      <div className="station-date-section">
        <div className="station-section">
          <h2>Выберите первую станцию:</h2>
          <StationSelect
            stations={sortedStations}
            onStationSelect={(station) => handleStationSelect(station, 1)}
            selectedStation={station1 ? station1.codes.esr_code : null}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
          {station1 && (
            <button onClick={() => handleShowOnMap(station1)}>
              Показать на карте
            </button>
          )}
        </div>

        <div className="station-section">
          <h2>Выберите вторую станцию:</h2>
          <StationSelect
            stations={sortedStations}
            onStationSelect={(station) => handleStationSelect(station, 2)}
            selectedStation={station2 ? station2.codes.esr_code : null}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
          {station2 && (
            <button onClick={() => handleShowOnMap(station2)}>
              Показать на карте
            </button>
          )}
        </div>

        <div className="date-section">
          <h3>Выберите дату:</h3>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="map-section">
        <h3>Все станции</h3>
        <Map
          stations={stations}
          selectedStations={selectedStationsOnMap}
          stationToFocus={stationToFocus}
        />
      </div>

      {station1 && station2 && selectedDate && (
        <div className="schedule-section">
          <Schedule
            station1={station1}
            station2={station2}
            date={selectedDate}
          />
        </div>
      )}
      {showAd && (
        <div className="ad-popup" style={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#fffae6',
          padding: '15px',
          boxShadow: '-3px 3px 10px rgba(221, 13, 13, 0.2)',
          zIndex: 1000
        }}>
          <strong>Здесь могла быть ваша реклама!</strong>
        </div>
      )}
    </div>
  );
}

export default App;
