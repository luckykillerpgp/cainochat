import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

const DISAPPEAR_OPTIONS = [
  {value: 0, label: 'Off', desc: 'Messages stay forever'},
  {value: 30, label: '30 seconds', desc: 'After being seen'},
  {value: 300, label: '5 minutes', desc: 'After being seen'},
  {value: 3600, label: '1 hour', desc: 'After being seen'},
  {value: 86400, label: '24 hours', desc: 'After being seen'},
  {value: 604800, label: '7 days', desc: 'After being seen'},
];

export default function DisappearingMessagesScreen({route, navigation}) {
  const {contact} = route.params;
  const [selected, setSelected] = useState(0);

  const handleSelect = (value) => {
    setSelected(value);
    const option = DISAPPEAR_OPTIONS.find((o) => o.value === value);
    if (value === 0) {
      Alert.alert(
        'Disappearing Messages Off',
        `Messages with ${contact.name} will stay in the chat.`,
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } else {
      Alert.alert(
        'Disappearing Messages On',
        `New messages with ${contact.name} will disappear ${option.label.toLowerCase()} after being seen.`,
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Disappearing Messages</Text>
        <Text style={styles.subtitle}>
          Messages in this chat will disappear after the set time
        </Text>
      </View>

      <View style={styles.contactInfo}>
        <Text style={styles.contactAvatar}>{contact.avatar}</Text>
        <Text style={styles.contactName}>{contact.name}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {DISAPPEAR_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              selected === option.value && styles.optionActive,
            ]}
            onPress={() => handleSelect(option.value)}>
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.radio,
                  selected === option.value && styles.radioActive,
                ]}>
                {selected === option.value && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <View>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDesc}>{option.desc}</Text>
              </View>
            </View>
            {option.value > 0 && (
              <Text style={styles.optionIcon}>⏱️</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          When enabled, new messages sent and received in this chat will
          disappear after they've been seen. This doesn't affect messages
          sent before the setting was changed.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.xxl + 10,
    marginBottom: spacing.lg,
  },
  backBtn: {
    color: colors.primary,
    fontSize: fontSize.md,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.title,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactAvatar: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  contactName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  optionsContainer: {
    marginBottom: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionLabel: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  optionDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  optionIcon: {
    fontSize: 18,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    flex: 1,
    lineHeight: 18,
  },
});
