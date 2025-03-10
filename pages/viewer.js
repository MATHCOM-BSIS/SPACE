import styles from "../styles/Viewer.module.css";

import Image from "next/image";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { FieldValue, Query } from "firebase/firestore";
import { useRouter } from "next/router";

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

export default function Viewer() {
    const router = useRouter();

    const Document = firestore.collection("messages").doc(router.query.docid);
    const [post, loading, error] = useDocument(Document);

    const koDtf = new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" });

    return (
        <div className={styles.app}>
            <div className={styles.viewer}>
                <p className={styles.viewer__title}>{post && post.data().title}</p>
                {post && !error && post.data().originalImg ? (
                    <div className={styles.viewer__wrapper}>
                        <Image
                            className={styles.viewer__wrapper__image}
                            alt="image"
                            placeholder="blur"
                            blurDataURL={post && `/_next/image?url=${post.data().compreesedImg}&w=16&q=1`}
                            src={post && post.data().originalImg}
                            fill
                        />
                    </div>
                ) : (
                    <></>
                )}
                <p className={styles.viewer__text}>{post && post.data().text}</p>
                <p className={styles.viewer__date}>
                    {post &&
                        koDtf.format(post.data().createdAt.toDate()) +
                            " - " +
                            (
                                "0" + post.data().createdAt.toDate().getHours()
                            ).slice(-2) +
                            "시 " +
                            post.data().createdAt.toDate().getMinutes() +
                            "분"}
                </p>
            </div>
        </div>
    );
}
