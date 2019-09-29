import React from "react";

const ListGroup = props => {
  const { items, textProperty, textValue, onItemChange, selectedItem } = props;

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
