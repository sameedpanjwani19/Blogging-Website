import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
  addDoc,
  collection,
  getDocs,
  getDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBhYLYqVlYrHxwsSH8sJd4CTwp69XjPzr8",
  authDomain: "blogging-website-6f36f.firebaseapp.com",
  projectId: "blogging-website-6f36f",
  storageBucket: "blogging-website-6f36f.appspot.com",
  messagingSenderId: "696432200226",
  appId: "1:696432200226:web:5ad72b52b464525000987b",
  measurementId: "G-XY6K3JYWEF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);



function signInFirebase(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

async function signUpFirebase(userInfo) {
  const { email, password } = userInfo;

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await addUserToDb(userInfo, userCredential.user.uid);
}
function addUserToDb(userInfo, uid) {
  const { email, fullName, age } = userInfo;

  return setDoc(doc(db, "users", uid), { email, fullName, age });
}

function postBlogToDb(title,description, imageUrl,) {
  const userId = auth.currentUser.uid;
  return addDoc(collection(db, "Blogs"), { title,description, imageUrl, createdAt: new Date(), userId });
}

async function uploadImage(image) {
  const storageRef = ref(storage, `image/${image.name}`);
  const snapshot = await uploadBytes(storageRef, image);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}
async function getBlogsFromDb() {
  const querySnapshot = await getDocs(collection(db, "Blogs"));
  const ads = [];
  querySnapshot.forEach((doc) => {
    ads.push({ id: doc.id, ...doc.data() });
  });
  return ads;
}
function getFirebaseAd(id) {
  const docRef = doc(db, "Blogs", id);
  return getDoc(docRef);
}

function getRealTimeBlogs(callback) {
  onSnapshot(collection(db, "Blogs"), (querySnapshot) => {
    const blogs = [];

    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    callback(blogs);
  });
}
export {
  signInFirebase,
  signUpFirebase,
  postBlogToDb,
  uploadImage,
  getBlogsFromDb,
  getRealTimeBlogs,
  getFirebaseAd,
};
