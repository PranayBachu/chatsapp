import React, { useState, useLayoutEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { auth, firebase } from "../firebase-services";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";

const SettingsScreen = () => {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const navigation = useNavigation();

	const logout = async () => {
		try {
			setIsLoggingOut(true);
			await auth.signOut();
		} catch (error) {
			console.log(error);
			setIsLoggingOut(false);
		}
	};

	const updatePassword = async () => {
		try {
			setIsUpdating(true);
			const cred = firebase.auth.EmailAuthProvider.credential(
				auth.currentUser.email,
				oldPassword
			);
			await auth.currentUser.reauthenticateWithCredential(cred);
			await auth.currentUser.updatePassword(newPassword);
			setIsUpdating(false);
			setOldPassword("");
			setNewPassword("");
			alert("Password Updated Successfully");
		} catch (error) {
			alert(error);
			setIsUpdating(false);
		}
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<View style={{ marginLeft: 20 }}>
					<Feather
						style={{ fontSize: 20 }}
						name="menu"
						onPress={() => {
							navigation.openDrawer();
						}}
					/>
				</View>
			),
		});
	}, [navigation]);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text h1 style={{ marginBottom: 50 }}>
				Change Password
			</Text>
			<View style={styles.inputContainer}>
				<Input
					placeholder="Old Password"
					secureTextEntry
					type="text"
					value={oldPassword}
					onChangeText={setOldPassword}
				/>
				<Input
					placeholder="New Password"
					type="text"
					secureTextEntry
					value={newPassword}
					onChangeText={setNewPassword}
				/>
			</View>
			<Button
				//raised
				title="Change Password"
				containerStyle={styles.button}
				onPress={updatePassword}
				loading={isUpdating}
				disabled={oldPassword === "" || newPassword === ""}
			/>
			<Button
				//raised
				title="Logout"
				buttonStyle={{ backgroundColor: "red" }}
				containerStyle={styles.button}
				onPress={logout}
				loading={isLoggingOut}
			/>
			<View style={{ height: 100 }} />
		</ScrollView>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		padding: 10,
		paddingTop: 30,
		backgroundColor: "white",
	},
	button: {
		width: 200,
		marginTop: 10,
	},
	inputContainer: {
		width: 300,
	},
});
