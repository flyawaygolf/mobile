import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';

const LoaderBox = ({ loading }: {
    loading: boolean;
}) => {

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute' }}
      >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={true}
            color="#000000"
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LoaderBox;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
