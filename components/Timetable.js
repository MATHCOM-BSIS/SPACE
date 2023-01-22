import styles from "../styles/Timetable.module.css";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCWCbJZQYXHMA_6SxZtdRRJ_GKvtrDKvFQ",
    authDomain: "gwa-gall.firebaseapp.com",
    projectId: "gwa-gall",
    storageBucket: "gwa-gall.appspot.com",
    messagingSenderId: "248926173412",
    appId: "1:248926173412:web:51a0327557a40f052754f1",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const auth = firebase.auth();

export default function Timetable() {
    const [user] = useAuthState(auth);
    const [data, setData] = useState();

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = "0" + dd;
    }
    if (mm < 10) {
        mm = "0" + mm;
    }
    var date = yyyy + "" + mm + "" + dd;

    var mail = user.email;

    //API URL 생성
    var url =
        "https://open.neis.go.kr/hub/hisTimetable?KEY=3c07c8b644464b768a20bc4370a8e842&Type=json&ATPT_OFCDC_SC_CODE=C10&SD_SCHUL_CODE=7150532&ALL_TI_YMD=" +
        "20220303" +
        "&GRADE=" +
        mail.slice(2, 3) +
        "&CLASS_NM=" +
        mail.slice(5, 6);

    //서버 점검중이므로 임시로 오류 안나개 지워둠
    /*
    //API fetch
    fetch(url)
        .then((res) => res.json())
        .then((dt) => setData(dt.hisTimetable[1].row));
    */

    return (
        <div className={styles.timetable}>
            {data ? (
                <>
                    <p className={styles.timetable__title}>{`${mm}월 ${dd}일 시간표`}</p>
                    {data.map((item) => (
                        <p className={styles.timetable__item}>{`${item.PERIO}교시 - ${item.ITRT_CNTNT}`}</p>
                    ))}
                </>
            ) : (
                <>
                    <p className={styles.timetable__title}>{`${mm}월 ${dd}일 시간표`}</p>
                    <p className={styles.timetable__item}>해당 시간표 데이터가 없습니다</p>
                    <p className={styles.timetable__item}>NEIS에 문의해주세요</p>
                </>
            )}
        </div>
    );
}
