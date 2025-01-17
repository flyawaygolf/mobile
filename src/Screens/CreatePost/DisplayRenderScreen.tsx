import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";

import { full_height, full_width } from '../../Style/style';
import { useTranslation } from 'react-i18next';
import { handleToast, navigationProps } from '../../Services';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';


export default function DisplayRenderScreen({ route: { params }}: any) {
  
  const { type, info } = params;
  const { t } = useTranslation();
  const navigation = useNavigation<navigationProps>();
  const videoPlayer = useRef<any | null>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [file, setFile] = useState(info);
  
  useEffect(() => {
    info && setFile(info)
  }, [info])

  const downloadFile = async () => {
    if(Platform.OS === "android") {
      const camera = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      if(camera !== RESULTS.GRANTED) await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      if(camera !== RESULTS.LIMITED) await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    }

    await CameraRoll.save(info.uri, { 
      type: info.type,
      album: "Trender"
    })
    handleToast(t(`commons.success`))
  }

  return (
    <View style={styles.container}>
      {
        type === "photo" ? <Image style={{
          width: full_width,
          height: full_height
        }} source={{
          uri: file.uri
        }} /> : <>
                <View style={{
                          width: full_width,
                          height: full_height
                        }}>
                        <Pressable style={{
                            width: full_width,
                            height: full_height
                          }} onPress={() => setPaused(!paused)} >
                          <Video
                            onEnd={() => setPaused(true)}
                            source={{
                              uri: file.uri
                            }}
                            resizeMode={'cover'}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                            }}
                            paused={paused}
                            repeat={true}
                            muted={muted}
                            ref={(ref) => (videoPlayer.current = ref)}
                          />
                        </Pressable>
                      <View
                        style={{
                          position: 'absolute',
                          top: 60,
                          left: 20,
                        }}>
                        <View style={{ marginBottom: 10 }}>
                          <IconButton onPress={() => setPaused(!paused)} size={22} icon={paused ? "play" : "pause"} />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                          <IconButton onPress={() => {
                            setPaused(false)
                          }} size={22} icon={"repeat"} />
                        </View>
                        <IconButton onPress={() => setMuted(!muted)} size={22} icon={muted ? "volume-variant-off" : "volume-high"} />
                      </View>
                  </View>
                </>
      }
      <View style={styles.leftButtonRow}>
        <IconButton icon={"chevron-left"} size={24} onPress={() => navigation.navigate("CreateStack", {
          screen: "CameraScreen",
          params: params
        })} />
      </View>
      <View style={styles.rightButtonRow}>
        <IconButton icon={"download"} size={24} onPress={() => downloadFile()} />
      </View>
      <View style={styles.bottomButtonRow}> 
        <IconButton icon={"chevron-right"} size={24} onPress={() => navigation.navigate("CreateStack", {
          screen: "PostCreatorScreen",
          params: {
            ...params,
            initFiles: file
          }
        })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leftButtonRow: {
    marginTop: Platform.OS === "ios" ? 20 : 0,
    position: "absolute",
    left: 20,
    top: 20,
  },
  rightButtonRow: {
    position: "absolute",
    left: 20,
    bottom: 30,
  },
  bottomButtonRow: {
    position: "absolute",
    right: 20,
    bottom: 30
  }
});