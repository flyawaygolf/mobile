import React from 'react';
import Video from 'react-native-video';
import { IconButton } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

type SectionProps = {
    uri: string;
    index: number;
    deleteImage: (idx: number) => any
}

export default function CreatorVideoDisplay({ uri, index, deleteImage }: SectionProps) {
    return (
        <View style={styles.container}>
            <Video 
                source={{ uri }} 
                resizeMode={'cover'}
                style={styles.video}
                paused={true}
                repeat={false}
                muted={true}
            />
            <IconButton
                onPress={() => deleteImage(index)}
                icon="close-circle"
                mode='contained'
                size={24}
                style={styles.deleteButton}
            />
            <IconButton
                icon="video"
                style={styles.indexButton}
            />
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
    video: {
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