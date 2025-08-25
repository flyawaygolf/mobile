import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { useTheme } from '../../Components/Container';
import JoinedEvents from '../../Components/Events/JoinedEvents';
import NearbyEventList from '../../Components/Events/NearbyEventList';
import PrivateEvents from '../../Components/Events/PrivateEvents';
import RecentEventsList from '../../Components/Events/RecentEventsList';
import { full_width } from '../../Style/style';

const renderScene = SceneMap({
    joined: JoinedEvents,
    nearby: NearbyEventList,
    private_joinable: PrivateEvents,
    recents: RecentEventsList,
});

export default function EventsNavigator() {

    const { colors } = useTheme();
    const { t } = useTranslation();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'joined', title: t("events.joined") },
        { key: 'nearby', title: t("events.nearby_you") },
        { key: 'private_joinable', title: t("events.privates") },
        { key: 'recents', title: t("events.recents")}
    ]);

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{
                backgroundColor: colors.fa_primary,
            }}
            style={{
                backgroundColor: colors.bg_primary,
            }}
            activeColor={colors.text_normal}
            inactiveColor={colors.text_normal}
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