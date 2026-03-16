import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

export default function CallControls({
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  onSwitchCamera,
  onScreenShare,
  showScreenShare,
}) {
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.controlBtn, !audioEnabled && styles.controlBtnOff]}
        onPress={onToggleAudio}>
        <Text style={styles.controlIcon}>{audioEnabled ? '🎤' : '🔇'}</Text>
        <Text style={styles.controlLabel}>
          {audioEnabled ? 'Mute' : 'Unmute'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlBtn, !videoEnabled && styles.controlBtnOff]}
        onPress={onToggleVideo}>
        <Text style={styles.controlIcon}>{videoEnabled ? '📹' : '📷'}</Text>
        <Text style={styles.controlLabel}>
          {videoEnabled ? 'Video Off' : 'Video On'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.controlBtn} onPress={onSwitchCamera}>
        <Text style={styles.controlIcon}>🔄</Text>
        <Text style={styles.controlLabel}>Flip</Text>
      </TouchableOpacity>

      {showScreenShare && (
        <TouchableOpacity style={styles.controlBtn} onPress={onScreenShare}>
          <Text style={styles.controlIcon}>🖥️</Text>
          <Text style={styles.controlLabel}>Share</Text>
        </TouchableOpacity>
      )}

      <Animated.View style={{transform: [{scale: pulseAnim}]}}>
        <TouchableOpacity style={styles.endCallBtn} onPress={onEndCall}>
          <Text style={styles.endCallIcon}>📵</Text>
          <Text style={styles.endCallLabel}>End</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlBtnOff: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  controlIcon: {
    fontSize: 22,
  },
  controlLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  endCallBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
  },
  endCallIcon: {
    fontSize: 24,
  },
  endCallLabel: {
    color: colors.text,
    fontSize: fontSize.xs,
    fontWeight: '700',
    marginTop: 2,
  },
});
