import React, { useState, useEffect } from "react";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AppDrawer from "./drawer";
import ChatScreen from "../screens/ChatScreen";
import { LoadingScreen } from "../screens/LoadingScreen";
import { auth } from "../firebase-services";

const Stack = createStackNavigator();

const AppStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				options={{ headerShown: false }}
				name="Message Boards"
				component={AppDrawer}
			/>
			<Stack.Screen name="Chat" component={ChatScreen} />
		</Stack.Navigator>
	);
};

const AuthStack = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: "#2C6BED" },
				headerTitleStyle: { color: "white" },
				headerTintColor: "white",
			}}
		>
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Register" component={RegisterScreen} />
		</Stack.Navigator>
	);
};

export const AppNavigator = () => {
	const [isAuthLoading, setIsAuthLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
			setIsAuthLoading(false);
		});

		return unsubscribe;
	}, []);

	if (isAuthLoading) {
		return <LoadingScreen />;
	} else {
		return (
			<NavigationContainer>
				{isLoggedIn ? <AppStack /> : <AuthStack />}
			</NavigationContainer>
		);
	}
};
