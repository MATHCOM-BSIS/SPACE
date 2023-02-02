import styles from "../styles/Write.module.css";

import { useRouter } from "next/router";
import { useState } from "react";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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
const storage = getStorage();

export default function Write() {
    const [titleValue, setTitleValue] = useState("");
    const [textValue, setTextValue] = useState("");
    const router = useRouter();
    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;
        var file = document.forms["form"]["file"].files[0];

        const Ref = firestore.collection("messages");

        if (file) {
            const blobURL = window.URL.createObjectURL(file);
            const img = new Image();
            img.src = blobURL;
            img.onerror = function () {
                URL.revokeObjectURL(this.src);
                console.log("Cannot load imgae");
            };
            img.onload = function () {
                URL.revokeObjectURL(this.src);
                const [newWidth, newHeight] = calculateSize(img, 75, 45);
                const canvas = document.createElement("canvas");
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                canvas.toBlob((blob) => {
                    const originalRef = ref(
                        storage,
                        Math.random().toString(36).substring(2, 12)
                    );
                    const compressedRef = ref(
                        storage,
                        Math.random().toString(36).substring(2, 12)
                    );
                    uploadBytes(originalRef, file).then(() => {
                        console.log("Uploaded a original file!");
                        uploadBytes(compressedRef, blob).then(() => {
                            console.log("Uploaded a Compressed file!");
                            getDownloadURL(originalRef).then((originalUrl) => {
                                getDownloadURL(compressedRef).then(
                                    (compreesedUrl) => {
                                        Ref.add({
                                            title: titleValue,
                                            text: textValue,
                                            createdAt:
                                                firebase.firestore.FieldValue.serverTimestamp(),
                                            wroteby: uid,
                                            pic: photoURL,
                                            originalImg: originalUrl,
                                            compreesedImg: compreesedUrl,
                                        }).then(() => {
                                            setTitleValue("");
                                            setTextValue("");
                                            router.push("/");
                                        });
                                    }
                                );
                            });
                        });
                    });
                }, 0.9999);
            };

            function calculateSize(img, maxWidth, maxHeight) {
                let width = img.width;
                let height = img.height;

                // calculate the width and height, constraining the proportions
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }
                return [width, height];
            }
        } else {
            Ref.add({
                title: titleValue,
                text: textValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                wroteby: uid,
                pic: photoURL,
            }).then(() => {
                setTitleValue("");
                setTextValue("");
                router.push("/", );
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.title}>
                    <p>글쓰기 ✍🏻</p>
                </div>
                <form className={styles.form} name="form" onSubmit={sendMessage}>
                    <input
                        className={styles.form__title}
                        value={titleValue}
                        onChange={(e) => setTitleValue(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />
                    <textarea
                        className={styles.form__text}
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        placeholder={`여기에 글을 쓰고 아래의 버튼을 눌러 글을 업로드 하세요! \n
[게시판 규칙 및 주의사항]\n
- 이 게시판은 실명을 밝히지 않는 ‘익명' 게시판 입니다.\n
- 프로필 사진은 공개되니 주의해 주세요\n
- 상대방을 지나치게 비방하는 내용의 작성은 자제해 주십시오.\n
- 법적으로 문제되는 일이 발생한 경우 실명 확인을 할 수 있습니다. \n
                        `}
                    />
                    <div className={styles.buttons}>
                        <label className={styles.buttons__file} id="File-Lablel" htmlFor="File-For">
                                사진 추가
                        </label>
                        <input style={{display: 'none'}} id="File-For" type="file" name="file" accept="image/png, image/jpeg, image/gif"></input>
                        <button className={styles.buttons__upload} type="submit" disabled={!titleValue || !textValue}>
                            업로드
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
