import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Ellipsis,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  CalendarDays,
  PenLine,
} from 'lucide-react-native';
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
      <View style={styles.topActions}>
        <TouchableOpacity
          style={[styles.iconCircle, styles.cardShadow]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={18} color="#292524" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconCircle, styles.cardShadow]} activeOpacity={0.8}>
          <Ellipsis size={18} color="#292524" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatarRing}>
          <Avatar initials="SJ" size={86} />
        </View>
        <Text style={styles.profileName}>{mockProfile.name}</Text>
        <Text style={styles.profileTitle}>{mockProfile.title}</Text>
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity style={[styles.socialBtn, styles.cardShadow]} activeOpacity={0.8}>
          <Linkedin size={17} color="#A58A66" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialBtn, styles.cardShadow]} activeOpacity={0.8}>
          <Twitter size={17} color="#A58A66" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialBtn, styles.cardShadow]} activeOpacity={0.8}>
          <Mail size={17} color="#A58A66" />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Memory</Text>
        <TouchableOpacity style={styles.editPill} activeOpacity={0.8}>
          <PenLine size={13} color="#E7E5E4" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.cardShadow]}>
        <View style={styles.sectionHeader}>
          <MapPin size={16} color="#78716C" />
          <Text style={styles.memoryLabel}>Met at</Text>
        </View>
        <Text style={styles.memoryValue}>{mockProfile.metAt}</Text>

        <View style={[styles.sectionHeader, styles.dateHeader]}>
          <CalendarDays size={16} color="#78716C" />
          <Text style={styles.memoryLabel}>Date</Text>
        </View>
        <Text style={styles.memoryValue}>{mockProfile.date}</Text>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>{mockProfile.notes}</Text>
        </View>

        <View style={styles.tagsRow}>
          {mockProfile.hashtags.map((tag) => (
            <View key={tag} style={styles.hashTag}>
              <Text style={styles.hashTagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.peopleSection}>
        <Text style={styles.sectionTitle}>People like them</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.peopleRow}
        >
          {mockProfile.peopleLike.map((person) => (
            <View key={person.name} style={[styles.personCard, styles.cardShadow]}>
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
    backgroundColor: '#F5F5F4',
  },
  content: {
    paddingBottom: 30,
    paddingHorizontal: 18,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 18,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAFAF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FAFAF9',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarRing: {
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 3,
    borderColor: '#C9A476',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  socialRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 22,
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FAFAF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 39,
    fontWeight: '700',
    color: '#292524',
    marginBottom: 2,
  },
  profileTitle: {
    fontSize: 14,
    color: '#78716C',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateHeader: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 31,
    fontWeight: '700',
    color: '#292524',
  },
  editPill: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#292524',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editText: {
    color: '#FAFAF9',
    fontSize: 13,
    fontWeight: '600',
  },
  memoryLabel: {
    fontSize: 14,
    color: '#78716C',
    fontWeight: '500',
  },
  memoryValue: {
    fontSize: 17,
    color: '#292524',
    marginTop: 8,
    fontWeight: '600',
  },
  noteContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 18,
    padding: 14,
    marginTop: 18,
  },
  noteText: {
    fontSize: 17,
    color: '#292524',
    lineHeight: 28,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  hashTag: {
    backgroundColor: '#D5AF84',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  hashTagText: {
    fontSize: 13,
    color: '#292524',
    fontWeight: '700',
  },
  peopleSection: {
    marginTop: 4,
  },
  peopleRow: {
    gap: 12,
    paddingTop: 12,
    paddingRight: 12,
  },
  personCard: {
    backgroundColor: '#FAFAF9',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    width: 102,
    gap: 6,
  },
  personName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#292524',
    textAlign: 'center',
  },
  personRole: {
    fontSize: 11,
    color: '#78716C',
    textAlign: 'center',
  },
});
