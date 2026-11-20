import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useKhatms } from "../../context/KhatmContext";
import AuthLoadingScreen from "../common/AuthLoadingScreen";

// Wraps every /khatm/:id page. After a page refresh the Khatm list is still
// loading, so pages used to think the Khatm didn't exist and redirect to
// My Khatms. This waits for the list, loads the Khatm from the server if it
// isn't in the list yet, and refreshes it in the background so other
// members' latest claims show up.
export default function KhatmGate() {
  const { pathname } = useLocation();
  const id = pathname.match(/^\/khatm\/([^/]+)/)?.[1];
  const { khatmsLoaded, getKhatm, fetchKhatm } = useKhatms();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!khatmsLoaded || !id) return undefined;

    if (getKhatm(id)) {
      setReady(true);
      fetchKhatm(id); // refresh in the background
    } else {
      setReady(false);
      fetchKhatm(id).finally(() => {
        if (!cancelled) setReady(true);
      });
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, khatmsLoaded]);

  if (!khatmsLoaded || !ready) return <AuthLoadingScreen />;
  return <Outlet />;
}
