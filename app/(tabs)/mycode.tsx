import { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Share,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '@/context/AuthContext';
import { makeMyQrPayload } from '@/lib/scanPayload';
import { useRouter } from 'expo-router';
import { ScanLine } from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import { useMyProfile } from '@/hooks/useMyProfile';
import { getPublicProfileUrl } from '@/lib/appLinks';

export default function MyCodeScreen() {
  const { supabaseUser } = useAuth();
  const myId = supabaseUser?.id ?? '';
  const router = useRouter();
  const qrValue = useMemo(() => (myId ? makeMyQrPayload(myId) : ''), [myId]);
  const { profile } = useMyProfile(supabaseUser?.id);
  const publicLink = useMemo(() => (myId ? getPublicProfileUrl(myId) : ''), [myId]);

  const displayName = (profile?.full_name ?? supabaseUser?.email?.split('@')[0] ?? 'TapMeet').trim();
  const displayTitle = (profile?.title ?? 'TapMeet member').trim();
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase() ?? '')
    .join('');

  const handleCopyLink = () =>
    Alert.alert('Copy link', publicLink ? publicLink : 'Sign in to generate your link.');

  const handleShare = async () => {
    try {
      await Share.share({
        message: publicLink ? `${displayName} on TapMeet: ${publicLink}` : 'TapMeet profile',
      });
    } catch {
      // dismissed
    }
  };

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
        <View style={styles.headerRow}>
          <View style={styles.dot} />
          <TouchableOpacity
            style={styles.scanPill}
            onPress={() => router.replace('/(tabs)/scan')}
            activeOpacity={0.85}
          >
            <ScanLine size={16} color="#292524" />
            <Text style={styles.scanPillText}>Scan</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.mainCard}>
        <View style={[styles.avatarWrap, styles.cardShadow]}>
          <Avatar
            initials={initials || 'TM'}
            size={88}
            uri={
              profile?.avatar_url
                ? `${profile.avatar_url}?v=${encodeURIComponent(profile.updated_at ?? '')}`
                : null
            }
          />
        </View>
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userRole}>{displayTitle}</Text>

        <View style={styles.qrShell}>
          <View style={styles.qrInset}>
            {qrValue ? (
              <QRCode value={qrValue} size={240} backgroundColor="#FFFFFF" color="#111827" />
            ) : (
              <View style={styles.qrCenter} />
            )}
          </View>
        </View>
        <View style={styles.nfcRings}>
          <View style={styles.ringOuter} />
          <View style={styles.ringMid} />
          <View style={styles.ringInner} />
        </View>
        <Text style={styles.instruction}>Bring phones close to share</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={handleCopyLink}
          activeOpacity={0.85}
        >
          <Text style={styles.copyButtonText}>Copy Link</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <Text style={styles.shareButtonText}>Share Profile</Text>
        </TouchableOpacity>
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
    paddingBottom: 20,
  },
  topSection: {
    paddingTop: Platform.OS === 'ios' ? 58 : 38,
    paddingBottom: 38,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
  },
  dot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F4',
  },
  scanPill: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#F5F5F4',
    borderWidth: 1,
    borderColor: 'rgba(231,229,228,0.9)',
  },
  scanPillText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#292524',
  },
  mainCard: {
    backgroundColor: '#FBFAF8',
    marginHorizontal: 18,
    marginTop: -16,
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingBottom: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  avatarWrap: {
    marginTop: -42,
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  userRole: {
    marginTop: 4,
    fontSize: 14,
    color: '#78716C',
    fontWeight: '500',
  },
  qrShell: {
    marginTop: 20,
    width: '100%',
    aspectRatio: 1,
    borderRadius: 30,
    backgroundColor: '#F1F1F1',
    padding: 26,
  },
  qrInset: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCenter: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: { elevation: 2 },
    }),
  },
  nfcRings: {
    width: 90,
    height: 90,
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: '#E7E5E4',
  },
  ringMid: {
    position: 'absolute',
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 1.5,
    borderColor: '#E7E5E4',
  },
  ringInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#D6D3D1',
  },
  instruction: {
    marginTop: 14,
    fontSize: 14,
    color: '#78716C',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 18,
    width: '100%',
    marginTop: 14,
    marginBottom: 8,
  },
  copyButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#D6D3D1',
    borderRadius: 22,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#FAFAF9',
  },
  copyButtonText: {
    color: '#292524',
    fontSize: 16,
    fontWeight: '700',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#CBA479',
    borderRadius: 22,
    paddingVertical: 15,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#292524',
    fontSize: 16,
    fontWeight: '700',
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
      },
      android: { elevation: 2 },
    }),
  },
});
