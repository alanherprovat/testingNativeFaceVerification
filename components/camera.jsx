import React, {useEffect,useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  useCameraFormat
} from 'react-native-vision-camera';
import { 
  Face,
  runAsync,
  useFaceDetector,
  FaceDetectionOptions
} from 'react-native-vision-camera-face-detector'

import { labelImage } from "vision-camera-image-labeler";
import { useFrameProcessor } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core'
import { runOnJS } from 'react-native-reanimated';
import { scanFaces,processFrame } from './MLKitDetection';

export default function CameraCom() {

  const faceDetectionOptions = useRef<FaceDetectionOptions>( {
    landmarkMode:'all'
  } ).current

  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();
  const camera = useRef(null)
  const { detectFaces } = useFaceDetector( faceDetectionOptions )

  const lowResolutionFormat = useCameraFormat(device, [
    { videoResolution: { width: 640, height: 480 } },
  ])

  const takeVedio = ()=>{
    camera.current.startRecording({
        // flash: 'on',
        videoCodec: 'h265',
        onRecordingFinished: async(video) =>
            {
                const path = video.path
                console.log(video),
                await CameraRoll.save(`file://${path}`, {
                  type: 'video',
                })
              },
        onRecordingError: (error) => console.error(error),
      })
      setTimeout(() => {
        camera.current.stopRecording()
      }, 5000)
  }

  const handleDetectedFaces = Worklets.createRunOnJS((faces) => {
    console.log('faces detected', faces);
  });
  

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    runAsync(frame, () => {
      'worklet'
      const faces = detectFaces(frame)
      // ... chain some asynchronous frame processor
      // ... do something asynchronously with frame
      handleDetectedFaces(faces)
    })
    // ... chain frame processors
    // ... do something with frame
  }, [handleDetectedFaces])




  return (
    <>
      {!hasPermission ? (
        <View>
          <TouchableOpacity onPress={requestPermission}>
            <Text style={{color: 'red'}}>Permission Required!!</Text>
          </TouchableOpacity>
        </View>
      ) : device == null ? (
        <View>
          <Text style={{color: 'red'}}>NO Device Found !!</Text>
        </View>
      ) : (
      
         <Camera
          ref={camera}
          style={{ height:360,width:360 }}
          device={device}
          isActive={true}
          fps={30}
          video={true}
          format={lowResolutionFormat}
          frameProcessor={frameProcessor}
          frameProcessorFps={1}
          // onInitialized={takeVedio}
    
        />
       
       
      )}
    </>
  );
}
