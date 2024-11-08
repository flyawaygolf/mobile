import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, ScrollView, View, StyleSheet, Keyboard, SafeAreaView } from 'react-native';
import MapView, { MapType, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Appbar, Chip, FAB, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { full_width } from '../Style/style';
import { IOSContainer, useClient, useNavigation, useTheme } from '../Components/Container';
import { getCurrentLocation, handleToast } from '../Services';
import { userInfo } from '../Services/Client/Managers/Interfaces/Global';
import { Avatar } from '../Components/Member';
import { SearchBar } from '../Components/Elements/Input';
import { FadeInFromTop, ShrinkEffect } from '../Components/Effects';
import { golfInterface } from '../Services/Client/Managers/Interfaces/Search';
import SearchMapModal from '../Components/Map/SearchMapModal';

type LocationType = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
}

type searchChipsType = {
  icon: string;
  text: string;
  value: FilterType;
}[]

type FilterType = "golfs" | "all" | "users" | "pro" | "events"

const MapScreen = () => {
  const { theme, colors } = useTheme();
  const { client } = useClient();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<LocationType>({
    latitude: 48.864716,
    longitude: 2.349014,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const [query, setQuery] = useState<string>("");
  const [queryResult, setQueryResult] = useState<(userInfo | golfInterface)[]>([]);
  const [queryFilter, setQueryFilter] = useState<FilterType>("all");
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchLocation, setSearchLocation] = useState<LocationType & { width?: number, heigth?: number } | undefined>(undefined);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [users, setUsers] = useState<userInfo[]>([]);
  const [golfs, setGolfs] = useState<golfInterface[]>([]);
  const [mapType, setMapType] = useState<MapType>("standard");
  const [loadingCenter, setLoadingCenter] = useState(false);

  const changeMapType = useCallback(() => setMapType(prevType => prevType === "standard" ? "satellite" : "standard"), []);

  const start = async () => {
    try {
      setLoadingCenter(true)
      const position = await getCurrentLocation();
      if (position) {
        const crd = position.coords;
        const init_location = {
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }
        centerMap({
          init: true,
          go_to: init_location,
          duration: 0
        })
        setLocation(init_location);
        setSearchLocation(init_location);
        await updateUserLocation(crd.longitude, crd.latitude, false);
        await updateMapUsers(crd.longitude, crd.latitude);
        await updateMapGolfs(crd.longitude, crd.latitude);
      }
      return setLoadingCenter(false);
    } catch (error) {
      handleToast(JSON.stringify(error))
    }
  }

  useEffect(() => {
    if (!isInputFocused) Keyboard.dismiss();
  }, [isInputFocused]);

  useEffect(() => {
    if (mapRef.current?.state.isReady) start()
  }, [mapRef.current?.state])

  const updateUserLocation = async (long = location?.longitude, lat = location?.latitude, toast = true) => {
    const request = await client.user.editLocation([long ?? 48.864716, lat ?? 2.349014]);
    if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
    return toast && handleToast(t(`commons.success`));
  }

  const updateMapGolfs = async (long = searchLocation?.longitude, lat = searchLocation?.latitude) => {
    const request = await client.search.map.golfs({
      long: long ?? 48.864716,
      lat: lat ?? 2.349014,
      max_distance: searchLocation?.width ?? 50000,
    })
    if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
    return setGolfs(request.data.golfs.items);
  }

  const updateMapUsers = async (long = searchLocation?.longitude, lat = searchLocation?.latitude) => {
    const request = await client.search.map.users({
      long: long ?? 48.864716,
      lat: lat ?? 2.349014,
      max_distance: searchLocation?.width ?? 50000,
    })
    if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
    return setUsers(request.data.users.items);
  }

  function calculateMapSize(region: LocationType) {
    const { latitude, latitudeDelta, longitudeDelta } = region;

    // Conversion des degrés en radians
    const latRadian = latitude * Math.PI / 180;

    /*// Calcul de la largeur et de la hauteur approximatives en kilomètres
    const widthKm = longitudeDelta * 111.32 * Math.cos(latRadian);
    const heightKm = latitudeDelta * 111.32;*/

    // Calcul de la largeur et de la hauteur approximatives en mètres
    const widthMeters = longitudeDelta * 111320 * Math.cos(latRadian);
    const heightMeters = latitudeDelta * 111320;

    return { widthMeters, heightMeters };
  }

  const searchAll = async (long = location?.longitude, lat = location?.latitude) => {
    const response = await client.search.all(query, {
      location: {
        long: long ?? 48.864716,
        lat: lat ?? 2.349014,
      }
    })
    if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
    setQueryResult(response.data.result.items);
  }

  const searchGolfs = async (long = location?.longitude, lat = location?.latitude) => {
    const response = await client.search.golfs(query, {
      location: {
        long: long ?? 48.864716,
        lat: lat ?? 2.349014,
      }
    })
    if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
    setQueryResult(response.data.golfs.items);
  }

  const searchUsers = async (long = location?.longitude, lat = location?.latitude) => {
    const response = await client.search.users(query, {
      location: {
        long: long ?? 48.864716,
        lat: lat ?? 2.349014,
      }
    })
    if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
    setQueryResult(response.data.users.items);
  }

  useEffect(() => {
    if (query.length > 2) searchQuery(queryFilter);
  }, [query])

  const searchQuery = async (filter: FilterType) => {
    setQueryFilter(filter);
    switch (filter) {
      case "golfs":
        await searchGolfs();
        break;
      case 'users':
        await searchUsers();
        break;
      case "all":
        await searchAll();
        break;
      default:
        break;
    }
  }

  const pressChip = async (type: FilterType, options?: {
    latitude: number;
    longitude: number;
  }) => {
    setFilter(type);
    switch (type) {
      case "golfs":
        await updateMapGolfs(options?.longitude, options?.latitude);
        setUsers([])
        break;
      case 'users':
        await updateMapUsers(options?.longitude, options?.latitude);
        setGolfs([])
        break;
      case "all":
        await updateMapUsers(options?.longitude, options?.latitude);
        await updateMapGolfs(options?.longitude, options?.latitude);
        break;
      default:
        break;
    }
  }

  const [searchChips] = useState<searchChipsType>([
    {
      icon: "all-inclusive",
      text: "all",
      value: "all",
    },
    {
      icon: "account-supervisor",
      text: "players",
      value: "users",
    },
    {
      icon: "golf",
      text: "golfs",
      value: "golfs",
    },
    /*{
      text: "Search events",
      value: "events"
    },*/
  ])

  const centerMap = async (options: {
    init?: boolean;
    go_to?: {
      latitude: number;
      longitude: number;
    },
    duration?: number
  }) => {
    if (options?.go_to && mapRef.current) {
      const new_location = {
        ...options?.go_to,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      }
      mapRef.current.animateToRegion(new_location, options?.duration ?? 1000);
      setSearchLocation(new_location);
      if (options.init) return;
      return await pressChip(filter, {
        latitude: new_location.latitude,
        longitude: new_location.longitude
      });
    }
    if (location && mapRef.current) {
      setLoadingCenter(true)
      const position = await getCurrentLocation();
      if (!position) return mapRef.current.animateToRegion(location, options?.duration ?? 1000);
      const crd = position.coords;
      const new_location = {
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }
      await pressChip(filter, {
        latitude: new_location.latitude,
        longitude: new_location.longitude
      });
      setLoadingCenter(false)
      return mapRef.current.animateToRegion(new_location, options?.duration ?? 1000);
    }
  };

  const iconActions = useMemo(() => [
    {
      icon: mapType === "standard" ? "map" : "satellite-variant",
      label: t("map.change_type"),
      onPress: () => changeMapType(),
      main: false,
      loading: false
    },
    /*{
      icon: "account-sync",
      label: t("map.account_sync"),
      onPress: () => updateUserLocation(),
      main: false
    },*/
    {
      icon: "crosshairs-gps",
      label: t("map.center"),
      onPress: () => centerMap({}),
      main: true,
      loading: loadingCenter
    },
  ], [mapType, loadingCenter])

  return (
    <IOSContainer>
      <View style={styles.globalView}>
        <View style={{
          position: "absolute",
          bottom: 5,
          right: 5,
          gap: 20,
          zIndex: 2,
          flexDirection: "column",
        }}>
          {
            !isInputFocused && iconActions.map((i, idx) => (
              <FAB
                loading={i.loading}
                key={idx}
                color={i.main ? undefined : colors.fa_primary}
                style={!i.main && {
                  backgroundColor: colors.bg_primary,
                  borderRadius: 60 / 2
                }} icon={i.icon} onPress={i.onPress} />
            ))
          }
        </View>
        <SearchMapModal queryResult={queryResult} setIsInputFocused={setIsInputFocused} centerMap={centerMap} visible={isInputFocused} query={query} />
        <View style={styles.elements}>
          <View style={styles.searchElements}>
            <FadeInFromTop>
              <SearchBar
                inputProps={{
                  onPress: () => setIsInputFocused(true),
                  onFocus: () => setIsInputFocused(true),
                  onBlur: () => Keyboard.dismiss()
                }}
                style={{
                  width: "95%",
                }}
                onClearPress={() => {
                  setIsInputFocused(false);
                  setQueryResult([])
                  setQuery("");
                }}
                onSearchPress={() => searchQuery(queryFilter)}
                value={query}
                onChangeText={(txt) => setQuery(txt)}
                placeholder="Search..."
              />
            </FadeInFromTop>
            <ScrollView horizontal={true} contentContainerStyle={styles.searchChips}>
              {
                !searchLocation?.width || searchLocation.width && searchLocation.width < 150 * 1000 && !isInputFocused && (
                  <ShrinkEffect shrinkAmount={0.90}><Chip icon={"refresh"} style={{ borderRadius: 60, paddingRight: 10, paddingLeft: 10 }} onPress={() => pressChip(filter)}>{t("map.refresh")}</Chip></ShrinkEffect>
                )
              }
              {
                searchChips.map((c, idx) => (
                  <ShrinkEffect key={idx} shrinkAmount={0.90}>
                    <Chip
                      selected={isInputFocused ? queryFilter === c.value : c.value === filter}
                      disabled={isInputFocused ? queryFilter === c.value : c.value === filter}
                      icon={isInputFocused ? queryFilter === c.value ? "check-bold" : c.icon : c.value === filter ? "check-bold" : c.icon}
                      style={{ borderRadius: 60, paddingRight: 10, paddingLeft: 10, backgroundColor: colors.bg_secondary }}
                      onPress={() => isInputFocused ? searchQuery(c.value) : pressChip(c.value)}>
                      {t(`map.${c.text}`)}
                    </Chip>
                  </ShrinkEffect>
                ))
              }
            </ScrollView>
          </View>
        </View>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          initialRegion={location}
          onRegionChange={(region) => {
            const { widthMeters, heightMeters } = calculateMapSize(region);
            setSearchLocation({
              ...region,
              heigth: heightMeters,
              width: widthMeters,
            })
          }}
          onUserLocationChange={(event) => setLocation({
            ...location,
            latitude: event.nativeEvent.coordinate?.latitude ?? location.latitude,
            longitude: event.nativeEvent.coordinate?.longitude ?? location.longitude,
          })}
          userLocationUpdateInterval={30000} // 30sec
          loadingIndicatorColor={colors.fa_primary}
          loadingBackgroundColor={colors.bg_primary}
          showsUserLocation={true}
          followsUserLocation={true}
          toolbarEnabled={false}
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
            users.length > 0 && users.map((u, idx) => {
              return (
                <Marker
                  key={idx}
                  onPress={() => navigation.push("ProfileStack", {
                    screen: "ProfileScreen",
                    params: {
                      user_info: u,
                    },
                  })}
                  coordinate={{
                    longitude: u.golf_info.location.longitude,
                    latitude: u.golf_info.location.latitude,
                  }}
                // calloutOffset={{ x: -8, y: 28 }}
                // calloutAnchor={{ x: 0.5, y: -0.2 }}
                // tracksViewChanges={false}
                >
                  <Avatar url={client.user.avatar(u.user_id, u.avatar)} size={33} />
                </Marker>
              )
            })
          }
          {
            golfs.length > 0 && golfs.map((g, idx) => {
              return (
                <Marker
                  key={idx}
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
      </View>
    </IOSContainer>
  );
};

const styles = StyleSheet.create({
  globalView: {
    //    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: full_width,
    height: "100%",
  },
  elements: {
    position: "absolute",
    zIndex: 3,
    top: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  searchElements: {
    width: full_width,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  searchChips: {
    marginTop: 5,
    paddingLeft: "5%",
    paddingRight: "5%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
})

export default MapScreen;
