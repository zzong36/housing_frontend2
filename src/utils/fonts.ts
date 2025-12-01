export interface Font {
  name: string;
  displayName: string;
  fontFamily: string;
  cssImport: string;
}

export const fonts: Font[] = [
  {
    name: 'pretendard',
    displayName: 'Pretendard',
    fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
    cssImport: '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css");'
  },
  {
    name: 'noto',
    displayName: 'Noto Sans KR',
    fontFamily: '"Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
    cssImport: '@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap");'
  },
  {
    name: 'spoqa',
    displayName: 'Spoqa Han Sans Neo',
    fontFamily: '"Spoqa Han Sans Neo", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
    cssImport: '@import url("https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@latest/css/SpoqaHanSansNeo.css");'
  },
  {
    name: 'ibm',
    displayName: 'IBM Plex Sans KR',
    fontFamily: '"IBM Plex Sans KR", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
    cssImport: '@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@300;400;500;700&display=swap");'
  },
  {
    name: 'gmarket',
    displayName: 'Gmarket Sans',
    fontFamily: '"GmarketSans", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
    cssImport: '@import url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff") format("woff");'
  }
];

export function getFont(fontName: string): Font {
  return fonts.find(f => f.name === fontName) || fonts[0];
}
