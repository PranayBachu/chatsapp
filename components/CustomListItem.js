import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { firestore } from "../firebase-services";

const CustomListItem = ({ id, name, enterChat, icon }) => {
	const [chatMessages, setChatMessages] = useState([]);
	useEffect(() => {
		const unsubscribe = firestore
			.collection("boards")
			.doc(id)
			.collection("messages")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) => {
				setChatMessages(snapshot.docs.map((doc) => doc.data()));
			});

		return unsubscribe;
	}, []);

	return (
		<ListItem onPress={() => enterChat(id, name, icon)} key={id} bottomDivider>
			<Avatar
				rounded
				source={{
					uri: icon,
				}}
			/>
			<ListItem.Content>
				<ListItem.Title style={{ fontWeight: "800" }}>{name}</ListItem.Title>

				<ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
					{chatMessages?.[0]?.text}
				</ListItem.Subtitle>
			</ListItem.Content>
		</ListItem>
	);
};

export default CustomListItem;
