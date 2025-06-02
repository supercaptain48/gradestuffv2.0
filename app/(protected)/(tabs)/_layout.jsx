import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as NavigationBar from 'expo-navigation-bar';

import Header from '@/components/Header';

export default function TabLayout() {
  NavigationBar.setBackgroundColorAsync('white');

  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: '#2563eb', 
        tabBarButton: (props) => (
          <Pressable
            onPress={props.onPress}
            onLongPress={props.onLongPress}
            style={props.style}
            android_ripple={{color: 'transparent'}}
            pressRetentionOffset={0}
          >
            {props.children}
          </Pressable>
        ),
        header: Header,
        tabBarHideOnKeyboard: true,
     }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='home' color={color} />,
        }}
      />
      <Tabs.Screen
        name="grades"
        options={{
          title: 'Grades',
          tabBarIcon: ({ color }) => <Ionicons size={28} name='document-text-outline' color={color} />,
        }}
      />
      <Tabs.Screen
        name="gpa"
        options={{
          title: 'GPA',
          tabBarIcon: ({ color }) => <Ionicons size={28} name='stats-chart-outline' color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='cog' color={color} />,
        }}
      />
    </Tabs>
  );
}
