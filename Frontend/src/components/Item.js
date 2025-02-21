import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const Item = ({ item }) => {
  // Function to format the date
  const formatDate = (dateString) => {
    const timeZone = 'UTC'; // Adjust this to your desired time zone if needed
    const zonedDate = toZonedTime(new Date(dateString), timeZone);
    return format(zonedDate, 'dd/MM/yyyy');
  };

  return (
    <Link to={`/items/${item.id}`} className="item__item">
      <div className="item__header">
        <div className="item__image">
          <img src={item.imageUrl} alt={item.itemName} />
        </div>
        <div>
          <p className="item_name">{item.itemName.substring(0, 15)} </p>
          <p className="item_title">{item.category}</p>
        </div>
      </div>
      <div className="item__quantity">
        <p> QNT: {item.quantity} </p>
      </div>
      <div className="item__body">
        <p>"{item.description}"</p>
      </div>
      <div className="item__footer">
        <p>Adicionado por: {item.addedBy}<br />
          Data de adição: {formatDate(item.addedDate)}</p>
      </div>
    </Link>
  );
};

export default Item;