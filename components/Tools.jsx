import React from 'react';

export default function Tools({ canvasRef, contextRef }) {
  const clearCanvas = () => {
    let canvas = canvasRef.current;
    let context = canvas.getContext('2d');
    context.fillStyle = '#FFF'; // Set the background color to white
    context.fillRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem('drawing');
  };

  return (
    <div className='flex items-center justify-center w-full h-20 my-2 bg-gray-500/40 rounded-full'>
      <div className='w-full p-5'>
        <button onClick={clearCanvas} className='bg-black p-3 rounded-full'>
          Clear
        </button>
      </div>
    </div>
  );
}
