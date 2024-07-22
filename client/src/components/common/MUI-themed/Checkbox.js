import React from 'react';

const Checkbox = ({ _id, value, checked, onChange, text }) => {
  return (
    <div className="flex items-center">
      <input
        id={_id}
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      <label htmlFor={_id} className="text-dark font-medium">
        {text}
      </label>
    </div>
  );
};

export default Checkbox;
