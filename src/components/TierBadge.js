import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';
import {useAuth} from '../context/AuthContext';
import {TIER_LIMITS} from '../utils/helpers';

export default function TierBadge() {
  const {isPaid} = useAuth();
  const tier = isPaid ? 'paid' : 'free';
  const info = TIER_LIMITS[tier];

  return (
    <View style={[styles.badge, isPaid ? styles.paidBadge : styles.freeBadge]}>
      <Text style={styles.icon}>{isPaid ? '💎' : '🆓'}</Text>
      <Text style={styles.label}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  freeBadge: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paidBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: colors.paid,
  },
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
  label: {
    color: colors.text,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
