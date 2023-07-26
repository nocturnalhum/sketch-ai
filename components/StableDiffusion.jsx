import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dataURLtoFile from '@/utils/dataURLtoFile';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function StableDiffusion({
  canvasRef,
  setFlip,
  message,
  setMessage,
  loading,
  setLoading,
  error,
  setError,
  setPrediction,
}) {
  const [inputPrompt, setInputPrompt] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const drawingDataUrl = canvas.toDataURL('image/png');
    const convertedUrlToFile = dataURLtoFile(
      drawingDataUrl,
      'canvas-image.png'
    );

    try {
      setMessage('Getting Signed Url...');
      setFlip(true);
      setLoading(true);
      const res = await fetch(
        `/api/upload?file=${convertedUrlToFile.name}&${convertedUrlToFile.type}`
      );

      const { preSignedUrl, imgUrl } = await res.json();

      setMessage('Uploading image to S3...');
      const upload = await fetch(preSignedUrl, {
        method: 'PUT',
        body: convertedUrlToFile,
        headers: { 'Content-Type': 'fileType' },
      });

      if (upload.ok) {
        console.log('Uploaded Successfully!', upload);
        setMessage('Uploaded Successfully to S3');

        const response = await fetch('/api/predictions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: inputPrompt,
            img: imgUrl,
          }),
        });

        let prediction = await response.json();
        if (response.status !== 201) {
          setMessage(prediction.detail);
          console.log('RES1', response);
          return;
        } else {
          console.log('RES2', response);
        }
        setPrediction(prediction);

        while (
          prediction.status !== 'succeeded' &&
          prediction.status !== 'failed'
        ) {
          setLoading(true);
          await sleep(1000);
          const response = await fetch('/api/predictions/' + prediction.id);
          prediction = await response.json();
          if (response.status !== 200) {
            setError(prediction.detail);
            return;
          }
          console.log({ prediction });
          setPrediction(prediction);
          setMessage(null);
          setLoading(false);
        }
      } else {
        console.error('S3 Upload Error:', upload.statusText);
        setMessage('Error uploading');
        setLoading(false);
        setFlip(false);
      }
    } catch (error) {
      console.error('Error processing image prediction:', error.toString());
      setMessage('Error processing image prediction');
      setError(error.toString());
      setFlip(false);
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-center w-full h-20 my-2 bg-gray-500/40 rounded-full'>
        <div className='w-full p-4'>
          <form onSubmit={handleSubmit} className='flex'>
            <input
              type='text'
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className='w-full px-7 py-3 text-gray-700 bg-gray-200 rounded-l-full focus:outline-none'
              placeholder='Enter a prompt...          e.g. Cat in the style of Van Gogh'
            />
            <button
              type='submit'
              className='flex justify-center w-32 px-3 py-4 text-white bg-blue-500 rounded-r-full disabled:cursor-not-allowed'
              disabled={loading || error || !inputPrompt}
            >
              Go!
            </button>
          </form>
        </div>
      </div>
      {message && (
        <p className='flex justify-center text-red-500 text-lg font-semibold'>
          Status: {message}
        </p>
      )}
    </>
  );
}
