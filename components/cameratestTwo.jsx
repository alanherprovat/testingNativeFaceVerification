import React, { useCallback, useEffect, useState ,useRef} from 'react';
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
 
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useSkiaFrameProcessor,useFrameProcessor
} from 'react-native-vision-camera';
import {
  useFaceDetector,faceDetectionOptions, Camera,
} from 'react-native-vision-camera-face-detector';
import {  Rect, Skia, TileMode ,
  Canvas,
  Circle,
} from '@shopify/react-native-skia';

const CameraTestTwo = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [position, setPosition] = useState('front');
  const device = useCameraDevice('front');
  const format = useCameraFormat(device, [
    {
      videoResolution: Dimensions.get('window'),
    },
    {
      fps: 60,
    },
  ]);
  const [faces, setFaces] = useState([]);
  const canvasRef = useRef();

const previewWidth = 400;  // Width of your Camera preview
const previewHeight = 400; // Height of your Camera preview
const canvasWidth = 400;   // Width of your Canvas
const canvasHeight = 400;  // Height of your Canvas

const paint = Skia.Paint();
paint.setStyle(1); // Use the enumeration for stroke style
paint.setColor(Skia.Color('#FF0000')); // Use a valid color format
paint.setStrokeWidth(4); // Set the stroke width



  useEffect(() => {
    
    (async () => {
        console.log("inside useEffects")
        const status = await requestPermission()
        console.log({ status })
      })()
  }, [device]);

  const faceDetectionOptions = useRef( {
    performanceMode: 'fast',
    classificationMode: 'all',
    landmarkMode:'all',
    contourMode:'all'
  } ).current
  

  const getBoundingBox = (landmarks) => {
   
    // Extract all x and y values from the landmarks
    const xValues = [
      // landmarks.LEFT_CHEEK.x,
      // landmarks.MOUTH_BOTTOM.x,
      landmarks.LEFT_EYE?.x,
      // landmarks.RIGHT_CHEEK.x,
      landmarks.RIGHT_EYE?.x,
      landmarks.LEFT_EAR?.x,
      landmarks.RIGHT_EAR?.x,
    ];

    const yValues = [
      // landmarks.LEFT_CHEEK.y,
      // landmarks.MOUTH_BOTTOM.y,
      landmarks.LEFT_EYE?.y,
      // landmarks.RIGHT_CHEEK.y,
      landmarks.RIGHT_EYE?.y,
      landmarks.LEFT_EAR?.y,
      landmarks.RIGHT_EAR?.y,
    ];
    console.log(xValues)
    // Find the min and max values for x and y to define the bounding box
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    // Return the bounding box
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  };

  const frameProcessor = useSkiaFrameProcessor((frame) => {
    'worklet'
    frame.render()

    faces.forEach((face, index) => {
     
      const { x, y, width, height } = face.bounds;
      const rect = Skia.XYWHRect(x, y, width, height)
      // const { x, y, width, height } = getBoundingBox(face.landmarks);
      console.log("Bounds values!!!!!!!!:", x, y, width, height);
      frame.drawRect(rect, paint)
  
    });
  }, [])

  function handleFacesDetection(faces, frame) {
    // Render frame first if necessary
    // frame.render();
    setFaces(faces);
    // Access properties for each face

    faces.forEach((face, index) => {
      // console.log(`Face ${index + 1}:`);
      // console.log("Bounds:", face.bounds);
      // console.log("Height:", face.bounds.height);
      // console.log("Width:", face.bounds.width);
      // console.log("Left Eye Open Probability:", face.leftEyeOpenProbability);
      // console.log("Right Eye Open Probability:", face.rightEyeOpenProbability);
      // console.log("Pitch Angle:", face.pitchAngle);
      // console.log("Smiling Probability:", face.smilingProbability);
  
      // Access landmarks
      // console.log("Landmarks:", face.landmarks);

      const { x, y, width, height } = face.bounds;
      const rect = Skia.XYWHRect(x, y, width, height)
      // const { x, y, width, height } = getBoundingBox(face.landmarks);
      console.log("Bounds values!!!!!!!!:", x, y, width, height);
      frame.drawRect(rect, paint)
  
    });
  
    // Extract specific properties using map for debugging
    const probabilities = faces.map(face => ({

      // leftEyeOpen: face.leftEyeOpenProbability,
      // rightEyeOpen: face.rightEyeOpenProbability,
      // smiling: face.smilingProbability,
      // contours: face.contours.FACE['0'],
      // landmarksLEFT_CHEEK: face.landmarks.LEFT_CHEEK,
      // landmarksLEFT_EAR: face.landmarks.LEFT_EAR,
      // landmarksLEFT_EYE: face.landmarks.LEFT_EYE,
      // landmarksRIGHT_CHEEK: face.landmarks.RIGHT_CHEEK,
      // landmarksRIGHT_EAR: face.landmarks.RIGHT_EAR,
      // landmarksRIGHT_EYE: face.landmarks. RIGHT_EYE,
   
    }));
  
  
    console.log("Probabilities:", probabilities);
  } 


  const drawBoundingBox = (x, y, width, height) => {
    const canvas = canvasRef.current;
    if (canvas) {
      // canvas.drawRect(x, y, width, height, paint);
      return <Rect x={x} y={y} width={width} height={height} paint={paint} />
    }
  };


  return (
    <View style={{ flex: 1,height:600,width:600}}>
      <>
      {!!device? 
      <>
        <Camera
        style={{ height:600,width:600 }}
        isActive={true}
        device={device}
        format={format}
        // frameProcessor={frameProcessor}

        faceDetectionCallback={ handleFacesDetection }
        faceDetectionOptions={ faceDetectionOptions }

        // fps={format?.maxFps}
        fps={30}
        pixelFormat="rgb"
        exposure={0}

      />

      <Canvas 
      ref={canvasRef}
      style={[styles.canvas, { height: canvasHeight, width: canvasWidth }]}>
        {/* {faces.map((face, index) => {
          // const { x, y, width, height } = face.bounds;
          const { x, y, width, height } = getBoundingBox(face.landmarks);

          // Scale the face bounding box coordinates to fit the canvas
          const scaleX = canvasWidth / previewWidth;
          const scaleY = canvasHeight / previewHeight;

          // Center of the face for drawing a circle
          const cx = (x + width / 2) * scaleX;
          const cy = (y + height / 2) * scaleY;

          // // Debugging logs
          // console.log(`Face ${index}:`, {
          //   x, y, width, height, cx, cy,
          //   canvasWidth, canvasHeight,
          //   previewWidth, previewHeight,
          // });
          return (
            <Rect x={x} y={y} width={width} height={height} paint={paint} />
          );

        })} */}
      </Canvas>


      </>
       : <Text>
        No Device
      </Text>
      }
      </>

  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    // flex: 1,
    height:360,
    width:360
  },
  canvas: {
    position: 'absolute', // Make canvas overlay on top of the Camera
   
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    maxWidth: '60%',
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
  },
  link: {
    color: 'rgb(80, 80, 255)',
  },
});

export default CameraTestTwo;
