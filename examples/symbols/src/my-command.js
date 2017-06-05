import React from 'react';
import PropTypes from 'prop-types';
import { render, Artboard, Text, View, Image, makeSymbol, injectSymbols } from '../../../';
import chroma from 'chroma-js';

// take a hex and give us a nice text color to put over it
const textColor = (hex) => {
  const vsWhite = chroma.contrast(hex, 'white');
  if (vsWhite > 4) {
    return '#FFF';
  }
  return chroma(hex).darken(3).hex();
};

const RedSquare = () => (
  <View name="Square" style={{ width: 100, height: 100, backgroundColor: 'red' }}>
    <Text name="Red Square Text">
      Red Square
    </Text>
  </View>
);

const RedSquareSym = makeSymbol(RedSquare);

const BlueSquare = () => (
  <View name="Square" style={{ width: 100, height: 100, backgroundColor: 'blue' }}>
    <Text name="Blue Square Text">
      Blue Square
    </Text>
  </View>
);

const BlueSquareSym = makeSymbol(BlueSquare);

const Photo = () => (
  <Image
    name="Photo"
    source="https://pbs.twimg.com/profile_images/756488692135526400/JUCawBiW_400x400.jpg"
    style={{ width: 100, height: 100 }}
  />
);

const PhotoSym = makeSymbol(Photo);

const Nested = () => (
  <View name="Multi" style={{ display: 'flex', flexDirection: 'column', width: 75, height: 150 }}>
    <PhotoSym name="Photo Instance" style={{ width: 75, height: 75 }} />
    <RedSquareSym name="Red Square Instance" style={{ width: 75, height: 75 }} />
  </View>
)

const NestedSym = makeSymbol(Nested);

const Document = () => (
  <Artboard name="Swatches" style={{ display: 'flex' }}>
    <NestedSym
      name="Nested Symbol"
      style={{ width: 75, height: 150 }}
      overrides={{
        'Red Square Instance': BlueSquareSym,
        'Blue Square Text': 'hello world',
        Photo: 'https://pbs.twimg.com/profile_images/833785170285178881/loBb32g3.jpg'
      }}
    />
  </Artboard>
);


export default (context) => {
  injectSymbols(context);
  render(<Document />, context.document.currentPage());
}
