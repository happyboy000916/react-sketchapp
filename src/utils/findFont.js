/* @flow */
/* eslint-disable no-bitwise, quote-props */
import { TextStyle } from '../types';

// this borrows heavily from react-native's RCTFont class
// thanks y'all
// https://github.com/facebook/react-native/blob/master/React/Views/RCTFont.mm

const FONT_STYLES = {
  normal: false,
  italic: true,
  oblique: true,
};

const FONT_WEIGHTS = {
  normal: NSFontWeightRegular,
  bold: NSFontWeightBold,
  '100': NSFontWeightUltraLight,
  '200': NSFontWeightThin,
  '300': NSFontWeightLight,
  '400': NSFontWeightRegular,
  '500': NSFontWeightMedium,
  '600': NSFontWeightSemibold,
  '700': NSFontWeightBold,
  '800': NSFontWeightHeavy,
  '900': NSFontWeightBlack,
};

const isItalicFont = (font: NSFont): boolean => {
  const traits = font.fontDescriptor().objectForKey(NSFontTraitsAttribute);
  const symbolicTraits = traits[NSFontSymbolicTrait].unsignedIntValue();

  return (symbolicTraits & NSFontItalicTrait) !== 0;
};

const isCondensedFont = (font: NSFont): boolean => {
  const traits = font.fontDescriptor().objectForKey(NSFontTraitsAttribute);
  const symbolicTraits = traits[NSFontSymbolicTrait].unsignedIntValue();

  return (symbolicTraits & NSFontCondensedTrait) !== 0;
};

const weightOfFont = (font: NSFont): number => {
  const traits = font.fontDescriptor().objectForKey(NSFontTraitsAttribute);

  const weight = traits[NSFontWeightTrait].doubleValue();
  if (weight === 0.0) {
    for (const w in FONT_WEIGHTS) {
      if (font.fontName().toLowerCase().endsWith(w)) {
        return FONT_WEIGHTS[w];
      }
    }
  }

  return weight;
};

// NSFont doesn't have UIFont's useful
// UIFont.fontNamesForFamilyName, so we can
// replicate it
// https://github.com/iccir/XUIKit/blob/master/Source/XUIFontAdditions.m#L52
const fontNamesForFamilyName = (familyName: string): Array<string> => {
  const manager = NSFontManager.sharedFontManager();
  const members = NSArray.arrayWithArray(
    manager.availableMembersOfFontFamily(familyName)
  );

  const results = [];
  for (let i = 0; i < members.length; i += 1) {
    results.push(members[i][0]);
  }

  return results;
};

const findNSFont = (style: TextStyle): NSFont => {
  let font;
  const defaultFontFamily = NSFont.systemFontOfSize(14).familyName();
  const defaultFontWeight = NSFontWeightRegular;
  const defaultFontSize = 14;

  let fontSize = defaultFontSize;
  let fontWeight = defaultFontWeight;
  let familyName = defaultFontFamily;
  let isItalic = false;
  let isCondensed = false;

  if (style.fontSize) {
    fontSize = style.fontSize;
  }

  if (style.fontFamily) {
    familyName = style.fontFamily;
  }

  if (style.fontStyle) {
    isItalic = FONT_STYLES[style.fontStyle] || false;
  }

  if (style.fontWeight) {
    fontWeight = FONT_WEIGHTS[style.fontWeight] || NSFontWeightRegular;
  }

  let didFindFont = false;

  // Handle system font as special case. This ensures that we preserve
  // the specific metrics of the standard system font as closely as possible.
  if ((familyName === defaultFontFamily) || (familyName === 'System')) {
    font = NSFont.systemFontOfSize_weight(14, fontWeight);

    if (font) {
      didFindFont = true;

      if (isItalic || isCondensed) {
        let fontDescriptor = font.fontDescriptor();
        let symbolicTraits = fontDescriptor.symbolicTraits();
        if (isItalic) {
          symbolicTraits |= NSFontItalicTrait;
        }

        if (isCondensed) {
          symbolicTraits |= NSFontCondensedTrait;
        }

        fontDescriptor = fontDescriptor.fontDescriptorWithSymbolicTraits(symbolicTraits);
        font = NSFont.fontWithDescriptor_size(fontDescriptor, fontSize);
      }
    }
  }

  const fontNames = fontNamesForFamilyName(familyName);

  // Gracefully handle being given a font name rather than font family, for
  // example: "Helvetica Light Oblique" rather than just "Helvetica".
  if (!didFindFont && fontNames.length === 0) {
    font = NSFont.fontWithName_size(familyName, fontSize);
    if (font) {
      // It's actually a font name, not a font family name,
      // but we'll do what was meant, not what was said.
      familyName = font.familyName();
      fontWeight = style.fontWeight ? fontWeight : weightOfFont(font);
      isItalic = style.fontStyle ? isItalic : isItalicFont(font);
      isCondensed = isCondensedFont(font);
    } else {
      log(`Unrecognized font family '${familyName}'`);
      font = NSFont.systemFontOfSize_weight(14, fontWeight);
    }
  }

  // Get the closest font that matches the given weight for the fontFamily
  let closestWeight = Infinity;
  for (let i = 0; i < fontNames.length; i += 1) {
    const match = NSFont.fontWithName_size(fontNames[i], fontSize);

    if (isItalic === isItalicFont(match) &&
        isCondensed === isCondensedFont(match)) {
      const testWeight = weightOfFont(match);

      if (Math.abs(testWeight - fontWeight) < Math.abs(closestWeight - fontWeight)) {
        font = match;

        closestWeight = testWeight;
      }
    }
  }

  // If we still don't have a match at least return the first font in the fontFamily
  // This is to support built-in font Zapfino and other custom single font families like Impact
  if (!font) {
    if (fontNames.length > 0) {
      font = NSFont.fontWithName_size(fontNames[0], fontSize);
    }
  }

  // TODO: support opentype features: small-caps & number types

  return font;
};

export default findNSFont;
