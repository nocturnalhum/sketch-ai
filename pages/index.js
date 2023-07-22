import React, { useRef, useState } from 'react';
import Card1 from '@/components/Card1';
import Card2 from '@/components/Card2';
import Tools from '@/components/Tools';

export default function Home() {
  const [flip, setFlip] = useState(false);
  const [image, setImage] = useState(false);
  const [showTools, setShowTools] = useState(true);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const handleFlip = () => {
    setFlip((prevValue) => !prevValue);
  };

  const handleTools = () => {
    setShowTools(!showTools);
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center bg-beach text-gray-100 overflow-y-hidden`}
    >
      <h1 className='text-xl p-2'>Sketch AI</h1>
      <div className='h-[80vh] max-w-5xl w-full group perspective'>
        <div className='w-full flex justify-end p-2'>
          <button
            onClick={handleTools}
            className='absolute left-0 -top-9 px-10 py-1 bg-slate-900 rounded-full'
          >
            ToolsTest
          </button>
          {!image && (
            <button
              onClick={handleFlip}
              className=' absolute -top-9 px-10 py-1 bg-slate-900 rounded-full'
            >
              Flip
            </button>
          )}
        </div>
        <div
          className={`relative h-full w-full shadow-inner  border-2 
          border-gray-600/70 border-r-gray-400 border-t-gray-500
          bg-gradient-to-br from-gray-100/10 to-gray-500/30 rounded-2xl duration-500 preserve-3d ${
            flip ? 'rotate-y-180' : ''
          }`}
        >
          <div className='absolute inset-0'>
            <Card1 canvasRef={canvasRef} contextRef={contextRef} />
          </div>
          <div className='absolute inset-0 h-full w-full rounded-xl rotate-y-180 backface-hidden'>
            <Card2 />
          </div>
        </div>
        <div
          className={`duration-500 ${
            showTools ? 'translate-y-[200%]' : 'translate-y-0'
          } `}
        >
          <Tools />
        </div>
      </div>
    </main>
  );
}
