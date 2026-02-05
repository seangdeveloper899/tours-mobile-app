import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../constants/theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  icon,
  disabled = false,
  style 
}) => {
  const getButtonStyle = () => {
    let styles = [buttonStyles.base];
    
    if (size === 'small') styles.push(buttonStyles.small);
    else if (size === 'large') styles.push(buttonStyles.large);
    else styles.push(buttonStyles.medium);
    
    if (disabled) styles.push(buttonStyles.disabled);
    if (style) styles.push(style);
    
    return styles;
  };

  const getTextStyle = () => {
    let styles = [buttonStyles.text];
    
    if (size === 'small') styles.push(buttonStyles.textSmall);
    else if (size === 'large') styles.push(buttonStyles.textLarge);
    
    if (variant === 'outline') styles.push(buttonStyles.outlineText);
    if (disabled) styles.push(buttonStyles.disabledText);
    
    return styles;
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={disabled 
            ? [theme.colors.textLight, theme.colors.textSecondary]
            : [theme.colors.primary, theme.colors.primaryDark]
          }
          style={getButtonStyle()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {icon && <View style={buttonStyles.icon}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={[
        getButtonStyle(),
        variant === 'outline' && buttonStyles.outline,
        variant === 'secondary' && buttonStyles.secondary,
      ]}
      activeOpacity={0.8}
    >
      {icon && <View style={buttonStyles.icon}>{icon}</View>}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.full,
  },
  small: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  medium: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  large: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  textSmall: {
    fontSize: theme.fontSize.sm,
  },
  textLarge: {
    fontSize: theme.fontSize.lg,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  disabledText: {
    color: theme.colors.white,
  },
  icon: {
    marginRight: 8,
  },
});

export default Button;
