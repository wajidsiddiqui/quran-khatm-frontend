import { createContext, useContext, useState, useEffect } from "react";

import { useAuth } from "./AuthContext";

import {
  createKhatm as createKhatmApi,
  getMyKhatms,
  getKhatmByInviteCode,
  joinKhatmApi,
  claimParaApi,
  completeParaApi,
  getMembers,
  getActivity,
} from "../services/khatmApi";

import {
  getReadingProgress as getReadingProgressApi,
  saveReadingProgress as saveReadingProgressApi,
} from "../services/readingProgressApi";

const KhatmContext = createContext(null);

export function KhatmProvider({ children }) {
  const { user, token, isAuthenticated } = useAuth();

  const [khatms, setKhatms] = useState([]);
  const [members, setMembers] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [khatmLoading, setKhatmLoading] = useState(false);

  // Reading progress
  // Stored using:
  // "khatmId-paraNumber" as the key.
  const [readingProgress, setReadingProgress] = useState({});

  // Load all Khatms belonging to the logged-in user
  const loadKhatms = async () => {
    if (!token) {
      setKhatms([]);
      return [];
    }

    try {
      setKhatmLoading(true);

      const result = await getMyKhatms(token);

      const loadedKhatms = result.data || [];

      setKhatms(loadedKhatms);

      return loadedKhatms;
    } catch (error) {
      console.error("Failed to load Khatms:", error.message);

      setKhatms([]);

      return [];
    } finally {
      setKhatmLoading(false);
    }
  };

  // Load Khatms when authentication changes
  useEffect(() => {
    if (isAuthenticated && token) {
      loadKhatms();
    } else {
      setKhatms([]);
      setMembers([]);
      setActivityLog([]);
      setReadingProgress({});
    }
  }, [isAuthenticated, token]);

  // Get one Khatm from local state
  const getKhatm = (id) => {
    return khatms.find((k) => String(k._id || k.id) === String(id));
  };

  // Get Khatm using invite code
  const getKhatmFromInvite = async (inviteCode) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await getKhatmByInviteCode(inviteCode, token);

    return result.data;
  };

  // Create a new Khatm
  const createKhatm = async (data) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await createKhatmApi(data, token);

    // Reload fresh data from backend
    await loadKhatms();

    return result.data;
  };

  // Join a Khatm
  const joinKhatm = async (khatmId) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await joinKhatmApi(khatmId, token);

    // Reload fresh Khatm data
    await loadKhatms();

    return result.data;
  };

  // Claim a Para
  const claimPara = async (khatmId, paraNumber) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await claimParaApi(khatmId, paraNumber, token);

    // IMPORTANT:
    // Get fresh populated Khatm data from backend
    const freshKhatms = await loadKhatms();

    const updatedKhatm =
      freshKhatms.find((k) => String(k._id || k.id) === String(khatmId)) ||
      result.data;

    return updatedKhatm;
  };

  // Complete a Para
  const completePara = async (khatmId, paraNumber) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await completeParaApi(khatmId, paraNumber, token);

    // IMPORTANT:
    // Get fresh populated Khatm data from backend
    const freshKhatms = await loadKhatms();

    const updatedKhatm =
      freshKhatms.find((k) => String(k._id || k.id) === String(khatmId)) ||
      result.data;

    return updatedKhatm;
  };

  // Load members of a Khatm
  const loadMembers = async (khatmId) => {
    if (!token) {
      return [];
    }

    const result = await getMembers(khatmId, token);

    const loadedMembers = result.data || [];

    setMembers(loadedMembers);

    return loadedMembers;
  };

  // Load activity of a Khatm
  const loadActivity = async (khatmId) => {
    if (!token) {
      return [];
    }

    const result = await getActivity(khatmId, token);

    const loadedActivity = result.data || [];

    setActivityLog(loadedActivity);

    return loadedActivity;
  };

  // Get saved reading progress
  const getReadingProgress = async (khatmId, paraNumber) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await getReadingProgressApi(khatmId, paraNumber, token);

    const progress = result.data || null;

    const key = `${khatmId}-${paraNumber}`;

    setReadingProgress((prev) => ({
      ...prev,
      [key]: progress,
    }));

    return progress;
  };

  // Save/update confirmed reading progress
  const saveReadingProgress = async (khatmId, paraNumber, data) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await saveReadingProgressApi(
      khatmId,
      paraNumber,
      data,
      token,
    );

    const progress = result.data;

    const key = `${khatmId}-${paraNumber}`;

    // Update React state immediately
    setReadingProgress((prev) => ({
      ...prev,
      [key]: progress,
    }));

    return progress;
  };

  return (
    <KhatmContext.Provider
      value={{
        user,
        khatms,
        members,
        activityLog,
        khatmLoading,

        // Reading Progress
        readingProgress,
        getReadingProgress,
        saveReadingProgress,

        loadKhatms,
        getKhatm,
        getKhatmFromInvite,
        createKhatm,
        joinKhatm,
        claimPara,
        completePara,
        loadMembers,
        loadActivity,
      }}
    >
      {children}
    </KhatmContext.Provider>
  );
}

export function useKhatms() {
  const ctx = useContext(KhatmContext);

  if (!ctx) {
    throw new Error("useKhatms must be used within KhatmProvider");
  }

  return ctx;
}
