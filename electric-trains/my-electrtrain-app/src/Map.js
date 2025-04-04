import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ stations, stationToFocus }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersGroup = useRef(null);

  useEffect(() => {
    if (!mapInstance.current) {
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      mapInstance.current = L.map(mapRef.current).setView([53.2, 50.2], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
      markersGroup.current = L.layerGroup().addTo(mapInstance.current);
    }

    markersGroup.current.clearLayers();

    stations.forEach((station) => {
      if (station.latitude && station.longitude) {
        const popupContent = `
          <strong>${station.title}</strong><br />
          <strong>Код станции:</strong> ${station.codes.esr_code}<br />
          <strong>Код станции (yandex):</strong> ${station.codes.yandex_code}`;

        L.marker([station.latitude, station.longitude])
          .bindPopup(popupContent)
          .addTo(markersGroup.current);
      }
    });

    if (stations.length > 0) {
      const bounds = stations
        .filter(s => s.latitude && s.longitude)
        .map(s => [s.latitude, s.longitude]);
      mapInstance.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [stations]);

  useEffect(() => {
    if (stationToFocus && stationToFocus.latitude && stationToFocus.longitude) {
      mapInstance.current.setView(
        [stationToFocus.latitude, stationToFocus.longitude],
        15,
        { animate: true }
      );
    }
  }, [stationToFocus]);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default Map;
