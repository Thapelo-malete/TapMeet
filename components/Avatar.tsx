import { Image, View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  initials: string;
  size?: number;
  uri?: string | null;
}

export default function Avatar({ initials, size = 40, uri }: AvatarProps) {
  const fontSize = size * 0.35;
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#4B5563',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
