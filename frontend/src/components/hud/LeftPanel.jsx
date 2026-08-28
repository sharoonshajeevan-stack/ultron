import HoloCard from "./HoloCard";

export default function LeftPanel() {
  return (
    <HoloCard title="SYSTEM STATUS">
      <div>CPU ............... ONLINE</div>

      <div>GPU ............... ONLINE</div>

      <div>MEMORY ............ READY</div>

      <div>NETWORK ........... CONNECTED</div>

      <div>POWER ............. STABLE</div>

      <div>SECURITY .......... ACTIVE</div>

      <div>VOICE ENGINE ...... READY</div>
    </HoloCard>
  );
}