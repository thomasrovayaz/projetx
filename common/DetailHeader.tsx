import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import IconButton from './IconButton';
import BackButton from './BackButton';
import {DARK_BLUE} from '../app/colors';

interface ProjetXDetailHeaderProps {
  subtitle?: string;
  title: string;
  actions?: {icon: string; color: string; onPress(): void}[];
  small?: boolean;
}

const DetailHeader: React.FC<ProjetXDetailHeaderProps> = ({
  subtitle,
  title,
  actions,
  small,
}) => {
  const fontSizeTitle = useSharedValue(small ? 16 : 24);
  const animationTimer = useSharedValue(small ? 0 : 1);
  const animatedActionBarStyle = useAnimatedStyle(() => {
    return {
      marginBottom: animationTimer.value * 10,
    };
  });
  const animatedTitleStyle = useAnimatedStyle(() => {
    return {
      fontSize: fontSizeTitle.value,
      marginVertical: animationTimer.value * 10,
    };
  });
  const animatedSubtitleStyle = useAnimatedStyle(() => {
    return {
      height: animationTimer.value * 20,
      fontSize: animationTimer.value * 14,
    };
  });
  useEffect(() => {
    const animConfig = {
      duration: 500,
      easing: Easing.out(Easing.exp),
    };
    fontSizeTitle.value = withTiming(small ? 16 : 24, animConfig);
    animationTimer.value = withTiming(small ? 0 : 1, animConfig);
  }, [small, fontSizeTitle, animationTimer]);

  return (
    <View style={styles.header}>
      <Animated.View style={[styles.actionBar, animatedActionBarStyle]}>
        <BackButton />
        <View style={styles.actionsContainer}>
          {actions &&
            actions.map(({icon, color, onPress}) => (
              <IconButton
                key={icon}
                name={icon}
                color={color}
                onPress={onPress}
                size={25}
                style={styles.action}
              />
            ))}
        </View>
      </Animated.View>
      {subtitle ? (
        <Animated.Text style={[styles.subtitle, animatedSubtitleStyle]}>
          {subtitle}
        </Animated.Text>
      ) : null}
      <Animated.Text
        numberOfLines={small ? 1 : undefined}
        style={[styles.title, animatedTitleStyle]}>
        {title}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-start',
    borderBottomRightRadius: 20,
  },
  subtitle: {
    fontFamily: 'Montserrat Alternates',
    paddingHorizontal: 20,
    fontSize: 14,
    color: DARK_BLUE,
    textAlign: 'left',
  },
  title: {
    fontFamily: 'Montserrat Alternates',
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: 10,
    paddingHorizontal: 20,
    color: DARK_BLUE,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    paddingHorizontal: 15,
  },
});

export default DetailHeader;