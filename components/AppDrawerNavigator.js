import React, { Component} from 'react';
import { Settings } from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';
import MyDonationScreen from '../screens/MyDonationScreen';
import SettingScreen from '../screens/SettingScreen';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import NotificationScreen from '../screens/NotificationScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {screen: AppTabNavigator},
    Settings: {screen: SettingScreen},
    MyDonations: {screen: MyDonationScreen},
    MyNotifications: {screen: NotificationScreen}
},
{contentComponent: CustomSideBarMenu},
{initialRouteName: 'Home'})
