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
    // console.log(frame.height,frame.width,frame.pixelFormat)
    // const data = new Uint8Array(frame.toArrayBuffer())
    // console.log(data)
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
          frameProcessorFps={5}
          // onInitialized={takeVedio}
    
        />
       
       
      )}
    </>
  );
}
