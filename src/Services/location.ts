import Geolocation, { GeolocationResponse } from "@react-native-community/geolocation";
import { Platform } from "react-native";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";

export const getCurrentLocation = async (): Promise<GeolocationResponse | false> => {
    const permissions = await checkLocationPermission();
    if(permissions) {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                async (pos) => {
                    // Retourner la localisation via "resolve"
                    resolve(pos);
                },
                (err) => {
                    // Rejeter la promesse en cas d'erreur
                    reject(err);
                }
            );
        });
    } else {
        return false
    }
};

export const requestLocationPermission = async () => {
    const result = await request(Platform.OS === "android" ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (result === RESULTS.GRANTED) {
        return true;
    } else if (result === RESULTS.DENIED) {
        return false;
    } else if (result === RESULTS.BLOCKED) {
        return false;
    }
}

export const checkLocationPermission = async () => {
    const result = await check(Platform.OS === "android" ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (result === RESULTS.GRANTED) {
        return true;
    } else if (result === RESULTS.DENIED) {
        return await requestLocationPermission();
    } else if (result === RESULTS.BLOCKED) {
        return await requestLocationPermission();
    }
};
