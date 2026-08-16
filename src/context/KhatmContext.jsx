import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

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

const KhatmContext = createContext(null);

export function KhatmProvider({ children }) {
  const { user, token, isAuthenticated } = useAuth();

  const [khatms, setKhatms] = useState([]);
  const [members, setMembers] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [khatmLoading, setKhatmLoading] = useState(false);

  // Load all Khatms belonging to the logged-in user
  const loadKhatms = async () => {
    if (!token) {
      setKhatms([]);
      return;
    }

    try {
      setKhatmLoading(true);

      const result = await getMyKhatms(token);

      setKhatms(result.data || []);
    } catch (error) {
      console.error(
        "Failed to load Khatms:",
        error.message
      );

      setKhatms([]);
    } finally {
      setKhatmLoading(false);
    }
  };

  // Load Khatms when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      loadKhatms();
    } else {
      setKhatms([]);
      setMembers([]);
      setActivityLog([]);
    }
  }, [isAuthenticated, token]);

  // Get one Khatm from local state
  const getKhatm = (id) => {
    return khatms.find(
      (k) => (k._id || k.id) === id
    );
  };

  // Get Khatm using invite code
  const getKhatmFromInvite = async (inviteCode) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await getKhatmByInviteCode(
      inviteCode,
      token
    );

    return result.data;
  };

  // Create a new Khatm
  const createKhatm = async (data) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await createKhatmApi(
      data,
      token
    );

    const newKhatm = result.data;

    setKhatms((prev) => [
      newKhatm,
      ...prev,
    ]);

    return newKhatm;
  };

  // Join a Khatm using Khatm ID
  const joinKhatm = async (khatmId) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await joinKhatmApi(
      khatmId,
      token
    );

    const joinedKhatm = result.data;

    setKhatms((prev) => {
      const joinedId =
        joinedKhatm._id || joinedKhatm.id;

      const exists = prev.some(
        (k) =>
          (k._id || k.id) === joinedId
      );

      if (exists) {
        return prev.map((k) =>
          (k._id || k.id) === joinedId
            ? joinedKhatm
            : k
        );
      }

      return [
        joinedKhatm,
        ...prev,
      ];
    });

    return joinedKhatm;
  };

  // Claim a Para
  const claimPara = async (
    khatmId,
    paraNumber
  ) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await claimParaApi(
      khatmId,
      paraNumber,
      token
    );

    const updatedKhatm = result.data;

    setKhatms((prev) =>
      prev.map((k) =>
        (k._id || k.id) === khatmId
          ? updatedKhatm
          : k
      )
    );

    return updatedKhatm;
  };

  // Complete a Para
  const completePara = async (
    khatmId,
    paraNumber
  ) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await completeParaApi(
      khatmId,
      paraNumber,
      token
    );

    const updatedKhatm = result.data;

    setKhatms((prev) =>
      prev.map((k) =>
        (k._id || k.id) === khatmId
          ? updatedKhatm
          : k
      )
    );

    return updatedKhatm;
  };

  // Load members of a Khatm
  const loadMembers = async (khatmId) => {
    if (!token) return [];

    const result = await getMembers(
      khatmId,
      token
    );

    setMembers(result.data || []);

    return result.data || [];
  };

  // Load activity of a Khatm
  const loadActivity = async (khatmId) => {
    if (!token) return [];

    const result = await getActivity(
      khatmId,
      token
    );

    setActivityLog(result.data || []);

    return result.data || [];
  };

  return (
    <KhatmContext.Provider
      value={{
        user,
        khatms,
        members,
        activityLog,
        khatmLoading,

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
    throw new Error(
      "useKhatms must be used within KhatmProvider"
    );
  }

  return ctx;
}