
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAcFIgicEQU6bfzypjQO8GWqymph1_hPCw",
  authDomain: "fir-practice-4a68c.firebaseapp.com",
  projectId: "fir-practice-4a68c",
  storageBucket: "fir-practice-4a68c.appspot.com",
  messagingSenderId: "44187873996",
  appId: "1:44187873996:web:f5bd0b5833ef48bf018869"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);