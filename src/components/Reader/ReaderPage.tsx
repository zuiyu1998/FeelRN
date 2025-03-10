import {Text, View} from 'react-native';
import {Page} from './types';
import React from 'react';
import {useReaderTextStyle} from './context';

export function ReaderPageView(props: Page) {
  const {data} = props;

  const textStyle = useReaderTextStyle();

  if (props.loading) {
    return (
      <View>
        <Text style={textStyle}>loading</Text>
      </View>
    );
  }

  if (props.error) {
    return (
      <View>
        <Text style={textStyle}>error</Text>
      </View>
    );
  }

  if (props.empty) {
    return (
      <View>
        <Text style={textStyle}>empty</Text>
      </View>
    );
  }

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
