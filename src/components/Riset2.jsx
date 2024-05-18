import '../App.css';
import * as faceapi from 'face-api.js';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Riset2 = () => {
  const [initialize, setInitializing] = useState();
  const [options, setOptions] = useState({});
  // const [face, setFaces] = useState('');

  const vidioRef = useRef(null);
  const canvasRef = useRef(null);
  const videoHeight = 480;
  const videoWidth = 640;

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

  // const getData = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/api/face');
  //     console.log(response.data);

  //     let faces = response.data;

  //     for (let i = 0; i < faces.length; i++) {
  //       // Change the face data descriptors from Objects to Float32Array type
  //       for (let j = 0; j < faces[i].descriptions.length; j++) {
  //         faces[i].descriptions[j] = new Float32Array(
  //           Object.values(faces[i].descriptions[j])
  //         );
  //       }
  //       // Turn the DB face docs to
  //       faces[i] = new faceapi.LabeledFaceDescriptors(
  //         faces[i].label,
  //         faces[i].descriptions
  //       );
  //     }
  //     console.log('faces');
  //     console.log(faces);

  //     return faces;

  //     // Mengakses array descriptions

  //     // response.data.map((d) => {
  //     //   console.log(d.label);

  //     //   const data_descriptions = d.descriptions.map((description) => {
  //     //     const values = Object.values(description);
  //     //     return values;
  //     //   });

  //     //   const flattenedArray = response.data.reduce((acc, obj) => {
  //     //     Object.values(obj).forEach((value) => {
  //     //       acc.push(value);
  //     //     });
  //     //     return acc;
  //     //   }, []);

  //     //   console.log('float32Array');
  //     //   const float32Array = new Float32Array(flattenedArray);
  //     //   console.log(float32Array);

  //     //   console.log('data_descriptions');
  //     //   console.log(data_descriptions);

  //     //   console.log('face labeled afi');
  //     //   console.log(
  //     //     new faceapi.LabeledFaceDescriptors(d.label, data_descriptions)
  //     //   );

  //     //   return new faceapi.LabeledFaceDescriptors(d.label, data_descriptions);
  //     // });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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

  // useEffect(() => {
  //   const getData = async () => {
  //     const response = await axios.get('http://localhost:5000/api/face');
  //     console.log(response.data);
  //     setFaces(response.data);
  //   };
  //   getData();
  // }, []);

  // const loadLabeledImages = () => {
  //   const labels = ['Afrizal', 'Andri', 'Bidadari', 'Harmon', 'Yoga'];

  //   return Promise.all(
  //     labels.map(async (label) => {
  //       const descriptions = [];
  //       for (let i = 0; i < labels.length; i++) {
  //         const img = await faceapi.fetchImage(`/labels/${label}/${i}.png`);
  //         //   console.log('data' + img);

  //         const detections = await faceapi
  //           .detectSingleFace(img)
  //           .withFaceExpressions()
  //           .withFaceLandmarks()
  //           .withFaceDescriptor();

  //         if (!detections) {
  //           throw new Error('No faces detected');
  //         }

  //         descriptions.push(detections.descriptor);
  //         //   console.log('data gambar' + detections.descriptor);
  //       }

  //       return new faceapi.LabeledFaceDescriptors(label, descriptions);
  //     })
  //   );
  // };

  //  const handleVideoOnPlay = () => {
  //     setInterval(async () => {
  //       if (initialize) {
  //         setInitializing(false);
  //       }

  //       const labeledFaceDescriptors = await getData();
  //       const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  //       canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
  //         vidioRef.current
  //       );

  //       const displaySize = {
  //         width: videoWidth,
  //         height: videoHeight,
  //       };

  //       faceapi.matchDimensions(canvasRef.current, displaySize);

  //       setInterval(async () => {
  //         const detections = await faceapi
  //           .detectAllFaces(
  //             vidioRef.current,
  //             new faceapi.TinyFaceDetectorOptions()
  //           )
  //           .withFaceLandmarks()
  //           .withFaceExpressions()
  //           .withFaceDescriptors();

  //         if (!detections) {
  //           throw new Error(`No faces detected`);
  //         }

  //         const resizedDetections = faceapi.resizeResults(
  //           detections,
  //           displaySize
  //         );

  //         canvasRef.current
  //           .getContext('2d')
  //           .clearRect(0, 0, videoWidth, videoHeight);

  //         const results = resizedDetections.map((d) => {
  //           return faceMatcher.findBestMatch(d.descriptor);
  //         });

  //         results.forEach((result, i) => {
  //           const box = resizedDetections[i].detection.box;
  //           const text = result.toString();
  //           const drawBox = new faceapi.draw.DrawBox(box, {
  //             label: text,
  //           });
  //           drawBox.draw(canvasRef.current);
  //         });
  //       }, 100);

  //       //   faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
  //       //   faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
  //       //   faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
  //       //   console.log(detections);
  //     }, 100);
  //   };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (initialize) {
        setInitializing(false);
      }

      const response = await axios.get('http://localhost:5000/api/face');
      console.log(response.data);
      let faces = response.data;

      for (let i = 0; i < faces.length; i++) {
        // Change the face data descriptors from Objects to Float32Array type
        for (let j = 0; j < faces[i].descriptions.length; j++) {
          faces[i].descriptions[j] = new Float32Array(
            Object.values(faces[i].descriptions[j])
          );
        }
        // Turn the DB face docs to
        faces[i] = new faceapi.LabeledFaceDescriptors(
          faces[i].label,
          faces[i].descriptions
        );
      }
      console.log('faces');
      console.log(faces);

      // const faces = await getData();
      const faceMatcher = new faceapi.FaceMatcher(faces);

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
        .withFaceDescriptors();

      if (!detections) {
        throw new Error(`No faces detected`);
      }

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvasRef.current
        .getContext('2d')
        .clearRect(0, 0, videoWidth, videoHeight);

      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor, 0.6);
      });

      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const text = result.toString();
        if (text === 'unknown') {
          setOptions({ boxColor: '#FF80AA' });
        } else {
          setOptions({ boxColor: '#0000FF' });
        }
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: text,
          options,
        });
        drawBox.draw(canvasRef.current);
      });
    }, 500);
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

export default Riset2;
