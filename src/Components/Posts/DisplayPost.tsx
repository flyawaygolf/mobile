import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import { useNavigation } from "@react-navigation/native";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Button, Divider, Text, Card, Icon, Chip } from "react-native-paper";
import { connect } from 'react-redux';

import { SinglePostContextProvider } from "./PostContext";
import { Loader } from "../../Other";
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';
import Postbottom from "./Views/Components/Postbottom";
import Postheader from "./Views/Components/Postheader";
import { addPostTempSaveTrends } from '../../Redux/postTempSaveFeed/action';
import { PostInterface } from "../../Services/Client/Managers/Interfaces";
import { navigationProps } from "../../Services/navigationProps";
import styles from "../../Style/style";
import { useClient, useTheme } from "../Container";
import PostNormal from "./Views/PostNormal";
import { formatDistance } from "../../Services";

type SectionProps = React.FC<{
    informations: PostInterface.postResponseSchema;
    pined?: boolean;
    comments?: boolean;
    is_comment?: boolean;
    is_share?: boolean;
    no_bottom?: boolean;
    is_original_post?: boolean;
    original_post_user?: any;
}>;

const DisplayPosts: SectionProps = ({
    informations,
    pined,
    comments,
    is_comment,
    is_share,
    no_bottom,
    is_original_post,
    original_post_user
}): JSX.Element => {
    const { t, i18n } = useTranslation();
    const { colors } = useTheme();
    const { client } = useClient();
    const navigation = useNavigation<navigationProps>();
    const savedPosts = useAppSelector((state) => state.postTempSaveFeed);
    const dispatch = useAppDispatch();
    const [attached_post, setAttachedPost] = useState<PostInterface.postResponseSchema | undefined | false>(undefined);
    const [commentLoad, setCommentLoad] = useState(false);

    const loadAttachedPosts = async (post_id: string) => {
        setCommentLoad(true);
        const findPost = savedPosts.find(p => p.post_id === post_id);
        if (findPost) {
            setCommentLoad(false);
            return setAttachedPost(findPost)
        } else {
            const response = await client.posts.fetchOne(post_id, i18n.language);
            setCommentLoad(false);
            if (response.error || !response.data) return setAttachedPost(false);
            dispatch(addPostTempSaveTrends([response.data]));
            return setAttachedPost(response.data);
        }
    };
    useEffect(() => {
        if (informations.attached_post_id && comments) loadAttachedPosts(informations.attached_post_id);
    }, [informations]);

    const PinnedView = () => (
        <View style={styles.pined}>
            <Icon source="pin" size={12} color={colors.color_green} />
            {
                /**<Text> {t("posts.pined")}</Text> */
            }
        </View>
    )

    const CategoriesBox = ({ c }: { c: number }) => (
        <View style={{
            backgroundColor: colors.bg_primary,
            borderWidth: 1,
            borderRadius: 60,
            padding: 3,
            paddingLeft: 6,
            marginLeft: 5,
        }}>
            <Text variant="labelSmall" style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>{t(`categories.${c}`)}</Text>
        </View>
    )

    const LeftComponent = () => (
        <View style={styles.row}>
            {informations.paid ? <MaterialIcons style={{ marginLeft: 3 }} size={20} color={colors.color_green} name={`cash`} /> : null}
        </View>
    )

    const handlePostPress = useCallback((post_id: string) => {
        navigation?.navigate("PostsStack", { screen: "PostScreen", params: { post_id: post_id } });
      }, []);
      

    return (
        <Card mode="contained" style={{
            borderRadius: 10,
            margin: is_original_post ? 0 : 10
        }}>
            <SinglePostContextProvider
                informations={{
                    ...informations,
                    is_comment: is_comment,
                    is_share: is_share,
                    no_bottom: no_bottom,
                    original_post_user: original_post_user
                }}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => comments ? null : handlePostPress(informations.post_id)}>
                    {attached_post ? <DisplayPosts is_original_post={true} comments informations={attached_post} /> : typeof attached_post !== "undefined" && <Button>{t("posts.deleted_post")}</Button>}

                    {commentLoad && <Loader />}

                    {pined && <PinnedView />}

                    <Postheader lefComponent={<LeftComponent />} info={informations.from} post_id={informations.post_id} created_at={informations.created_at} />
                    <View style={styles.row}>
                        {
                            informations.golf_info && (
                                <Chip style={{
                                    marginLeft: 5,
                                }} icon="golf" onPress={() => navigation.navigate("GolfsStack", {
                                    screen: "GolfsProfileScreen",
                                    params: {
                                        golf_id: informations?.golf_info?.golf_id,
                                    }
                                })}>{informations.golf_info.name} {informations.golf_info.distance && `· ${formatDistance(informations.golf_info.distance)}Km`}</Chip>
                            )
                        }
                    </View>
                    {informations.categories && informations.categories.length > 0 && <View style={[styles.row, { marginTop: -5, marginLeft: 5 }]}>{informations.categories.map((c, idx) => <CategoriesBox key={idx} c={c} />)}</View>}
                    <PostNormal maxLines={comments ? undefined : 5} />
                </TouchableOpacity>
                {informations.shared_post && !is_share && (
                    <View style={{ margin: 10, borderColor: colors.bg_primary, borderWidth: 1, borderRadius: 8 }}>
                        {informations.shared_post ? (
                            <DisplayPosts is_share={true} informations={{
                                ...informations.shared_post as any
                            }} />
                        ) : <Button>{t("posts.unavailable")}</Button>
                        }
                    </View>
                )}
                {!is_share && (
                    <>
                        <Postbottom />
                        {is_original_post && <Divider bold horizontalInset />}
                    </>
                )}
            </SinglePostContextProvider>
        </Card>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        mainFeed: state.mainFeed,
        notificationFeed: state.notificationFeed
    };
};

const mapDispatchToProps = {
    addPostTempSaveTrends,
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(DisplayPosts));
