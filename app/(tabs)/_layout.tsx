import { Tabs } from 'expo-router';
import { House, User, QrCode, Camera, List } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mycode"
        options={{
          title: 'My Code',
          tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <Camera size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recent"
        options={{
          title: 'Recent',
          tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
