// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore,
} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAZZwUma3slm5kjWoM_9MiMhWVcGGmSjkM",
    authDomain: "rcdlink.firebaseapp.com",
    projectId: "rcdlink",
    storageBucket: "rcdlink.appspot.com",
    messagingSenderId: "597432915507",
    appId: "1:597432915507:web:c9c9e8556df182092b3546",
    measurementId: "G-4LD51X7NDL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const storage = getStorage();

export const newLink = (data) => {
    return new Promise(async (resolve, reject) => {
        // Add a new document with a generated id.
        let addNewData;
        try {
            addNewData = await addDoc(collection(db, "links"), data);
        } catch (error) {
            reject(error);
        }

        console.log(addNewData.id);

        resolve(addNewData.id);
    });
};

export const getLink = (id) => {
    return new Promise(async (resolve, reject) => {
        // Add a new document with a generated id.
        let linkInfo;
        try {
            linkInfo = await await getDoc(doc(db, "links", id));
        } catch (error) {
            reject(error);
        }

        console.log(linkInfo.data());

        resolve(linkInfo.data());
    });
};
