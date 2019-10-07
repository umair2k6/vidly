import React from "react";

const ListGroup = ({ items, textProperty, textValue, onItemChange, selectedItem }) => {

  return (
    <ul className="list-group">
      {items.map(item => (
        <li
          onClick={() => onItemChange(item)}
          key={item[textProperty]}
          className={item === selectedItem? "list-group-item active": "list-group-item"}
        >
          {item[textValue]}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  textProperty:"_id",
  textValue:"name"
};

export default ListGroup;
