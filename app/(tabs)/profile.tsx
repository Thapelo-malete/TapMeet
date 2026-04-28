import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import Avatar from '@/components/Avatar';
import { currentUser } from '@/constants/mockData';

export default function ProfileScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <View style={[styles.card, styles.cardShadow]}>
        <View style={styles.profileRow}>
          <Avatar initials="SM" size={64} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser.name}</Text>
            <Text style={styles.profileHandle}>@sam · TapMeet</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser.connectionsCount}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser.eventsCount}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, styles.cardShadow]}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Building connections that matter. Based in San Francisco, CA.
        </Text>
      </View>

      <View style={[styles.card, styles.cardShadow]}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.tagsRow}>
          {['Product', 'Startups', 'Design', 'AI'].map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag.toLowerCase()}</Text>
            </View>
          ))}
        </View>
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  profileHandle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
});
