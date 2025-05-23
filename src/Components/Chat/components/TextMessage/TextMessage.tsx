import {
  LinkPreview,
  PreviewData,
  REGEX_LINK,
} from '@flyerhq/react-native-link-preview';
import * as React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { MessageType } from '../../types';
import {
  excludeDerivedMessageProps,
  getUserName,
  ThemeContext,
  UserContext,
} from '../../utils';
import styles from './styles';

export interface TextMessageTopLevelProps {
  /** @see {@link LinkPreviewProps.onPreviewDataFetched} */
  onPreviewDataFetched?: ({
    message,
    previewData,
  }: {
    message: MessageType.Text
    previewData: PreviewData
  }) => void
  /** Enables link (URL) preview */
  usePreviewData?: boolean
}

export interface TextMessageProps extends TextMessageTopLevelProps {
  enableAnimation?: boolean
  message: MessageType.DerivedText
  messageWidth: number
  showName: boolean
}

export const TextMessage = ({
  enableAnimation,
  message,
  messageWidth,
  onPreviewDataFetched,
  showName,
  usePreviewData,
}: TextMessageProps) => {
  const theme = React.useContext(ThemeContext);
  const user = React.useContext(UserContext);
  const [previewData, setPreviewData] = React.useState(message.previewData);
  const { descriptionText, headerText, titleText, text, textContainer } =
    styles({
      message,
      theme,
      user,
    });


  const handlePreviewDataFetched = (data: PreviewData) => {
    setPreviewData(data);
    onPreviewDataFetched?.({
      // It's okay to cast here since we know it is a text message
      // type-coverage:ignore-next-line
      message: excludeDerivedMessageProps(message) as MessageType.Text,
      previewData: data,
    });
  };

  const renderPreviewDescription = (description: string) => {
    return (
      <Text numberOfLines={3} style={descriptionText}>
        {description}
      </Text>
    );
  };

  const renderPreviewHeader = (header: string) => {
    return (
      <Text numberOfLines={1} style={headerText}>
        {header}
      </Text>
    );
  };

  const renderPreviewText = (previewText: string) => {
    return (
      <Text style={text}>{previewText}</Text>
    );
  };

  const renderPreviewTitle = (title: string) => {
    return (
      <Text numberOfLines={2} style={titleText}>
        {title}
      </Text>
    );
  };

  return usePreviewData &&
    !!onPreviewDataFetched &&
    REGEX_LINK.test(message.text.toLowerCase()) ? (
    <LinkPreview
      containerStyle={{ width: previewData?.image ? messageWidth : undefined }}
      enableAnimation={enableAnimation}
      header={showName ? getUserName(message.author) : undefined}
      onPreviewDataFetched={handlePreviewDataFetched}
      previewData={previewData}
      renderDescription={renderPreviewDescription}
      renderHeader={renderPreviewHeader}
      renderText={renderPreviewText}
      renderTitle={renderPreviewTitle}
      text={message.text}
      textContainerStyle={textContainer}
      touchableWithoutFeedbackProps={{
        accessibilityRole: undefined,
        accessible: false,
        disabled: true,
      }}
    />
  ) : (
    <View style={textContainer}>
      {
      showName
          ? renderPreviewHeader(getUserName(message.author))
          : null
      }
      <Text style={text}>{message.text}</Text>
    </View>
  );
};
