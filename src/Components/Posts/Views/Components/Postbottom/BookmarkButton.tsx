import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import Toast from 'react-native-toast-message';
import { IconButton } from "react-native-paper";
import { useClient, useTheme } from "../../../../Container";
import { SinglePostContext } from "../../../PostContext";

function BookmarkButton() {

    const { client } = useClient();
    const { t } = useTranslation('');
    const { info, setInfo } = useContext(SinglePostContext);
    const { colors } = useTheme();

    const createBookmark = async () => {
        const response = await client.posts.save(info.post_id);
        if(response.error) return  Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        setInfo({ ...info, bookmarks: info?.bookmarks > 0 ? info?.bookmarks + 1 : 1, bookmarked: true})
    }

    const deleteBookmark = async () => {
        const response = await client.posts.unSave(info.post_id);
        if(response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        setInfo({ ...info, bookmarks: info?.bookmarks > 0 ? info?.bookmarks - 1 : 0, bookmarked: false})
    }

    return (
        <IconButton onPress={() => info?.bookmarked ? deleteBookmark() : createBookmark()} icon={info.bookmarked ? "bookmark" : "bookmark-outline"} iconColor={info?.bookmarked ? colors.good_color : undefined} />
    )
}

export default BookmarkButton;