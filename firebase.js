import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyCUf-ws_B293Wqbp24qEJeFTlGWH1Hio9A",
	authDomain: "messageboard-1445d.firebaseapp.com",
	projectId: "messageboard-1445d",
	storageBucket: "messageboard-1445d.appspot.com",
	messagingSenderId: "1007027506928",
	appId: "1:1007027506928:web:524b6cfcd962e912d63c35",
	measurementId: "G-9L4P1MEXS4",
};

firebase.initializeApp(firebaseConfig);
