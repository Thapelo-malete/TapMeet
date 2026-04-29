import { View, Text, StyleSheet } from 'react-native';

const categoryColors: Record<string, { bg: string; text: string }> = {
  Design: { bg: '#EDE9FE', text: '#6D28D9' },
  Startup: { bg: '#D1FAE5', text: '#065F46' },
  Fintech: { bg: '#DBEAFE', text: '#1D4ED8' },
  Events: { bg: '#FEF3C7', text: '#92400E' },
  Content: { bg: '#FCE7F3', text: '#9D174D' },
  Tech: { bg: '#E0F2FE', text: '#075985' },
};

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
