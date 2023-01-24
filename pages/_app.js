import Head from "next/head";

import { Navbar, Dropdown, Avatar, Button } from "flowbite-react";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";

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

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const [user] = useAuthState(auth);

    const signInWithGoogle = () => {
        alert("학년, 반 정보 확인을 위해 학교 계정으로 로그인 해주세요");
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then((res) => {
            if (res.user.email.split("@")[1] != "bsis.hs.kr") {
                alert("학교 계정으로 로그인 해주세요");
                auth.signOut()
                    .then(() => {
                        console.log("로그아웃");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    };

    const signOut = () => {
        auth.signOut()
            .then(() => {
                console.log("로그아웃");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Head>
                <title>O-NEUL</title>
            </Head>
            <Navbar
                fluid={true}
                rounded={false}
                className="sticky top-0 z-50 border border-b border-gray-200"
            >
                <Navbar.Brand href="/">
                    <img
                        src="./solar-eclipse.png"
                        className="mr-2 h-6 sm:h-9"
                        alt="SPACE Logo"
                    />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        O-NEUL
                    </span>
                </Navbar.Brand>
                <div className="flex md:order-2 h-7 sm:h-9">
                    {user ? (
                        <>
                            <Dropdown
                                arrowIcon={false}
                                inline={true}
                                label={
                                    <Avatar
                                        alt="User settings"
                                        img={user.photoURL}
                                        rounded={true}
                                        status="online"
                                        statusPosition="bottom-right"
                                        className="profile"
                                    />
                                }
                            >
                                <Dropdown.Header>
                                    <span className="block text-sm">
                                        {user.displayName}
                                    </span>
                                    <span className="block truncate text-sm font-medium">
                                        {user.email}
                                    </span>
                                </Dropdown.Header>
                                <Dropdown.Item>글쓰기</Dropdown.Item>
                                <Dropdown.Item>계정 정보</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item>문의하기</Dropdown.Item>
                                <Dropdown.Item onClick={signOut}>로그아웃</Dropdown.Item>
                            </Dropdown>
                        </>
                    ) : (
                        <>
                            <Button className="login" onClick={signInWithGoogle}>로그인</Button>
                        </>
                    )}
                    <Navbar.Toggle className="toggle" />
                </div>
                <Navbar.Collapse>
                    <Navbar.Link href="/">홈</Navbar.Link>
                    <Navbar.Link href="/navbars">시간표</Navbar.Link>
                    <Navbar.Link href="/navbars">급식표</Navbar.Link>
                    <Navbar.Link href="/navbars">문의하기</Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
