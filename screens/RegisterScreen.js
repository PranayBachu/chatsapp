import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { auth, firestore } from "../firebase-services";

const logo = require("../assets/logo.png");
const { height } = Dimensions.get("window");

const RegisterScreen = () => {
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isRegistering, setIsRegistering] = useState(false);

	const handleRegister = async () => {
		try {
			setIsRegistering(true);
			const { user } = await auth.createUserWithEmailAndPassword(
				email,
				password
			);

			await user.updateProfile({
				displayName: `${firstname} ${lastname}`,
				photoURL: `https://via.placeholder.com/150x150.png/?text=${firstname.slice(
					0,
					1
				)}`,
			});

			await firestore
				.collection("users")
				.doc(user.uid)
				.set({
					firstname,
					lastname,
					role: "customer",
					email: user.email,
					photoURL: `https://via.placeholder.com/150x150.png/?text=${firstname.slice(
						0,
						1
					)}`,
					createdAt: Date.now(),
				});
		} catch (error) {
			alert(error.message);
			setIsRegistering(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Image source={logo} style={{ width: 200, height: 100 }} />
			<View style={styles.inputContainer}>
				<Input
					placeholder="First Name"
					autoFocus
					type="text"
					value={firstname}
					onChangeText={setFirstname}
				/>
				<Input
					placeholder="Last Name"
					type="text"
					value={lastname}
					onChangeText={setLastname}
				/>
				<Input
					placeholder="Email"
					type="email"
					value={email}
					onChangeText={setEmail}
				/>
				<Input
					placeholder="Password"
					type="password"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
				/>
			</View>
			<Button
				raised
				title="Sign Up"
				containerStyle={styles.button}
				onPress={handleRegister}
				loading={isRegistering}
			/>
			<View style={{ height: 100 }} />
		</ScrollView>
	);
};

export default RegisterScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		backgroundColor: "white",
		height,
	},
	button: {
		width: 200,
		marginTop: 10,
	},
	inputContainer: {
		width: 300,
		marginTop: 30,
	},
});
