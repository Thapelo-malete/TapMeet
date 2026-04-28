import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Radio } from 'lucide-react-native';

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
      <LinearGradient
        colors={['#101418', '#1A1411', '#29221B']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.cameraArea}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.85}>
            <X size={24} color="#E7E5E4" />
          </TouchableOpacity>
          <Text style={styles.title}>Scan Connection</Text>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.85} />
        </View>

        <View style={styles.reticle}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
        <Text style={styles.reticleLabelText}>Position QR code within frame</Text>
      </LinearGradient>

      <View style={styles.bottomSheet}>
        <View style={styles.sheetGrabber} />

        <View style={styles.toggleContainer}>
          {(['Scan Code', 'My Code'] as Tab[]).map((t) => (
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

        <TouchableOpacity
          style={styles.connectButton}
          onPress={handleConnect}
          activeOpacity={0.85}
        >
          <View style={styles.connectIcon}>
            <Radio size={20} color="#292524" />
          </View>
          <View>
            <Text style={styles.connectButtonText}>Tap to Connect</Text>
            <Text style={styles.helperText}>Hold near another phone or tag</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111827',
  },
  cameraArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 58 : 34,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(250,250,249,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(24,24,27,0.25)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F5F5F4',
  },
  reticle: {
    width: 300,
    height: 300,
    position: 'relative',
    marginTop: 160,
  },
  corner: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderColor: '#D6B08A',
    borderWidth: 4,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 16,
  },
  reticleLabelText: {
    color: '#F5F5F4',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 28,
  },
  bottomSheet: {
    backgroundColor: '#F5F5F4',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 26,
    marginTop: -12,
  },
  sheetGrabber: {
    width: 54,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E7E5E4',
    alignSelf: 'center',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#D2A779',
    borderRadius: 24,
    padding: 5,
    marginBottom: 20,
    gap: 6,
  },
  toggleItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  toggleItemActive: {
    backgroundColor: '#F5F5F4',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#78716C',
  },
  toggleTextActive: {
    color: '#292524',
  },
  connectButton: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  connectIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#D6AF84',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    color: '#292524',
    fontSize: 17,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 14,
    color: '#78716C',
    fontWeight: '500',
    marginTop: 2,
  },
});
