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
  Camera,useCameraFormat
} from 'react-native-vision-camera';
import { labelImage } from "vision-camera-image-labeler";
import { useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';
import { scanFaces } from './MLKitDetection';

export default function CameraCom() {
  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();
  const camera = useRef(null)

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

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
     console.log("Frame processor is running"); // Test log to ensure worklet is being called
    // console.log(frame.height,frame.width)
    // Use runOnJS to call scanFaces asynchronously on the JS thread
    // runOnJS(() => {
    //    scanFaces('https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500');
    //    console.log("inside run on js")
    // })();

  }, [])




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
