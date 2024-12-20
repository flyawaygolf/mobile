import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import ImagePicker, { Image } from 'react-native-image-crop-picker';
import { ProgressBar } from 'react-native-paper';
import dayjs from 'dayjs';
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons"

import { useClient, PostCreatorContainer, useTheme } from '../../Components/Container';
import { axiosInstance, handleToast, navigationProps } from '../../Services';
import BottomButtonPostCreator from '../../Components/Posts/Creator/BottomButton';
import { addMainCreatedTrends } from '../../Redux/mainFeed/action';
import styles, { full_width } from '../../Style/style';
import { Avatar, Username } from '../../Components/Member';
import CreatorVideoDisplay from '../../Components/Posts/Creator/CreatorVideoDisplay';
import CreatorImageDisplay from '../../Components/Posts/Creator/CreatorImageDisplay';
import DisplayAttachedPost from '../../Components/Posts/Creator/DisplayAttachedPost';
import DisplaySharedPost from '../../Components/Posts/Creator/DisplaySharedPost';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../Redux';
import { AxiosRequestConfig } from 'axios';
import TextAreaAutoComplete from '../../Components/Posts/Creator/TextAreaAutoComplete';

const PostCreatorScreenStack = ({ route: { params } }: any) => {

  const { attached_post, shared_post, initFiles, initContent } = params;
  const [content, SetContent] = useState(initContent ?? "");
  const [files, setFiles] = useState<Array<{ size: number, name: string, type: string, uri: string }>>([]);
  const [options, setOptions] = useState({
    paid: false
  })
  const [modalVisible, setModalVisible] = useState(false);
  const [sending, setSending] = useState({
    send: false,
    progress: 0
  });
  const { client, token, user } = useClient();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<navigationProps>();

  const memoizedFiles = useMemo(() => files, [files]);

  useEffect(() => {
    if (Array.isArray(initFiles)) setFiles(initFiles);
    else setFiles([initFiles])
  }, [initFiles])

  const sendInfo = async () => {
    if (sending.send) return handleToast(t(`errors.sending_form`))
    if (!content) {
      if (files.length < 1 && !shared_post) return handleToast(t(`errors.2001`))
    }
    if (content && content.length > 280) return handleToast(t(`errors.2001`)) // Assuming 280 is the max length
    setSending({ send: true, progress: 0 })

    let data = {
      content: content ?? "",
      ...options
    };

    if (files.length > 0) {
      var formdata = new FormData();

      files.forEach(a => formdata.append("posts", a))

      var config: AxiosRequestConfig = {
        headers: {
          'content-type': 'multipart/form-data',
          "flyawaytoken": token
        },
        onUploadProgress: function (progressEvent) {
          setSending({ send: true, progress: progressEvent.loaded / (progressEvent?.total ?? 100) })
        },
        validateStatus: s => s < 501
      };

      const request = await axiosInstance.post("/files/upload?type=posts", formdata, config);
      const req_data = request.data;
      if (!req_data.data) {
        setSending({ send: false, progress: 0 })
        return handleToast(t(`errors.${req_data.error.code}`))
      }
      data = { ...data, ...req_data.data }
    }

    const response = await client.posts.create({ ...data, attached_post_id: attached_post?.post_id, shared_post_id: shared_post?.post_id });

    if (!response.data && response.error) {
      setSending({ send: false, progress: 0 })
      return handleToast(t(`errors.${response.error.code}`))
    }
    if (response.data) {
      const post_info = await client.posts.fetchOne(response.data.post_id);
      if(post_info.data) dispatch(addMainCreatedTrends(post_info.data));
    }
    setFiles([])
    SetContent("")
    handleToast(t(`commons.success`))
    navigation.goBack()
  }

  const addFiles = async (target: 'photo' | 'video') => {
    try {
      const res: any = await ImagePicker.openPicker({
        maxFiles: target !== "photo" ? 1 : 8 - files.length,
        multiple: target !== "photo" ? false : true,
        mediaType: target
      })

      if (target === "photo") {
        if (res.length > 8 - files.length) {
          handleToast(t(`errors.9002`))
          return;
        }
        const result = res.map((res: Image) => {
          return {
            size: res.size,
            name: res.path.split('/')[res.path.split('/').length - 1],
            type: res.mime,
            uri: res.path
          }
        })

        return setFiles([...result, ...files]);
      } else {
        if (res.length > 1) {
          handleToast(t(`errors.9002`))
          return;
        }
        const result = [{
          size: res.size,
          name: res.path.split('/')[res.path.split('/').length - 1],
          type: res.mime,
          uri: res.path
        }]

        return setFiles([...result]);
      }
    } catch (error) {
      return;
    }
  }

  const deleteImage = (i: number) => {
    let array = [...files]
    array.splice(i, 1);
    setFiles(array);
  }

  return (
    <PostCreatorContainer dontSend={content.length > 512} onSave={() => sendInfo()} changeVisibilty={() => navigation.goBack()} >
      {sending.progress > 0 && <ProgressBar progress={sending.progress} />}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView>
          {attached_post && <DisplayAttachedPost attached_post={attached_post} />}
          <View style={[styles.row, { width: full_width, padding: 10 }]}>
            <Avatar size={40} url={client.user.avatar(user.user_id, user.avatar)} />
            <View style={[styles.column, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
              <Username
                created_at={dayjs().format()}
                user={user} />
            </View>
          </View>
          <TextAreaAutoComplete autoFocus={true} value={content} maxLength={512} setValue={(text) => SetContent(text)} />
          {shared_post && <DisplaySharedPost shared_post={shared_post} />}
        </ScrollView>
        <View style={{
          bottom: 0,
          marginLeft: -5,
          width: full_width
        }}>
          <FlatList
            horizontal={true}
            data={memoizedFiles}
            keyExtractor={(i) => i.uri}
            scrollsToTop={true}
            renderItem={({ item, index }) => item?.type.startsWith("video") ? <CreatorVideoDisplay deleteImage={(i) => deleteImage(i)} index={index} uri={item.uri} /> : <CreatorImageDisplay deleteImage={(i) => deleteImage(i)} index={index} uri={item.uri} />}
          />
          <BottomButtonPostCreator setModalVisible={setModalVisible} content={content} maxLength={512} setFiles={(info) => setFiles([...files, info])} setCameraVisible={() => navigation.navigate("CreateStack", {
            screen: "CameraScreen",
            params: {
            ...params,
            initContent: content,
            initFiles: files
          }
          })} addFiles={addFiles} />
        </View>
      </KeyboardAvoidingView>
    </PostCreatorContainer>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    mainFeed: state.mainFeed,
  };
};

const mapDispatchToProps = {
  addMainCreatedTrends
};


export default connect(mapStateToProps, mapDispatchToProps)(PostCreatorScreenStack);