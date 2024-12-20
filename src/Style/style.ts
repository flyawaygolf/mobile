import { Dimensions, StyleSheet } from 'react-native';

export const full_width = Dimensions.get('window').width;
export const full_height = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    align_left: {
        textAlign: 'left',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    activityIndicator: {
        alignItems: 'center',
        height: 50,
    },
    pdp33: {
        width: 33,
        height: 33,
        borderRadius: 60 / 2,
    },
    pined: {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "flex-start"
    }
});

export default styles;
