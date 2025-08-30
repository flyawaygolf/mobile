import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";

import { SettingsContainer, useClient } from "../../Components/Container";
import DisplayUserScoreCard from "../../Components/Scorecards/DisplayUserScoreCard";
import { Loader } from "../../Other";
import { handleToast, navigationProps } from "../../Services";
import { getUserScoreCardInterface } from "../../Services/Client/Managers/Interfaces/Scorecard";


const ScorecardListScreen = () => {

    const { client, user } = useClient();
    const { t } = useTranslation();
    const navigation = useNavigation<navigationProps>();

    const [userScorecards, setuserScorecards] = useState<getUserScoreCardInterface[]>([]);
    const [loader, setLoader] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);

    async function getData() {
        const response = await client.userScoreCards.fetch(user.user_id, { pagination: { pagination_key: pagination_key } });
        setLoader(false)
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        if (response.data && response.data.length < 1) return;
        setuserScorecards(response.data ?? []);
    }

    useEffect(() => {
        getData()
    }, [])

    const bottomHandler = async () => {
        if (loader) return;
        setLoader(true)
        const response = await client.userScoreCards.fetch(user.user_id, { pagination: { pagination_key: pagination_key } });
        setLoader(false);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        if (response.data && response.data.length < 1) return;
        setuserScorecards(prev => [...prev, ...(response.data ?? [])]);
    }

    const renderItem = ({ item }: { item: getUserScoreCardInterface }) => {

        const navigateToSummarize = () => {
            navigation.navigate("ScorecardStack", {
                screen: "ScorecardSummarizeScreen",
                params: {
                    fromList: true,
                    user_id: user.user_id,
                    user_scorecard_id: item.user_scorecard_id

                }
            });
        }

        return <DisplayUserScoreCard
            onPress={navigateToSummarize}
            scorecard={item}
        />;
    };

    const memoizedValue = useMemo(() => renderItem, [userScorecards]);

    return (
        <SettingsContainer title={t("scorecard.list")}>
            <FlashList
                ListEmptyComponent={<Text style={{ padding: 5 }}>{t("commons.nothing_display")}</Text>}
                ListFooterComponent={loader ? <Loader /> : undefined}
                onScrollEndDrag={() => bottomHandler()}
                data={userScorecards}
                renderItem={memoizedValue}
                keyExtractor={item => item.user_scorecard_id} />
        </SettingsContainer>
    )
};

export default ScorecardListScreen;