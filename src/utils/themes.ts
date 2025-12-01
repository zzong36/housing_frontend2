export interface Theme {
  name: string;
  displayName: string;
  botBubble: string;
  userBubble: string;
  botTextColor?: string;
  userTextColor?: string;
  chartBackground: string;
}

export const themes: Theme[] = [
    {
    name: "winter",
    displayName: "윈터",
    botBubble: "#99C6EE",
    userBubble: "#375BB9",
    chartBackground: "#7C94DA",
  },
  {
    name: "mint",
    displayName: "민트",
    botBubble: "#BBDED6",
    userBubble: "#61C0BF",
    chartBackground: "#FAE3D9",
  },
  {
    name: "arctic",
    displayName: "북극",
    botBubble: "#cae9ff",
    userBubble: "#00b4d8",
    botTextColor: "#000000",
    userTextColor: "#ffffff",
    chartBackground: "#00b4d8",
  },
  {
    name: "cotton",
    displayName: "솜사탕",
    botBubble: "#FFE6E6",
    userBubble: "#F2D1D1",
    chartBackground: "#DAEAF1",
  },
  {
    name: "forest",
    displayName: "숲속",
    botBubble: "#EDF1D6",
    userBubble: "#9DC08B",
    chartBackground: "#609966",
  },
  {
    name: "pink",
    displayName: "핑크",
    botBubble: "#FFDDCC",
    userBubble: "#FEBBCC",
    chartBackground: "#FFEECC",
  },
];

export function getTheme(themeName: string): Theme {
  return themes.find((t) => t.name === themeName) || themes[0];
}