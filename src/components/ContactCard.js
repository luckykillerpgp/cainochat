import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

export default function ContactCard({contact, onPress, onCall}) {
  const statusColor =
    contact.status === 'online'
      ? colors.online
      : contact.status === 'away'
      ? colors.warning
      : colors.offline;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(contact)} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{contact.avatar}</Text>
        <View style={[styles.statusDot, {backgroundColor: statusColor}]} />
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{contact.name}</Text>
          {contact.verified && <Text style={styles.verified}>🔒</Text>}
        </View>
        <Text style={styles.phone}>{contact.phone}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.videoBtn]}
          onPress={() => onCall?.(contact, 'video')}>
          <Text style={styles.actionIcon}>📹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.audioBtn]}
          onPress={() => onCall?.(contact, 'audio')}>
          <Text style={styles.actionIcon}>📞</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    fontSize: 36,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  verified: {
    fontSize: 12,
  },
  phone: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBtn: {
    backgroundColor: colors.primary,
  },
  audioBtn: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    fontSize: 16,
  },
});
