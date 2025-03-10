import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Keyboard } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import Clipboard from "@react-native-clipboard/clipboard";
import { useClient, useTheme } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { handleToast } from '../../Services';

function AffiliationScreen() {

    const { t } = useTranslation();
    const { client, user } = useClient();
    const { colors } = useTheme();
    const [affiliation_code, setAffiliate] = useState("");
    const [affiliate_number, setAffiliateNumber] = useState(0);
    const [originalCode, setOriginalCode] = useState("");

    async function getData() {
        const request = await client.affiliations.fetch();
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        if (!request.data) return;
        const data = request.data;
        if (data.affiliate_to) {
            setOriginalCode(data.affiliate_to.username);
            setAffiliate(data.affiliate_to.username);
        }
        setAffiliateNumber(data.affiliate_number ?? 0);
    }

    useEffect(() => {
        getData()
    }, [])

    const registerAffiliate = async () => {
        if (affiliation_code.length === 0) return;
        if (affiliation_code === originalCode) return;
        if (affiliation_code.length < 3) return;
        if (affiliation_code === user.nickname) return handleToast(t(`errors.13001`));
        Keyboard.dismiss();        
        const request = await client.affiliations.set(affiliation_code);
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        if (!request.data) return;
        setOriginalCode(request.data.username);
        setAffiliate(request.data.username);
        handleToast(t(`commons.success`))
    }

    /*const deleteCode = async () => {
        Keyboard.dismiss();
        const request = await client.affiliations.delete();
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        handleToast(t(`commons.success`))
    }*/

    const copyCode = async () => {
        Clipboard.setString(user.nickname);
        handleToast(t(`commons.success`))
    }

    return (
        <SettingsContainer title={t("settings.affiliation")}>
            <TextInput
                disabled
                style={{ margin: 10 }}
                label={`${t("settings.my_code")}`}
                autoCapitalize="none"
                value={user.nickname}
                right={<TextInput.Icon onPress={() => copyCode()} icon="content-copy" color={colors.text_normal} />}
            />
            <TextInput
                style={{ margin: 10 }}
                label={`${t("settings.affiliation_code")}`}
                autoCapitalize="none"
                value={affiliation_code}
                disabled={originalCode.length > 0}
                right={originalCode.length < 1 && <TextInput.Icon 
                    disabled={affiliation_code.length < 3 && affiliation_code.length !== 0} 
                    onPress={() => registerAffiliate()}
                    icon={originalCode === affiliation_code ? "close-circle" : "content-save"}
                    color={colors.text_normal} />}
                onChangeText={(text) => setAffiliate(text)}
            />
            <Text style={{ margin: 10 }}>{t("settings.affiliate_use_code", {
                number: affiliate_number
            })}</Text>
        </SettingsContainer>
    )
}

export default AffiliationScreen;