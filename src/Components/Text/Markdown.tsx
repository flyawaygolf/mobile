import React, { Suspense, lazy, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { NativeSyntheticEvent, StyleProp, TextLayoutEventData, TextStyle } from "react-native";
import { Divider, Text } from "react-native-paper";

import { handleToast, translateText } from "../../Services";
import { premiumAdvantages } from "../../Services/premiumAdvantages";
import { useClient } from "../Container";
import { PostNormalContextInfo } from "../Posts/Views/PostNormal";

const Renderer = lazy(() => import("./Markdown/Renderer"));

type SectionProps = React.FC<{
    content: string,
    noBr?: boolean,
    maxLine?: number,
    translate?: string,
    token?: string,
    style?: StyleProp<TextStyle>,
    postInfo?: PostNormalContextInfo
}>

const Markdown: SectionProps = ({ content, noBr, maxLine, translate, token, style, postInfo }) => {

    const [newText, setNewText] = useState<undefined | string>(undefined);
    const [lengthMore, setLengthMore] = useState<boolean | undefined>(false);
    const { t } = useTranslation();
    const { client, user } = useClient();

    const advantages = premiumAdvantages(user.premium_type, user.flags);

    const setTranslation = async (to: string) => {
        if (!token) return;
        const txt = await translateText(token, {
            content: content,
            to: to
        });        
        return setNewText(txt);
    }

    const onTextLayout = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
        maxLine && setLengthMore(e.nativeEvent.lines.length > maxLine); //to check the text is more than 5 lines or not
    }, []);

    const getOriginalText = async () => {
        if(!postInfo) return;
        const request = await client.posts.getOriginalText(postInfo.post_id);
        if(request.error || !request.data) return handleToast(t(`errors.${request.error?.message}`));
        return setNewText(request.data.text);
    }

    const DisplayMoreText = () => <Text style={{ color: "#00B0F4" }}> {t("commons.see_more")}</Text>;

    return (
        <>
            <Text onTextLayout={onTextLayout} style={[style, { fontSize: 15 }]} onPress={undefined} selectable={true} numberOfLines={maxLine ? maxLine : undefined}>
                <Suspense fallback={content}>
                    <Renderer noBr={noBr ? false : true} content={maxLine ? `${content.slice(0, 150).trim()}` : content.trim()} />
                </Suspense>
            </Text>
            {
                maxLine ? lengthMore ? <DisplayMoreText />
                    : content.length > 150 ? <DisplayMoreText />
                        : null
                    : null
            }
            {
                !maxLine && !newText && translate ? advantages.translatePosts() ? <Text onPress={() => getOriginalText()} style={{ color: "#00B0F4" }}>{t("commons.view_original")}</Text> : <Text onPress={() => setTranslation(translate)} style={{ color: "#00B0F4" }}>{t("commons.translate")}</Text> : undefined
            }
            {
                newText && (
                    <>
                        <Text onPress={() => setNewText(undefined)} style={{ color: "#00B0F4" }}>{t("commons.translated_with")} <Text>Google</Text></Text>
                        <Divider bold horizontalInset />
                        <Text style={{ fontSize: 15 }} onPress={undefined} selectable={true}>
                            <Suspense fallback={content}>
                                <Renderer noBr={noBr ? false : true} content={newText} />
                            </Suspense>
                        </Text>
                    </>
                )
            }
        </>

    );
}

export default Markdown;