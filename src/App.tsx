import { useMemo } from "react";
import { BackgroundScene } from "./components/BackgroundScene";
import { DetailsCard } from "./components/DetailsCard";
import { StatusPanel } from "./components/StatusPanel";
import { useStatusData } from "./hooks/useStatusData";
import { buildStatusViewModel } from "./utils/statusViewModel";

function App() {
  const state = useStatusData();
  const status = useMemo(() => buildStatusViewModel(state), [state]);

  return (
    <main className={`app shell-${status.tone}`}>
      <BackgroundScene />

      <section className="main-card">
        <p className="eyebrow">Mensa Central (Stuttgart Mitte)</p>
        <h1>Gibt es heute Maultaschen?</h1>

        <StatusPanel status={status} />
        <DetailsCard status={status} />

        <footer className="footer">
          <span>Zuletzt aktualisiert: {status.updatedAt}</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
