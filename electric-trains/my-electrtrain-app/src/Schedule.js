import React, { useEffect, useState } from 'react';

const Schedule = ({ station1, station2, date }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (station1 && station2 && date) {
      const formattedDate = new Date(date).toISOString().split('T')[0];

      const url = `/api/schedule?station1=${station1.codes.yandex_code}&station2=${station2.codes.yandex_code}&date=${formattedDate}`;

      setLoading(true);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setSchedule(data.segments || []);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [station1, station2, date]);

  if (loading) {
    return <p>Загрузка расписания...</p>;
  }

  if (error) {
    return <p>Ошибка при загрузке расписания: {error.message}</p>;
  }

  const formattedDisplayDate = new Date(date).toLocaleDateString('ru-RU');

  return (
    <div>
      <h2>Расписание на {formattedDisplayDate}</h2>
      {schedule.length > 0 ? (
        <ul>
          {schedule.map((item, index) => (
            <li key={index}>
              <strong>Поезд:</strong> {item.thread.title || 'Нет данных'} <br />
              <strong>Время отправления:</strong> {new Date(item.departure).toLocaleTimeString()} <br />
              <strong>Время прибытия:</strong> {new Date(item.arrival).toLocaleTimeString() || 'Нет данных'} <br />
              <strong>Продолжительность:</strong> {Math.floor(item.duration / 60) || 'Нет данных'} минут <br />
              <strong>Цена билета:</strong> {item.tickets_info?.places?.[0]?.price?.whole || 'Нет данных'} руб. <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>Расписание недоступно для выбранных станций на эту дату</p>
      )}
    </div>
  );
};

export default Schedule;
