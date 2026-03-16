import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  Switch,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';
import {useAuth} from '../context/AuthContext';
import TierBadge from '../components/TierBadge';

export default function SettingsScreen({navigation}) {
  const {user, isPaid, logout, upgrade} = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [showInstallQR, setShowInstallQR] = useState(false);

  const handleUpgrade = () => {
    Alert.alert(
      '💎 Upgrade to Premium',
      'Unlock group calls, HD quality, screen sharing, and unlimited call time.',
      [
        {text: 'Maybe Later', style: 'cancel'},
        {
          text: 'Upgrade Now',
          onPress: () => {
            upgrade('paid');
            Alert.alert('🎉 Welcome to Premium!', 'You now have access to all features.');
          },
        },
      ],
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'Check out CainoChat — encrypted video calling for iOS & Android!\n\nhttps://cainochat.app/install',
        title: 'CainoChat — Encrypted Video Calls',
      });
    } catch (e) {
      // User cancelled
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', style: 'destructive', onPress: logout},
    ]);
  };

  const INSTALL_URL = 'https://cainochat.app/install';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Profile */}
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.profileAvatar}>👤</Text>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.contact || 'User'}</Text>
          <Text style={styles.profileId}>Tap to edit profile</Text>
        </View>
        <TierBadge />
      </TouchableOpacity>

      {/* Tier Section */}
      {!isPaid && (
        <TouchableOpacity style={styles.upgradeCard} onPress={handleUpgrade}>
          <View style={styles.upgradeHeader}>
            <Text style={styles.upgradeIcon}>💎</Text>
            <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
          </View>
          <View style={styles.upgradeFeatures}>
            <Text style={styles.upgradeFeature}>✓ Group calls (up to 10 people)</Text>
            <Text style={styles.upgradeFeature}>✓ HD video quality (720p/1080p)</Text>
            <Text style={styles.upgradeFeature}>✓ Unlimited call duration</Text>
            <Text style={styles.upgradeFeature}>✓ Screen sharing</Text>
          </View>
          <View style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Upgrade Now — $4.99/mo</Text>
          </View>
        </TouchableOpacity>
      )}

      {isPaid && (
        <View style={styles.premiumCard}>
          <Text style={styles.premiumIcon}>💎</Text>
          <Text style={styles.premiumTitle}>Premium Active</Text>
          <Text style={styles.premiumSubtext}>
            You have access to all features
          </Text>
        </View>
      )}

      {/* Settings Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Preferences</Text>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.settingLabel}>👤 Edit Profile</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>🔔 Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{false: colors.surfaceLight, true: colors.primary}}
            thumbColor={colors.text}
          />
        </View>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => navigation.navigate('AppLock')}>
          <Text style={styles.settingLabel}>🔒 App Lock</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Install QR Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📲 Share & Install</Text>

        <TouchableOpacity
          style={styles.qrToggle}
          onPress={() => setShowInstallQR(!showInstallQR)}>
          <Text style={styles.qrToggleText}>
            {showInstallQR ? 'Hide' : 'Show'} Install QR Code
          </Text>
          <Text style={styles.qrToggleArrow}>{showInstallQR ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showInstallQR && (
          <View style={styles.installQRContainer}>
            <Text style={styles.installQRTitle}>
              Scan to install CainoChat
            </Text>
            <Text style={styles.installQRDesc}>
              Works on both Android & iOS
            </Text>
            <View style={styles.qrBox}>
              <QRCode
                value={INSTALL_URL}
                size={180}
                backgroundColor={colors.surface}
                color={colors.text}
              />
            </View>
            <Text style={styles.installURL}>{INSTALL_URL}</Text>

            <View style={styles.platforms}>
              <View style={styles.platformBadge}>
                <Text style={styles.platformIcon}>🤖</Text>
                <Text style={styles.platformText}>Android</Text>
              </View>
              <View style={styles.platformBadge}>
                <Text style={styles.platformIcon}>🍎</Text>
                <Text style={styles.platformText}>iOS</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.shareBtn}
              onPress={handleShareApp}>
              <Text style={styles.shareBtnText}>📤 Share App Link</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛡️ Privacy & Security</Text>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => navigation.navigate('BlockedUsers')}>
          <Text style={styles.settingLabel}>🚫 Blocked Users</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => navigation.navigate('Security', {contact: {name: 'Your Account', avatar: '👤', id: user?.id}})}>
          <Text style={styles.settingLabel}>🔑 My Security QR</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ About</Text>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Encryption</Text>
          <Text style={styles.aboutValue}>E2E (AES-256)</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Platforms</Text>
          <Text style={styles.aboutValue}>Android & iOS</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileAvatar: {
    fontSize: 36,
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  profileId: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  upgradeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.paid,
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  upgradeIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  upgradeTitle: {
    color: colors.paid,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  upgradeFeatures: {
    marginBottom: spacing.md,
  },
  upgradeFeature: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  upgradeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  upgradeBtnText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  premiumCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.paid,
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  premiumTitle: {
    color: colors.paid,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  premiumSubtext: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLabel: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  settingArrow: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  qrToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrToggleText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  qrToggleArrow: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  installQRContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  installQRTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  installQRDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
  },
  qrBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  installURL: {
    color: colors.primary,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  platforms: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  platformIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  platformText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  shareBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  shareBtnText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aboutLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  aboutValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  logoutText: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
