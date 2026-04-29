import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import AppLogo from '@/components/AppLogo';

function formatAuthError(message?: string) {
  const m = (message ?? '').toLowerCase();
  if (m.includes('already registered') || m.includes('already') && m.includes('email')) {
    return 'An account with this email already exists. Try logging in instead.';
  }
  if (m.includes('password') && m.includes('6')) {
    return 'Please use a password with at least 6 characters.';
  }
  if (m.includes('email') && m.includes('invalid')) {
    return 'Please enter a valid email address.';
  }
  if (m.includes('api key')) {
    return 'We couldn’t connect to our servers. Please try again in a moment.';
  }
  if (m.includes('network') || m.includes('fetch')) {
    return 'Network issue detected. Check your connection and try again.';
  }
  if (message?.trim()) {
    return 'We couldn’t create your account. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const onSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErrorText(null);

    try {
      const result = await register({
        fullName,
        email,
        password,
        confirmPassword,
      });

      if (!result.ok) {
        setErrorText(formatAuthError(result.message));
        return;
      }

      // Optional: show message if email confirmation is required
      if (result.message) {
        Alert.alert('Almost there', result.message);
      }

      // If email confirmation is enabled, the user won't have a session yet.
      if (!result.message) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      setErrorText('We couldn’t create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#C9A376', '#E7D4BD', '#F4F0EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerBg}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <AppLogo />
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Start using TapMeet today</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign up</Text>
            <Text style={styles.cardSubtitle}>It only takes a minute</Text>

            {errorText ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorText}</Text>
              </View>
            ) : null}

            <Text style={styles.label}>Full name</Text>
            <View style={styles.inputRow}>
              <User size={18} color="#A8A29E" />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your name"
                placeholderTextColor="#A8A29E"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Mail size={18} color="#A8A29E" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
                placeholderTextColor="#A8A29E"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Lock size={18} color="#A8A29E" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="At least 6 characters"
                placeholderTextColor="#A8A29E"
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                activeOpacity={0.8}
                style={styles.eyeBtn}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#78716C" />
                ) : (
                  <Eye size={18} color="#78716C" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm password</Text>
            <View style={styles.inputRow}>
              <Lock size={18} color="#A8A29E" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholder="Repeat password"
                placeholderTextColor="#A8A29E"
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((v) => !v)}
                activeOpacity={0.8}
                style={styles.eyeBtn}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} color="#78716C" />
                ) : (
                  <Eye size={18} color="#78716C" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={onSubmit}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#292524" />
                  <Text style={styles.primaryButtonText}>Creating account…</Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>Create account</Text>
              )}
            </TouchableOpacity>
            {loading ? <View style={styles.progressBar} /> : null}

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already registered?</Text>
              <Link href="/login" asChild>
                <TouchableOpacity activeOpacity={0.85}>
                  <Text style={styles.footerLink}>Log in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: '#F5F5F4' },
  headerBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 320,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  content: {
    paddingTop: Platform.OS === 'ios' ? 68 : 52,
    paddingBottom: 28,
    paddingHorizontal: 18,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 18,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#78716C',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 320,
  },
  card: {
    backgroundColor: '#FAFAF9',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECE9E4',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
      },
      android: { elevation: 3 },
    }),
  },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#292524' },
  cardSubtitle: { marginTop: 4, fontSize: 13, color: '#78716C', fontWeight: '500' },
  errorBanner: {
    marginTop: 14,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600',
  },
  label: { fontSize: 13, color: '#57534E', fontWeight: '700', marginTop: 14 },
  inputRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E5E4',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  eyeBtn: {
    padding: 6,
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: '#C7A074',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: { color: '#292524', fontSize: 16, fontWeight: '700' },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    height: 3,
    borderRadius: 999,
    backgroundColor: '#E7E5E4',
    marginTop: 10,
    overflow: 'hidden',
  },
  footerRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: { color: '#78716C', fontSize: 13, fontWeight: '600' },
  footerLink: { color: '#7C3AED', fontSize: 13, fontWeight: '800' },
});