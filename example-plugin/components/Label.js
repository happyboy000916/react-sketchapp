/* @flow */
import React from 'react';
import { Text } from '../../src';

type P = {
  bold?: boolean,
  children?: any,
}
const Label = ({ bold, children }: P) =>
  <Text
    style={{
      color: '#333',
      fontFamily: bold ? 'SFUIText-Bold' : 'SFUIText-Regular',
      fontSize: 16,
      lineHeight: 24,
    }}
  >
    { children }
  </Text>;

export default Label;
