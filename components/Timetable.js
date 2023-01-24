import styles from "../styles/Timetable.module.css";

import { useState } from "react";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAtwXhr3zI4tR3KKlg9305K5zVrkekkMiA",
    authDomain: "bsis-space.firebaseapp.com",
    projectId: "bsis-space",
    storageBucket: "bsis-space.appspot.com",
    messagingSenderId: "649970236418",
    appId: "1:649970236418:web:f77dc789da6dac9c9e7b1b"
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

    if (today.getHours() >= 20) {
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        dd = tomorrow.getDate();
        mm = tomorrow.getMonth() + 1;
        yyyy = tomorrow.getFullYear();
        if (dd < 10) {
            dd = "0" + dd;
        }
        if (mm < 10) {
            mm = "0" + mm;
        }
        date = yyyy + "" + mm + "" + dd;
    }

    var mail = user.email;

    //generate API url
    var url =
        "https://open.neis.go.kr/hub/hisTimetable?KEY=3c07c8b644464b768a20bc4370a8e842&Type=json&ATPT_OFCDC_SC_CODE=C10&SD_SCHUL_CODE=7150532&ALL_TI_YMD=" +
        date +
        "&GRADE=" +
        mail.slice(2, 3) +
        "&CLASS_NM=" +
        mail.slice(5, 6);

    //API fetch
    fetch(url)
        .then((res) => res.json())
        .then((dt) => {
            if(dt.hisTimetable&&dt.hisTimetable[1].row){
                setData(dt.hisTimetable[1].row)
            }
        });

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
