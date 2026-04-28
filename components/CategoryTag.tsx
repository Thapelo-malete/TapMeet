import { View, Text, StyleSheet } from 'react-native';
import { categoryColors } from '@/constants/mockData';

interface CategoryTagProps {
  label: string;
}

export default function CategoryTag({ label }: CategoryTagProps) {
  const colors = categoryColors[label] ?? { bg: '#F3F4F6', text: '#374151' };
  return (
    <View style={[styles.tag, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
