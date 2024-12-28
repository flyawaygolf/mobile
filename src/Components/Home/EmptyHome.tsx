import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "react-native-paper";

const EmptyHome = () => {

    const { t } = useTranslation();
    
    return (
        <View>
            <Text style={{ padding: 5 }}>{t("home.no_posts")}</Text>
        </View>
    )
}

export default EmptyHome;