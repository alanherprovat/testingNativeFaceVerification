import { StyleSheet, View,Dimensions } from 'react-native'
import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';


const VerificationCard = ({children,style}) => {
  return (
    <Card
    mode="contained"
    style={[styles.card, style]}
    contentStyle={styles.cardContent}
    // Add these props to further reduce padding
    elevation={2} // Reduce shadow/elevation
    theme={{ roundness: 10 }} // Control border radius
  >
    <Card.Content 
      style={[
        styles.content, 
        { paddingHorizontal: 12, paddingVertical: 8 } // Explicit tight padding
      ]}
    >
      {children}
    </Card.Content>
  </Card>
  )
}

export default VerificationCard
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    card: {
        margin: 8,
        width: width*0.9,
        // marginHorizontal:10,
        shadowRadius: 3.84,
        borderRadius: 10,
        backgroundColor: '#fee2e2',
        borderWidth: 2,
        borderColor: '#CC0A13',
        overflow: 'hidden', // Helps contain content
      },
      cardContent: {
        padding: 8,
        margin: 0,
      },
      content: {
        padding: 0,
        margin: 0, // Explicitly set margin to 0
      },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1a1a1a',      // Custom text color
      marginBottom: 8,
    },
    body: {
      fontSize: 24,
      color: '#CC0A13',         // Custom text color
    //   lineHeight: 24,
      
    },
  });
  