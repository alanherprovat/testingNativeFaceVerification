/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useCameraPermission,useCameraDevice } from 'react-native-vision-camera';
import ProgressBar from './components/common/ProgressBarCircular';
import CameraCom from './components/camera';
import CameraTest from './components/cameratest';
import CameraTestTwo from './components/cameratestTwo'
import MLKitDetection from './components/MLKitDetection';
import FaceBlur from './components/faceBlur';

import {
  Colors,
  DebugInstructions,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import CanvasTest from './components/testCanvas';

function Section({ title, children }) {
  const isDarkMode = useColorScheme() === 'dark';
 
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
            textAlign: 'center', // Center title
          },
        ]}
      >
        {title}
      </Text>
      <View style={styles.sectionChildrenContainer}>
        {children}
      </View>
    </View>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const device = useCameraDevice('back')
  const { hasPermission } = useCameraPermission()
  const [blinkCount, setBlinkCount] = useState(0);
  const [faceExpression, setFaceExpression] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.safeArea]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View
          style={[
            styles.contentContainer,
            {
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }
          ]}
        >
          <Section title="Take Your Live Photo">
            <View style={styles.componentContainer}>
              <CameraTest
              blinkCount={blinkCount} 
              setBlinkCount={setBlinkCount} 
              faceExpression={faceExpression}  
              setFaceExpression={setFaceExpression}
              />
             
            </View>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    alignItems: 'center',
  },
  sectionContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily:'K2D-Medium',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight:30
  },
  sectionChildrenContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  componentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
