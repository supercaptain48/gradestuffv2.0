import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

import Header from '@/components/Header';

export default function TabLayout() {

  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: 'blue', 
        header: Header,
     }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="grades"
        options={{
          title: 'Grades',
        }}
      />
      <Tabs.Screen
        name="gpa"
        options={{
          title: 'GPA',
        }}
      />
    </Tabs>
  );
}
