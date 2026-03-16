import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

const {width} = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: '🔐',
    title: 'End-to-End Encrypted',
    description: 'Every call and message is secured with military-grade AES-256 encryption. Nobody can spy on you.',
    color: colors.primary,
  },
  {
    id: '2',
    icon: '🔑',
    title: 'No Passwords Needed',
    description: 'Log in with a simple 6-digit code sent to your phone or email. Fast, secure, no forgotten passwords.',
    color: '#8B5CF6',
  },
  {
    id: '3',
    icon: '📱',
    title: 'Works Everywhere',
    description: 'Available on both Android and iOS. Call anyone, anywhere, on any device.',
    color: '#4CAF50',
  },
  {
    id: '4',
    icon: '🛡️',
    title: 'Verify & Trust',
    description: 'Scan QR codes to verify your contacts\' identity. Know exactly who you\'re talking to.',
    color: '#FF9800',
  },
];

export default function OnboardingScreen({navigation, onComplete}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({index: currentIndex + 1});
    } else {
      onComplete?.();
    }
  };

  const handleSkip = () => {
    onComplete?.();
  };

  const renderSlide = ({item, index}) => {
    return (
      <View style={[styles.slide, {width}]}>
        <View style={[styles.iconContainer, {backgroundColor: item.color + '20'}]}>
          <Text style={styles.slideIcon}>{item.icon}</Text>
        </View>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {width: dotWidth, opacity},
                currentIndex === index && styles.dotActive,
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {renderPagination()}

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipBtn: {
    position: 'absolute',
    top: spacing.xxl + 20,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  slideIcon: {
    fontSize: 64,
  },
  slideTitle: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slideDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  nextBtn: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  nextText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
