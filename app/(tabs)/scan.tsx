import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';

type Tab = 'Scan Code' | 'My Code';

export default function ScanScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Scan Code');

  const handleConnect = () =>
    Alert.alert(
      'Connection Successful',
      'Mock connection successful – added to recent connections'
    );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Connection</Text>
      </View>

      {/* Camera mock */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraMock}>
          {/* Reticle */}
          <View style={styles.reticle}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <View style={styles.reticleLabel}>
              <Text style={styles.reticleLabelText}>
                Position QR code within frame
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom toggle */}
      <View style={styles.toggleContainer}>
        {(['Scan Code', 'My Code'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.toggleItem,
              activeTab === t && styles.toggleItemActive,
            ]}
            onPress={() => setActiveTab(t)}
            activeOpacity={0.8}
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

      {/* Tap to Connect */}
      <TouchableOpacity
        style={styles.connectButton}
        onPress={handleConnect}
        activeOpacity={0.85}
      >
        <Text style={styles.connectButtonText}>Tap to Connect</Text>
      </TouchableOpacity>
      <Text style={styles.helperText}>Hold near another phone or tag</Text>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  cameraContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  cameraMock: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#D1D5DB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  reticle: {
    width: 200,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  reticleLabel: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  reticleLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    gap: 4,
  },
  toggleItem: {
    paddingHorizontal: 24,
    paddingVertical: 10,
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
  connectButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
