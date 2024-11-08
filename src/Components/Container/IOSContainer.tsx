import { PropsWithChildren } from "react";
import { Platform, SafeAreaView } from "react-native";

const IOSContainer = ({ children }: PropsWithChildren) => (
    Platform.OS === "ios" ? (
        <SafeAreaView>
            {children}
        </SafeAreaView>
    ) : children
)

export default IOSContainer;