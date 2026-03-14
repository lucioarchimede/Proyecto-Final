import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import Home from '../screens/Home';
import NewPost from '../screens/NewPost';
import Profile from '../screens/Profile';
import Search from "../screens/Search"
const Tab = createBottomTabNavigator();

class TabNav extends Component {
    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen
                    options={{ headerShown: false, tabBarIcon: () => <FontAwesome name="newspaper-o" size={24} color="black" /> }}
                    name='Home' component={Home} />
                <Tab.Screen
                    options={{ headerShown: false }}
                    name='new-post' component={NewPost} />
                <Tab.Screen
                    options={{ headerShown: false }}
                    name='profile' component={Profile} />

                <Tab.Screen
                    options={{ headerShown: false }}
                    name='search' component={Search} />
                
            </Tab.Navigator>
        );
    }
}

export default TabNav;
