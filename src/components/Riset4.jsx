import { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';

const Riset4 = () => {
  const [recognizedUsers, setRecognizedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialize, setInitializing] = useState();

//   useEffect(() => {
//     async function loadModels() {
//       await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
//       await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//       await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
//       setLoading(false);
//       console.log('load model')
//     }

//     loadModels();
//   }, []);

  const vidioRef = useRef(null);
  const canvasRef = useRef(null);
  const videoHeight = 480;
  const videoWidth = 640;

//   const startVideo = () => {
//     navigator.mediaDevices
//       .getUserMedia({
//         video: {},
//         audio: false,
//       })
//       .then((stream) => {
//         vidioRef.current.srcObject = stream;
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

  useEffect(() => {
    const loadModels = async () => {
      setInitializing(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]).then();
    };
    loadModels();
  }, []);

  const recognizeFace = async () => {
    if (!loading) {
      const video = document.getElementById('video');
      const canvas = faceapi.createCanvasFromMedia(video);
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);
  
      const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
      const faceMatcher = new faceapi.FaceMatcher(recognizedUsers.map(user => user.descriptor));
      
      const results = detections.map(detection => faceMatcher.findBestMatch(detection.descriptor));
  
      // Handle recognition results...
      const resultsWithUsers = results.map((result, idx) => ({
        detection: detections[idx],
        user: recognizedUsers[result.label],
        distance: result.distance,
      }));
      
      setRecognizedUsers([...resultsWithUsers]);

    }
  };

  return (
   <div className="absensi-container">
    <video id="video" autoPlay muted></video>
    <canvas id="canvas"></canvas>
    <button onClick={recognizeFace}>Mulai Absensi</button>
  </div>
  )
}

export default Riset4