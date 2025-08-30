import { FlashList } from "@shopify/flash-list";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Badge, Card, ProgressBar, Text } from "react-native-paper";

import { SettingsContainer, useClient, useTheme } from "../../Components/Container";
import { Loader } from "../../Other";
import { handleToast } from "../../Services";
import { AchievementFetchSchema } from "../../Services/Client/Managers/Interfaces/Achievement";
import { View } from "react-native";

const achievementIcons: Record<number, string> = {
    1: "clipboard-check",                // CompleteFirstScorecard
    2: "clipboard-multiple",             // Complete10Scorecards
    3: "golf",                           // MakeAPar
    4: "star",                           // MakeABirdie
    5: "star-outline",                   // Make2ConsecutiveBirdies
    6: "trophy",                         // MakeAnEagle
    7: "trophy-award",                   // MakeAnAlbatross
    8: "numeric-100",                    // ScoreUnder100On18Holes
    9: "equal",                          // FinishAtParOn18Holes
    10: "less-than",                     // FinishUnderParOn18Holes
    11: "numeric-9-plus",                // ReachSingleDigitHandicap
    12: "numeric-negative-1",            // HaveANegativeHandicap
    13: "golf-tee",                      // HoleInOne
    14: "arrow-right-bold",              // LongestDriveInARound
    15: "emoticon-happy",                // Finish18HolesWithoutAnyBogey
    16: "chart-line",                    // BeatYourPersonalBestScore
    17: "calendar-range",                // PlayGolfFor3ConsecutiveDays
    18: "earth",                         // PlayAllGolfCoursesInACountry
    19: "star-multiple",                 // Accumulate50BirdiesInASeason
    20: "post",                          // CreateYourFirstPost
    21: "heart",                         // AddYourFirstFavorite
    22: "account-group",                 // JoinYourFirstEvent
    23: "account-plus",                  // InviteAFriendToFlyAway
    24: "weather-rainy",                 // PlayARoundInTheRain
    25: "airplane",                      // PlayOnAForeignCourse
    26: "camera",                        // PostASelfieOnTheGreen
    27: "medal",                         // ParticipateInAnOfficialFlyAwayTournament
};

const AchievementsListScreen = () => {

    const { client, user } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();

    const [achievements, setAchievements] = useState<AchievementFetchSchema[]>([]);
    const [loader, setLoader] = useState(true);

    async function getData() {
        const response = await client.achievements.fetch(user.user_id);
        setLoader(false)
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (response.data && response.data.length < 1) return;
        setAchievements(response.data ?? []);
    }

    useEffect(() => {
        getData()
    }, [])

    const renderItem = ({ item }: { item: AchievementFetchSchema }) => {
        const unlocked = item.achieved;
        const percent = item.pourcentage_achieved ?? 0;
        const iconName = achievementIcons[item.achievement_id] || "medal";
        return (
            <Card
                style={{
                    marginVertical: 8,
                    marginHorizontal: 12,
                    elevation: unlocked ? 3 : 1,
                    borderColor: unlocked ? colors.fa_primary : colors.text_muted,
                    borderWidth: unlocked ? 1 : 0,
                }}
            >
                <Card.Title
                    title={item.label}
                    subtitle={item.description}
                    left={props => (
                        <Avatar.Icon
                            {...props}
                            icon={iconName}
                            color={unlocked ? colors.fa_primary : colors.text_muted}
                        />
                    )}
                    right={() =>
                        unlocked ? (
                            <Badge style={{ backgroundColor: colors.fa_primary, marginRight: 12 }}>Débloqué</Badge>
                        ) : (
                            <Badge style={{ backgroundColor: colors.text_muted, marginRight: 12 }}>À débloquer</Badge>
                        )
                    }
                />
                <Card.Content>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                        <ProgressBar
                            progress={percent / 100}
                            style={{ flex: 1, height: 8, borderRadius: 4 }}
                        />
                        <Text style={{ marginLeft: 12, fontWeight: "bold" }}>
                            {percent.toFixed(1)}%
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    const memoizedValue = useMemo(() => renderItem, [achievements]);

    return (
        <SettingsContainer title={t("achievements.title")}>
            <FlashList
                ListEmptyComponent={<Text style={{ padding: 5 }}>{t("commons.nothing_display")}</Text>}
                ListFooterComponent={loader ? <Loader /> : undefined}
                data={achievements}
                renderItem={memoizedValue}
                keyExtractor={item => item.achievement_id.toString()} />
        </SettingsContainer>
    )
};

export default AchievementsListScreen;