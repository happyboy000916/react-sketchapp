import React from 'react';
import { appVersionSupported, fromSJSONDictionary } from 'sketchapp-json-plugin';
import buildTree from './buildTree';
import renderers from './renderers';
import flexToSketchJSON from './renderViaJSON';
import { timeFunction } from './debug';

import type {
  SketchContext,
  SketchLayer,
  TreeNode,
} from './types';
import RedBox from './components/RedBox';

const useNewRenderer = true;

const renderToSketchViaJSON = (node: TreeNode, page: SketchLayer): SketchLayer => {
  const json = flexToSketchJSON(node);
  // const str = NSString.stringWithString_(JSON.stringify(json));
  // log(str);
  // timeFunction(() => {
  //   const file = NSString.stringWithString_('~/Desktop/sketchtest.json')
  //     .stringByExpandingTildeInPath();
  //   str.writeToFile_atomically_(file, false);
  // }, 'writeToFile_atomically_');
  const layer = fromSJSONDictionary(json);
  page.addLayers([layer]);
  return page;
};

const renderToSketch = (node: TreeNode, layer: SketchLayer): SketchLayer => {
  const { type, style, textStyle, layout, value, props, children } = node;
  const Renderer = renderers[type];
  if (Renderer == null) {
    throw new Error(`Could not find renderer for type '${type}'`);
  }
  const renderer = new Renderer();
  const groupLayer = renderer.renderGroupLayer(layout, style, textStyle, props, value);
  const backingLayers = renderer.renderBackingLayers(layout, style, textStyle, props, value);
  layer.addLayers([
    groupLayer,
  ]);
  groupLayer.addLayers(backingLayers);
  children.map(child => renderToSketch(child, groupLayer));

  return groupLayer;
};

function render(
  element: React$Element<any>,
  context: SketchContext,
): SketchLayer {
  const page: SketchLayer = context.document.currentPage();
  try {
    const tree = timeFunction(() =>
      buildTree(element)
    , 'build tree');
    if (appVersionSupported && useNewRenderer) {
      timeFunction(() =>
        renderToSketchViaJSON(tree, page)
      , 'new renderer');
    }
    return timeFunction(() =>
      renderToSketch(tree, page)
    , 'old renderer');
  } catch (err) {
    const tree = buildTree(<RedBox error={err} />);
    return renderToSketch(tree, page);
  }
}

module.exports = render;
