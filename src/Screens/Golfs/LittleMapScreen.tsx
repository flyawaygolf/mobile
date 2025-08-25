import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native';
import MapView, { MapType, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { IconButton } from 'react-native-paper';

import { useClient, useTheme } from '../../Components/Container';
import CustomHeader from '../../Components/Header/CustomHeader';
import { handleToast, navigationProps } from '../../Services';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Golf';
import { full_width } from '../../Style/style';


type LocationType = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
}

const LittleMapScreen = ({ route }: any) => {
  const { initial_location } = route.params ?? {};
  const { theme, colors } = useTheme();
  const { client } = useClient();
  const navigation = useNavigation<navigationProps>();
  const { t } = useTranslation();
  const mapRef = useRef<MapView>(null);
  const [location] = useState<LocationType>({
    latitude: initial_location.latitude ?? 48.864716,
    longitude: initial_location.longitude ?? 2.349014,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const [golfs, setGolfs] = useState<golfInterface[]>([]);
    const [mapType, setMapType] = useState<MapType>("standard");
    const changeMapType = useCallback(() => setMapType(prevType => prevType === "standard" ? "satellite" : "standard"), []);

  const start = async () => {
    try {
      await updateMapGolfs(location.longitude, location.latitude);
    } catch (error) {
      handleToast(JSON.stringify(error))
    }
  }

  useEffect(() => {
    start();
  }, [initial_location])

  const updateMapGolfs = async (long: number, lat: number) => {
    const request = await client.search.map.golfs({
      long: long,
      lat: lat,
      max_distance: 50000,
    })
    if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));    
    return setGolfs(request.data.golfs.items);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title={t(`map.title`)} leftComponent={<IconButton icon={mapType === "standard" ? "map" : "satellite-variant"} onPress={() => changeMapType()} />} />
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        initialRegion={location}
        userLocationUpdateInterval={30000} // 30sec
        loadingIndicatorColor={colors.fa_primary}
        loadingBackgroundColor={colors.bg_primary}
        showsUserLocation={true}
        followsUserLocation={false}
        toolbarEnabled={true}
        showsCompass={false}
        showsMyLocationButton={false}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
        mapType={mapType}
        userInterfaceStyle={theme === "dark" ? "dark" : "light"}
        style={{
          width: full_width,
          height: "100%",
        }}
      >
        {
          golfs.length > 0 && golfs.map((g, idx) => {
            const isActive = Number(location?.latitude?.toFixed(2)) === Number(g.location.latitude.toFixed(2)) && Number(location?.longitude?.toFixed(2)) === Number(g.location.longitude.toFixed(2));
            return (
              <Marker
                key={`${idx}-${isActive ? 'active' : 'inactive'}`}
                onPress={() => navigation.navigate("GolfsStack", {
                  screen: "GolfsProfileScreen",
                  params: {
                    golf_id: g.golf_id,
                  }
                })}
                pinColor={isActive ? 'yellow' : 'red'}
                coordinate={{
                  longitude: g.location.longitude,
                  latitude: g.location.latitude,
                }}
                title={g.name}
              />
            )
          })
        }
      </MapView>
    </SafeAreaView>
  );
};

export default LittleMapScreen;
