import React, { useEffect, useState } from 'react';
import getLocalStorageDrawing from '@/utils/getLocalStorageDrawing';

export default function Canvas({
  canvasRef,
  contextRef,
  myRef,
  color,
  radius,
  setActions,
  currentPosition,
  setCurrentPosition,
}) {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = myRef.current.clientWidth;
    canvas.height = myRef.current.clientHeight;
    const ctx = canvas.getContext('2d');
    // Set the background color to white
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = radius;

    // ctx.globalCompositeOperation = 'destination-over';
    contextRef.current = ctx;

    // Convert this to a utils functions:
    const savedDrawing = getLocalStorageDrawing();
    if (savedDrawing) {
      const image = new Image();
      image.src = savedDrawing;
      image.onload = () => {
        const scale =
          image.naturalWidth > image.naturalHeight
            ? canvas.width / image.naturalWidth
            : canvas.height / image.naturalHeight;
        const imageWidth = image.naturalWidth * scale;
        const imageHeight = image.naturalHeight * scale;
        const startX = (canvas.width - imageWidth) / 2;
        const startY = (canvas.height - imageHeight) / 2;
        ctx.drawImage(image, startX, startY, imageWidth, imageHeight);
      };
    }

    const resize = () => {
      ctx.canvas.width = myRef.current.clientWidth;
      ctx.canvas.height = myRef.current.clientHeight;
      ctx.canvas.style.width = `${myRef.current.clientWidth}px`;
      ctx.canvas.style.height = `${myRef.current.clientHeight}px`;

      const savedDrawing = getLocalStorageDrawing();
      if (savedDrawing) {
        const image = new Image();
        image.src = savedDrawing;
        image.onload = () => {
          const scale =
            image.naturalWidth > image.naturalHeight
              ? canvas.width / image.naturalWidth
              : canvas.height / image.naturalHeight;
          const imageWidth = image.naturalWidth;
          const imageHeight = image.naturalHeight;
          const startX = (canvas.width - imageWidth) / 2;
          const startY = (canvas.height - imageHeight) / 2;
          ctx.drawImage(image, startX, startY, imageWidth, imageHeight);
        };
      }
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [canvasRef, contextRef, myRef, color, radius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // ============================================================================
    // =============<<< Undo & Redo Actions >>>====================================
    // ============================================================================
    const addAction = (dataURL) => {
      setActions((prevActions) => {
        const newActions = prevActions.slice(0, currentPosition + 1);
        return [...newActions, dataURL];
      });
      setCurrentPosition((prevPosition) => prevPosition + 1);
    };

    // ============================================================================
    // =============<<< Touch Events >>>===========================================
    // ============================================================================
    const handleTouchStart = (e) => {
      e.preventDefault(); // Prevent iOS magnifying glass from popping up while drawing
      const { touches } = e;
      const { pageX, pageY } = touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = pageX - rect.left;
      const y = pageY - rect.top;

      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
      setIsDrawing(true);
    };

    const handleTouchMove = (e) => {
      if (!isDrawing) return;

      const { touches } = e;
      const { pageX, pageY } = touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = pageX - rect.left;
      const y = pageY - rect.top;

      // contextRef.current.lineCap = 'round';
      // contextRef.current.lineJoin = 'round';
      // contextRef.current.strokeStyle = color;
      // contextRef.current.lineWidth = radius;
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    };

    const handleTouchEnd = () => {
      const drawing = canvasRef.current.toDataURL('image/png');
      localStorage.setItem('drawing', drawing);
      contextRef.current.closePath();
      setIsDrawing(false);
      addAction(drawing);
      console.log('Current Position Set:', currentPosition);
    };

    // ============================================================================
    // =============<<< Mouse Events >>>===========================================
    // ============================================================================
    const handleMouseDown = (e) => {
      const { clientX, clientY } = e;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
      setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      const { clientX, clientY } = e;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // contextRef.current.lineCap = 'round';
      // contextRef.current.lineJoin = 'round';
      // contextRef.current.strokeStyle = color;
      // contextRef.current.lineWidth = radius;
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    };

    const handleMouseUp = () => {
      const drawing = canvasRef.current.toDataURL('image/png');
      localStorage.setItem('drawing', drawing);
      contextRef.current.closePath();
      setIsDrawing(false);
      addAction(drawing);
      console.log('Current Position Set:', currentPosition);
    };

    const handleMouseOut = () => {
      if (isDrawing) {
        const drawing = canvasRef.current.toDataURL('image/png');
        localStorage.setItem('drawing', drawing);
        contextRef.current.closePath();
        setIsDrawing(false);
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseOut);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseOut);
    };
  }, [
    isDrawing,
    contextRef,
    canvasRef,
    color,
    radius,
    currentPosition,
    setCurrentPosition,
    setActions,
  ]);

  return (
    <canvas ref={canvasRef} className='bg-white select-none w-full h-full' />
  );
}
