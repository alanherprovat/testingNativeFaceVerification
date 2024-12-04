import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Skia,Rect } from '@shopify/react-native-skia';

const CanvasTest = () => {
  const canvasRef = useRef(null); // Reference to the Canvas
  const paint = Skia.Paint();
  paint.setStyle(1); // Use the enumeration for stroke style
  paint.setColor(Skia.Color('#FF0000')); // Use a valid color format
  paint.setStrokeWidth(4); // Set the stroke width

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      // Draw the rectangle after the component has mounted
    //   canvas.drawRect(50, 50, 100, 100, paint); // Draw rect at (50, 50) with width 100 and height 100
       <Rect x={50} y={50} width={100} height={100} paint={paint} />
      
    }
  }, []); // Empty dependency array to run this effect once on mount

  return (
    <View style={styles.container}>
      <Canvas ref={canvasRef} style={styles.canvas} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  canvas: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
  },
});

export default CanvasTest;
