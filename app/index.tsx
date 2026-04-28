import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function IndexRoute() {
  const { user } = useAuth();
  if (user) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/login" />;
}
