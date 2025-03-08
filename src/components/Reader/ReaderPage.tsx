import {Text, View} from 'react-native';
import {Page} from './types';
import React from 'react';
import {useReaderTextStyle} from './context';

export function ReaderPageView(props: Page) {
  const {data} = props;

  const textStyle = useReaderTextStyle();

  return (
    <View>
      {data.map((text, index) => {
        return (
          <Text key={index} style={textStyle}>
            {text}
          </Text>
        );
      })}
    </View>
  );
}
