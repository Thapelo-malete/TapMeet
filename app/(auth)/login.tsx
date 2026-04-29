import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import AppLogo from '@/components/AppLogo';

function formatAuthError(message?: string) {
  const m = (message ?? '').toLowerCase();
  if (m.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please try again.';
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
    return 'We couldn’t sign you in. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const onSubmit = async () => {
    if (loading) return;
    setErrorText(null);
    setLoading(true);
    try {
      const result = await login({ email, password });
      if (!result.ok) {
        setErrorText(formatAuthError(result.message));
        return;
      }
      router.replace('/(tabs)');
    } catch {
      setErrorText('We couldn’t sign you in. Please try again.');
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
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <AppLogo />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to continue building your network</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign in</Text>
            <Text style={styles.cardSubtitle}>Use the account you created</Text>

            {errorText ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorText}</Text>
              </View>
            ) : null}

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
                placeholder="Enter your password"
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

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={onSubmit}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#292524" />
                  <Text style={styles.primaryButtonText}>Signing in…</Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>Log in</Text>
              )}
            </TouchableOpacity>
            {loading ? <View style={styles.progressBar} /> : null}

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to TapMeet?</Text>
              <Link href="/register" asChild>
                <TouchableOpacity activeOpacity={0.85}>
                  <Text style={styles.footerLink}>Create account</Text>
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
    height: 300,
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
  primaryButtonDisabled: { opacity: 0.75 },
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
  linkText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
});
