import { useEffect, useRef } from "react";

const KEY = "lendswift_draft";

export function useAutoSave(formData, step) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      try {
        const draft = {
          formData,
          step,
          savedAt: new Date().toISOString(),
          version: "1.0"
        };
        localStorage.setItem(KEY, JSON.stringify(draft));
        console.log("✅ Draft saved at", new Date().toLocaleTimeString());
      } catch (e) {
        console.error("Auto-save failed:", e);
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timerRef.current);
  }, [formData, step]);
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    const savedAt = new Date(draft.savedAt);
    const now = new Date();
    const hoursDiff = (now - savedAt) / (1000 * 60 * 60);
    if (hoursDiff > 72) {
      localStorage.removeItem(KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function clearDraft() {
  localStorage.removeItem(KEY);
}
