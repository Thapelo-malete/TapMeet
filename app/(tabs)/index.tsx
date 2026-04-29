import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, Hash, ScanLine, Search } from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { useMyProfile } from '@/hooks/useMyProfile';

export default function HomeScreen() {
  const router = useRouter();
  const { user, supabaseUser } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { recentConnections, connectionsCount, isRefreshing, refresh } = useDashboard();
  const { profile } = useMyProfile(supabaseUser?.id);

  const timeGreeting = useMemo(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Good morning';
    if (h >= 12 && h < 17) return 'Good afternoon';
    if (h >= 17 && h < 22) return 'Good evening';
    return 'Good night';
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const c of recentConnections) {
      if (c.category) set.add(c.category);
    }
    return ['All', ...Array.from(set).slice(0, 8)];
  }, [recentConnections]);

  const connections = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return recentConnections.filter((c) => {
      const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, recentConnections, searchText]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => void refresh()}
          tintColor="#A58A66"
        />
      }
    >
      <LinearGradient
        colors={['#C9A376', '#E7D4BD', '#F4F0EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topSection}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {timeGreeting}, {profile?.full_name ?? user?.fullName ?? 'there'}
            </Text>
            <Text style={styles.subtitle}>Ready to grow your network?</Text>
          </View>
          <Avatar
            initials={(profile?.full_name?.slice(0, 2).toUpperCase() ?? 'TM')}
            size={52}
            uri={
              profile?.avatar_url
                ? `${profile.avatar_url}?v=${encodeURIComponent(profile.updated_at ?? '')}`
                : null
            }
          />
        </View>

        <View style={styles.searchWrap}>
          <Search size={18} color="#78716C" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search connections"
            placeholderTextColor="#A8A29E"
            style={styles.searchInput}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, activeCategory === c && styles.chipActive]}
              onPress={() => setActiveCategory(c)}
              activeOpacity={0.85}
            >
              <Text style={[styles.chipText, activeCategory === c && styles.chipTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.cardShadow]}>
            <Text style={styles.statNumber}>{connectionsCount}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={[styles.statCard, styles.cardShadow]}>
            <Text style={styles.statNumber}>0</Text>
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
          {recentConnections.slice(0, 5).map((p) => (
            <View key={p.id} style={styles.weeklyItem}>
              <Avatar initials={p.initials} size={60} />
              <Text style={styles.weeklyName}>{p.name.split(' ')[0]}</Text>
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
  searchWrap: {
    marginTop: 2,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(231,229,228,0.8)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#292524',
  },
  chipsRow: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
    paddingBottom: 2,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(231,229,228,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: '#C7A074',
    borderColor: '#C7A074',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78716C',
  },
  chipTextActive: {
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
