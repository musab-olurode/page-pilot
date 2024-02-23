import {useState} from 'react';
import {
  Material3Scheme,
  Material3Theme,
  SystemScheme,
} from '../../types/ExpoMaterial3Theme.types';
import {
  createThemeFromSourceColor,
  createThemeFromSystemSchemes,
} from './createMaterial3Theme';
import MaterialYou from 'react-native-material-you-colors';
import {getSystemTheme, getSystemThemeAsync} from './MaterialYouThemeModule';

export const isDynamicThemeSupported = MaterialYou.isSupported;

/**
 * Hook to manage material3 theme.
 *
 * It returns:
 * - a Material 3 theme:
 *   - the system theme (or a fallback theme if not supported) if sourceColor is not provided
 *   - a theme based on sourceColor if provided
 * - a function to update the theme based on a source color
 * - a function to reset the theme to default
 *
 * @param params.fallbackSourceColor - optional - source color for the fallback theme (default to #6750A4)
 * @param params.sourceColor - optional - source color for the theme (overwrite system theme)
 * @returns
 */
export function useMaterial3Theme(params?: {
  fallbackSourceColor?: string;
  sourceColor?: string;
}) {
  const {fallbackSourceColor = '#6750A4', sourceColor} = params || {};

  const [theme, setTheme] = useState<Material3Theme>(
    sourceColor
      ? createMaterial3Theme(sourceColor)
      : getMaterial3Theme(fallbackSourceColor),
  );

  const updateTheme = (updateThemeSourceColor: string) => {
    setTheme(createThemeFromSourceColor(updateThemeSourceColor));
  };

  const resetTheme = () => {
    setTheme(getMaterial3Theme(fallbackSourceColor));
  };

  return {theme, updateTheme, resetTheme};
}

/**
 * Get the Material 3 theme from the system (works only on Android 12+).
 *
 * If the system does not support Material3, it will return a theme based on the fallback source color.
 *
 * @param fallbackSourceColor source color for the fallback theme (default to #6750A4)
 * @returns
 */
export function getMaterial3Theme(
  fallbackSourceColor: string = '#6750A4',
): Material3Theme {
  if (!isDynamicThemeSupported) {
    return createThemeFromSourceColor(fallbackSourceColor);
  }

  const systemSchemes = getSystemTheme(fallbackSourceColor) as {
    light: SystemScheme;
    dark: SystemScheme;
  } | null;

  if (systemSchemes) {
    return createThemeFromSystemSchemes(systemSchemes);
  }
  return createThemeFromSourceColor(fallbackSourceColor);
}

export async function getMaterial3ThemeAsync(
  fallbackSourceColor: string = '#6750A4',
): Promise<Material3Theme> {
  if (!isDynamicThemeSupported) {
    return createThemeFromSourceColor(fallbackSourceColor);
  }

  const systemSchemes = (await getSystemThemeAsync(fallbackSourceColor)) as {
    light: SystemScheme;
    dark: SystemScheme;
  } | null;

  if (systemSchemes) {
    return createThemeFromSystemSchemes(systemSchemes);
  }
  return createThemeFromSourceColor(fallbackSourceColor);
}

/**
 * Create a Material 3 theme based on the source color.
 *
 * @param sourceColor source color for the theme
 * @returns
 */
export function createMaterial3Theme(sourceColor: string): Material3Theme {
  return createThemeFromSourceColor(sourceColor);
}

export type {Material3Scheme, Material3Theme};
