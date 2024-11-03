import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import MapView, { MapType, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Appbar, Chip, IconButton, Text, Tooltip } from 'react-native-paper';
import { full_width } from '../Style/style';
import { useClient, useNavigation, useTheme } from '../Components/Container';
import { getCurrentLocation, handleToast } from '../Services';
import { useTranslation } from 'react-i18next';
import { userInfo } from '../Services/Client/Managers/Interfaces/Global';
import { Avatar } from '../Components/Member';
import { SearchBar } from '../Components/Elements/Input';
import { StyleSheet } from 'react-native';
import { ShrinkEffect } from '../Components/Effects';

type LocationType = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
}

const MapScreen = () => {
  const { theme, colors } = useTheme();
  const { client } = useClient();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<LocationType>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 1,
    longitudeDelta: 1,
  });
  const [searchLocation, setSearchLocation] = useState<LocationType & { width?: number, heigth?: number } | undefined>(undefined);
  const [searchUser, setSearchUser] = useState("");
  const [users, setUsers] = useState<userInfo[] | undefined>(undefined);
  const [mapType, setMapType] = useState<MapType>("standard");

  const changeMapType = () => mapType === "standard" ? setMapType("satellite") : setMapType("standard");

  const getCurrentPosition = async () => {
    try {
      const position = await getCurrentLocation();
      if (position) {
        const crd = position.coords;
        const location = {
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }
        setLocation(location);
        setSearchLocation(location);
        updateMapUsers(crd.longitude, crd.latitude)
      }
      return;
    } catch (error) {
      handleToast(JSON.stringify(error))
    }
  }

  useEffect(() => {
    getCurrentPosition()
  }, [])

  const updateUserLocation = async (long = location?.longitude, lat = location?.latitude) => {
    const request = await client.user.editLocation([long ?? 48.864716, lat ?? 2.349014]);
    if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
    return handleToast(t(`commons.success`));
  }

  const updateMapUsers = async (long = searchLocation?.longitude, lat = searchLocation?.latitude) => {
    const request = await client.user.displayUsersMap(long ?? 48.864716, lat ?? 2.349014, {
      max_distance: searchLocation?.width ?? 50000
    });
    if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
    return setUsers(request.data);
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

  const [searchChips] = useState([
    {
      text: "Search users",
      value: "users"
    },
    {
      text: "Search golfs",
      value: "golfs"
    },
    /*{
      text: "Search events",
      value: "events"
    },*/
  ])

  const centerMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(location, 1000);
    }
  };

  return (
    <>
      {
        Platform.OS === "ios" && (
          <Appbar.Header>
            <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>Find users</Text>
          </Appbar.Header>
        )
      }
      <View style={styles.globalView}>
      <View style={{
            position: "absolute",
            zIndex: 3,
            top: 5, // 85,
            right: 5,
            flexDirection: "column"
          }}>
            <Tooltip title='Change Map Type'>
              <IconButton icon={mapType === "standard" ? "map" : "satellite-variant"} onPress={() => changeMapType()} mode='contained' size={25} />
            </Tooltip>
            <Tooltip title='Update Showed Users'>
              <IconButton icon="sync" onPress={() => updateMapUsers()} mode='contained' size={25} />
            </Tooltip>
            <Tooltip title='Update Location'>
              <IconButton icon="account-sync" onPress={() => updateUserLocation()} mode='contained' size={25} />
            </Tooltip>
            <Tooltip title='Center'>
              <IconButton icon="crosshairs-gps" onPress={() => centerMap()} mode='contained' size={25} />
            </Tooltip>
          </View>
        <View style={styles.elements}>
          {
            /**
             *           <View style={styles.searchElements}>
            <SearchBar
              style={{
                width: "100%"
              }}
              onClearPress={() => { }}
              onSearchPress={() => { }}
              value={searchUser}
              onChangeText={(txt) => setSearchUser(txt)}
              placeholder='Search...'
            />
            <ScrollView contentContainerStyle={styles.searchChips} style={{ width: "100%" }}>
              {
                searchChips.map((c, idx) => <ShrinkEffect key={idx} shrinkAmount={0.90}><Chip style={{ borderRadius: 60 }}>{c.text}</Chip></ShrinkEffect>)
              }
            </ScrollView>
          </View>
             */
          }
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
              width: widthMeters
            })
          }}
          onUserLocationChange={(event) => setLocation({
            ...location,
            latitude: event.nativeEvent.coordinate?.latitude ?? location.latitude,
            longitude: event.nativeEvent.coordinate?.longitude ?? location.longitude
          })}
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
            height: "100%"
          }}
        >
          {
            users && users.length > 0 && users.map((u, idx) => {
              return (
                <Marker
                  key={idx}
                  onPress={() => navigation.push("ProfileStack", {
                    screen: "ProfileScreen",
                    params: {
                      user_info: u
                    }
                  })}
                  coordinate={{
                    longitude: u.golf_info.location[0],
                    latitude: u.golf_info.location[1]
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
        </MapView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  globalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: full_width,
    height: "100%"
  },
  elements: {
    position: "absolute",
    zIndex: 3,
    top: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  searchElements: {
    width: "90%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  searchChips: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5
  }
})

export default MapScreen;