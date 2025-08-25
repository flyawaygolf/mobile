import React, { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeBottomContainer } from '../Container';


function LoginContainer({ children }: PropsWithChildren) {

    return (
        <SafeBottomContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView keyboardShouldPersistTaps="handled">
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeBottomContainer>
    );
}

export default LoginContainer;

