import React, { useEffect, useRef, useState } from 'react';
import Card1 from '@/components/Card1';
import Card2 from '@/components/Card2';
import Tools from '@/components/Tools';
import StableDiffusion from '@/components/StableDiffusion';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function Home() {
  const [flip, setFlip] = useState(false);
  const [showTools, setShowTools] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [color, setColor] = useState('#000');
  const [radius, setRadius] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actions, setActions] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedActions = localStorage.getItem('actions');
      return savedActions ? JSON.parse(savedActions) : [];
    }
    return [];
  });
  const [currentPosition, setCurrentPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPosition = localStorage.getItem('currentPosition');
      return savedPosition ? parseInt(savedPosition, 10) : -1;
    }
    return -1;
  });

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('actions', JSON.stringify(actions));
    }
  }, [actions]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentPosition', currentPosition);
    }
  }, [currentPosition]);

  const handleFlip = () => {
    setFlip((prevValue) => !prevValue);
  };

  const handleTools = () => {
    setShowTools(!showTools);
  };

  const clearCanvas = () => {
    setIsModalOpen(true);
  };

  const handleConfirmClear = () => {
    let canvas = canvasRef.current;
    let context = canvas.getContext('2d');
    context.fillStyle = '#FFF'; // Set the background color to white
    context.fillRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem('drawing');
    localStorage.removeItem('actions');
    localStorage.removeItem('currentPosition');
    setActions([]);
    setCurrentPosition(-1);
    setIsModalOpen(false);
  };
  const handleCancelClear = () => {
    setIsModalOpen(false);
  };

  const undo = () => {
    console.log('Undo CurrentPosition', currentPosition);
    if (currentPosition === -1) return;
    if (currentPosition > 0) {
      setCurrentPosition((prevPosition) => prevPosition - 1);
      const image = new Image();
      image.src = actions[currentPosition - 1];
      image.onload = () => {
        const scale =
          image.naturalWidth > image.naturalHeight
            ? contextRef.current.canvas.width / image.naturalWidth
            : contextRef.current.canvas.height / image.naturalHeight;
        const imageWidth = image.naturalWidth * scale;
        const imageHeight = image.naturalHeight * scale;
        const startX = (contextRef.current.canvas.width - imageWidth) / 2;
        const startY = (contextRef.current.canvas.height - imageHeight) / 2;

        contextRef.current.clearRect(
          0,
          0,
          contextRef.current.canvas.width,
          contextRef.current.canvas.height
        );
        console.log('ContextRef:', contextRef.current);
        contextRef.current.drawImage(
          image,
          startX,
          startY,
          imageWidth,
          imageHeight
        );
      };
    } else if (currentPosition === 0) {
      // Special case: If currentPosition is at the first action, undo to a blank canvas
      setCurrentPosition(-1);
      contextRef.current.fillStyle = '#FFF';
      contextRef.current.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const redo = () => {
    console.log('Redo CurrentPosition', currentPosition);
    if (currentPosition === actions.length - 1) return;
    if (currentPosition < actions.length - 1) {
      setCurrentPosition((prevPosition) => prevPosition + 1);
      const image = new Image();
      image.src = actions[currentPosition + 1];
      image.onload = () => {
        const scale =
          image.naturalWidth > image.naturalHeight
            ? contextRef.current.canvas.width / image.naturalWidth
            : contextRef.current.canvas.height / image.naturalHeight;
        const imageWidth = image.naturalWidth * scale;
        const imageHeight = image.naturalHeight * scale;
        const startX = (contextRef.current.canvas.width - imageWidth) / 2;
        const startY = (contextRef.current.canvas.height - imageHeight) / 2;

        contextRef.current.clearRect(
          0,
          0,
          contextRef.current.canvas.width,
          contextRef.current.canvas.height
        );
        console.log('ContextRef:', contextRef.current);
        contextRef.current.drawImage(
          image,
          startX,
          startY,
          imageWidth,
          imageHeight
        );
      };
    }
    localStorage.setItem('drawing', actions[currentPosition + 1]);
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center bg-beach text-gray-100 overflow-y-hidden`}
    >
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
      />
      <h1 className='text-xl p-2'>Sketch AI</h1>
      <div className='h-[80vh] max-w-5xl w-full group perspective'>
        <div className='w-full flex justify-end p-2'>
          <button
            onClick={handleTools}
            className='absolute left-0 -top-9 px-10 py-1 bg-slate-900 rounded-full'
          >
            Tools
          </button>
          <button
            onClick={handleTools}
            className='absolute left-32 -top-9 px-4 py-1 bg-slate-900 rounded-full'
          >
            Stable Diffusion
          </button>
          {prediction?.status === 'succeeded' && (
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
            <Card1
              canvasRef={canvasRef}
              contextRef={contextRef}
              color={color}
              radius={radius}
              setActions={setActions}
              currentPosition={currentPosition}
              setCurrentPosition={setCurrentPosition}
            />
          </div>
          <div className='absolute inset-0 h-full w-full rounded-xl rotate-y-180 backface-hidden'>
            <Card2 prediction={prediction} error={error} message={message} />
          </div>
        </div>
        <div className='relative w-full'>
          <div
            className={`absolute w-full top-0 duration-300 ${
              !showTools ? 'translate-y-[250%]' : 'translate-y-0'
            } `}
          >
            <Tools
              canvasRef={canvasRef}
              contextRef={contextRef}
              color={color}
              setColor={setColor}
              radius={radius}
              setRadius={setRadius}
              clearCanvas={clearCanvas}
              undo={undo}
              redo={redo}
              setActions={setActions}
              currentPosition={currentPosition}
              setCurrentPosition={setCurrentPosition}
            />
          </div>
          <div
            className={`absolute w-full top-0 duration-300 ${
              showTools ? 'translate-y-[250%]' : 'translate-y-0'
            } `}
          >
            <StableDiffusion
              canvasRef={canvasRef}
              setFlip={setFlip}
              message={message}
              setMessage={setMessage}
              loading={loading}
              setLoading={setLoading}
              setPrediction={setPrediction}
              error={error}
              setError={setError}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
