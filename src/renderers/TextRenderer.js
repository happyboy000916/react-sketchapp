/* @flow */
import convertToColor from '../utils/convertToColor';
import SketchRenderer from './SketchRenderer';
import ViewRenderer from './ViewRenderer';
import type { SketchLayer, ViewStyle, LayoutInfo, TextStyle } from '../types';

const TEXT_ALIGN = {
  auto: 0,
  left: 0,
  right: 1,
  center: 2,
  justify: 3,
};

const TEXT_BEHAVIOR = {
  auto: 0,
  fixed: 1,
};

class TextRenderer extends SketchRenderer {
  renderBackingLayers(
    layout: LayoutInfo,
    style: ViewStyle,
    textStyle: TextStyle,
    props: any,
    value: ?string
  ): Array<SketchLayer> {
    if (value === null) {
      const viewRenderer = new ViewRenderer();
      return viewRenderer.renderBackingLayers(layout, style, textStyle, props, value);
    }

    const layer = MSTextLayer
      .alloc()
      .initWithFrame_(NSMakeRect(layout.left, layout.top, layout.width, layout.height));

    // Text Value
    layer.setStringValue(value);

    // Styling

    if (textStyle.fontFamily) {
      // TODO(lmr): handle default font family etc.
      const font = NSFont.fontWithName_size(textStyle.fontFamily, textStyle.fontSize);
      layer.setFont(font);
    }

    if (textStyle.color !== undefined) {
      layer.setTextColor(convertToColor(textStyle.color));
    }

    if (textStyle.lineHeight !== undefined) {
      layer.setLineHeight(textStyle.lineHeight);
    }

    if (textStyle.letterSpacing !== undefined) {
      layer.setCharacterSpacing(textStyle.letterSpacing);
    }

    if (textStyle.textAlign) {
      layer.setTextAlignment(TEXT_ALIGN[textStyle.textAlign]);
    }

    if (style.opacity !== undefined) {
      layer.style().contextSettings().opacity = style.opacity;
    }

    // note european spelling :P
    layer.setTextBehaviour(TEXT_BEHAVIOR.fixed);

    layer.frame().setWidth(layout.width);
    layer.frame().setHeight(layout.height);

    // TODO: fontWeight

    return [layer];
  }
}

module.exports = TextRenderer;
