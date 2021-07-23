import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth, firestore } from "../firebase-services";

const AddChatScreen = ({ navigation }) => {
	const [input, setInput] = useState("");
	const [isCreatingChat, setIsCreatingChat] = useState(false);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Add a new Chat",
			headerBackTitle: "Chats",
		});
	}, [navigation]);

	const handleCreateChat = async () => {
		if (input.length > 10) {
			alert("Chat name can't be longer than 10 characters!");
			return;
		}
		try {
			setIsCreatingChat(true);
			await firestore
				.collection("chats")
				.add({
					chatName: input,
					participants: [auth.currentUser.uid],
				})
				.then(() => {
					navigation.goBack();
				})
				.catch((error) => alert(error));
		} catch (error) {
			console.log(error);
		} finally {
			setIsCreatingChat(false);
		}
	};

	return (
		<View style={styles.container}>
			<Input
				placeholder="Enter a chat name"
				value={input}
				onChangeText={(text) => setInput(text)}
				leftIcon={
					<Icon name="search" type="antdesign" size={24} color="black" />
				}
				onSubmitEditing={handleCreateChat}
			/>
			<Button
				disabled={!input}
				onPress={handleCreateChat}
				title="Create new chat"
				loading={isCreatingChat}
			/>
		</View>
	);
};

export default AddChatScreen;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 30,
		height: "100%",
	},
});
