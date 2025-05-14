import React from 'react';
import { useTheme } from '../../Container';
import { IconButton, Button } from 'react-native-paper';
import { Image, View, StyleSheet } from 'react-native';

type SectionProps = {
  uri: string;
  index: number;
  deleteImage: (idx: number) => any
}

export default function CreatorImageDisplay({ uri, index, deleteImage }: SectionProps) {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <Image 
        style={[styles.image, { backgroundColor: colors.bg_secondary }]} 
        source={{ uri }} 
      />
      <IconButton 
        onPress={() => deleteImage(index)} 
        mode='contained'
        icon="close-circle"
        size={24}
        style={styles.deleteButton}
      />
      <Button 
        icon="image" 
        style={styles.indexButton}>
        {index + 1}/8
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 100,
    height: 100,
    margin: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    right: -8,
    top: -8,
  },
  indexButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  }
});