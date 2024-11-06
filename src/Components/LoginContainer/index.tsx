import React, { PropsWithChildren } from 'react';
import { useTheme } from '../Container';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Logo } from '../Elements/Assets';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

function LoginContainer({ children }: PropsWithChildren) {

    const { colors } = useTheme();

    return (
        <SafeAreaView style={[style.area, { backgroundColor: colors.bg_primary }]}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={style.area}>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                    <View>
                        <View style={{ alignItems: 'center' }}>
                            <Logo size={65} style={{
                                marginBottom: 20,
                            }} />
                            <Text variant="headlineMedium" style={{ fontFamily: "Lobster-Regular" }}>FlyAway</Text>
                        </View>
                        {children}
                    </View>
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
