import React, { PropsWithChildren } from 'react';
import { useTheme } from '../Container';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

function LoginContainer({ children }: PropsWithChildren) {

    const { colors } = useTheme();

    return (
        <SafeAreaView style={[style.area, { backgroundColor: colors.bg_primary }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', height: '100%', paddingBottom: 100 }}>
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
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

