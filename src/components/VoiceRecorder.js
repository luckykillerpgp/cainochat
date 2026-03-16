import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

export default function VoiceRecorder({onSend, onCancel}) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const slideX = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < -100) {
          // Slide left = cancel
          onCancel?.();
          resetState();
        }
        slideX.setValue(Math.min(0, gesture.dx));
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -100) {
          onCancel?.();
          resetState();
        } else {
          sendRecording();
        }
      },
    }),
  ).current;

  const startRecording = () => {
    setIsRecording(true);
    setDuration(0);

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    // Timer
    timerRef.current = setInterval(() => {
      setDuration((prev) => {
        if (prev >= 300) {
          // Max 5 minutes
          sendRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const sendRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (duration > 0) {
      onSend?.({
        type: 'voice',
        duration,
        uri: 'demo_voice_recording.m4a',
      });
    }
    resetState();
  };

  const resetState = () => {
    setIsRecording(false);
    setDuration(0);
    setIsLocked(false);
    slideX.setValue(0);
    pulseAnim.setValue(1);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isRecording) {
    return (
      <View style={styles.recordingContainer}>
        <Animated.View
          style={[styles.recordingBar, {transform: [{translateX: slideX}]}]}
          {...panResponder.panHandlers}>
          <Animated.View
            style={[styles.recordingDot, {transform: [{scale: pulseAnim}]}]}
          />
          <Text style={styles.recordingTime}>{formatDuration(duration)}</Text>
          <View style={styles.waveform}>
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  {
                    height: 4 + Math.random() * 16,
                    backgroundColor:
                      i < (duration / 300) * 20
                        ? colors.primary
                        : colors.surfaceLight,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.slideHint}>← Slide to cancel</Text>
          <TouchableOpacity style={styles.sendVoiceBtn} onPress={sendRecording}>
            <Text style={styles.sendVoiceIcon}>➤</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.micBtn}
      onLongPress={startRecording}
      delayLongPress={200}>
      <Text style={styles.micIcon}>🎤</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  micIcon: {
    fontSize: 18,
  },
  recordingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  recordingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  recordingTime: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginRight: spacing.sm,
    fontVariant: ['tabular-nums'],
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 24,
    marginRight: spacing.sm,
  },
  waveBar: {
    width: 2,
    borderRadius: 1,
    marginHorizontal: 1,
  },
  slideHint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginRight: spacing.sm,
  },
  sendVoiceBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendVoiceIcon: {
    fontSize: 16,
    color: colors.text,
  },
});
