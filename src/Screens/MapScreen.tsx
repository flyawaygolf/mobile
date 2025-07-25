import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View, StyleSheet, Keyboard, Platform } from 'react-native';
import MapView, { MapType, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Chip, FAB } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

import { full_width } from '../Style/style';
import { useClient, useTheme } from '../Components/Container';
import { getCurrentLocation, handleToast, navigationProps } from '../Services';
import { userInfo } from '../Services/Client/Managers/Interfaces/Global';
import { Avatar } from '../Components/Member';
import { SearchBar } from '../Components/Elements/Input';
import { FadeInFromTop, ShrinkEffect } from '../Components/Effects';
import { golfInterface } from '../Services/Client/Managers/Interfaces/Golf';
import SearchMapModal from '../Components/Map/SearchMapModal';
import { locationType } from '../Components/Container/Client/ClientContext';

type searchChipsType = {
  icon: string;
  text: string;
  value: FilterType;
}[]

type FilterType = "golfs" | "all" | "users" | "pro" | "events"

const MapScreen = () => {
  const { theme, colors } = useTheme();
  const { client, user, setValue, location: initLocation } = useClient();
  const allClient = useClient();
  const navigation = useNavigation<navigationProps>();
  const { t } = useTranslation();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<locationType>(initLocation);
  const { top } = useSafeAreaInsets();
  const [query, setQuery] = useState<string>("");
  const [lastQuery, setLastQuery] = useState<string>("");
  const [queryResult, setQueryResult] = useState<(userInfo | golfInterface)[]>([]);
  const [queryFilter, setQueryFilter] = useState<FilterType>("all");
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchLocation, setSearchLocation] = useState<locationType & { width?: number, heigth?: number } | undefined>(undefined);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [users, setUsers] = useState<userInfo[]>([]);
  const [golfs, setGolfs] = useState<golfInterface[]>([]);
  const [mapType, setMapType] = useState<MapType>("standard");
  const [loadingCenter, setLoadingCenter] = useState(false);

  const changeMapType = useCallback(() => setMapType(prevType => prevType === "standard" ? "satellite" : "standard"), []);

  const getAndSetLocation = async () => {
    const position = await getCurrentLocation();
    if (!position) return null;
    const crd = position.coords;
    const new_location = {
      latitude: crd.latitude,
      longitude: crd.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    };
    centerMap({ init: true, go_to: new_location, duration: 0 });
    setLocation(new_location);
    setSearchLocation(new_location);
    await updateUserLocation(new_location.longitude, new_location.latitude, false);
    return new_location;
  };

  const start = useCallback(async () => {
    setLoadingCenter(true);
    let currentLocation = null;

    try {
      if (Platform.OS === "android") {
        const isEnabled = await isLocationEnabled();
        if (!isEnabled) {
          const result = await promptForEnableLocationIfNeeded();
          if (result === "enabled") {
            currentLocation = await getAndSetLocation();
          }
        } else {
          currentLocation = await getAndSetLocation();
        }
      } else {
        currentLocation = await getAndSetLocation();
      }
    } catch (error) {
      handleToast(t("errors.no_gps"));
    }

    try {
      const loc = currentLocation || initLocation;
      await Promise.all([
        updateMapUsers(loc.longitude, loc.latitude),
        updateMapGolfs(loc.longitude, loc.latitude)
      ]);
    } catch (error) {
      const init_location = {
        latitude: initLocation.latitude,
        longitude: initLocation.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
      centerMap({ init: true, go_to: init_location, duration: 0 });
      setSearchLocation(init_location);
      await Promise.all([
        updateMapUsers(init_location.longitude, init_location.latitude),
        updateMapGolfs(init_location.longitude, init_location.latitude)
      ]);
    } finally {
      setLoadingCenter(false);
    }
  }, [initLocation, t]);

  useEffect(() => {
    if (!isInputFocused) Keyboard.dismiss();
  }, [isInputFocused]);

  const updateUserLocation = useCallback(async (long = location?.longitude, lat = location?.latitude, toast = true) => {
    const request = await client.user.editLocation([long ?? 0, lat ?? 0]);
    if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
    setValue({ ...allClient, user: { ...user, golf_info: { ...user.golf_info, location: [long, lat] } }, location: location });
    return toast && handleToast(t(`commons.success`));
  }, [client, user, setValue, allClient, location, t]);

  const updateMapGolfs = useCallback(async (long = searchLocation?.longitude, lat = searchLocation?.latitude) => {
    const request = await client.search.map.golfs({
      long: long ?? 48.864716,
      lat: lat ?? 2.349014,
      max_distance: searchLocation?.width ?? 50000,
    });
    if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
    return setGolfs(request.data.golfs.items);
  }, [client, searchLocation, t]);

  const updateMapUsers = useCallback(async (long = searchLocation?.longitude, lat = searchLocation?.latitude) => {
    const request = await client.search.map.users({
      long: long ?? 48.864716,
      lat: lat ?? 2.349014,
      max_distance: searchLocation?.width ?? 50000,
    });
    if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
    return setUsers(request.data.users.items);
  }, [client, searchLocation, t]);

  const calculateMapSize = useMemo(() => (region: locationType) => {
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
  }, []);

  const searchAll = useCallback(async (query: string, long = location?.longitude, lat = location?.latitude) => {
    const response = await client.search.all(query, {
      location: {
        long: long ?? 48.864716,
        lat: lat ?? 2.349014,
      }
    });
    if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
    setQueryResult(response.data.result.items);
  }, [client, query, location, t]);

  const searchGolfs = useCallback(async (query: string, long = location?.longitude, lat = location?.latitude) => {
    const response = await client.search.golfs(query, {
      location: {
        long: long ?? 48.864716,
        lat: lat ?? 2.349014,
      }
    });
    if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
    setQueryResult(response.data.golfs.items);
  }, [client, query, location, t]);

  const searchUsers = useCallback(async (query: string, long = location?.longitude, lat = location?.latitude) => {
    const response = await client.search.users(query, {
      location: {
        long: long ?? 48.864716,
        lat: lat ?? 2.349014,
      }
    });
    if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
    setQueryResult(response.data.users.items);
  }, [client, query, location, t]);

  const debounceSearch = async (filter: FilterType) => {
    setQueryFilter(filter);
    setLastQuery(query);
    if (filter === 'all') await searchAll(query);
    else if (filter === 'golfs') await searchGolfs(query);
    else if (filter === 'users') await searchUsers(query);
  };

  useEffect(() => {
    if (query.length > 2 && lastQuery !== query) debounceSearch(queryFilter);
  }, [query, debounceSearch]);

  const handleChipPress = useCallback(async (type: FilterType, options?: {
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
  }, [setFilter, setUsers, setGolfs, updateMapGolfs, updateMapUsers]);

  const searchChips = useMemo<searchChipsType>(() => [
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
    }
    /*{
  text: "Search events",
  value: "events"
},*/
  ], []);

  const centerMap = useCallback(async (options: {
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
      return await handleChipPress(filter, {
        latitude: new_location.latitude,
        longitude: new_location.longitude
      });
    }
    if (location && mapRef.current) {
      setLoadingCenter(true)
      try {
        const position = await getCurrentLocation();
        if (!position) return mapRef.current.animateToRegion(location, options?.duration ?? 1000);
        const crd = position.coords;
        const new_location = {
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }
        setLocation(new_location);
        setSearchLocation(new_location);
        await Promise.all([
          handleChipPress(filter, {
            latitude: new_location.latitude,
            longitude: new_location.longitude
          }),
          updateUserLocation(new_location.longitude, new_location.latitude, false)
        ])
        return mapRef.current.animateToRegion(new_location, options?.duration ?? 1000);
      } catch (error) {
        handleToast(t(`errors.no_gps`));
        return mapRef.current.animateToRegion(location, options?.duration ?? 1000);
      } finally {
        setLoadingCenter(false)
      }
    }
  }, [mapRef, filter, location, setLoadingCenter, t, handleChipPress, updateUserLocation]);

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


  const fabButtons = useMemo(() => iconActions.map((i, idx) => (
    <FAB
      loading={i.loading}
      key={idx}
      color={i.main ? undefined : colors.fa_primary}
      style={!i.main && {
        backgroundColor: colors.bg_primary,
        borderRadius: 60 / 2
      }} icon={i.icon} onPress={i.onPress} />
  )), [iconActions, colors.fa_primary, colors.bg_primary]);


  const searchChipsComponents = useMemo(() => searchChips.map((c, idx) => (
    <ShrinkEffect key={idx} shrinkAmount={0.90}>
      <Chip
        selected={isInputFocused ? queryFilter === c.value : c.value === filter}
        disabled={isInputFocused ? queryFilter === c.value : c.value === filter}
        icon={isInputFocused ? queryFilter === c.value ? "check-bold" : c.icon : c.value === filter ? "check-bold" : c.icon}
        style={{ borderRadius: 60, paddingRight: 10, paddingLeft: 10, backgroundColor: colors.bg_secondary }}
        onPress={() => isInputFocused ? debounceSearch(c.value) : handleChipPress(c.value)}>
        {t(`map.${c.text}`)}
      </Chip>
    </ShrinkEffect>
  )), [searchChips, queryFilter, filter, isInputFocused, t, debounceSearch, handleChipPress]);


  const userMarkers = useMemo(() => users.map((u, idx) => {
    return (
      <Marker
        key={idx}
        onPress={() => navigation.navigate("ProfileStack", {
          screen: "ProfileScreen",
          params: {
            nickname: u.nickname,
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
  }), [users, client, navigation]);

  const golfMarkers = useMemo(() => golfs.map((g, idx) => {
    const isActive = Number(searchLocation?.latitude?.toFixed(2)) === Number(g.latitude.toFixed(2)) && Number(searchLocation?.longitude?.toFixed(2)) === Number(g.longitude.toFixed(2));

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
          longitude: g.longitude,
          latitude: g.latitude,
        }}
        title={g.name}
      />
    )
  }), [golfs, searchLocation, navigation]);

  const debouncedRegionChange = (region: Region) => {
    const { widthMeters, heightMeters } = calculateMapSize(region);    
    setSearchLocation({
      ...region,
      heigth: heightMeters,
      width: widthMeters,
    });
  };

  return (
    <View style={[styles.globalView]}>
      <View style={{
        position: "absolute",
        bottom: 5,
        right: 5,
        gap: 20,
        zIndex: 2,
        flexDirection: "column",
      }}>
        {
          !isInputFocused && fabButtons
        }
      </View>
      <SearchMapModal queryResult={queryResult} setIsInputFocused={setIsInputFocused} centerMap={centerMap} visible={isInputFocused} query={query} />
      <View style={[styles.elements, { top: top + 5 }]}>
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
              onSearchPress={() => debounceSearch(queryFilter)}
              value={query}
              onChangeText={(txt) => setQuery(txt)}
              placeholder="Search..."
            />
          </FadeInFromTop>
          <ScrollView horizontal={true} contentContainerStyle={styles.searchChips}>
            {
              !isInputFocused && (
                <ShrinkEffect shrinkAmount={0.90}><Chip icon={"refresh"} style={{ borderRadius: 60, paddingRight: 10, paddingLeft: 10 }} onPress={() => handleChipPress(filter)}>{t("map.refresh")}</Chip></ShrinkEffect>
              )
            }
            {searchChipsComponents}
          </ScrollView>
        </View>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        initialRegion={location}
        onMapReady={() => start()}
        onRegionChangeComplete={(props) => debouncedRegionChange(props)}
        onUserLocationChange={(event) => setLocation({
          ...location,
          latitude: event.nativeEvent.coordinate?.latitude ?? location.latitude,
          longitude: event.nativeEvent.coordinate?.longitude ?? location.longitude,
        })}
        userLocationUpdateInterval={30 * 1000} // 30sec
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
        {users.length > 0 && userMarkers}
        {golfs.length > 0 && golfMarkers}
      </MapView>
    </View>
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
