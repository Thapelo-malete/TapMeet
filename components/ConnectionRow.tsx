import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import CategoryTag from './CategoryTag';

interface Connection {
  id: string;
  name: string;
  role: string;
  company: string;
  category: string;
  timeAgo: string;
  initials: string;
}

interface ConnectionRowProps {
  item: Connection;
  onPress: () => void;
}

export default function ConnectionRow({ item, onPress }: ConnectionRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Avatar initials={item.initials} />
      <View style={styles.middle}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>
          {item.role} at {item.company}
        </Text>
        <CategoryTag label={item.category} />
      </View>
      <Text style={styles.time}>{item.timeAgo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  middle: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  role: {
    fontSize: 12,
    color: '#6B7280',
  },
  time: {
    fontSize: 11,
    color: '#9CA3AF',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
});
