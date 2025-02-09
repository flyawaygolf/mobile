import React, { useContext } from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { navigationProps } from '../../../../Services';
import { useClient, useTheme } from '../../../Container';
import { SinglePostContext } from '../../../Posts/PostContext';
import { premiumAdvantages } from '../../../../Services/premiumAdvantages';
import { GlobalInterface } from '../../../../Services/Client/Managers/Interfaces';
import { emojies_defs } from '../emojis';

interface Styles {
  container: ViewStyle;
  paragraph: ViewStyle;
  bold: TextStyle;
  underline: TextStyle;
  listItem: ViewStyle;
  bullet: TextStyle;
}

const RE_MENTIONS = /@[A-z0-9]{1,33}/gi;
const RE_TWEMOJI = /:(\w+):/gi;
// const RE_HASHTAG = /#(.*)/gi;
export const RE_LINKS = /(https?:\/\/[^\s]+)/gi;

const styles = StyleSheet.create<Styles>({
  container: {
    padding: 10,
  },
  paragraph: {
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  listItem: {
    flexDirection: 'row',
  },
  bullet: {
    marginRight: 5,
  },
});

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { user } = useClient();
  const ctx = useContext(SinglePostContext);
  const info = ctx?.info;

  const advantages = premiumAdvantages(user.premium_type, user.flags);

  const navigation = useNavigation<navigationProps>();
  const { colors } = useTheme();

  const renderLine = (line: string, index: number): React.ReactNode => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      return (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text>{renderInlineStyles(trimmedLine.slice(2))}</Text>
        </View>
      );
    }

    return (
      <Text key={index} style={styles.paragraph}>
        {renderInlineStyles(trimmedLine)}
      </Text>
    );
  };

  const renderInlineStyles = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*|__.*?__)/g);
    return parts.map((part, index) => {      
      if (RE_MENTIONS.test(part)) {
        
        const nickname = part.replace(/@/g, "");
        if (info?.mentions.length < 1) return <Text>{part} </Text>;

        const find = info?.mentions.find((m: GlobalInterface.userInfo) => m.nickname === nickname);
        if (!find) return <Text>{part} </Text>;

        return <Text onPress={() => navigation?.navigate("ProfileStack", {
          screen: "ProfileScreen",
          params: {
            nickname: find.nickname
          }
        })} style={{ color: colors.text_link }}>{find.username} </Text>;
      }
      if (RE_TWEMOJI.test(part)) {
        const sub = text.replace(/:/g, "")
        if (!sub) return <Text>{text} </Text>
        return <Text>{emojies_defs[sub]} </Text>
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <Text key={index} style={advantages.betterMarkdown() ? styles.bold : undefined}>{part.slice(2, -2)}</Text>;
      }
      if (part.startsWith('__') && part.endsWith('__')) {
        return <Text key={index} style={advantages.betterMarkdown() ? styles.underline : undefined}>{part.slice(2, -2)}</Text>;
      }
      return part;
    });
  };

  const lines = content.split('\n');

  return (
    <View style={styles.container}>
      {lines.map((line, index) => (
        <Text key={index}>
          {renderLine(line, index)}
        </Text>
      ))}
    </View>

  );
};

export default MarkdownRenderer;