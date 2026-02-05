import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '../constants/colors';

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkColors : lightColors;
};
