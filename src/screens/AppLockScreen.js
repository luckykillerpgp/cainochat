import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';

export default function AppLockScreen({navigation}) {
  const [pinEnabled, setPinEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState('main'); // 'main' | 'set-pin' | 'confirm-pin'

  const handleSetPin = () => {
    setStep('set-pin');
    setPin('');
    setConfirmPin('');
  };

  const handlePinInput = (digit) => {
    if (step === 'set-pin') {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setStep('confirm-pin');
      }
    } else if (step === 'confirm-pin') {
      const newConfirm = confirmPin + digit;
      setConfirmPin(newConfirm);
      if (newConfirm.length === 4) {
        if (newConfirm === pin) {
          setPinEnabled(true);
          setStep('main');
          Alert.alert('✅ PIN Set', 'Your app lock PIN has been configured.');
        } else {
          Alert.alert('❌ Mismatch', 'PINs don\'t match. Try again.');
          setPin('');
          setConfirmPin('');
          setStep('set-pin');
        }
      }
    }
  };

  const handleDisablePin = () => {
    Alert.alert('Disable PIN Lock', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Disable',
        style: 'destructive',
        onPress: () => {
          setPinEnabled(false);
          setBiometricEnabled(false);
          setPin('');
        },
      },
    ]);
  };

  if (step === 'set-pin' || step === 'confirm-pin') {
    const currentPin = step === 'set-pin' ? pin : confirmPin;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('main')}>
            <Text style={styles.backBtn}>← Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pinContainer}>
          <Text style={styles.pinTitle}>
            {step === 'set-pin' ? 'Create PIN' : 'Confirm PIN'}
          </Text>
          <Text style={styles.pinSubtitle}>
            {step === 'set-pin'
              ? 'Enter a 4-digit PIN'
              : 'Enter the same PIN again'}
          </Text>

          {/* PIN dots */}
          <View style={styles.pinDots}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.pinDot,
                  currentPin.length > i && styles.pinDotFilled,
                ]}
              />
            ))}
          </View>

          {/* Number pad */}
          <View style={styles.numpad}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(
              (digit, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.numBtn}
                  onPress={() => {
                    if (digit === '⌫') {
                      if (step === 'set-pin') setPin((p) => p.slice(0, -1));
                      else setConfirmPin((p) => p.slice(0, -1));
                    } else if (digit) {
                      handlePinInput(digit);
                    }
                  }}
                  disabled={!digit}>
                  <Text style={styles.numText}>{digit}</Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>App Lock</Text>
        <Text style={styles.subtitle}>
          Protect CainoChat with a PIN or biometrics
        </Text>
      </View>

      {/* PIN Lock */}
      <TouchableOpacity
        style={styles.lockOption}
        onPress={pinEnabled ? handleDisablePin : handleSetPin}>
        <View style={styles.lockInfo}>
          <Text style={styles.lockIcon}>🔢</Text>
          <View>
            <Text style={styles.lockLabel}>PIN Lock</Text>
            <Text style={styles.lockDesc}>
              {pinEnabled ? 'Enabled — tap to disable' : 'Set a 4-digit PIN'}
            </Text>
          </View>
        </View>
        <View style={[styles.toggle, pinEnabled && styles.toggleActive]}>
          <View style={[styles.toggleDot, pinEnabled && styles.toggleDotActive]} />
        </View>
      </TouchableOpacity>

      {/* Biometric */}
      <TouchableOpacity
        style={[styles.lockOption, !pinEnabled && styles.lockOptionDisabled]}
        onPress={() => {
          if (!pinEnabled) {
            Alert.alert('Set PIN First', 'Enable PIN lock before using biometrics.');
            return;
          }
          setBiometricEnabled(!biometricEnabled);
        }}>
        <View style={styles.lockInfo}>
          <Text style={styles.lockIcon}>👆</Text>
          <View>
            <Text style={styles.lockLabel}>Biometric Lock</Text>
            <Text style={styles.lockDesc}>
              Use fingerprint or face recognition
            </Text>
          </View>
        </View>
        <View style={[styles.toggle, biometricEnabled && styles.toggleActive]}>
          <View style={[styles.toggleDot, biometricEnabled && styles.toggleDotActive]} />
        </View>
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>🛡️</Text>
        <Text style={styles.infoText}>
          When app lock is enabled, you'll need to enter your PIN or use
          biometrics every time you open CainoChat. Your calls are always
          end-to-end encrypted regardless of this setting.
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
    marginBottom: spacing.xl,
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
  lockOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lockOptionDisabled: {
    opacity: 0.5,
  },
  lockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lockIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  lockLabel: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  lockDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.textMuted,
  },
  toggleDotActive: {
    backgroundColor: colors.text,
    alignSelf: 'flex-end',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
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
  // PIN setup styles
  pinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinTitle: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  pinSubtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginBottom: spacing.xxl,
  },
  pinDots: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  pinDotFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    justifyContent: 'center',
  },
  numBtn: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  numText: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '600',
  },
});
