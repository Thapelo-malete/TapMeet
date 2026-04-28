import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, Hash, ScanLine } from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import { currentUser, weeklyMet } from '@/constants/mockData';
import { useConnections } from '@/hooks/useConnections';

const FILTERS = ['Professional', 'Social', 'Creator'] as const;
type Filter = (typeof FILTERS)[number];

const filterCategoryMap: Record<Filter, string> = {
  Professional: 'Design',
  Social: 'Startup',
  Creator: 'Fintech',
};

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>('Professional');
  const { connections: recentConnections } = useConnections(5);

  const connections = useMemo(
    () =>
      recentConnections.map((c, i) =>
        i === 0 ? { ...c, category: filterCategoryMap[activeFilter] } : c
      ),
    [activeFilter]
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={['#C9A376', '#E7D4BD', '#F4F0EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topSection}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, {currentUser.name}</Text>
            <Text style={styles.subtitle}>Ready to grow your network?</Text>
          </View>
          <Avatar initials="SA" size={52} />
        </View>

        <View style={styles.segmented}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.segmentItem, activeFilter === f && styles.segmentActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeFilter === f && styles.segmentTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.cardShadow]}>
            <Text style={styles.statNumber}>{currentUser.connectionsCount}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={[styles.statCard, styles.cardShadow]}>
            <Text style={styles.statNumber}>{currentUser.eventsCount}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={[styles.statCard, styles.cardShadow]}>
            <View style={styles.hashBadge}>
              <Hash size={14} color="#1F2937" />
            </View>
            <Text style={styles.statLabel}>Tech</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Met this week</Text>
          <TouchableOpacity>
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
              <Avatar initials={p.initials} size={60} />
              <Text style={styles.weeklyName}>{p.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent connections</Text>
        </View>
        {connections.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.connectionCard, styles.cardShadow]}
            onPress={() => router.push('/person-profile')}
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
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.scanFab, styles.cardShadow]} activeOpacity={0.85}>
        <ScanLine size={22} color="#1F2937" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F4',
  },
  content: {
    paddingBottom: 100,
  },
  topSection: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#A8A29E',
    marginTop: 8,
    fontWeight: '500',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginHorizontal: 20,
    padding: 6,
    borderRadius: 28,
    gap: 6,
  },
  segmentItem: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#C7A074',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78716C',
  },
  segmentTextActive: {
    color: '#292524',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 13,
    color: '#78716C',
    marginTop: 4,
  },
  hashBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D5B48D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  sectionWrap: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 14,
    color: '#A58A66',
    fontWeight: '600',
  },
  weeklyRow: {
    gap: 20,
    paddingRight: 16,
  },
  weeklyItem: {
    alignItems: 'center',
    gap: 8,
  },
  weeklyName: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  connectionCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#1F2937',
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
  scanFab: {
    position: 'absolute',
    right: 22,
    bottom: 24,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#D8BA93',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
