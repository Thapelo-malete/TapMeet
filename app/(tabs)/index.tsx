import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Avatar from '@/components/Avatar';
import ConnectionRow from '@/components/ConnectionRow';
import { currentUser, recentConnections, weeklyMet } from '@/constants/mockData';

const FILTERS = ['Professional', 'Social', 'Creator'] as const;
type Filter = (typeof FILTERS)[number];

const filterCategoryMap: Record<Filter, string> = {
  Professional: 'Design',
  Social: 'Events',
  Creator: 'Content',
};

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>('Professional');

  const connections = recentConnections.map((c, i) =>
    i === 0 ? { ...c, category: filterCategoryMap[activeFilter] } : c
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, {currentUser.name}</Text>
        <Text style={styles.subtitle}>Ready to grow your network?</Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.chipText,
                activeFilter === f && styles.chipTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.cardShadow]}>
          <Text style={styles.statNumber}>{currentUser.connectionsCount}</Text>
          <Text style={styles.statLabel}>Connections</Text>
        </View>
        <View style={[styles.statCard, styles.cardShadow]}>
          <Text style={styles.statNumber}>{currentUser.eventsCount}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
      </View>

      {/* Met this week */}
      <View style={[styles.card, styles.cardShadow]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Met this week</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('All weekly connections – mock only')
            }
          >
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weeklyRow}
        >
          {weeklyMet.map((p) => (
            <View key={p.id} style={styles.weeklyItem}>
              <Avatar initials={p.initials} size={48} />
              <Text style={styles.weeklyName}>{p.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Recent connections */}
      <View style={[styles.card, styles.cardShadow]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent connections</Text>
        </View>
        {connections.map((item) => (
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
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  chipsRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  chipActive: {
    backgroundColor: '#3B82F6',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  weeklyRow: {
    gap: 16,
    paddingRight: 8,
  },
  weeklyItem: {
    alignItems: 'center',
    gap: 6,
  },
  weeklyName: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
});
