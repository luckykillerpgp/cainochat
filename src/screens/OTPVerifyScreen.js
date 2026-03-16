import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';
import {verifyOTP} from '../services/auth';
import {useAuth} from '../context/AuthContext';

export default function OTPVerifyScreen({route, navigation}) {
  const {contact, method, demoCode} = route.params;
  const {login} = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (value && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (codeToVerify) => {
    const fullCode = codeToVerify || code.join('');
    if (fullCode.length !== 6) {
      Alert.alert('Error', 'Enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP(contact, fullCode);
      if (result.success) {
        await login(result.user);
        // Navigation will auto-redirect via AuthContext
      } else {
        Alert.alert('Error', result.message || 'Invalid code');
        setCode(['', '', '', '', '', '']);
        inputs.current[0]?.focus();
      }
    } catch (e) {
      Alert.alert('Error', 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(60);
      Alert.alert('Code Sent', `A new code has been sent to ${contact}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Enter Code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={styles.contactHighlight}>{contact}</Text>
        </Text>
      </View>

      {/* OTP Input */}
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
            value={digit}
            onChangeText={(value) => handleChange(value.slice(-1), index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={index === 0}
            selectTextOnFocus
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        style={[styles.verifyBtn, loading && styles.verifyBtnDisabled]}
        onPress={() => handleVerify()}
        disabled={loading}
        activeOpacity={0.8}>
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.verifyBtnText}>Verify</Text>
        )}
      </TouchableOpacity>

      {/* Resend */}
      <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
        <Text style={[styles.resendText, timer > 0 && styles.resendDisabled]}>
          {timer > 0 ? `Resend code in ${timer}s` : 'Resend code'}
        </Text>
      </TouchableOpacity>

      {/* Demo code hint */}
      {demoCode && (
        <View style={styles.demoHint}>
          <Text style={styles.demoLabel}>🧪 Demo code:</Text>
          <Text style={styles.demoCode}>{demoCode}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + 20,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  backBtn: {
    color: colors.primary,
    fontSize: fontSize.md,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.title,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  contactHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  codeInput: {
    width: 48,
    height: 56,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  verifyBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 4,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  verifyBtnDisabled: {
    opacity: 0.7,
  },
  verifyBtnText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  resendText: {
    color: colors.primary,
    fontSize: fontSize.md,
    textAlign: 'center',
    fontWeight: '500',
  },
  resendDisabled: {
    color: colors.textMuted,
  },
  demoHint: {
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  demoLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  demoCode: {
    color: colors.primaryBright,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    letterSpacing: 4,
  },
});
