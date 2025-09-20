import React from 'react';
import { Image, ImageStyle, View } from 'react-native';
import tw from 'twrnc';

interface LogoProps {
  size?: number;
  style?: ImageStyle;
  showGlow?: boolean;
  glowIntensity?: 'none' | 'subtle' | 'normal';
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 128, 
  style, 
  showGlow = true,
  glowIntensity = 'subtle'
}) => {
  const containerStyle = {
    width: size,
    height: size,
  };

  const imageStyle = {
    width: '100%' as const,
    height: '100%' as const,
    resizeMode: 'contain' as const,
  };

  const getGlowOpacity = () => {
    switch (glowIntensity) {
      case 'none':
        return { primary: 0, secondary: 0, accent: 0 };
      case 'subtle':
        return { primary: 0.03, secondary: 0.02, accent: 0.01 };
      case 'normal':
        return { primary: 0.05, secondary: 0.03, accent: 0.02 };
      default:
        return { primary: 0.03, secondary: 0.02, accent: 0.01 };
    }
  };

  const glowOpacity = getGlowOpacity();

  return (
    <View style={[tw`justify-center items-center relative`, containerStyle]}>
      <Image
        source={require('../assets/images/LOGO.png')}
        style={[imageStyle, style]}
      />
      
      {showGlow && glowIntensity !== 'none' && (
        <>
          {/* Primary Glow */}
          <View style={[
            tw`absolute rounded-full`,
            {
              width: size * 1.25,
              height: size * 1.25,
              backgroundColor: `rgba(0, 173, 239, ${glowOpacity.primary})`,
            }
          ]} />
          
          {/* Secondary Glow */}
          <View style={[
            tw`absolute rounded-full`,
            {
              width: size * 1.5,
              height: size * 1.5,
              backgroundColor: `rgba(255, 165, 0, ${glowOpacity.secondary})`,
            }
          ]} />
          
          {/* Accent Glow */}
          <View style={[
            tw`absolute rounded-full`,
            {
              width: size * 1.75,
              height: size * 1.75,
              backgroundColor: `rgba(255, 215, 0, ${glowOpacity.accent})`,
            }
          ]} />
        </>
      )}
    </View>
  );
}; 