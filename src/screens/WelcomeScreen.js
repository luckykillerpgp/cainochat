import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

const {width, height} = Dimensions.get('window');

export default function WelcomeScreen({navigation}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Background glow */}
      <View style={styles.glowBackground} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, {transform: [{scale: logoScale}]}]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🔴</Text>
          </View>
          <Text style={styles.appName}>CainoChat</Text>
          <Text style={styles.tagline}>Encrypted. Private. Yours.</Text>
        </Animated.View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔐</Text>
            <Text style={styles.featureText}>End-to-end encrypted</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>iOS & Android</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔑</Text>
            <Text style={styles.featureText}>OTP login — no passwords</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}>
            <Text style={styles.primaryBtnText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* Cross-platform badge */}
        <View style={styles.platformBadge}>
          <Text style={styles.platformText}>🤖 Android  •  🍎 iOS  •  🔒 Encrypted</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowBackground: {
    position: 'absolute',
    top: -height * 0.3,
    left: -width * 0.3,
    width: width * 1.6,
    height: height * 0.6,
    borderRadius: width,
    backgroundColor: colors.primaryDark,
    opacity: 0.15,
  },
  content: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    color: colors.text,
    fontSize: fontSize.title,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  features: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  featureText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  buttons: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  platformBadge: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  platformText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
});
