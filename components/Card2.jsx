import React from 'react';

export default function Card2() {
  return (
    <div className='h-full w-full bg-gray-500 text-white rounded-xl flex items-center justify-center'>
      <button
        onClick={() => alert('clicked canvas 2')}
        className='bg-blue-300 p-3 rounded-xl'
      >
        Click Me 2
      </button>
    </div>
  );
}
