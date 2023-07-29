import React, { useState } from 'react';
import { PopoverPicker } from './PopoverPicker';
import Slider from './Slider';
import ConfirmationModal from './ConfirmationModal';

export default function Tools({
  canvasRef,
  color,
  setColor,
  radius,
  setRadius,
  clearCanvas,
}) {
  const savePNG = (e) => {
    let link = e.currentTarget;
    link.setAttribute('download', 'canvas.png');
    let image = canvasRef.current.toDataURL('image/png');
    link.setAttribute('href', image);
  };

  return (
    <div className='w-full h-20 my-2 bg-gray-400/50 rounded-full'>
      <div className='flex justify-between items-center w-full h-full p-3 '>
        <div className='flex flex-col items-center  justify-center mr-3 p-3 rounded-xl drop-shadow-md shadow-lg'>
          <h1 className='font-medium text-gray-100'>Brush Color</h1>
          <PopoverPicker color={color} onChange={setColor} />
        </div>
        <div className='flex flex-col items-start h-full'>
          <h2 className='mb-2'>Radius: {radius}</h2>
          <Slider
            currentValue={radius}
            setCurrentValue={setRadius}
            minVal={1}
            maxVal={100}
          />
        </div>
        <div className='bg-black p-3 rounded-full'>
          <a
            onClick={savePNG}
            href='download_link'
            className='rounded-xl px-2 py-3.5 select-none'
          >
            Save
          </a>
        </div>
        <button onClick={clearCanvas} className='bg-black p-3 rounded-full'>
          Clear
        </button>
      </div>
    </div>
  );
}
