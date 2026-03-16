import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';
import {useAuth} from '../context/AuthContext';

const STATUSES = ['🟢 Available', '🟡 Busy', '🔴 Do not disturb', '⚫ Invisible'];
const EMOJIS = ['😎', '🎮', '💼', '📚', '🚀', '🎵', '🍕', '🌟'];

export default function ProfileScreen({navigation}) {
  const {user} = useAuth();
  const [name, setName] = useState('Lucky');
  const [status, setStatus] = useState(STATUSES[0]);
  const [bio, setBio] = useState('Hey there! I use CainoChat 🔴');
  const [selectedEmoji, setSelectedEmoji] = useState('😎');
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your profile has been saved.');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <TouchableOpacity style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>{selectedEmoji}</Text>
          <View style={styles.avatarEditBadge}>
            <Text style={styles.avatarEditText}>✏️</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Tap to change avatar</Text>
      </View>

      {/* Emoji Picker */}
      <View style={styles.emojiPicker}>
        <Text style={styles.sectionLabel}>Choose your vibe</Text>
        <View style={styles.emojiRow}>
          {EMOJIS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={[
                styles.emojiOption,
                selectedEmoji === emoji && styles.emojiSelected,
              ]}
              onPress={() => setSelectedEmoji(emoji)}>
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
          maxLength={30}
        />
        <Text style={styles.charCount}>{name.length}/30</Text>
      </View>

      {/* Bio */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell people about yourself..."
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={150}
        />
        <Text style={styles.charCount}>{bio.length}/150</Text>
      </View>

      {/* Status */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Status</Text>
        <TouchableOpacity
          style={styles.statusSelector}
          onPress={() => setShowStatusPicker(!showStatusPicker)}>
          <Text style={styles.statusText}>{status}</Text>
          <Text style={styles.statusArrow}>{showStatusPicker ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showStatusPicker && (
          <View style={styles.statusPicker}>
            {STATUSES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusOption,
                  s === status && styles.statusOptionActive,
                ]}
                onPress={() => {
                  setStatus(s);
                  setShowStatusPicker(false);
                }}>
                <Text style={styles.statusOptionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Account Info */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User ID</Text>
          <Text style={styles.infoValue}>{user?.id || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Contact</Text>
          <Text style={styles.infoValue}>{user?.contact || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tier</Text>
          <Text style={styles.infoValue}>{user?.tier === 'paid' ? '💎 Premium' : '🆓 Free'}</Text>
        </View>
      </View>

      {/* Save */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
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
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  avatarEditText: {
    fontSize: 12,
  },
  avatarHint: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
  emojiPicker: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emojiSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  emojiText: {
    fontSize: 22,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  statusSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  statusText: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  statusArrow: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  statusPicker: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  statusOption: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusOptionActive: {
    backgroundColor: colors.surfaceLight,
  },
  statusOptionText: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  infoSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  infoValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveBtnText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
