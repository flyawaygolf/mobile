import React, { PropsWithChildren } from 'react';
import { useTheme } from '../Container';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ScrollView, StyleSheet } from 'react-native';

function LoginContainer({ children }: PropsWithChildren) {

    const { colors } = useTheme();

    return (
        <SafeAreaView style={[style.area, { backgroundColor: colors.bg_primary }]}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', height: '100%', paddingBottom: 100 }}>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                    {children}
                </KeyboardAwareScrollView>
            </ScrollView>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    area: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
})

export default LoginContainer;

