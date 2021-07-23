import "react-native-gesture-handler";
import "./firebase";

import React from "react";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./stack";

const App = () => {
	return (
		<React.Fragment>
			<StatusBar />
			<AppNavigator />
		</React.Fragment>
	);
};

export default App;
