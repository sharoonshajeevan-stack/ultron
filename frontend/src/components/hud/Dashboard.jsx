import TopBar from "./TopBar";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import BottomBar from "./BottomBar";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <TopBar />

      <LeftPanel />

      <RightPanel />

      <BottomBar />
    </div>
  );
}