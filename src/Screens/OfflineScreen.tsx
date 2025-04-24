import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Dialog, Paragraph, Portal, Text } from 'react-native-paper';
import { full_height, full_width } from '../Style/style';
import { useTheme } from '../Components/Container';
import { deviceInfo } from '../Services';
import { useTranslation } from 'react-i18next';

const OfflineScreen = () => {

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
          <Dialog.Title>{t("offline.title")}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{t("offline.offline_message")}</Paragraph>
          </Dialog.Content>
        </Dialog>
      </Portal>
      {appInfo && <Text variant="bodyLarge" style={{ position: 'absolute', bottom: 100 }}>{appInfo.version} ({appInfo.build_number})</Text>}
    </View>
  );
};

export default OfflineScreen;

