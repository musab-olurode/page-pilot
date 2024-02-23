import MaterialYou, {
  MaterialYouPalette,
} from 'react-native-material-you-colors';

function generateTheme(palette: MaterialYouPalette) {
  const light = {
    primary: palette.system_accent1[8],
    onPrimary: palette.system_accent1[0],
    primaryContainer: palette.system_accent1[3],
    onPrimaryContainer: palette.system_accent1[11],

    secondary: palette.system_accent2[8],
    onSecondary: palette.system_accent2[0],
    secondaryContainer: palette.system_accent2[3],
    onSecondaryContainer: palette.system_accent2[11],

    tertiary: palette.system_accent3[8],
    onTertiary: palette.system_accent3[0],
    tertiaryContainer: palette.system_accent3[3],
    onTertiaryContainer: palette.system_accent3[11],

    background: palette.system_neutral1[1],
    onBackground: palette.system_neutral1[11],

    surface: palette.system_neutral1[1],
    onSurface: palette.system_neutral1[11],
    surfaceVariant: palette.system_neutral2[3],
    onSurfaceVariant: palette.system_neutral2[9],

    outline: palette.system_neutral2[7],
    outlineVariant: palette.system_neutral2[4],

    inverseSurface: palette.system_neutral1[10],
    inverseOnSurface: palette.system_neutral1[2],
    inversePrimary: palette.system_accent1[4],
  };

  const dark = {
    primary: palette.system_accent1[4],
    onPrimary: palette.system_accent1[10],
    primaryContainer: palette.system_accent1[9],
    onPrimaryContainer: palette.system_accent1[3],

    secondary: palette.system_accent2[4],
    onSecondary: palette.system_accent2[10],
    secondaryContainer: palette.system_accent2[9],
    onSecondaryContainer: palette.system_accent2[3],

    tertiary: palette.system_accent3[4],
    onTertiary: palette.system_accent3[10],
    tertiaryContainer: palette.system_accent3[9],
    onTertiaryContainer: palette.system_accent3[3],

    background: palette.system_neutral1[11],
    onBackground: palette.system_neutral1[3],

    surface: palette.system_neutral1[11],
    onSurface: palette.system_neutral1[3],
    surfaceVariant: palette.system_neutral2[9],
    onSurfaceVariant: palette.system_neutral2[4],

    outline: palette.system_neutral2[6],
    outlineVariant: palette.system_neutral2[9],

    inverseSurface: palette.system_neutral1[3],
    inverseOnSurface: palette.system_neutral1[10],
    inversePrimary: palette.system_accent1[8],
  };

  return {light, dark};
}

export const getSystemTheme = (fallbackColor?: string) => {
  const rawMaterialYouTheme = MaterialYou.getMaterialYouPalette(
    fallbackColor,
    'TONAL_SPOT',
  );
  const systemTheme = generateTheme(rawMaterialYouTheme);

  return systemTheme;
};

export const getSystemThemeAsync = async (fallbackColor?: string) => {
  const rawMaterialYouTheme = MaterialYou.getMaterialYouPalette(
    fallbackColor,
    'TONAL_SPOT',
  );
  const systemTheme = generateTheme(rawMaterialYouTheme);

  return systemTheme;
};
