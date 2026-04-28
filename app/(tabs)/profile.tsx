import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Bell, Pencil } from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import { currentUser } from '@/constants/mockData';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={['#CAA57A', '#E8D7C2', '#F4EFE9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topSection}
      >
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.iconCircle} activeOpacity={0.85}>
            <Settings size={18} color="#292524" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle} activeOpacity={0.85}>
            <Bell size={18} color="#292524" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={[styles.profileCard, styles.cardShadow]}>
        <View style={styles.avatarRing}>
          <Avatar initials="SM" size={78} />
        </View>
        <Text style={styles.profileName}>{user?.fullName ?? currentUser.name}</Text>
        <Text style={styles.profileHandle}>Product Lead @ TapMeet</Text>

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
            <Text style={styles.statLabel}>This week</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Memory</Text>
        <TouchableOpacity style={styles.editPill} activeOpacity={0.85}>
          <Pencil size={12} color="#FAFAF9" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.cardShadow]}>
        <Text style={styles.aboutText}>
          Building connections that matter. Based in San Francisco, CA.
        </Text>
      </View>

      <View style={[styles.card, styles.cardShadow]}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.tagsRow}>
          {['#product', '#startups', '#design', '#ai'].map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.85}>
        <Text style={styles.logoutButtonText}>Log out</Text>
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
    paddingBottom: 32,
  },
  topSection: {
    paddingBottom: 70,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topActions: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAFAF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: '#FAFAF9',
    borderRadius: 24,
    marginHorizontal: 18,
    marginTop: -54,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
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
  avatarRing: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 2.5,
    borderColor: '#C8A376',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 30,
    fontWeight: '700',
    color: '#292524',
  },
  profileHandle: {
    fontSize: 14,
    color: '#78716C',
    marginTop: 2,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#292524',
  },
  statLabel: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ECE9E4',
  },
  sectionHeader: {
    marginHorizontal: 18,
    marginBottom: 10,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editPill: {
    marginLeft: 'auto',
    backgroundColor: '#292524',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  editText: {
    color: '#FAFAF9',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#292524',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FAFAF9',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 18,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#44403C',
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#D5AF84',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: '#292524',
    fontWeight: '700',
  },
  logoutButton: {
    marginHorizontal: 18,
    marginTop: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    backgroundColor: '#FAFAF9',
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '700',
  },
});
