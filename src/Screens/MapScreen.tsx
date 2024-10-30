import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, View } from 'react-native';
import MapView, { MapType, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Appbar, IconButton, Text, Tooltip } from 'react-native-paper';
import { full_width } from '../Style/style';
import { useClient, useTheme } from '../Components/Container';
import { getCurrentLocation, handleToast } from '../Services';
import { useTranslation } from 'react-i18next';
import { userInfo } from '../Services/Client/Managers/Interfaces/Global';
import { BottomModal, LoaderBox } from '../Other';
import CustomCallout from '../Components/Map/CustomCallout';
import { Avatar } from '../Components/Member';

type LocationType = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
}

const MapScreen = () => {
  const { theme, colors } = useTheme();
  const { client } = useClient();
  const [location, setLocation] = useState<LocationType | undefined>(undefined);
  const [searchLocation, setSearchLocation] = useState<LocationType & { width?: number, heigth?: number } | undefined>(undefined);
  const [users, setUsers] = useState<userInfo[] | undefined>(undefined);
  const [mapType, setMapType] = useState<MapType>("satellite");
  const [modal, setModal] = useState({
    visible: false,
    user_index: 0,
  })
  const { t } = useTranslation();

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

  const UserModal = (user: userInfo) => (
    <BottomModal isVisible={modal.visible} dismiss={() => setModal({ ...modal, visible: false })}>
      <CustomCallout onDismiss={() => setModal({ ...modal, visible: false })} user_info={user} />
    </BottomModal>
  )

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

  return (
    <>
      {
        Platform.OS === "ios" && (
          <Appbar.Header>
          <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>Find users</Text>
        </Appbar.Header>
        )
      }
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: full_width,
        height: "100%"
      }}>
        {location ? (
          <>
            {users && modal.visible && <UserModal {...users[modal.user_index]} />}
            <View style={{
              position: "absolute",
              zIndex: 3,
              left: 5,
              top: 5,
              flexDirection: "column",
              alignItems: "center"
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
              {
                /**
                 * <Tooltip title='Search Distance'>
                <IconButton icon={`numeric-${max_distance}-circle`} onPress={() => setMaxDistance(max_distance === 50 ? 100 : 5)} mode='contained' size={25} />
              </Tooltip>
                 */
              }
            </View>
            <MapView
              provider={PROVIDER_GOOGLE}
              initialRegion={location}
              showsUserLocation={true}
              followsUserLocation={true}
              showsCompass={true}
              showsMyLocationButton={true}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}
              loadingIndicatorColor={colors.fa_primary}
              loadingBackgroundColor={colors.bg_primary}
              onRegionChangeComplete={(region) => {
                const { widthMeters, heightMeters } = calculateMapSize(region);
                setSearchLocation({
                  ...region,
                  heigth: heightMeters > 50000 ? 50000 : heightMeters,
                  width: widthMeters > 50000 ? 50000 : widthMeters
                })
              }}
              mapType={mapType}
              onUserLocationChange={(event) => setLocation({
                ...location,
                latitude: event.nativeEvent.coordinate?.latitude ?? location.latitude,
                longitude: event.nativeEvent.coordinate?.longitude ?? location.longitude
              })}
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
                      onPress={() => setModal({ visible: true, user_index: idx })}
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
          </>
        ) : <LoaderBox loading={true} />
        }
      </View>
    </>
  );
};

export default MapScreen;