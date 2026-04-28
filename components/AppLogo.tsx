import { View, Text, StyleSheet } from 'react-native';
import { ScanLine } from 'lucide-react-native';

export default function AppLogo() {
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <ScanLine size={16} color="#292524" />
      </View>
      <Text style={styles.wordmark}>TapMeet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAFAF9',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: 15,
    fontWeight: '700',
    color: '#292524',
    letterSpacing: 0.2,
  },
});
