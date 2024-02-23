/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import Library from '../screens/Library';
import Discover from '../screens/Discover';
import Menu from '../screens/Menu';
import {Icon} from 'react-native-paper';

const Tab = createMaterialBottomTabNavigator();

const HomeTabsNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          tabBarIcon(props) {
            return (
              <Icon
                {...props}
                size={20}
                source={
                  props.focused
                    ? 'bookmark-box-multiple'
                    : 'bookmark-box-multiple-outline'
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          tabBarIcon(props) {
            return (
              <Icon
                {...props}
                size={20}
                source={props.focused ? 'compass' : 'compass-outline'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarIcon(props) {
            return <Icon {...props} size={20} source="dots-horizontal" />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabsNavigator;
