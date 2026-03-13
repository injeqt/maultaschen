import { useEffect, useState } from "react";
import type { LoadState, StatusPayload } from "../types/status";

export function useStatusData(): LoadState {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadStatus() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/status.json`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as StatusPayload;
        setState({ kind: "ready", data: payload });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error(error);
        setState({
          kind: "error",
          message: "Die aktuellen Speiseplan-Daten konnten nicht geladen werden.",
        });
      }
    }

    loadStatus();

    return () => controller.abort();
  }, []);

  return state;
}
