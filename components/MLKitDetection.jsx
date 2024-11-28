import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Svg, { Rect, Circle } from 'react-native-svg';
import React,{useState} from 'react';
import FaceDetection from '@react-native-ml-kit/face-detection';

export async function scanFaces(imageUrl) {
  try {
    // Use await to resolve the Promise returned by FaceDetection.detect
    const faces = await FaceDetection.detect(imageUrl, { landmarkMode: 'all' });
    console.log('Detected Faces:', faces);
    return faces;
  } catch (error) {
    console.error('Error detecting faces:', error);
  }
}

const MLKitDetection = () => {

    const [faces, setFaces] = useState([]);
    const imageUri = 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';
    const imageWidth = 500; // Width of the original image
    const imageHeight = 750; // Height of the original image

  const handleProcessImage = async () => {
    const result = await scanFaces(imageUri);
    // console.log('Face Detection Result:', result);
    console.log("data",result[0].landmarks);


    // Access landmarks
    console.log("\nLandmarks:");
    Object.entries(result[0].landmarks).forEach(([landmarkName, landmarkData]) => {
    console.log(`${landmarkName}: x=${landmarkData.position.x}, y=${landmarkData.position.y}`);
    });

  };

  return (
    <View style={styles.container}>
        <Image
        source={{ uri: imageUri }}
        style={[styles.image, { height: imageHeight , width: imageWidth }]}
        resizeMode="contain"
        />

   
    
      <TouchableOpacity onPress={handleProcessImage}>
        <Text style={{ color: 'red' }}>Process Image</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MLKitDetection;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    image: {
      alignSelf: 'center',
    },
    button: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: 'red',
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
