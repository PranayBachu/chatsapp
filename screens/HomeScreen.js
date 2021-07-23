import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";

import CustomListItem from "../components/CustomListItem";
import Feather from "@expo/vector-icons/Feather";
import { firestore } from "../firebase-services";

const HomeScreen = ({ navigation }) => {
	const [boards, setBoards] = useState([]);

	const getBoards = async () => {
		try {
			const boardsDocs = await firestore.collection("boards").get();
			setBoards([
				...boardsDocs.docs.map((doc) => {
					return {
						...doc.data(),
						id: doc.id,
					};
				}),
			]);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getBoards();
	}, []);

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

	const enterChat = (id, name, icon) => {
		navigation.navigate("Chat", {
			id,
			name,
			icon,
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				{boards.map(({ id, name, icon }) => (
					<CustomListItem
						key={id}
						id={id}
						name={name}
						icon={icon}
						enterChat={enterChat}
					/>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "black",
	},
	headerRight: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: 80,
		marginRight: 20,
	},

	container: {
		height: "100%",
	},
});
