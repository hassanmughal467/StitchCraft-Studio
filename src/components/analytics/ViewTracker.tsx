"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Fires a privacy-safe analytics event once after mount. */
export function ViewTracker({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    track(event);
    // Intentionally once per mount; the event identity is fixed by the server page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
