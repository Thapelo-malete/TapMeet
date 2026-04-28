import { useState } from 'react';
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

type Tab = 'My Code' | 'Scan';

export default function MyCodeScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('My Code');

  const handleCopyLink = () => Alert.alert('Link copied to clipboard');

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out my TapMeet profile: Julian Rhodes',
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
          <View style={styles.toggleContainer}>
            {(['My Code', 'Scan'] as Tab[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.toggleItem,
                  activeTab === t && styles.toggleItemActive,
                ]}
                onPress={() => setActiveTab(t)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.toggleText,
                    activeTab === t && styles.toggleTextActive,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.mainCard}>
        <View style={[styles.avatarWrap, styles.cardShadow]}>
          <View style={styles.avatarInner}>
            <Text style={styles.avatarInitials}>JR</Text>
          </View>
        </View>
        <Text style={styles.userName}>Julian Rhodes</Text>
        <Text style={styles.userRole}>Founder @ TapMeet</Text>

        <View style={styles.qrShell}>
          <View style={styles.qrInset}>
            <View style={styles.qrCenter} />
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F4',
    borderRadius: 24,
    padding: 5,
    gap: 6,
    flex: 1,
  },
  toggleItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  toggleItemActive: {
    backgroundColor: '#C3A077',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#78716C',
  },
  toggleTextActive: {
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
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: '700',
    color: '#334155',
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
