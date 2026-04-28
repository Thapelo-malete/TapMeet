import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import AppLogo from '@/components/AppLogo';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    const result = login({ email, password });
    if (!result.ok) {
      Alert.alert('Login failed', result.message);
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#CAA57A', '#E8D7C2', '#F4EFE9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <AppLogo />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to continue building your network</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor="#A8A29E"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
          placeholderTextColor="#A8A29E"
          style={styles.input}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={onSubmit} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Log in</Text>
        </TouchableOpacity>

        <Link href="/register" asChild>
          <TouchableOpacity activeOpacity={0.85}>
            <Text style={styles.linkText}>No account? Create one</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F4' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 74 : 52,
    paddingBottom: 36,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#1F2937' },
  subtitle: { marginTop: 8, fontSize: 14, color: '#78716C', fontWeight: '500' },
  form: { padding: 20, gap: 10 },
  label: { fontSize: 13, color: '#57534E', fontWeight: '600', marginTop: 6 },
  input: {
    backgroundColor: '#FAFAF9',
    borderColor: '#E7E5E4',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#C7A074',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#292524', fontSize: 16, fontWeight: '700' },
  linkText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
});
