import styles from '../styles/Post.module.css'
import Image from 'next/image';
import Link from 'next/link';

export default function Post(props) {
    const { title, text, createdAt, wroteby, originalImg } = props.post;
    const id = props.postid;

    const koDtf = new Intl.DateTimeFormat('ko-KR', { dateStyle: "long" });
    const uploadDate = koDtf.format(createdAt.toDate())

    return (
        <div className={styles.post}>
            <div className={styles.post__title}>
                <Link style={{textDecoration : 'none', color:'#000'}} href={{ pathname: '/viewer', query: { docid : id } }}>                <p className={styles.post__title__title}>{title.substring(0, 20) + (title.length > 20 ? "..." : "")}</p></Link>
                {originalImg ? <Image className={styles.post__title__image} src="/img/images-outline.svg" width="18" height="18" alt="Post with a photo"/> : <></>}
                <p className={styles.post__title__user}>{wroteby.slice(0, 8)}</p>
            </div>
            <p className={styles.post__text}>{text.substring(0, 70) + (text.length > 70 ? "..." : "")}</p>
            <p className={styles.post__time}>{uploadDate + " - " + ("0"+createdAt.toDate().getHours()).slice(-2) + "시 " + createdAt.toDate().getMinutes() + "분"}</p>
        </div>
    )
}