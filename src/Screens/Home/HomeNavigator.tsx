import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useTheme } from '../../Components/Container';
import { full_width } from '../../Style/style';
import FollowsPosts from './FollowsPosts';
import RecentPosts from './RecentPosts';

const renderScene = SceneMap({
    recents: RecentPosts,
    follows: FollowsPosts
});

function HomeNavigator() {

    const { colors } = useTheme();
    const { t } = useTranslation();

    const [index, setIndex] = useState(1);
    const [routes] = useState([
        { key: 'recents', title: t("home.recents") },
        { key: 'follows', title: t("home.follows") }
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
}

export default HomeNavigator;