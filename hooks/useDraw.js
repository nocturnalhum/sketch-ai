import React, { useEffect, useRef, useState } from 'react';

export default function useDraw(onDraw) {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const prevPointRef = useRef(null);

  const mouseMoveListener = useRef(null);
  const mouseUpListener = useRef(null);

  useEffect(() => {
    function initMouseMoveListener() {
      const mouseMoveListener = (e) => {
        if (isDrawing) {
          const point = computePointInCanvas(e.clientX, e.clientY);
          const ctx = canvasRef.current.getContext('2d');
          if (onDraw) onDraw(ctx, point, prevPointRef.current);
          prevPointRef.current = point;
          console.log(point);
        }
      };
      window.addEventListener('mousemove', mouseMoveListener);
    }

    function initMouseUpListener() {
      if (!canvasRef.current) return;
      const listener = () => {
        setIsDrawing(false);
      };
      window.addEventListener('mouseup', listener);
    }
    initMouseMoveListener();
    initMouseUpListener();

    function computePointInCanvas(clientX, clientY) {
      if (!canvasRef.current) return null;
      const boundingRect = canvasRef.current.getBoundingClientRect();
      return { x: clientX - boundingRect.left, y: clientY - boundingRect.top };
    }

    return () => {};
  }, [onDraw, isDrawing]);

  function setCanvasRef(ref) {
    if (!ref) return;
    canvasRef.current = ref;
  }

  function onMouseDown() {
    if (!canvasRef.current) return;
    const listener = () => {
      setIsDrawing(true);
    };
  }

  return { setCanvasRef, onMouseDown };
}
