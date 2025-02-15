import React, { PropsWithChildren, useState } from "react";
import { Appbar, Button, DataTable, Divider, Text } from "react-native-paper";
import { View, ViewStyle } from "react-native";

import styles, { full_width } from "../../Style/style";
import { SafeBottomContainer, useTheme } from ".";
import { useTranslation } from "react-i18next";
import { BottomModal } from "../../Other";

type SectionProps = PropsWithChildren<{
  changeVisibilty: () => void,
  onSave: () => void,
  dontSend: boolean
}>;

const PostCreatorContainer = ({ children, changeVisibilty, onSave, dontSend }: SectionProps) => {

  const { colors } = useTheme();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [items] = useState([
    {
      markdown: 'This is a **bold** text',
      render: ['This is a ', <Text key="bold" style={{ fontWeight: "bold" }}>bold</Text>, ' text'],
    },
    {
      markdown: 'This a __underline__ text',
      render: ['This a ', <Text key="underline" style={{ textDecorationLine: "underline" }}>underline</Text>, ' text'],
    },
    {
      markdown: 'This is a *italic* text',
      render: ['This is a ', <Text key="italic" style={{ fontStyle: "italic" }}>italic</Text>, ' text'],
    },
    {
      markdown: 'This is a ~~strike~~ text',
      render: ['This is a ', <Text key="strike" style={{ textDecorationLine: "line-through" }}>strike</Text>, ' text'],
    },
    {
      markdown: `- This is a list item`,
      render: '• This is a list item',
    }
  ]);

  return (
    <SafeBottomContainer>
      <BottomModal isVisible={visible} onSwipeComplete={() => setVisible(!visible)} dismiss={() => setVisible(false)}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>{t("posts.markdown")}</DataTable.Title>
            <DataTable.Title>{t("posts.rendering")}</DataTable.Title>
          </DataTable.Header>
          {items.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{item.markdown}</DataTable.Cell>
              <DataTable.Cell>{item.render}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
        <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
        <View style={{ padding: 10 }}>
          <Button textColor={colors.color_red} onPress={() => setVisible(false)}>{t("commons.close")}</Button>
        </View>
      </BottomModal>
      <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", justifyContent: "space-between", borderBottomColor: colors.bg_secondary, borderBottomWidth: 1 }}>
        <Appbar.BackAction onPress={() => changeVisibilty()} />
        <Button onPress={() => setVisible(true)} icon={"information-outline"}>{t("posts.text_formatting")}</Button>
        <View style={[styles.row, { justifyContent: "flex-end" }]}>
          <Appbar.Action disabled={dontSend} color={colors.text_normal} icon="send" onPress={() => onSave()} />
        </View>
      </Appbar.Header>
      {children}
    </SafeBottomContainer>
  )
};

export default PostCreatorContainer;