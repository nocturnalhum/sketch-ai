import React, { useRef } from 'react';
import Canvas from './Canvas';

export default function Card1({
  canvasRef,
  contextRef,
  color,
  radius,
  setActions,
  currentPosition,
  setCurrentPosition,
}) {
  const myRef = useRef(null);

  return (
    <div className='h-full w-full bg-gray-300/10 backdrop-blur-sm text-white rounded-xl flex items-center justify-center p-3'>
      <div ref={myRef} className='w-full h-full'>
        <Canvas
          canvasRef={canvasRef}
          contextRef={contextRef}
          myRef={myRef}
          color={color}
          radius={radius}
          setActions={setActions}
          currentPosition={currentPosition}
          setCurrentPosition={setCurrentPosition}
        />
      </div>
    </div>
  );
}
