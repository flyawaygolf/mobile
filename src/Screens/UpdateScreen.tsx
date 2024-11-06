import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Paragraph, Portal, Text } from 'react-native-paper';
import { full_height, full_width } from '../Style/style';
import { useTheme } from '../Components/Container';
import { deviceInfo, openURL, storeLink } from '../Services';
import { useTranslation } from 'react-i18next';

const UpdateScreen = () => {

  const { colors } = useTheme();
  const { t } = useTranslation();
  const [appInfo, setAppInfo] = useState<any>(undefined);

  const getInfo = async () => {
    setAppInfo(await deviceInfo());
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <View style={{
      width: full_width,
      height: full_height,
      position: 'absolute',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bg_primary,
    }}>
      <Portal>
        <Dialog visible={true}>
          <Dialog.Title>{t("update.title")}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{t("update.paragraph_1")}</Paragraph>
            <Paragraph>{t("update.paragraph_2")}</Paragraph>
            <Paragraph>{t("update.paragraph_3")}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button uppercase={false} onPress={() => openURL(storeLink())}>{t("update.update")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {appInfo && <Text variant="bodyLarge" style={{ position: 'absolute', bottom: 100 }}>{appInfo.version} ({appInfo.build_number})</Text>}
    </View>
  );
};

export default UpdateScreen;

