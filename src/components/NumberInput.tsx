'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ArrowUp from '@/assets/images/arrow/arrowUp.svg';
import ArrowDown from '@/assets/images/arrow/arrowDown.svg';

interface NumberInputProps {
  name: string;
  defaultValue?: number;
  min?: number;
  step?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  name, 
  defaultValue = 10, 
  min = 1, 
  step = 1 
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleIncrement = () => {
    setValue(prev => prev + step);
  };

  const handleDecrement = () => {
    setValue(prev => Math.max(min, prev - step));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min) {
      setValue(newValue);
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        type="number"
        name={name}
        value={value}
        onChange={handleInputChange}
        min={min}
        step={step}
        className="px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white w-24 pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div className="absolute right-1 flex flex-col">
        <button
          type="button"
          onClick={handleIncrement}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Image src={ArrowUp} alt="増加" width={16} height={16} />
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Image src={ArrowDown} alt="減少" width={16} height={16} />
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
