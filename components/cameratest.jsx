import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {useEffect, useState, useRef} from 'react';
import {
  Frame,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  Face,
  Camera,
  FaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';
import ProgressBar from './common/ProgressBarCircular';
import {BlinkAndExpression} from './BlinkAndExpression';
import VerificationCard from './common/VerificationCard';
import CustomCheckBox from './common/CustomCheckBox';

export default function CameraTest({blinkCount, setBlinkCount,faceExpression, setFaceExpression}) {
  const {width} = Dimensions.get('window');
  const {hasPermission, requestPermission} = useCameraPermission();
  // const [blinkCount, setBlinkCount] = useState(0);
  const blinkCountRef = useRef(blinkCount);
  // const [faceExpression, setFaceExpression] = useState('');
  const [steps,setSteps]=useState(0)
  const faceExpressionRef = useRef('');
  const [faceDectected, setFaceDetected] = useState(false);
  const blinkInProgress = useRef(false);
  const leftEyeClosedFrames = useRef(0);
  const rightEyeClosedFrames = useRef(0);
  const CONSEC_FRAMES = 2;
  const [selectedValues, setSelectedValues] = useState([]);
  const cameraStyleRef = useRef(styles.cameraContainer);
  const [cameraStyle, setCameraStyle] = useState(styles.cameraContainer);

  const faceDetectionOptions = useRef({
    performanceMode: 'fast',
    classificationMode: 'all',
    landmarkMode: 'all',
    contourMode: 'all',
    trackingEnabled:true
  }).current;

  const device = useCameraDevice('front');

  useEffect(() => {
    (async () => {
      console.log('inside useEffects');
      const status = await requestPermission();
      console.log({status});
    })();
  }, [device]);

 
  const handleCheckBoxChange = updatedValues => {
    setSelectedValues(updatedValues);
  };

  function handleFacesDetection(faces, frame) {
    cameraStyleRef.current = {
      ...styles.cameraContainer,
      // borderColor: '#CC0A13', // Red border color when face detected !!!
      // borderWidth: 3,
    };

    // Access properties for each face
    faces.forEach((face, index) => {
      // console.log(`Face ${index + 1}:`);
      // console.log("Bounds:", face.bounds);
      // console.log("Height:", face.bounds.height);
      // console.log("Width:", face.bounds.width);
      console.log("Left Eye Open Probability:", face.leftEyeOpenProbability);
      console.log("Right Eye Open Probability:", face.rightEyeOpenProbability);
      console.log("Pitch Angle:", face.pitchAngle);
      console.log("Roll Angle:", face.rollAngle);
      console.log("Yaw Angle:", face.yawAngle);
      // console.log("Smiling Probability:", face.smilingProbability);
      // console.log("Landmarks:", face.landmarks);
      // console.log("Contours:", face.contours);

      setFaceDetected(true);
      setCameraStyle(cameraStyleRef.current);

      BlinkAndExpression(
        face,
        leftEyeClosedFrames,
        rightEyeClosedFrames,
        CONSEC_FRAMES,
        blinkInProgress,
        setBlinkCount,
        setFaceExpression,
      );
      console.log('Blink Count', blinkCount);

      if(blinkCount===1)  setSteps(1)
      else if(blinkCount===2)  setSteps(2)

      if (blinkCount >= 2) {
        face.smilingProbability > 0.9 && setFaceExpression('smiling');
      }
      if(faceExpression==='smiling'){
        setSteps(3)
      }
    });

    // Extract specific properties using map
    const probabilities = faces.map(face => ({
      leftEyeOpen: face.leftEyeOpenProbability,
      rightEyeOpen: face.rightEyeOpenProbability,
      smiling: face.smilingProbability,
    }));

    if (faces.length === 0) {
      setBlinkCount(0);
      setFaceExpression('');
      setSteps(0)
      setFaceDetected(false);
      cameraStyleRef.current = styles.cameraContainer;
      setCameraStyle(cameraStyleRef.current);
    }

    console.log('Probabilities:', probabilities);
    ///testing
  }

  return (
    <View style={{flex: 1}}>
      {!!device ? (
        <View style={cameraStyle}>
          <Camera
            style={styles.camera}
            isActive={true}
            device={device}
            faceDetectionCallback={handleFacesDetection}
            faceDetectionOptions={faceDetectionOptions}
          />
          {faceDectected && (
            <View style={styles.progressOverlay}>
              <ProgressBar
                currentStep={steps}
                totalStep={3}
                tintColor="#008000"
                backgroundColor="#87080EB0"
              />
            </View>
          )}
        </View>
      ) : (
        <Text>No Device</Text>
      )}

      <View style={{marginTop: 30, alignSelf: 'center'}}>
        <Text style={{color: 'red', fontSize: 20}}>
          Blink Count:: {blinkCount}
        </Text>
        <Text style={{color: 'red', fontSize: 20}}>
          Expression:: {faceExpression}
        </Text>
      </View>

      <VerificationCard>
        <CustomCheckBox
          options={[
            {label: 'Please Blink 2 times', value: '1'},
            {label: 'Please Smile', value: '2'},
          ]}
          direction="vertical"
          selectedValues={[
            blinkCount >= 2 ? '1' : null,
            blinkCount >= 2 && faceExpression === 'smiling' ? '2' : null,
          ].filter(Boolean)}
          onChange={handleCheckBoxChange}
          disabled={true}
        />
      </VerificationCard>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    width: 360, // Adjust to desired size
    height: 360, // Adjust to desired size
    borderRadius: 180, // Half of the width/height for a circle
    overflow: 'hidden', // Ensures content outside the circle is clipped
    alignSelf: 'center', // Center the camera on the screen
  },
  camera: {
    flex: 1, // Fill the parent container
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Ensure it doesn't block the camera
  },
});
