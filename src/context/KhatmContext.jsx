import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  useAuth,
} from "./AuthContext";

import {
  createKhatm as createKhatmApi,
  getMyKhatms,
  getKhatmByInviteCode,
  joinKhatmApi,
  claimParaApi,
  completeParaApi,
  completeKhatmApi,
  getMembers,
  getActivity,
} from "../services/khatmApi";

import {
  getAllReadingProgress as getAllReadingProgressApi,
  getQuranBookmarks as getQuranBookmarksApi,
  saveQuranBookmark as saveQuranBookmarkApi,
  getReadingProgress as getReadingProgressApi,
  saveReadingProgress as saveReadingProgressApi,
  deleteReadingProgress as deleteReadingProgressApi,
} from "../services/readingProgressApi";


const KhatmContext =
  createContext(null);


export function KhatmProvider({
  children,
}) {
  const {
    user,
    token,
    isAuthenticated,
  } = useAuth();


  const [
    khatms,
    setKhatms,
  ] = useState([]);


  const [
    members,
    setMembers,
  ] = useState([]);


  const [
    activityLog,
    setActivityLog,
  ] = useState([]);


  const [
    khatmLoading,
    setKhatmLoading,
  ] = useState(false);


  const [
    readingProgress,
    setReadingProgress,
  ] = useState({});


  /*
   * ========================================
   * LOAD KHATMS
   * ========================================
   */

  const loadKhatms =
    useCallback(
      async () => {
        if (!token) {
          setKhatms([]);

          return [];
        }


        try {
          setKhatmLoading(
            true,
          );


          const result =
            await getMyKhatms(
              token,
            );


          const loadedKhatms =
            result.data || [];


          setKhatms(
            loadedKhatms,
          );


          return loadedKhatms;

        } catch (error) {
          console.error(
            "Failed to load Khatms:",
            error.message,
          );


          setKhatms([]);


          return [];

        } finally {
          setKhatmLoading(
            false,
          );
        }
      },
      [token],
    );


  /*
   * ========================================
   * LOAD KHATMS WHEN AUTH CHANGES
   * ========================================
   */

  useEffect(() => {
    if (
      isAuthenticated &&
      token
    ) {
      loadKhatms();

    } else {
      setKhatms([]);

      setMembers([]);

      setActivityLog([]);

      setReadingProgress({});
    }
  }, [
    isAuthenticated,
    token,
    loadKhatms,
  ]);


  /*
   * ========================================
   * GET KHATM FROM LOCAL STATE
   * ========================================
   */

  const getKhatm =
    useCallback(
      (id) => {
        return khatms.find(
          (k) =>
            String(
              k._id || k.id,
            ) ===
            String(id),
        );
      },
      [khatms],
    );


  /*
   * ========================================
   * GET KHATM BY INVITE CODE
   * ========================================
   */

  const getKhatmFromInvite =
    useCallback(
      async (
        inviteCode,
      ) => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await getKhatmByInviteCode(
            inviteCode,
            token,
          );


        return result.data;
      },
      [token],
    );


  /*
   * ========================================
   * CREATE KHATM
   * ========================================
   */

  const createKhatm =
    useCallback(
      async (data) => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await createKhatmApi(
            data,
            token,
          );


        await loadKhatms();


        return result.data;
      },
      [
        token,
        loadKhatms,
      ],
    );


  /*
   * ========================================
   * JOIN KHATM
   * ========================================
   */

  const joinKhatm =
    useCallback(
      async (
        khatmId,
      ) => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await joinKhatmApi(
            khatmId,
            token,
          );


        await loadKhatms();


        return result.data;
      },
      [
        token,
        loadKhatms,
      ],
    );


  /*
   * ========================================
   * CLAIM PARA
   * ========================================
   */

  const claimPara =
    useCallback(
      async (
        khatmId,
        paraNumber,
      ) => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await claimParaApi(
            khatmId,
            paraNumber,
            token,
          );


        const freshKhatms =
          await loadKhatms();


        const updatedKhatm =
          freshKhatms.find(
            (k) =>
              String(
                k._id || k.id,
              ) ===
              String(khatmId),
          ) ||
          result.data;


        return updatedKhatm;
      },
      [
        token,
        loadKhatms,
      ],
    );


  /*
   * ========================================
   * COMPLETE PARA
   * ========================================
   */

  const completePara =
    useCallback(
      async (
        khatmId,
        paraNumber,
      ) => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await completeParaApi(
            khatmId,
            paraNumber,
            token,
          );


        const freshKhatms =
          await loadKhatms();


        const updatedKhatm =
          freshKhatms.find(
            (k) =>
              String(
                k._id || k.id,
              ) ===
              String(khatmId),
          ) ||
          result.data;


        return updatedKhatm;
      },
      [
        token,
        loadKhatms,
      ],
    );


  /*
   * ========================================
   * COMPLETE ENTIRE KHATM
   *
   * Called only after the creator finishes
   * the final Khatm Dua and presses Ameen.
   *
   * Backend still performs the real security
   * checks:
   * - creator only
   * - all 30 Juz completed
   * ========================================
   */

  const completeKhatm =
    useCallback(
      async (
        khatmId,
      ) => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await completeKhatmApi(
            khatmId,
            token,
          );


        /*
         * Reload Khatms so every screen gets
         * the persisted completed status.
         */

        const freshKhatms =
          await loadKhatms();


        const updatedKhatm =
          freshKhatms.find(
            (k) =>
              String(
                k._id || k.id,
              ) ===
              String(khatmId),
          ) ||
          result.data;


        return updatedKhatm;
      },
      [
        token,
        loadKhatms,
      ],
    );


  /*
   * ========================================
   * LOAD MEMBERS
   * ========================================
   */

  const loadMembers =
    useCallback(
      async (
        khatmId,
      ) => {
        if (!token) {
          return [];
        }


        const result =
          await getMembers(
            khatmId,
            token,
          );


        const loadedMembers =
          result.data || [];


        setMembers(
          loadedMembers,
        );


        return loadedMembers;
      },
      [token],
    );


  /*
   * ========================================
   * LOAD ACTIVITY
   * ========================================
   */

  const loadActivity =
    useCallback(
      async (
        khatmId,
      ) => {
        if (!token) {
          return [];
        }


        const result =
          await getActivity(
            khatmId,
            token,
          );


        const loadedActivity =
          result.data || [];


        setActivityLog(
          loadedActivity,
        );


        return loadedActivity;
      },
      [token],
    );


  /*
   * ========================================
   * GET ALL SAVED READING LOCATIONS
   * ========================================
   */

  const getAllReadingProgress =
    useCallback(
      async () => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await getAllReadingProgressApi(
            token,
          );


        return result.data || [];
      },
      [token],
    );


  /*
   * ========================================
   * GET QURAN-ONLY BOOKMARKS
   * ========================================
   */

  const getQuranBookmarks =
    useCallback(
      async () => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await getQuranBookmarksApi(
            token,
          );


        return result.data || [];
      },
      [token],
    );


  /*
   * ========================================
   * SAVE / UPDATE QURAN BOOKMARK
   * ========================================
   */

  const saveQuranBookmark =
    useCallback(
      async (
        data,
      ) => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await saveQuranBookmarkApi(
            data,
            token,
          );


        return result.data;
      },
      [token],
    );


  /*
   * ========================================
   * GET SAVED KHATM READING PROGRESS
   * ========================================
   */

  const getReadingProgress =
    useCallback(
      async (
        khatmId,
        paraNumber,
      ) => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await getReadingProgressApi(
            khatmId,
            paraNumber,
            token,
          );


        const progress =
          result.data || null;


        const key =
          `${khatmId}-${paraNumber}`;


        setReadingProgress(
          (prev) => ({
            ...prev,
            [key]:
              progress,
          }),
        );


        return progress;
      },
      [token],
    );


  /*
   * ========================================
   * SAVE / UPDATE KHATM READING PROGRESS
   * ========================================
   */

  const saveReadingProgress =
    useCallback(
      async (
        khatmId,
        paraNumber,
        data,
      ) => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await saveReadingProgressApi(
            khatmId,
            paraNumber,
            data,
            token,
          );


        const progress =
          result.data;


        const key =
          `${khatmId}-${paraNumber}`;


        setReadingProgress(
          (prev) => ({
            ...prev,
            [key]:
              progress,
          }),
        );


        return progress;
      },
      [token],
    );


  /*
   * ========================================
   * DELETE SAVED READING PROGRESS
   * ========================================
   */

  const deleteReadingProgress =
    useCallback(
      async (
        progressId,
      ) => {
        if (!token) {
          throw new Error(
            "You must be logged in.",
          );
        }


        const result =
          await deleteReadingProgressApi(
            progressId,
            token,
          );


        setReadingProgress(
          (prev) => {
            const updated = {
              ...prev,
            };


            Object.keys(
              updated,
            ).forEach(
              (
                key,
              ) => {
                if (
                  updated[
                    key
                  ]?._id ===
                  progressId
                ) {
                  delete updated[
                    key
                  ];
                }
              },
            );


            return updated;
          },
        );


        return result.data;
      },
      [token],
    );


  /*
   * ========================================
   * PROVIDER
   * ========================================
   */

  return (
    <KhatmContext.Provider
      value={{
        user,

        khatms,

        members,

        activityLog,

        khatmLoading,

        readingProgress,


        /*
         * Reading Progress
         */

        getAllReadingProgress,

        getQuranBookmarks,

        saveQuranBookmark,

        getReadingProgress,

        saveReadingProgress,

        deleteReadingProgress,


        /*
         * Khatm
         */

        loadKhatms,

        getKhatm,

        getKhatmFromInvite,

        createKhatm,

        joinKhatm,

        claimPara,

        completePara,

        completeKhatm,

        loadMembers,

        loadActivity,
      }}
    >
      {children}
    </KhatmContext.Provider>
  );
}


export function useKhatms() {
  const ctx =
    useContext(
      KhatmContext,
    );


  if (!ctx) {
    throw new Error(
      "useKhatms must be used within KhatmProvider",
    );
  }


  return ctx;
}