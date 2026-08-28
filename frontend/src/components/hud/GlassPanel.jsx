import styles from "./GlassPanel.module.css";

export default function GlassPanel({ children }) {
  return <div className={styles.panel}>{children}</div>;
}