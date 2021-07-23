import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	SafeAreaView,
	ScrollView,
	TextInput,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { auth, firestore } from "../firebase-services";
import moment from "moment";
import { useRoute, useNavigation } from "@react-navigation/native";

const ChatScreen = () => {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	//const [isSendingMessage, setIsSendingMessage] = useState(false);

	const scrollViewRef = useRef();
	const route = useRoute();
	const navigation = useNavigation();

	const { name, icon, id } = route.params;

	useLayoutEffect(() => {
		navigation.setOptions({
			title: name,
			headerLeft: () => (
				<View style={styles.headerTitle}>
					<Ionicons
						onPress={() => navigation.goBack()}
						name="chevron-back-sharp"
						style={{ fontSize: 25, paddingLeft: 5 }}
					/>
					<Avatar
						rounded
						source={{
							uri: icon,
						}}
					/>
				</View>
			),
		});
	}, [navigation]);

	const handleSendMessage = async () => {
		try {
			await firestore
				.collection("boards")
				.doc(id)
				.collection("messages")
				.add({
					timestamp: Date.now(),
					text: message,
					sender: {
						name: auth.currentUser.displayName,
						uid: auth.currentUser.uid,
						photoURL: auth.currentUser.photoURL,
					},
				});
			setMessage("");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const unsubscribe = firestore
			.collection("boards")
			.doc(id)
			.collection("messages")
			.orderBy("timestamp", "asc")
			.onSnapshot((snapshot) => {
				setMessages(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
				);
			});

		return unsubscribe;
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<>
					<ScrollView
						contentContainerStyle={{ paddingTop: 15 }}
						scrollsToTop="false"
						ref={scrollViewRef}
						onContentSizeChange={() =>
							scrollViewRef.current.scrollToEnd({ animated: false })
						}
					>
						{messages.map(({ id, sender, text, timestamp }) =>
							sender?.uid === auth.currentUser.uid ? (
								<View key={id} style={styles.myMessage}>
									<Avatar
										rounded
										right={-5}
										bottom={-15}
										size={30}
										position="absolute"
									/>
									<Text style={styles.myMessageText}>{text}</Text>
									<Text
										style={[
											styles.recievedMessageName,
											{ color: "white", marginTop: 10 },
										]}
									>
										{moment(timestamp).format("ddd HH:mm")}
									</Text>
								</View>
							) : (
								<View key={id} style={styles.recievedMessage}>
									<Avatar
										rounded
										size={30}
										rounded
										left={-35}
										bottom={0}
										size={30}
										position="absolute"
										source={{ uri: sender?.photoURL }}
									/>
									<Text style={styles.recievedMessageText}>{text}</Text>
									<Text style={styles.recievedMessageName}>{sender?.name}</Text>

									<Text style={styles.recievedMessageName}>
										{moment(timestamp).format("ddd HH:mm")}
									</Text>
								</View>
							)
						)}
					</ScrollView>
					<View style={styles.footer}>
						<TextInput
							placeholder="Type Here"
							value={message}
							onChangeText={setMessage}
							style={styles.textInput}
							onSubmitEditing={handleSendMessage}
						/>
						<TouchableOpacity onPress={handleSendMessage} activeOpacity={0.5}>
							<Ionicons name="send" size={24} color="#2B68E6" />
						</TouchableOpacity>
					</View>
				</>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default ChatScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	chatContainer: {
		flex: 1,
	},

	footer: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		padding: 15,
	},
	textInput: {
		bottom: 0,
		height: 40,
		flex: 1,
		marginRight: 15,
		backgroundColor: "#ECECEC",
		padding: 10,
		color: "grey",
		borderRadius: 30,
	},
	recievedMessage: {
		padding: 15,
		backgroundColor: "#ECECEC",
		alignSelf: "flex-start",
		borderRadius: 20,
		marginLeft: 40,
		marginBottom: 20,
		maxWidth: "80%",
		position: "relative",
	},
	myMessage: {
		padding: 15,
		backgroundColor: "#2B68E6",
		alignSelf: "flex-end",
		borderRadius: 20,
		margin: 15,
		maxWidth: "80%",
		position: "relative",
	},
	recievedMessageText: {
		color: "black",
		fontWeight: "500",
		marginLeft: 10,
		marginBottom: 15,
	},
	myMessageText: {
		color: "white",
		fontWeight: "500",
		marginLeft: 10,
	},
	recievedMessageName: {
		left: 10,
		color: "black",
		fontSize: 12,
		paddingRight: 10,
	},
	headerTitle: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerText: {
		color: "white",
		marginLeft: 10,
		fontWeight: "700",
	},
	headerRight: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: 75,
		marginRight: 20,
	},
});
