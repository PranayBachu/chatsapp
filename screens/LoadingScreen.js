import React from "react";
import { View, Image, ActivityIndicator } from "react-native";

const logo = require("../assets/icon.png");

export const LoadingScreen = () => {
	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<Image source={logo} style={{ width: 200, height: 200 }} />
			<ActivityIndicator style={{ marginTop: 10 }} />
		</View>
	);
};
