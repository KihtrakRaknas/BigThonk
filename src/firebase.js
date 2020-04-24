import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyBHgeNNvgO_HbYJ6NWNnVs8Y8Xbg0Xealw",
    authDomain: "big-thonk.firebaseapp.com",
    databaseURL: "https://big-thonk.firebaseio.com",
    projectId: "big-thonk",
    storageBucket: "big-thonk.appspot.com",
    messagingSenderId: "199147602141",
    appId: "1:199147602141:web:e1a0ff1fdf473a66ab5b34"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
export default firebase;