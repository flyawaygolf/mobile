import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useTheme } from '../../Components/Container';
import { full_width } from '../../Style/style';

import FavoritesScreen from './FavoritesScreen';
import OthersScreen from './OthersScreen';
import EventsScreen from './EventsScreen';

const renderScene = SceneMap({
    favorites: FavoritesScreen,
    events: EventsScreen,
    others: OthersScreen
});

const GuildNavigator = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'favorites', title: t("guilds.favorites") },
        { key: 'events', title: t("guilds.events") },
        { key: 'others', title: t("guilds.others") }
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
            activeColor={colors.text_normal}
            inactiveColor={colors.text_normal}
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

export default GuildNavigator;