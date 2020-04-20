import * as React from 'react';
import * as PropTypes from 'prop-types';

import { Style } from './stylesheet/types';

const initialArtboardState = {
  width: 0,
  height: 0,
  scale: 1,
  fontScale: 1,
};

const ArtboardContext = React.createContext({
  state: initialArtboardState,
});

export const useWindowDimensions = () => {
  const { state } = React.useContext(ArtboardContext);
  const { width, height } = state || {};

  return { width, height };
}

const ArtboardPropTypes = {
  viewport: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    name: PropTypes.string,
  }),
  children: PropTypes.node,
};

type ArtboardProps = PropTypes.InferProps<typeof ArtboardPropTypes> & {
  children: any,
  style?: Style,
};

export const ArtboardProvider = ({ children, viewport, style }: ArtboardProps) => {
  if (!viewport) {
    return children;
  }

  const { state: oState } = React.useContext(ArtboardContext);

  const state = {
    ...oState,
    width: viewport.width || (style || {}).width || oState.width,
    height: viewport.height || (style || {}).height || oState.height
  };

  return (
    <ArtboardContext.Provider value={{ state }}>
      {children}
    </ArtboardContext.Provider>
  )
}

export default ArtboardContext;
