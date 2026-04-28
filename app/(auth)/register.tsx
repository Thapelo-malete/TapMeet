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
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import AppLogo from '@/components/AppLogo';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmit = () => {
    const result = register({ fullName, email, password, confirmPassword });
    if (!result.ok) {
      Alert.alert('Registration failed', result.message);
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={['#CAA57A', '#E8D7C2', '#F4EFE9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <AppLogo />
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start using TapMeet today</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>Full name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Your name"
          placeholderTextColor="#A8A29E"
          style={styles.input}
        />

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
          placeholder="At least 6 characters"
          placeholderTextColor="#A8A29E"
          style={styles.input}
        />

        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Repeat password"
          placeholderTextColor="#A8A29E"
          style={styles.input}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={onSubmit} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Create account</Text>
        </TouchableOpacity>

        <Link href="/login" asChild>
          <TouchableOpacity activeOpacity={0.85}>
            <Text style={styles.linkText}>Already registered? Log in</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F4' },
  content: { paddingBottom: 24 },
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
