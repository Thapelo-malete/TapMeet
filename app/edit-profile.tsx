import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Link as LinkIcon, Linkedin, Twitter, Instagram } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { getMyProfile, upsertMyProfile, type UserProfile } from '@/lib/userProfile';
import Avatar from '@/components/Avatar';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';

function normalizeUrl(raw: string) {
  const t = raw.trim();
  if (!t) return '';
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  return `https://${t}`;
}

function isValidHttpsUrl(raw: string) {
  const t = raw.trim();
  if (!t) return true;
  const normalized = normalizeUrl(t);
  try {
    const u = new URL(normalized);
    return u.protocol === 'https:' && Boolean(u.hostname);
  } catch {
    return false;
  }
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { supabaseUser, user } = useAuth();
  const userId = supabaseUser?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadedProfile, setLoadedProfile] = useState<UserProfile | null>(null);

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarVersion, setAvatarVersion] = useState<number>(0);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [linkedin, setLinkedin] = useState('');
  const [x, setX] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');

  const baseProfile = useMemo<UserProfile | null>(() => {
    if (!userId) return null;
    return {
      id: userId,
      full_name: fullName.trim() || null,
      title: title.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      linkedin_url: linkedin.trim() ? normalizeUrl(linkedin) : null,
      x_url: x.trim() ? normalizeUrl(x) : null,
      instagram_url: instagram.trim() ? normalizeUrl(instagram) : null,
      website_url: website.trim() ? normalizeUrl(website) : null,
    };
  }, [avatarUrl, bio, fullName, instagram, linkedin, title, userId, website, x]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!userId) return;
      const { data, error } = await getMyProfile(userId);
      if (!mounted) return;
      setLoading(false);
      if (error) return;
      setLoadedProfile(data ?? null);
      if (!data) return;
      setFullName(data.full_name ?? fullName);
      setTitle(data.title ?? '');
      setBio(data.bio ?? '');
      setAvatarUrl(data.avatar_url ?? '');
      setAvatarVersion(Date.now());
      setInterests(Array.isArray(data.interests) ? data.interests.filter(Boolean) : []);
      setLinkedin(data.linkedin_url ?? '');
      setX(data.x_url ?? '');
      setInstagram(data.instagram_url ?? '');
      setWebsite(data.website_url ?? '');
    }
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const onSave = async () => {
    if (!baseProfile) return;
    if (saving) return;
    const existing = loadedProfile;

    // Merge behavior: if a field is blank, keep existing value.
    // This lets users update just one field without accidentally wiping others.
    const merged: UserProfile = {
      id: baseProfile.id,
      full_name:
        baseProfile.full_name ??
        existing?.full_name ??
        (user?.fullName?.trim() ? user.fullName.trim() : null),
      title: baseProfile.title ?? existing?.title ?? null,
      bio: baseProfile.bio ?? existing?.bio ?? null,
      avatar_url: baseProfile.avatar_url ?? existing?.avatar_url ?? null,
      interests: interests.length ? interests : existing?.interests ?? [],
      linkedin_url: baseProfile.linkedin_url ?? existing?.linkedin_url ?? null,
      x_url: baseProfile.x_url ?? existing?.x_url ?? null,
      instagram_url: baseProfile.instagram_url ?? existing?.instagram_url ?? null,
      website_url: baseProfile.website_url ?? existing?.website_url ?? null,
    };

    if (!merged.full_name) {
      Alert.alert('Missing name', 'Please enter your name.');
      return;
    }
    if (!isValidHttpsUrl(linkedin) || !isValidHttpsUrl(x) || !isValidHttpsUrl(instagram) || !isValidHttpsUrl(website)) {
      Alert.alert('Check your links', 'Please enter valid URLs (https) for your social links.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await upsertMyProfile(merged);
      if (error) {
        Alert.alert('Couldn’t save', error.message || 'Please try again in a moment.');
        return;
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <ArrowLeft size={18} color="#292524" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Edit profile</Text>
        <View style={styles.iconBtn} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>Loading profile…</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarRing}>
                <Avatar
                  initials={(fullName.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || 'TM')}
                  size={86}
                  uri={avatarUrl ? `${avatarUrl}?v=${avatarVersion}` : null}
                />
              </View>
              <View style={styles.avatarRight}>
                <Text style={styles.sectionTitle}>Profile photo</Text>
                <Text style={styles.helper}>Upload a clear photo to help people recognize you.</Text>
                <TouchableOpacity
                  style={[styles.secondaryBtn, avatarUploading && styles.saveBtnDisabled]}
                  onPress={async () => {
                    if (!userId || avatarUploading) return;
                    setAvatarUploading(true);
                    try {
                      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert('Permission needed', 'Please allow photo library access to upload a profile photo.');
                        return;
                      }

                      const res = await ImagePicker.launchImageLibraryAsync({
                        // Avoid deprecated MediaTypeOptions warning (and keep TS compatibility)
                        mediaTypes: ['images'] as any,
                        quality: 0.85,
                        allowsEditing: true,
                        aspect: [1, 1],
                      });

                      if (res.canceled) return;
                      const asset = res.assets[0];
                      const uri = asset.uri;

                      const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
                      const path = `${userId}/avatar.${ext}`;

                      const arrayBuffer = await (await fetch(uri)).arrayBuffer();
                      const contentType =
                        asset.mimeType ??
                        (ext === 'png'
                          ? 'image/png'
                          : ext === 'webp'
                            ? 'image/webp'
                            : 'image/jpeg');
                      const { error } = await supabase.storage
                        .from('avatars')
                        .upload(path, arrayBuffer, { upsert: true, contentType });

                      if (error) {
                        Alert.alert('Upload failed', 'Please try again in a moment.');
                        return;
                      }

                      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
                      const publicUrl = data.publicUrl;
                      setAvatarUrl(publicUrl);
                      setAvatarVersion(Date.now());

                      // Persist immediately so it shows after navigating back.
                      await upsertMyProfile({ id: userId, avatar_url: publicUrl });
                    } finally {
                      setAvatarUploading(false);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  {avatarUploading ? (
                    <View style={styles.saveRow}>
                      <ActivityIndicator color="#292524" />
                      <Text style={styles.secondaryBtnText}>Uploading…</Text>
                    </View>
                  ) : (
                    <Text style={styles.secondaryBtnText}>Change photo</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.label}>Full name</Text>
            <TextInput value={fullName} onChangeText={setFullName} style={styles.input} placeholder="Your name" placeholderTextColor="#A8A29E" />

            <Text style={styles.label}>Title</Text>
            <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="e.g. Founder @ TapMeet" placeholderTextColor="#A8A29E" />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              style={[styles.input, styles.textarea]}
              placeholder="A short bio about you"
              placeholderTextColor="#A8A29E"
              multiline
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Social links</Text>

            <View style={styles.socialRow}>
              <Linkedin size={18} color="#A58A66" />
              <Text style={styles.socialLabel}>LinkedIn</Text>
            </View>
            <TextInput value={linkedin} onChangeText={setLinkedin} style={styles.input} placeholder="linkedin.com/in/yourname" placeholderTextColor="#A8A29E" autoCapitalize="none" />
            {!isValidHttpsUrl(linkedin) ? <Text style={styles.inlineError}>Please enter a valid https URL.</Text> : null}

            <View style={styles.socialRow}>
              <Twitter size={18} color="#A58A66" />
              <Text style={styles.socialLabel}>X (Twitter)</Text>
            </View>
            <TextInput value={x} onChangeText={setX} style={styles.input} placeholder="x.com/yourhandle" placeholderTextColor="#A8A29E" autoCapitalize="none" />
            {!isValidHttpsUrl(x) ? <Text style={styles.inlineError}>Please enter a valid https URL.</Text> : null}

            <View style={styles.socialRow}>
              <Instagram size={18} color="#A58A66" />
              <Text style={styles.socialLabel}>Instagram</Text>
            </View>
            <TextInput value={instagram} onChangeText={setInstagram} style={styles.input} placeholder="instagram.com/yourhandle" placeholderTextColor="#A8A29E" autoCapitalize="none" />
            {!isValidHttpsUrl(instagram) ? <Text style={styles.inlineError}>Please enter a valid https URL.</Text> : null}

            <View style={styles.socialRow}>
              <LinkIcon size={18} color="#A58A66" />
              <Text style={styles.socialLabel}>Website</Text>
            </View>
            <TextInput value={website} onChangeText={setWebsite} style={styles.input} placeholder="yourwebsite.com" placeholderTextColor="#A8A29E" autoCapitalize="none" />
            {!isValidHttpsUrl(website) ? <Text style={styles.inlineError}>Please enter a valid https URL.</Text> : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <Text style={styles.helper}>Add topics you’d like to connect about.</Text>

            <View style={styles.interestRow}>
              <TextInput
                value={interestInput}
                onChangeText={setInterestInput}
                style={[styles.input, styles.interestInput]}
                placeholder="e.g. startups"
                placeholderTextColor="#A8A29E"
                autoCapitalize="none"
                onSubmitEditing={() => {
                  const raw = interestInput.trim();
                  if (!raw) return;
                  const normalized = raw.startsWith('#') ? raw : `#${raw}`;
                  const clean = normalized.replace(/\s+/g, '-').toLowerCase();
                  setInterests((prev) =>
                    prev.includes(clean) ? prev : [...prev, clean].slice(0, 20)
                  );
                  setInterestInput('');
                }}
              />
              <TouchableOpacity
                style={styles.addBtn}
                activeOpacity={0.85}
                onPress={() => {
                  const raw = interestInput.trim();
                  if (!raw) return;
                  const normalized = raw.startsWith('#') ? raw : `#${raw}`;
                  const clean = normalized.replace(/\s+/g, '-').toLowerCase();
                  setInterests((prev) =>
                    prev.includes(clean) ? prev : [...prev, clean].slice(0, 20)
                  );
                  setInterestInput('');
                }}
              >
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tagsWrap}>
              {interests.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tag}
                  onPress={() => setInterests((prev) => prev.filter((t) => t !== tag))}
                  activeOpacity={0.85}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <Text style={styles.tagX}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={onSave}
            activeOpacity={0.85}
            disabled={saving || !userId}
          >
            {saving ? (
              <View style={styles.saveRow}>
                <ActivityIndicator color="#292524" />
                <Text style={styles.saveText}>Saving…</Text>
              </View>
            ) : (
              <Text style={styles.saveText}>Save changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: '#F5F5F4' },
  topBar: {
    paddingTop: Platform.OS === 'ios' ? 58 : 38,
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAFAF9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECE9E4',
  },
  topTitle: { fontSize: 18, fontWeight: '800', color: '#292524' },
  content: { paddingHorizontal: 18, paddingBottom: 28, gap: 12 },
  loadingWrap: { alignItems: 'center', paddingVertical: 8, gap: 8 },
  loadingText: { fontSize: 13, color: '#78716C', fontWeight: '600' },
  card: {
    backgroundColor: '#FAFAF9',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECE9E4',
    gap: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2.5,
    borderColor: '#C8A376',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  avatarRight: { flex: 1, gap: 6 },
  helper: { fontSize: 12, color: '#78716C', fontWeight: '600' },
  secondaryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondaryBtnText: { color: '#292524', fontSize: 13, fontWeight: '800' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#292524', marginBottom: 4 },
  label: { fontSize: 13, color: '#57534E', fontWeight: '700', marginTop: 6 },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E5E4',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  textarea: { height: 110, textAlignVertical: 'top' },
  socialRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  socialLabel: { fontSize: 13, fontWeight: '700', color: '#44403C' },
  inlineError: {
    marginTop: 6,
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '600',
  },
  interestRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  interestInput: {
    flex: 1,
  },
  addBtn: {
    backgroundColor: '#C7A074',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#292524', fontSize: 13, fontWeight: '800' },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D5AF84',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: { fontSize: 12, color: '#292524', fontWeight: '800' },
  tagX: { fontSize: 16, color: '#292524', fontWeight: '800', marginTop: -1 },
  saveBtn: {
    marginTop: 6,
    backgroundColor: '#C7A074',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.75 },
  saveRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  saveText: { color: '#292524', fontSize: 16, fontWeight: '800' },
});

