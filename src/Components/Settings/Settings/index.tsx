import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { useNavigation } from "@react-navigation/native";

import SettingsButtons from "./SettingsButtons";
import { deviceInfo, handleToast, navigationProps } from "../../../Services";
type PropsType = {
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsModifyProfile = ({ setModalVisible }: PropsType) => {
    const { t } = useTranslation();
    const [appInfo, setAppInfo] = useState<any>(undefined);
    const navigation = useNavigation<navigationProps>();

    const getInfo = async () => {
        setAppInfo(await deviceInfo())
    }

    useEffect(() => {
        getInfo()
    }, [])

    const copyText = () => {
        Clipboard.setString(`App informations : ${JSON.stringify(appInfo)}`);
        handleToast(t("commons.success"));
    }

    return (
        <View>
            <ScrollView style={{ padding: 5, display: "flex", flexDirection: "column", gap: 10 }}>
                {appInfo && <SettingsButtons onPress={() => copyText()} t={`${t("settings.app_version")} : ${appInfo.version} (${appInfo.build_number})`} icon={"content-copy"} />}
                <SettingsButtons onPress={() => {
                    setModalVisible(false)
                    navigation?.navigate("SettingsStack", { screen: "SessionScreen" })
                }} t={t("settings.sessions")} />
                <SettingsButtons onPress={() => {
                    setModalVisible(false)
                    navigation?.navigate("SettingsStack", { screen: "BlockScreen" })
                }} t={t("settings.blocked")} />
                <SettingsButtons onPress={() => {
                    setModalVisible(false)
                    navigation?.navigate("SettingsStack", { screen: "SecurityScreen" })
                }} t={t("settings.security")} />
            </ScrollView>
        </View>
    )
}

export default SettingsModifyProfile