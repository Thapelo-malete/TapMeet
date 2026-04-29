import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { QrCode, Radio } from 'lucide-react-native';
import { CameraView, type BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { parseScannedUserId } from '@/lib/scanPayload';
import { supabase } from '@/lib/supabase';

export default function ScanScreen() {
  const router = useRouter();
  const { supabaseUser } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const lastScanRef = useRef<string>('');

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      void requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (!isScanning || isConnecting) return;
    const data = (result.data ?? '').trim();
    if (!data) return;

    const otherUserId = parseScannedUserId(data);
    if (!otherUserId) {
      setIsScanning(false);
      Alert.alert('Invalid code', 'This QR code is not a TapMeet profile.');
      setTimeout(() => setIsScanning(true), 800);
      return;
    }

    if (otherUserId === supabaseUser?.id) {
      setIsScanning(false);
      Alert.alert('That’s you', 'Scan someone else’s code to connect.');
      setTimeout(() => setIsScanning(true), 800);
      return;
    }

    if (lastScanRef.current === otherUserId) return;
    lastScanRef.current = otherUserId;

    setIsConnecting(true);
    try {
      // If already connected, take them straight to that user.
      if (supabaseUser?.id) {
        const { data: existing } = await supabase
          .from('user_connections')
          .select('met_at,met_location')
          .eq('owner_id', supabaseUser.id)
          .eq('other_user_id', otherUserId)
          .order('met_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existing?.met_at) {
          Alert.alert('Already connected', 'Opening this connection.');
          router.push({
            pathname: '/person-profile',
            params: {
              userId: otherUserId,
              metAt: existing.met_at,
              metLocation: existing.met_location ?? '',
            },
          });
          return;
        }
      }

      let metLocation: string | null = null;
      let metLat: number | null = null;
      let metLng: number | null = null;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        metLat = pos.coords.latitude;
        metLng = pos.coords.longitude;
        const geo = await Location.reverseGeocodeAsync({
          latitude: metLat,
          longitude: metLng,
        });
        const g = geo[0];
        metLocation = g
          ? [g.city || g.subregion, g.region, g.country].filter(Boolean).join(', ')
          : null;
      }

      const { error } = await supabase.rpc('connect_users', {
        p_other_user_id: otherUserId,
        met_lat: metLat,
        met_lng: metLng,
        met_location: metLocation,
      });

      if (error) {
        // Surface the underlying cause (missing RPC, permissions, schema cache, etc.)
        // Keep it readable for users, but include enough detail to debug quickly.
        const msg =
          (error.message || '').toLowerCase().includes('could not find the function') ||
          (error.message || '').toLowerCase().includes('function')
            ? 'Scan connect isn’t enabled on Supabase yet. Run supabase/user_connections.sql and reload schema.'
            : error.message || 'Please try again in a moment.';
        // eslint-disable-next-line no-console
        console.log('[connect_users] error', error);
        Alert.alert('Couldn’t connect', msg);
        lastScanRef.current = '';
        return;
      }

      Alert.alert('Connected', 'You’ve been added to each other’s connections.');

      let finalMetAt = new Date().toISOString();
      let finalMetLocation = metLocation ?? '';
      if (supabaseUser?.id) {
        const { data: created } = await supabase
          .from('user_connections')
          .select('met_at,met_location')
          .eq('owner_id', supabaseUser.id)
          .eq('other_user_id', otherUserId)
          .order('met_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (created?.met_at) finalMetAt = created.met_at;
        if (typeof created?.met_location === 'string') finalMetLocation = created.met_location;
      }

      router.push({
        pathname: '/person-profile',
        params: {
          userId: otherUserId,
          metAt: finalMetAt,
          metLocation: finalMetLocation,
        },
      });
    } finally {
      setIsConnecting(false);
      setIsScanning(true);
      setTimeout(() => {
        lastScanRef.current = '';
      }, 1500);
    }
  };

  const cameraOverlay = useMemo(() => {
    if (permission && !permission.granted) {
      return (
        <View style={styles.permissionWrap}>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionText}>
            Enable camera permission to scan TapMeet QR codes.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.cameraStage}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
        <View style={styles.cameraScrim} />
        <View style={styles.reticle}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
        <Text style={styles.reticleLabelText}>
          {isConnecting ? 'Connecting…' : 'Position QR code within frame'}
        </Text>
        {isConnecting ? (
          <View style={styles.connectingBadge}>
            <ActivityIndicator color="#F5F5F4" />
            <Text style={styles.connectingText}>Saving connection</Text>
          </View>
        ) : null}
      </View>
    );
  }, [handleBarcodeScanned, isConnecting, permission]);

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
            <QrCode size={22} color="#E7E5E4" />
          </TouchableOpacity>
          <Text style={styles.title}>Scan Connection</Text>
          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.85}
            onPress={() => router.replace('/(tabs)/mycode')}
          >
            <Text style={styles.headerBtnText}>My Code</Text>
          </TouchableOpacity>
        </View>

        {cameraOverlay}
      </LinearGradient>

      <View style={styles.bottomSheet}>
        <View style={styles.sheetGrabber} />

        {/* Top switch removed (bottom tabs already handle navigation) */}

        <TouchableOpacity
          style={styles.connectButton}
          activeOpacity={0.85}
        >
          <View style={styles.connectIcon}>
            <Radio size={20} color="#292524" />
          </View>
          <View>
            <Text style={styles.connectButtonText}>Tap to Connect</Text>
            <Text style={styles.helperText}>Scan a TapMeet QR code to connect</Text>
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
  cameraStage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  cameraScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
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
  headerBtnText: {
    color: '#F5F5F4',
    fontSize: 12,
    fontWeight: '800',
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
  connectingBadge: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(24,24,27,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(250,250,249,0.18)',
  },
  connectingText: { color: '#F5F5F4', fontSize: 13, fontWeight: '600' },
  permissionWrap: {
    marginTop: 110,
    paddingHorizontal: 22,
    alignItems: 'center',
    gap: 10,
  },
  permissionTitle: { color: '#F5F5F4', fontSize: 18, fontWeight: '800' },
  permissionText: {
    color: 'rgba(245,245,244,0.75)',
    textAlign: 'center',
    fontWeight: '600',
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
