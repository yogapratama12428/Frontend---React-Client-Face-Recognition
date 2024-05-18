import '../App.css';
import * as faceapi from 'face-api.js';
import { useState, useEffect, useRef } from 'react';

const Riset1 = () => {
  const [initialize, setInitializing] = useState();
  const vidioRef = useRef(null);
  const canvasRef = useRef(null);
  const videoHeight = 480;
  const videoWidth = 640;

  useEffect(() => {
    const loadModels = async () => {
      setInitializing(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]).then(startVideo);
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {},
        audio: false,
      })
      .then((stream) => {
        vidioRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (initialize) {
        setInitializing(false);
      }

      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        vidioRef.current
      );

      const displaySize = {
        width: videoWidth,
        height: videoHeight,
      };

      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detections = await faceapi
        .detectAllFaces(vidioRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvasRef.current
        .getContext('2d')
        .clearRect(0, 0, videoWidth, videoHeight);

      faceapi.draw.drawDetections(canvasRef.current, resizedDetections, {
        withScore: true,
      });
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections, {
        withScore: true,
      });
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections, {
        withScore: true,
      });
      console.log(detections);
    }, 300);
  };
  
  return (
    <div className="app">
      <span>{initialize ? 'Initializing' : 'Ready'}</span>
      <div className="display-flex justify-content-center">
        <video
          ref={vidioRef}
          autoPlay
          muted
          height={videoHeight}
          width={videoWidth}
          onPlay={handleVideoOnPlay}
        />
        <canvas ref={canvasRef} className="position-absolute" />
      </div>
    </div>
  );
};

export default Riset1;
