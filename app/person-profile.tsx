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
import { ArrowLeft, Pencil } from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import { mockProfile } from '@/constants/mockData';

export default function PersonProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ArrowLeft size={20} color="#3B82F6" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Profile header */}
      <View style={[styles.card, styles.cardShadow, styles.profileCard]}>
        <Avatar initials="SJ" size={64} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{mockProfile.name}</Text>
          <Text style={styles.profileTitle}>{mockProfile.title}</Text>
        </View>
      </View>

      {/* Memory section */}
      <View style={[styles.card, styles.cardShadow]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Memory</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('Edit mode (mock) – would save changes.')}
            activeOpacity={0.7}
          >
            <Pencil size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.memoryRow}>
          <Text style={styles.memoryLabel}>Met at</Text>
          <Text style={styles.memoryValue}>{mockProfile.metAt}</Text>
        </View>
        <View style={styles.memoryRow}>
          <Text style={styles.memoryLabel}>Date</Text>
          <Text style={styles.memoryValue}>{mockProfile.date}</Text>
        </View>
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>{mockProfile.notes}</Text>
        </View>
      </View>

      {/* Hashtags */}
      <View style={[styles.card, styles.cardShadow]}>
        <View style={styles.tagsRow}>
          {mockProfile.hashtags.map((tag) => (
            <View key={tag} style={styles.hashTag}>
              <Text style={styles.hashTagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* People like them */}
      <View style={[styles.card, styles.cardShadow]}>
        <Text style={styles.sectionTitle}>People like them</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.peopleRow}
        >
          {mockProfile.peopleLike.map((person) => (
            <View key={person.name} style={styles.personCard}>
              <Avatar initials={person.name.slice(0, 2).toUpperCase()} size={56} />
              <Text style={styles.personName}>{person.name}</Text>
              <Text style={styles.personRole}>{person.role}</Text>
            </View>
          ))}
        </ScrollView>
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
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 12,
  },
  backText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  profileTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  memoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  memoryLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    width: 48,
    paddingTop: 1,
  },
  memoryValue: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  noteContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  hashTagText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  peopleRow: {
    gap: 12,
    paddingTop: 8,
  },
  personCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: 96,
    gap: 6,
  },
  personName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  personRole: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
});
