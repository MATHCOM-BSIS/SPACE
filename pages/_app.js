import Head from "next/head";
import Link from "next/link";

import { Navbar, Dropdown, Avatar, Button } from "flowbite-react";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";

import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());

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
                <Link href="/">
                    <Navbar.Brand>
                        <img
                            src="./solar-eclipse.png"
                            className="mr-2 h-6 sm:h-9"
                            alt="SPACE Logo"
                        />
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                            O-NEUL
                        </span>
                    </Navbar.Brand>
                </Link>
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
                                <Link href="/Write"><Dropdown.Item>글쓰기</Dropdown.Item></Link>
                                <Dropdown.Item>계정 정보</Dropdown.Item>
                                <Dropdown.Divider />
                                <Link href="mailto:2210220@bsis.hs.kr?subject=O-Neul 앱 관련 문의">
                                    <Dropdown.Item>문의하기</Dropdown.Item>
                                </Link>
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
                    <Link href="/"><Navbar.Link>홈</Navbar.Link></Link>
                    <Link href="/Write"><Navbar.Link href="/Write">글쓰기</Navbar.Link></Link>
                    <Navbar.Link href="#">시간표</Navbar.Link>
                    <Navbar.Link href="#">급식표</Navbar.Link>
                    <Navbar.Link href="mailto:2210220@bsis.hs.kr?subject=O-Neul 앱 관련 문의">문의하기</Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
