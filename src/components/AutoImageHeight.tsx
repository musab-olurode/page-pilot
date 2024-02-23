import React from 'react';
import {
  Image,
  ImageStyle,
  LayoutAnimation,
  Platform,
  StyleProp,
  UIManager,
} from 'react-native';

interface AutoHeightImageProps {
  width: number;
  maxHeight?: number;
  source?: any;
  class?: string;
  style?: StyleProp<ImageStyle>;
}

const AutoHeightImage = React.memo(
  ({
    width,
    class: className,
    style,
    maxHeight,
    ...props
  }: AutoHeightImageProps) => {
    const [height, setHeight] = React.useState(maxHeight || 192);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    return (
      <Image
        className={className}
        {...props}
        style={[style, {width, height}]}
        onLoad={({nativeEvent}) => {
          const newHeight =
            (nativeEvent.source.height / nativeEvent.source.width) * width;
          const appliedHeight =
            maxHeight && newHeight > maxHeight ? maxHeight : newHeight;
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setHeight(appliedHeight);
        }}
      />
    );
  },
);

export default AutoHeightImage;
