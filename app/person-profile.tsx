import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Ellipsis,
  Linkedin,
  Twitter,
  Globe,
  MapPin,
  CalendarDays,
} from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PersonProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ userId?: string; metAt?: string; metLocation?: string }>();
  const otherUserId = params.userId;
  const metAt = params.metAt;
  const metLocation = params.metLocation;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/recent');
    }
  };

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string | null;
    title: string | null;
    bio: string | null;
    avatar_url: string | null;
    interests: string[] | null;
    linkedin_url: string | null;
    x_url: string | null;
    instagram_url: string | null;
    website_url: string | null;
  } | null>(null);

  const initials = useMemo(() => {
    const name = profile?.full_name?.trim() || 'TapMeet';
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'TM';
  }, [profile?.full_name]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!otherUserId) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('user_profiles')
        .select(
          'id,full_name,title,bio,avatar_url,interests,linkedin_url,x_url,instagram_url,website_url'
        )
        .eq('id', otherUserId)
        .maybeSingle();
      if (!mounted) return;
      setProfile(data ? (data as any) : null);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserId]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topActions}>
        <TouchableOpacity
          style={[styles.iconCircle, styles.cardShadow]}
          onPress={handleBack}
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
          <Avatar
            initials={initials}
            size={86}
            uri={profile?.avatar_url ?? null}
          />
        </View>
        <Text style={styles.profileName}>{profile?.full_name ?? 'Connection'}</Text>
        <Text style={styles.profileTitle}>{profile?.title ?? 'TapMeet member'}</Text>
      </View>

      <View style={styles.socialRow}>
        {profile?.linkedin_url ? (
          <TouchableOpacity
            style={[styles.socialBtn, styles.cardShadow]}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(profile.linkedin_url!)}
          >
            <Linkedin size={17} color="#A58A66" />
          </TouchableOpacity>
        ) : null}
        {profile?.x_url ? (
          <TouchableOpacity
            style={[styles.socialBtn, styles.cardShadow]}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(profile.x_url!)}
          >
            <Twitter size={17} color="#A58A66" />
          </TouchableOpacity>
        ) : null}
        {profile?.website_url ? (
          <TouchableOpacity
            style={[styles.socialBtn, styles.cardShadow]}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(profile.website_url!)}
          >
            <Globe size={17} color="#A58A66" />
          </TouchableOpacity>
        ) : null}
      </View>

      {profile?.bio ? (
        <View style={[styles.card, styles.cardShadow]}>
          <Text style={styles.sectionTitleSmall}>About</Text>
          <Text style={styles.aboutText}>{profile.bio}</Text>
        </View>
      ) : null}

      {profile?.interests?.length ? (
        <View style={[styles.card, styles.cardShadow]}>
          <Text style={styles.sectionTitleSmall}>Interests</Text>
          <View style={styles.tagsRow}>
            {profile.interests.map((t) => (
              <View key={t} style={styles.hashTag}>
                <Text style={styles.hashTagText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Memory</Text>
      </View>

      <View style={[styles.card, styles.cardShadow]}>
        <View style={styles.sectionHeader}>
          <MapPin size={16} color="#78716C" />
          <Text style={styles.memoryLabel}>Met at</Text>
        </View>
        <Text style={styles.memoryValue}>
          {metLocation || (loading ? 'Loading…' : '—')}
        </Text>

        <View style={[styles.sectionHeader, styles.dateHeader]}>
          <CalendarDays size={16} color="#78716C" />
          <Text style={styles.memoryLabel}>Date</Text>
        </View>
        <Text style={styles.memoryValue}>
          {metAt ? new Date(metAt).toLocaleString() : '—'}
        </Text>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            {metAt ? `Connected on ${new Date(metAt).toLocaleString()}.` : ' '}
          </Text>
        </View>

        <View style={styles.tagsRow}>
          {/* Tags can be added when we store shared interests per connection */}
        </View>
      </View>

      {/* People like them section can be added once we have recommendation data */}
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
  sectionTitleSmall: {
    fontSize: 16,
    fontWeight: '800',
    color: '#292524',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#44403C',
    fontWeight: '500',
    lineHeight: 22,
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
