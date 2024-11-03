import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TutorialPopup = () => {
    const onClose = () => {};

    return (
        <View style={styles.container}>
            <View style={styles.popup}>
                <Text style={styles.message}>Welcome to FlyAway</Text>
                <TouchableOpacity onPress={onClose} style={styles.button}>
                    <Text style={styles.buttonText}>Compris</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default TutorialPopup;