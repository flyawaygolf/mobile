import React, { memo, useContext, useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, StyleProp, ImageRequireSource } from "react-native";
import { Badge } from "react-native-paper";
import ImageModal from 'react-native-image-modal';
import FastImage, { ImageStyle, ResizeMode } from '@d11/react-native-fast-image';
import { useClient, useTheme } from "../../../Container";
import { SinglePostContext } from "../../PostContext";
import { attachments } from "../../../../Services/Client/Managers/Interfaces/Global";

type createType = {
    size: number,
    name: string,
    type: string,
    uri: string
}

type carrousselType = {
    pictures: attachments[],
    creator?: createType[],
    changeList?: (i: number) => any
}

const BlurImage = memo(({ img, info, setOpen, openModal }: {
    img: attachments,
    info: any,
    setOpen: (bool: boolean) => any,
    openModal: boolean
}) => {
    const { client } = useClient();
    const { colors } = useTheme();

    return (
        <ImageModal
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            resizeMode={openModal ? "contain" : "cover"}
            style={sectionStyle.media_image}
            renderImageComponent={({ source, resizeMode, style }) => (
                <FastImage
                    onError={() => console.log(`Error loading image ${client.posts.file(info?.from?.user_id, info?.post_id, img.name)}`)}
                    style={style as StyleProp<ImageStyle>}
                    source={source as ImageRequireSource}
                    resizeMode={resizeMode as ResizeMode}
                />
            )}
            source={{
                uri: client.posts.file(info?.from?.user_id, info?.post_id, img.name),
            }}
            imageBackgroundColor={colors.bg_secondary}
        />
    );
}, (prev, next) => prev.img.name === next.img.name); // Évite les re-renders si l'image est identique

export default function Carroussel({ pictures }: carrousselType) {
    const [Index, setIndex] = useState(0);
    const [openModal, setOpen] = useState(false)
    const { colors } = useTheme();
    const { client } = useClient();
    const postContext = useContext(SinglePostContext)
    const info = postContext?.info;

    const change = ({ nativeEvent }: any) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        setIndex(slide)
    }

    useEffect(() => {
        FastImage.preload(
            pictures.map(img => ({ uri: client.posts.file(info?.from?.user_id, info?.post_id, img.name) }))
        );
      }, []);

    return (
        <View>
            <ScrollView
                onScroll={change}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={sectionStyle.media_image}>
                {pictures.map((img: attachments, i: number) => <BlurImage key={`${i}_${info.post_id}`} img={img} info={info} setOpen={setOpen} openModal={openModal} />)}
            </ScrollView>
            {
                pictures.length > 1 && <Badge style={sectionStyle.text}>{Index + 1}</Badge>
            }
            <View style={sectionStyle.circleDiv}>
                {
                    pictures.length > 1 && pictures.map((_image, i) => <View style={[sectionStyle.whiteCircle, { backgroundColor: colors.fa_primary, opacity: i === Index ? 1 : 0.25 }]} key={i} />)
                }
            </View>
        </View>
    )
}

const sectionStyle = StyleSheet.create({
    circleDiv: {
        position: "absolute",
        bottom: 15,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 10
    },
    whiteCircle: {
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 5,
    },
    text: {
        position: "absolute",
        top: 15,
        right: 5,
    },
    media_image: {
        width: 350,
        height: 350,
        borderRadius: 10
    }
})