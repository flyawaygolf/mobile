import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Platform } from "react-native";
import { Text } from "react-native-paper";
import { useClient, useProfile } from "../../Components/Container";
import { PostInterface } from "../../Services/Client/Managers/Interfaces";
import DisplayPost from "../../Components/Posts/DisplayPost";
import { handleToast } from "../../Services";
import { Loader } from "../../Other";

const ProfilePosts = () => {
    const { nickname, user_info, scrollY } = useProfile();
    const { client } = useClient();
    const { t } = useTranslation();

    const [postsPaginationKey, setPostsPaginationKey] = useState<string | undefined>(undefined);
    const [posts, setPosts] = useState<PostInterface.postInterface[]>([])

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user_info) return;
        getPosts(true);
    }, [user_info]);

    const getPosts = async (load = false) => {
        if(load) {
            if (loading) return;
            setLoading(true);
        }
        const response = await client.posts.user.fetch(nickname, { pagination_key: postsPaginationKey });
        setLoading(false);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        if (!response.data) return;
        if (response.pagination_key) setPostsPaginationKey(response.pagination_key);
        setPosts([...posts, ...response.data]);
    };

    const renderPosts = useCallback(({ item }: { item: PostInterface.postInterface }) => (
        <DisplayPost informations={item} />
    ), []);

    const memoizedPosts = useMemo(() => renderPosts, [posts]);

    return user_info && !loading ? (
        <Animated.FlatList
            removeClippedSubviews={true}
            initialNumToRender={15}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            data={posts}
            keyExtractor={(item) => item.post_id}
            renderItem={memoizedPosts}
            onScrollEndDrag={() => getPosts()}
            ListEmptyComponent={loading ? <Loader /> : <Text style={{ textAlign: "center" }}>{t("profile.no_posts")}</Text>}
            scrollIndicatorInsets={Platform.OS === "ios" ? {
                right: 1
            } : undefined}
        />
    ) : <Loader />;
};

export default memo(ProfilePosts);