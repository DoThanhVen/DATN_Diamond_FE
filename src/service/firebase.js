import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signOut
} from "firebase/auth";
import {
    getFirestore,

} from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyC8oz_65d_ngwSXljGFFjboeSKBWMcaffc",
    authDomain: "server-7c9d4.firebaseapp.com",
    projectId: "server-7c9d4",
    storageBucket: "server-7c9d4.appspot.com",
    messagingSenderId: "413083861036",
    appId: "1:413083861036:web:41618521fc3ef0cfea9189",
    measurementId: "G-NKS64L39KM"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    return res;
};

const uploadImageToFirebaseStorage = async (file) => {
    try {
        const storageRef = ref(storage, 'images/' + file.name);
        const snapshot = await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image: ", error);
        throw error;
    }
};
const deleteImageFromFirebaseStorage = async (imagePath) => {
    try {
        const pathSegments = imagePath.split('/o/');
        const encodedPath = pathSegments[1].split('?')[0];
        const decodedPath = decodeURIComponent(encodedPath);
        const imageRef = ref(storage, decodedPath);
        await deleteObject(imageRef);
        console.log("Image deleted successfully!");
    } catch (error) {
        console.error("Error deleting image: ", error);
        throw error;
    }
};


const logout = () => {
    signOut(auth);
};
export {
    auth,
    db,
    storage,
    signInWithGoogle,
    logout, uploadImageToFirebaseStorage,deleteImageFromFirebaseStorage
};