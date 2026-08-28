import styles from "./HoloCard.module.css";

export default function HoloCard({ title, children }) {
  return (
    <div className={styles.card}>
      <div className={styles.glow}></div>

      <div className={styles.innerBorder}></div>

      <div className={styles.content}>
        <div className={styles.title}>
          {title}
        </div>

        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
}