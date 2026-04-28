import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  Share,
} from 'react-native';

type Tab = 'My' | 'Scan' | 'Code';

export default function MyCodeScreen() {
  const [activeTab, setActiveTab] = useState<Tab[]>(['My', 'Code']);

  const isActive = (t: Tab) => activeTab.includes(t);

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
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>My Code</Text>
      </View>

      {/* Toggle */}
      <View style={styles.toggleContainer}>
        {(['My', 'Scan', 'Code'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.toggleItem, isActive(t) && styles.toggleItemActive]}
            onPress={() =>
              setActiveTab((prev) =>
                prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
              )
            }
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.toggleText,
                isActive(t) && styles.toggleTextActive,
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* QR area */}
      <View style={styles.qrCard}>
        <View style={styles.qrWrapper}>
          <MockQR />
        </View>
        <Text style={styles.userName}>Julian Rhodes</Text>
        <Text style={styles.userRole}>Founder @ TapMeet</Text>
      </View>

      <Text style={styles.instruction}>Bring phones close to share</Text>

      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={handleCopyLink}
          activeOpacity={0.8}
        >
          <Text style={styles.copyButtonText}>Copy Link</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.shareButtonText}>Share Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MockQR() {
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  ];
  const cellSize = 8;
  return (
    <View>
      {pattern.map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row' }}>
          {row.map((cell, ci) => (
            <View
              key={ci}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell ? '#111827' : '#FFFFFF',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
    gap: 4,
  },
  toggleItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 9,
  },
  toggleItemActive: {
    backgroundColor: '#3B82F6',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
    marginBottom: 20,
  },
  qrWrapper: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  instruction: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 32,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    width: '100%',
  },
  copyButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
