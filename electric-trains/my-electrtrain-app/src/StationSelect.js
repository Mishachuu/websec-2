import React from 'react';
import Select, { components } from 'react-select';

const StationSelect = ({ stations, onStationSelect, selectedStation, favorites, toggleFavorite }) => {
  const options = stations.map(station => ({
    value: station.codes.esr_code,
    label: station.title,
    station: station,
  }));

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      const selected = stations.find(station => station.codes.esr_code === selectedOption.value);
      onStationSelect(selected);
    } else {
      onStationSelect(null);
    }
  };

  const currentValue = options.find(option => option.value === selectedStation) || null;

  const CustomOption = (props) => {
    const isFavorite = favorites.some(fav => fav.codes.esr_code === props.data.value);
  
    return (
      <components.Option {...props}>
        {props.data.label}
        <span
          className={`favorite-icon ${isFavorite ? 'favorite' : 'not-favorite'}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(props.data.station);
          }}
          title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
        >
          {isFavorite ? '★' : '☆'}
        </span>
      </components.Option>
    );
  };
  

  return (
    <div className="station-select">
      <Select
        value={currentValue}
        onChange={handleChange}
        options={options}
        placeholder="Выберите станцию"
        noOptionsMessage={() => "Список пуст"}
        isClearable
        components={{ Option: CustomOption }}
      />
    </div>
  );
};

export default StationSelect;
