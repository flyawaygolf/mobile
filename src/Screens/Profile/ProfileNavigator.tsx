import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from '../../Components/Container';
import { full_width } from '../../Style/style';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ProfileGolfs from './ProfileGolfs';
import ProfilePosts from './ProfilePosts';

const renderScene = SceneMap({
    posts: ProfilePosts,
    golfs: ProfileGolfs,
});

const ProfileNavigator = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'posts', title: t("profile.posts") },
        { key: 'golfs', title: t("profile.golfs") }
    ]);

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{
                backgroundColor: colors.fa_primary
            }}
            style={{
                backgroundColor: colors.bg_primary
            }}
            labelStyle={{
                color: colors.text_normal,
                textTransform: "capitalize"
            }}
            tabStyle={{
                width: full_width / routes.length
            }}
        />
    );

    return (
        <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: full_width, height: 0 }}
        />
    );
};

export default ProfileNavigator;