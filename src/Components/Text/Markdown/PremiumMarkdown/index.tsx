import React, { useContext } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { navigationProps } from '../../../../Services';
import { useClient, useTheme } from '../../../Container';
import { SinglePostContext } from '../../../Posts/PostContext';
import { premiumAdvantages } from '../../../../Services/premiumAdvantages';
import { GlobalInterface } from '../../../../Services/Client/Managers/Interfaces';
import { emojies_defs } from '../emojis';
import { Text } from 'react-native-paper';

interface Styles {
  container: ViewStyle;
  paragraph: ViewStyle;
  bold: TextStyle;
  underline: TextStyle;
  italic: TextStyle;
  strike: TextStyle;
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
  italic: {
    fontStyle: 'italic',
  },
  strike: {
    textDecorationLine: 'line-through',
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

    if (trimmedLine.startsWith('- ')) {
      return (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>{advantages.betterMarkdown() ? "•" : trimmedLine.substring(0, 1)}</Text>
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
    const result: React.ReactNode[] = [];
    let currentText = '';
  
    const flushCurrentText = () => {
      if (currentText) {
        result.push(currentText);
        currentText = '';
      }
    };
  
    const processText = (index: number): number => {
      if (index >= text.length) return text.length;
  
      // Traitement des mentions
      if (text[index] === '@') {
        const endIndex = text.indexOf(' ', index);
        const mention = text.slice(index, endIndex > -1 ? endIndex : undefined);
        const nickname = mention.slice(1);
        
        flushCurrentText();
  
        if (info?.mentions.length > 0) {
          const find = info.mentions.find((m: GlobalInterface.userInfo) => m.nickname === nickname);
          if (find) {
            result.push(
              <Text key={result.length} onPress={() => navigation?.navigate("ProfileStack", {
                screen: "ProfileScreen",
                params: { nickname: find.nickname }
              })} style={{ color: colors.text_link }}>
                {find.username}{' '}
              </Text>
            );
            return endIndex > -1 ? endIndex : text.length;
          }
        }
        
        currentText += mention + ' ';
        return endIndex > -1 ? endIndex : text.length;
      }
  
      // Traitement des emojis
      if (text[index] === ':') {
        const endIndex = text.indexOf(':', index + 1);
        if (endIndex > -1) {
          const emojiCode = text.slice(index + 1, endIndex);
          flushCurrentText();
          if (emojies_defs[emojiCode]) {
            result.push(<Text key={result.length}>{emojies_defs[emojiCode]}</Text>);
          } else {
            currentText += text.slice(index, endIndex + 1);
          }
          return endIndex + 1;
        }
      }
  
      // Traitement du formatage Markdown
      const markdownStyles = [
        { start: '**', end: '**', style: styles.bold },
        { start: '__', end: '__', style: styles.underline },
        { start: '*', end: '*', style: styles.italic },
        { start: '~~', end: '~~', style: styles.strike },
      ];
  
      for (const { start, end, style } of markdownStyles) {
        if (text.startsWith(start, index)) {
          const endIndex = text.indexOf(end, index + start.length);
          if (endIndex > -1) {
            flushCurrentText();
            const content = text.slice(index + start.length, endIndex);
            result.push(
              <Text key={result.length} style={advantages.betterMarkdown() ? style : undefined}>
                {content}
              </Text>
            );
            return endIndex + end.length;
          }
        }
      }
  
      // Texte normal
      currentText += text[index];
      return index + 1;
    };
  
    let i = 0;
    while (i < text.length) {
      i = processText(i);
    }
  
    flushCurrentText();
  
    return result;
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