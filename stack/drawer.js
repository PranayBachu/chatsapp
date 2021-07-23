import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MessageBoardStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Message Boards" component={HomeScreen} />
		</Stack.Navigator>
	);
};

const ProfileStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Profile" component={ProfileScreen} />
		</Stack.Navigator>
	);
};

const SettingStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Settings" component={SettingsScreen} />
		</Stack.Navigator>
	);
};

const AppDrawer = () => {
	return (
		<Drawer.Navigator>
			<Drawer.Screen name="Message Boards" component={MessageBoardStack} />
			<Drawer.Screen name="Profile" component={ProfileStack} />
			<Drawer.Screen name="Settings" component={SettingStack} />
		</Drawer.Navigator>
	);
};

export default AppDrawer;
