import styles from "../styles/Meal.module.css";

import { useState } from "react";

export default function Meal() {
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
    var hour = today.getHours();

    if (hour <= 8){
        var meal_now=0;
        var meal_now_txt=mm + "월 " + dd + "일 조식";
    }
    if (8 <= hour && hour <= 13){
        var meal_now=1;
        var meal_now_txt=mm + "월 " + dd + "일 점심";
    }
    if (13 <= hour && hour <= 20){
        var meal_now=2;
        var meal_now_txt = mm + "월 " + dd + "일 석식";
    }
    if (hour >= 20) {
        console.log("tomorrow");
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
        var meal_now=0;
        var meal_now_txt=mm + "월 " + dd + "일 조식";
    }

    //generate API url
    const API_KEY = "8dd95958b0d741cea4fa73b1866337f0";
    const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=C10&SD_SCHUL_CODE=7150532&MLSV_YMD=${date}}`;

    fetch(url)
        .then((res) => res.json())
        .then((dt) => {
            if(dt.mealServiceDietInfo&&dt.mealServiceDietInfo[1].row[meal_now]) {
                setData(
                    dt.mealServiceDietInfo[1].row[meal_now].DDISH_NM.replace(
                        /<br\s*[\/]?>/gi,
                        "\n"
                    )
                        .replace(/"/gi, "")
                        .split("\n")
                );
            }
        });

    return (
        <div className={styles.meal}>
            {typeof data != "undefined" ? (
                <>
                    <p className={styles.meal__title}>{meal_now_txt}</p>
                    {data.map((item) => (
                        <p className={styles.meal__item}>{item}</p>
                    ))}
                </>
            ) : (
                <>
                    <p className={styles.meal__title}>{meal_now_txt}</p>
                    <p className={styles.meal__item}>
                        해당 급식 데이터가 없습니다.
                    </p>
                    <p className={styles.meal__item}>NEIS에 문의해주세요.</p>
                </>
            )}
        </div>
    );
}
