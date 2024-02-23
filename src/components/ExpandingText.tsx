import Color from 'color';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Text, Icon, useTheme} from 'react-native-paper';

interface ExpandingTextProps {
  text: string;
  class?: string;
  onToggleExpand?: (expanded: boolean) => void;
}

const ExpandingText = ({
  text,
  onToggleExpand,
  class: className,
}: ExpandingTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    onToggleExpand?.(!expanded);
  };

  return (
    <View className={className} style={styles.btnTextHolder}>
      <Pressable
        onPress={changeLayout}
        className="relative"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{height: expanded ? null : 50, overflow: 'hidden'}}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{paddingBottom: expanded ? 30 : 0}}>{text}</Text>
        <LinearGradient
          colors={
            expanded
              ? [
                  Color(theme.colors.background).alpha(0).rgb().string(),
                  Color(theme.colors.background).alpha(0).rgb().string(),
                ]
              : [
                  Color(theme.colors.background).alpha(0.1).rgb().string(),
                  theme.colors.background,
                ]
          }
          className="absolute bottom-0 w-full flex items-center pt-2">
          <Icon source={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    color: 'black',
    padding: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
  btnTextHolder: {
    shadowColor: 'rgba(0, 0, 0, 0.03)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export default ExpandingText;
