import Post from "../components/Post";
import Timetable from "../components/Timetable";

import styles from "../styles/Home.module.css";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { FieldValue, Query } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAtwXhr3zI4tR3KKlg9305K5zVrkekkMiA",
    authDomain: "bsis-space.firebaseapp.com",
    projectId: "bsis-space",
    storageBucket: "bsis-space.appspot.com",
    messagingSenderId: "649970236418",
    appId: "1:649970236418:web:f77dc789da6dac9c9e7b1b",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}
const auth = firebase.auth();
const firestore = firebase.firestore();

function SignIn() {
    const signInWithGoogle = () => {
        alert("학년, 반 정보 확인을 위해 학교 계정으로 로그인 해주세요");
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then((res) => {
            if (res.user.email.split("@")[1] != "bsis.hs.kr") {
                alert("학교 계정으로 로그인 해주세요");
                auth.signOut()
                    .then(() => {
                        console.log("logged out");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    };
    return <button className={styles.signIn} onClick={signInWithGoogle}>Sign In with Google</button>;
}

function PostList() {
    const Ref = firestore.collection("messages");
    const query = Ref.orderBy("createdAt", "desc");
    const [posts, loading, error] = useCollection(query, { idField: "id" });
    return (
        <div className={styles.pstList}>
            {posts && posts.docs.map((pst) => <Post key={pst.id} post={pst.data()} postid={pst.id} />)}
        </div>
    );
}

function EctList() {
    return (
        <div className={styles.ectList}>
            <Timetable/>
        </div>
    );
}

export default function Home() {
    const [user] = useAuthState(auth);
    return (
        <div className={styles.app}>
            <div className={styles.container}>
                {user ? (
                    <>
                        <PostList />
                        <EctList />
                    </>
                ) : (
                    <SignIn />
                )}
            </div>
        </div>
    );
}
