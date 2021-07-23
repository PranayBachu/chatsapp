import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { auth, firebase, firestore } from "../firebase-services";
import * as Facebook from "expo-facebook";

const logo = require("../assets/logo.png");

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoginLoading, setIsLoginLoading] = useState(false);
	const [isFbLoading, setIsFbLoading] = useState(false);

	const handleSignIn = async () => {
		try {
			setIsLoginLoading(true);
			await auth.signInWithEmailAndPassword(email, password);
		} catch (error) {
			alert(error);
			setIsLoginLoading(false);
		}
	};

	const facebookLogin = async () => {
		try {
			setIsFbLoading(true);
			await Facebook.initializeAsync({
				appId: "508367063579550",
			});
			const { type, token, permissions } =
				await Facebook.logInWithReadPermissionsAsync({
					permissions: ["public_profile"],
				});
			const credentials = firebase.auth.FacebookAuthProvider.credential(token);
			const { user } = await auth.signInWithCredential(credentials);
			const userDoc = await firestore.collection("users").doc(user.uid).get();
			if (!userDoc.exists) {
				await firestore
					.collection("users")
					.doc(user.uid)
					.set({
						firstname: user.displayName.split(" ")[0],
						lastname: user.displayName.split(" ")[1],
						role: "customer",
						email: user.email,
						photoURL: user.photoURL
							? user.photoURL
							: `https://via.placeholder.com/150x150.png/?text=${firstname.slice(
									0,
									1
							  )}`,
						createdAt: Date.now(),
					});
			}
		} catch (error) {
			console.log(error);
			setIsFbLoading(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Image source={logo} style={{ width: 300, height: 200 }} />
			<View style={styles.inputContainer}>
				<Input
					placeholder="Email"
					//autoFocus
					type="email"
					value={email}
					onChangeText={setEmail}
				/>
				<Input
					placeholder="Password"
					secureTextEntry
					type="password"
					value={password}
					onChangeText={setPassword}
					onSubmitEditing={handleSignIn}
				/>
			</View>
			<Button
				loading={isLoginLoading}
				containerStyle={styles.button}
				onPress={handleSignIn}
				title="Login"
			/>
			<Button
				backgroundColor="#ff0000"
				containerStyle={styles.button}
				loading={isFbLoading}
				onPress={facebookLogin}
				title="Facebook Login"
				type="solid"
			/>
			<Button
				containerStyle={styles.button}
				onPress={() => navigation.navigate("Register")}
				title="Sign Up"
				type="outline"
			/>
		</ScrollView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		backgroundColor: "white",
		//height,
		paddingTop: 0,
	},
	inputContainer: {
		width: 300,
	},
	button: {
		marginTop: 10,
		width: 200,
	},
});
