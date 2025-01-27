import React, { useContext, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../Home/Home';
import Login from '../User/Login';
import Search from '../Home/Search';
import UserProfile from '../User/UserProfile';
import styles from './DefaultStyles';
import Colors from '../../colors/Colors';
import { MyUserContext } from '../../configs/UserContexts';

const Tab = createBottomTabNavigator();

// Custom Button cho từng tab
const TabButton = ({ item, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({ 0: { scale: 0.5, rotate: '0deg' }, 1: { scale: 1.2, rotate: '360deg' } });
    } else {
      viewRef.current.animate({ 0: { scale: 1.2, rotate: '360deg' }, 1: { scale: 1, rotate: '0deg' } });
    }
  }, [focused]);

  const IconComponent = item.type === 'Ionicons' ? Icon : MaterialCommunityIcons;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.tabButtonContainer}
    >
      <Animatable.View ref={viewRef} duration={1000}>
        <IconComponent
          name={focused ? item.activeIcon : item.inActiveIcon}
          size={28}
          color={focused ? Colors.primary : Colors.primaryLite}
        />
      </Animatable.View>
    </TouchableOpacity>
  );
};

// Main Component
export default function Default() {
  const { user } = useContext(MyUserContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        {/* Các Tab khác */}
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarButton: (props) => <TabButton {...props} item={{ route: 'Home', type: 'Ionicons', activeIcon: 'home', inActiveIcon: 'home-outline' }} />,
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarButton: (props) => <TabButton {...props} item={{ route: 'Search', type: 'Ionicons', activeIcon: 'search', inActiveIcon: 'search-sharp' }} />,
          }}
        />
        <Tab.Screen
          name="Login"
          component={user === null ? Login : UserProfile}
          options={{
            tabBarButton: (props) => <TabButton {...props} item={{ route: 'Login', type: 'MaterialCommunityIcons', activeIcon: 'account', inActiveIcon: 'account-outline' }} />,
          }}
        />
        
      </Tab.Navigator>
    </SafeAreaView>
  );
}


