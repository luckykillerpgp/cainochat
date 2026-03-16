import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

const {width, height} = Dimensions.get('window');

export default function VideoView({stream, isLocal = false, isMuted = false, label}) {
  return (
    <View style={[styles.container, isLocal && styles.localContainer]}>
      {stream ? (
        <RTCView
          streamURL={stream.toURL()}
          style={styles.video}
          objectFit="cover"
          mirror={isLocal}
          zOrder={isLocal ? 1 : 0}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>👤</Text>
          <Text style={styles.placeholderText}>{label || 'No video'}</Text>
        </View>
      )}
      {isMuted && (
        <View style={styles.mutedBadge}>
          <Text style={styles.mutedText}>🔇</Text>
        </View>
      )}
      {label && !isLocal && (
        <View style={styles.nameTag}>
          <Text style={styles.nameText}>{label}</Text>
        </View>
      )}
    </View>
  );
}

// Lazy import to avoid crashes if webrtc isn't available yet
let RTCView;
try {
  RTCView = require('react-native-webrtc').RTCView;
} catch (e) {
  RTCView = () => null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  localContainer: {
    position: 'absolute',
    bottom: spacing.lg + 80,
    right: spacing.md,
    width: 120,
    height: 160,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    zIndex: 10,
    elevation: 10,
  },
  video: {
    flex: 1,
    backgroundColor: colors.background,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  mutedBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.overlay,
    borderRadius: borderRadius.round,
    padding: spacing.xs,
  },
  mutedText: {
    fontSize: 14,
  },
  nameTag: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.overlay,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  nameText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});
