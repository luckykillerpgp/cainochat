import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';
import {useAuth} from '../context/AuthContext';
import {
  generateKeyPair,
  generateVerificationCode,
  generateSecurityQR,
  parseSecurityQR,
} from '../services/encryption';

export default function SecurityScreen({route, navigation}) {
  const {contact} = route.params;
  const {user} = useAuth();
  const [verified, setVerified] = useState(contact.verified || false);
  const [showScanner, setShowScanner] = useState(false);

  // Generate key pair for this user
  const keyPair = generateKeyPair();
  const verificationCode = generateVerificationCode(keyPair.publicKey, contact.id);
  const qrData = generateSecurityQR(user?.id || 'me', keyPair.publicKey);

  const handleScanQR = () => {
    // In production, this would open a QR scanner
    // For demo, we simulate a successful scan
    Alert.alert(
      'Verify Contact',
      `Scan ${contact.name}'s QR code to verify their identity.\n\nIn production, this opens your camera to scan their code.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Simulate Scan',
          onPress: () => {
            setVerified(true);
            Alert.alert(
              '✅ Verified!',
              `${contact.name}'s identity has been verified. Your communication is secure.`,
            );
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chat Security</Text>
        <Text style={styles.subtitle}>Verify {contact.name}'s identity</Text>
      </View>

      {/* Contact info */}
      <View style={styles.contactCard}>
        <Text style={styles.contactAvatar}>{contact.avatar}</Text>
        <View>
          <Text style={styles.contactName}>{contact.name}</Text>
          <View style={styles.statusRow}>
            {verified ? (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>🔒 Verified</Text>
              </View>
            ) : (
              <View style={styles.unverifiedBadge}>
                <Text style={styles.unverifiedText}>⚠️ Not Verified</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* QR Code */}
      <View style={styles.qrSection}>
        <Text style={styles.sectionTitle}>Your Security QR Code</Text>
        <Text style={styles.sectionDesc}>
          Show this to {contact.name} so they can verify your identity
        </Text>
        <View style={styles.qrContainer}>
          <QRCode
            value={qrData}
            size={200}
            backgroundColor={colors.surface}
            color={colors.text}
          />
        </View>

        {/* Verification code */}
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Verification Code</Text>
          <Text style={styles.codeValue}>{verificationCode}</Text>
          <Text style={styles.codeDesc}>
            Compare this code with {contact.name} to verify your connection is secure
          </Text>
        </View>
      </View>

      {/* Scan button */}
      <TouchableOpacity style={styles.scanBtn} onPress={handleScanQR}>
        <Text style={styles.scanIcon}>📷</Text>
        <Text style={styles.scanText}>Scan {contact.name}'s QR Code</Text>
      </TouchableOpacity>

      {/* Security info */}
      <View style={styles.securityInfo}>
        <Text style={styles.securityTitle}>🛡️ How verification works</Text>
        <Text style={styles.securityText}>
          1. Show your QR code to {contact.name}{'\n'}
          2. They scan it with their CainoChat app{'\n'}
          3. Or compare the verification code in person{'\n'}
          4. If they match, your chat is verified & secure
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
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactAvatar: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  contactName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
  },
  verifiedText: {
    color: colors.success,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  unverifiedBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
  },
  unverifiedText: {
    color: colors.warning,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  sectionDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  codeBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  codeValue: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  codeDesc: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  scanIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  scanText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  securityInfo: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  securityTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  securityText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
