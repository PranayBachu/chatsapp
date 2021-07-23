import React, { useState, useLayoutEffect, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { auth, firestore } from "../firebase-services";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator } from "react-native";

const ProfileScreen = () => {
	const [firstname, setFirstname] = useState(auth.currentUser.displayName);
	const [lastname, setLastname] = useState(auth.currentUser.displayName);
	const [email, setEmail] = useState(auth.currentUser.email);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const navigation = useNavigation();

	const fetchProfile = async () => {
		try {
			setIsLoading(true);
			const userDoc = await firestore
				.collection("users")
				.doc(auth.currentUser.uid)
				.get();
			if (userDoc.exists) {
				const user = userDoc.data();
				setFirstname(user?.firstname);
				setLastname(user?.lastname);
				setEmail(user?.email);
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	const updateUserProfile = async () => {
		try {
			setIsUpdating(true);
			await auth.currentUser.updateProfile({
				displayName: `${firstname} ${lastname}`,
			});
			await firestore.collection("users").doc(auth.currentUser.uid).update({
				firstname,
				lastname,
			});
			setIsUpdating(false);
			alert("Profile updated successfully!");
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

	useEffect(() => {
		fetchProfile();
	}, []);

	if (isLoading) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator />
			</View>
		);
	}
	return (
		<ScrollView behavior="padding" contentContainerStyle={styles.container}>
			<Text h1 style={{ marginBottom: 50 }}>
				Update Your Profile
			</Text>
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
				<Input placeholder="Email" disabled type="text" value={email} />
			</View>
			<Button
				title="Update"
				containerStyle={styles.button}
				onPress={updateUserProfile}
				loading={isUpdating}
			/>
			<View style={{ height: 100 }} />
		</ScrollView>
	);
};

export default ProfileScreen;

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
