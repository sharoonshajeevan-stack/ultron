import styles from "./BottomBar.module.css";

export default function BottomBar() {
  return (
    <footer className={styles.bar}>
      <input
        className={styles.input}
        placeholder="Ask ULTRON anything..."
      />

      <button className={styles.button}>
        🎤
      </button>
    </footer>
  );
}