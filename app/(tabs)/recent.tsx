import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import ConnectionRow from '@/components/ConnectionRow';
import { recentConnections } from '@/constants/mockData';

export default function RecentScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Recent Connections</Text>
        <Text style={styles.subtitle}>{recentConnections.length} people</Text>
      </View>

      <View style={[styles.card, styles.cardShadow]}>
        {recentConnections.map((item) => (
          <ConnectionRow
            key={item.id}
            item={item}
            onPress={() => router.push('/person-profile')}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
});
