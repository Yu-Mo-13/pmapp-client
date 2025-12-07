'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ToggleOff from '@/assets/images/toggle/toggleOff.svg';
import ToggleOn from '@/assets/images/toggle/toggleOn.svg';

interface ToggleButtonProps {
  name: string;
  defaultValue?: boolean;
}

enum ToggleButtonState {
  TRUE = 1,
  FALSE = 0,
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  name,
  defaultValue = false,
}) => {
  const [isOn, setIsOn] = useState(defaultValue);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <>
      <input
        type="hidden"
        name={name}
        value={isOn ? ToggleButtonState.TRUE : ToggleButtonState.FALSE}
      />
      <button type="button" onClick={handleToggle} className="mb-3">
        <Image
          src={isOn ? ToggleOn : ToggleOff}
          alt={isOn ? 'Toggle On' : 'Toggle Off'}
          width={44}
          height={24}
        />
      </button>
    </>
  );
};

export default ToggleButton;
