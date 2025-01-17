import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { BottomModal } from '../../Other';

const colors = [
    '#6874e7',
    '#b8304f',
    '#758E4F',
    '#fa3741',
    '#F26419',
    '#F6AE2D',
    '#DFAEB4',
    '#7A93AC',
    '#33658A',
    '#3d2b56',
    '#42273B',
    '#171A21',
];

const CIRCLE_SIZE = 40;
const CIRCLE_RING_SIZE = 2;

export default function Example() {
    const [value, setValue] = React.useState(0);

    return (
        <BottomModal>
            <View style={styles.sheetHeader}>
                <Text style={styles.sheetHeaderTitle}>Select profile color</Text>
            </View>
            <View style={styles.sheetBody}>
                <View style={[styles.profile, { backgroundColor: colors[value] }]}>
                    <Text style={styles.profileText}>MB</Text>
                </View>
                <View style={styles.group}>
                    {colors.map((item, index) => {
                        const isActive = value === index;
                        return (
                            <View key={item}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        setValue(index);
                                    }}>
                                    <View
                                        style={[
                                            styles.circle,
                                            isActive && { borderColor: item },
                                        ]}>
                                        <View
                                            style={[styles.circleInside, { backgroundColor: item }]}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        );
                    })}
                </View>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                        // handle onPress
                    }}>
                    <Text style={styles.btnText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </BottomModal>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    group: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    /** Placeholder */
    placeholder: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        height: 400,
        marginTop: 0,
        padding: 24,
        backgroundColor: 'transparent',
    },
    placeholderInset: {
        borderWidth: 4,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
        borderRadius: 9,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    sheetHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    sheetHeaderTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    sheetBody: {
        padding: 24,
    },
    /** Profile */
    profile: {
        alignSelf: 'center',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    profileText: {
        fontSize: 34,
        fontWeight: '600',
        color: 'white',
    },
    /** Circle */
    circle: {
        width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
        height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
        borderRadius: 9999,
        backgroundColor: 'white',
        borderWidth: CIRCLE_RING_SIZE,
        borderColor: 'transparent',
        marginRight: 8,
        marginBottom: 12,
    },
    circleInside: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: 9999,
        position: 'absolute',
        top: CIRCLE_RING_SIZE,
        left: CIRCLE_RING_SIZE,
    },
    /** Button */
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        padding: 14,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#000',
        marginBottom: 12,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
