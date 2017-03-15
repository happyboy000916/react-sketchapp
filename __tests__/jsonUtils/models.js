import { generateID, makeColorFromCSS/* , makeColorFill, makeRect*/ } from '../../src/jsonUtils/models';

describe('generateID', () => {
  it('is unique', () => {
    expect(generateID()).not.toBe(generateID());
  });
});

const BLACK = { _class: 'color', red: 0, green: 0, blue: 0, alpha: 1 };
const WHITE = { _class: 'color', red: 1, green: 1, blue: 1, alpha: 1 };
const GOLD = { _class: 'color', red: 0.8745098039215686, green: 0.7294117647058823, blue: 0.4117647058823529, alpha: 1 };
const PURPLE = { _class: 'color', red: 0.4, green: 0.2, blue: 0.6, alpha: 1 };

describe('makeColorFromCSS', () => {
  it('works with hex colors', () => {
    expect(makeColorFromCSS('#000')).toEqual(BLACK);
    expect(makeColorFromCSS('#000000')).toEqual(BLACK);
    expect(makeColorFromCSS('#FFF')).toEqual(WHITE);
    expect(makeColorFromCSS('#FFFFFF')).toEqual(WHITE);
    expect(makeColorFromCSS('#DFBA69')).toEqual(GOLD);
  });

  it('works with named colors', () => {
    expect(makeColorFromCSS('black')).toEqual(BLACK);
    expect(makeColorFromCSS('white')).toEqual(WHITE);
    expect(makeColorFromCSS('rebeccapurple')).toEqual(PURPLE);
  });

  it('works with rgb colors', () => {
    expect(makeColorFromCSS('rgb(0, 0, 0)')).toEqual(BLACK);
    expect(makeColorFromCSS('rgb(255, 255, 255)')).toEqual(WHITE);
    expect(makeColorFromCSS('rgb(102, 51, 153)')).toEqual(PURPLE);
  });

  it('works with rgba colors', () => {
    expect(makeColorFromCSS('rgba(0, 0, 0, 1)')).toEqual(BLACK);
    expect(makeColorFromCSS('rgba(255, 255, 255, 1)')).toEqual(WHITE);
    expect(makeColorFromCSS('rgba(102, 51, 153, 1)')).toEqual(PURPLE);
  });


  it('works with hsl colors', () => {
    expect(makeColorFromCSS('hsl(0, 0%, 0%)')).toEqual(BLACK);
    expect(makeColorFromCSS('hsl(0, 0%, 100%)')).toEqual(WHITE);
  });

  it('works with hsla colors', () => {
    expect(makeColorFromCSS('hsla(0, 0%, 0%, 1)')).toEqual(BLACK);
    expect(makeColorFromCSS('hsla(0, 0%, 100%, 1)')).toEqual(WHITE);
  });
});

xdescribe('makeColorFill', () => {
});

xdescribe('makeRect', () => {
});
