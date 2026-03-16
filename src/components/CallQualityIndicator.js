import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

export default function CallQualityIndicator({quality = 'good'}) {
  // quality: 'excellent' | 'good' | 'fair' | 'poor'
  const levels = {
    excellent: {bars: 4, color: colors.success, label: 'Excellent', icon: '📶'},
    good: {bars: 3, color: '#8BC34A', label: 'Good', icon: '📶'},
    fair: {bars: 2, color: colors.warning, label: 'Fair', icon: '📶'},
    poor: {bars: 1, color: colors.error, label: 'Poor', icon: '📶'},
  };

  const config = levels[quality] || levels.good;

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[
              styles.bar,
              {
                height: 4 + level * 4,
                backgroundColor:
                  level <= config.bars ? config.color : colors.surfaceLight,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, {color: config.color}]}>{config.label}</Text>
    </View>
  );
}

export function ConnectionStats({bitrate, latency, packetLoss}) {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.stat}>
        <Text style={styles.statValue}>{bitrate || '1.2'} Mbps</Text>
        <Text style={styles.statLabel}>Bitrate</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.stat}>
        <Text style={styles.statValue}>{latency || '45'}ms</Text>
        <Text style={styles.statLabel}>Latency</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.stat}>
        <Text style={styles.statValue}>{packetLoss || '0.1'}%</Text>
        <Text style={styles.statLabel}>Loss</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: spacing.xs,
    height: 20,
  },
  bar: {
    width: 3,
    borderRadius: 1,
    marginHorizontal: 1,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  statValue: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
});
