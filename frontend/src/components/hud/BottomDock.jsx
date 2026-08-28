import styles from "./BottomDock.module.css";

export default function BottomDock() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.dock}>
        <div className={styles.status}>
          <span className={styles.dot}></span>
          AI ONLINE
        </div>

        <input
          className={styles.input}
          type="text"
          placeholder="Ask ULTRON anything..."
        />

        <div className={styles.actions}>
          <button className={styles.button}>🎤</button>
          <button className={styles.button}>➜</button>
        </div>
      </div>
    </div>
  );
}