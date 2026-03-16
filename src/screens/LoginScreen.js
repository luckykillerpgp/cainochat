import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme/colors';
import {sendOTP} from '../services/auth';

export default function LoginScreen({navigation}) {
  const [contact, setContact] = useState('');
  const [method, setMethod] = useState('phone'); // 'phone' or 'email'
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!contact.trim()) {
      Alert.alert('Error', method === 'phone' ? 'Enter your phone number' : 'Enter your email');
      return;
    }

    if (method === 'phone' && contact.length < 8) {
      Alert.alert('Error', 'Enter a valid phone number');
      return;
    }

    if (method === 'email' && !contact.includes('@')) {
      Alert.alert('Error', 'Enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await sendOTP(contact);
      if (result.success) {
        navigation.navigate('OTPVerify', {
          contact,
          method,
          demoCode: result.demoCode,
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            Sign in with a one-time code. No passwords needed.
          </Text>
        </View>

        {/* Method toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, method === 'phone' && styles.toggleActive]}
            onPress={() => setMethod('phone')}>
            <Text style={[styles.toggleText, method === 'phone' && styles.toggleTextActive]}>
              📱 Phone
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, method === 'email' && styles.toggleActive]}
            onPress={() => setMethod('email')}>
            <Text style={[styles.toggleText, method === 'email' && styles.toggleTextActive]}>
              ✉️ Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            {method === 'phone' ? 'Phone Number' : 'Email Address'}
          </Text>
          <TextInput
            style={styles.input}
            value={contact}
            onChangeText={setContact}
            placeholder={method === 'phone' ? '+31 6 12345678' : 'you@email.com'}
            placeholderTextColor={colors.textMuted}
            keyboardType={method === 'phone' ? 'phone-pad' : 'email-address'}
            autoCapitalize="none"
            autoFocus
          />
        </View>

        {/* Send OTP Button */}
        <TouchableOpacity
          style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
          onPress={handleSendOTP}
          disabled={loading}
          activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.sendBtnText}>Send Code</Text>
          )}
        </TouchableOpacity>

        {/* Security note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityIcon}>🔐</Text>
          <Text style={styles.securityText}>
            We'll send you a 6-digit code. Your number is never shared.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + 20,
  },
  header: {
    marginBottom: spacing.xl,
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.xl,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.text,
  },
  inputContainer: {
    marginBottom: spacing.xl,
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: fontSize.lg,
    letterSpacing: 1,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 4,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendBtnDisabled: {
    opacity: 0.7,
  },
  sendBtnText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  securityIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  securityText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    flex: 1,
    lineHeight: 18,
  },
});
