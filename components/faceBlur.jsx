import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useSkiaFrameProcessor,
  useFrameProcessor
} from 'react-native-vision-camera';
import {
  Contours,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';
import {ClipOp, Skia, TileMode,Canvas} from '@shopify/react-native-skia';
import { FeDisplacementMap } from 'react-native-svg';

function FaceBlur(){
  const {hasPermission, requestPermission} = useCameraPermission();
  const [position, setPosition] = useState('front');
  const device = useCameraDevice(position);
  const format = useCameraFormat(device, [
    {
      videoResolution: Dimensions.get('window'),
    },
    {
      fps: 60,
    },
  ]);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    console.log("maxFps",format?.maxFps)
  }, [format]);

  const {detectFaces} = useFaceDetector({
    performanceMode: 'fast',
    contourMode: 'all',
    landmarkMode: 'none',
    classificationMode: 'none',
  });

  const blurRadius = 25;
  const blurFilter = Skia.ImageFilter.MakeBlur(
    blurRadius,
    blurRadius,
    TileMode.Repeat,
    null,
  );
  const paint = Skia.Paint();
  paint.setImageFilter(blurFilter);

  const frameProcessor = useSkiaFrameProcessor(frame => {
    'worklet';
    
    const { height, width, orientation } = frame;
  
    console.log("Frame details:", {
      height,
      width,
      orientation,
      isLandscapeLeft: orientation === 'landscape-left',
    });
    
    const surface = Skia.Surface.Make(width, height);
    const canvas = surface.getCanvas();
     // Render the frame after transformations
    //  frame.render();
    
    // Improved orientation handling
    switch (orientation) {
      case 'portrait':
        // No transformation needed
        break;
      
      case 'landscape-left':
        // Front camera specific handling
        console.log("Front camera detected");
        // canvas.save();
        canvas.translate(0, height);
        canvas.rotate(90);
        break;
      
      case 'landscape-right':
        // Back camera handling
        console.log("Back camera detected");
        // canvas.save();
        canvas.translate(0, height);
        canvas.rotate(90);
        break;
      
      case 'portrait-upside-down':
        // canvas.save();
        canvas.translate(width, height);
        canvas.rotate(180);
        break;
      
      default:
        console.error(`Unexpected orientation: ${orientation}`);
        throw new Error(`Invalid frame.orientation: ${orientation}`);
    }

    // Scale the frame if resizing is required
  const targetWidth = 300; // Example target width
  const targetHeight = 400; // Example target height

  const scaleX = targetWidth / width;
  const scaleY = targetHeight / height;

  canvas.scale(scaleX, scaleY);

  // Render the frame to the transformed canvas
  frame.render(canvas);
    
   
  
    const faces = detectFaces(frame);
    console.log("faces", faces);
  
    for (const face of faces) {
      if (face.contours != null) {
        // this is a foreground face, draw precise mask with edges
        const path = Skia.Path.Make();
  
        const necessaryContours = [
          'FACE',
          'LEFT_CHEEK',
          'RIGHT_CHEEK',
        ];
        for (const key of necessaryContours) {
          const points = face.contours[key];
          points.forEach((point, index) => {
            if (index === 0) {
              // it's a starting point
              path.moveTo(point.x, point.y);
            } else {
              // it's a continuation
              path.lineTo(point.x, point.y);
            }
          });
          path.close();
        }
  
        frame.save();
        frame.clipPath(path, ClipOp.Intersect, true);
        frame.render(paint);
        frame.restore();
      } else {
        // this is a background face, just use a simple blur circle
        const path = Skia.Path.Make();
        console.log(`Face at ${face.bounds.x}, ${face.bounds.y}`);
  
        const rect = Skia.XYWHRect(
          face.bounds.x,
          face.bounds.y,
          face.bounds.width,
          face.bounds.height,
        );
        path.addOval(rect);
  
        frame.save();
        frame.clipPath(path, ClipOp.Intersect, true);
        frame.render(paint);
        frame.restore();
      }
    }
  
    // Restore canvas state
    canvas.restore();
  }, []);

//   const flipCamera = useCallback(() => {
//     setPosition(pos => (pos === 'front' ? 'back' : 'front'));
//   }, []);

  return (
    <View style={styles.container} 
    >
      {hasPermission && (
        device != null ? (
          <Camera
            style={styles.camera}
            isActive={true}
            device={device}
            format={format}
            frameProcessor={frameProcessor}
            fps={format?.maxFps}
            pixelFormat="rgb"
            exposure={0}
          />
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              Your phone does not have a {position} Camera.
            </Text>
          </View>
        )
      ) 
      
    //   : (
    //     <View style={styles.textContainer}>
    //       <Text style={styles.text} numberOfLines={5}>
    //         FaceBlurApp needs Camera permission.{' '}
    //         <Text style={styles.link} onPress={Linking.openSettings}>
    //           Grant
    //         </Text>
    //       </Text>
    //     </View>
    //   )

      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    height:480,
    width:480
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

export default FaceBlur;
