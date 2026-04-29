import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import { useConnections } from '@/hooks/useConnections';

export default function RecentScreen() {
  const router = useRouter();
  const { connections: recentConnections, isLoading } = useConnections();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Recent connections</Text>
        <Text style={styles.subtitle}>People you met recently</Text>
      </View>

      <View style={styles.listWrap}>
        {isLoading ? (
          <Text style={styles.subtitle}>Loading…</Text>
        ) : null}
        {recentConnections.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.connectionCard, styles.cardShadow]}
            onPress={() => router.push({ pathname: '/person-profile', params: { id: item.id } })}
            activeOpacity={0.85}
          >
            <Avatar initials={item.initials} size={52} />
            <View style={styles.connectionBody}>
              <Text style={styles.connectionName}>{item.name}</Text>
              <Text style={styles.connectionRole}>
                {item.role} at {item.company}
              </Text>
              <View style={styles.connectionFooter}>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{item.category}</Text>
                </View>
                <Text style={styles.connectionTime}>{item.timeAgo}</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#A8A29E" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F4',
  },
  content: {
    paddingBottom: 28,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#292524',
  },
  subtitle: {
    fontSize: 14,
    color: '#78716C',
    marginTop: 3,
  },
  listWrap: {
    paddingHorizontal: 18,
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
  connectionCard: {
    backgroundColor: '#FAFAF9',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  connectionBody: {
    flex: 1,
    gap: 3,
  },
  connectionName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#292524',
  },
  connectionRole: {
    fontSize: 13,
    color: '#78716C',
    marginBottom: 4,
  },
  connectionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pill: {
    backgroundColor: '#D3AD81',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    color: '#292524',
    fontSize: 12,
    fontWeight: '600',
  },
  connectionTime: {
    fontSize: 12,
    color: '#78716C',
    fontWeight: '500',
  },
});
