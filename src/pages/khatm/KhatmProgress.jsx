import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  useKhatms,
} from "../../context/KhatmContext";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  paraProgress,
} from "../../data/mockData";

import TopBar from "../../components/common/TopBar";

import ParaRing from "../../components/common/ParaRing";

import Card from "../../components/common/Card";

import Button from "../../components/common/Button";

import {
  Heart,
  ArrowRight,
} from "lucide-react";


const dotStyles = {
  completed:
    "bg-gold text-emerald-deep",

  claimed:
    "bg-emerald text-cream",

  available:
    "bg-ink-faint/15 text-ink-faint",
};


export default function KhatmProgress() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();


  /* =========================================================
     AUTH
  ========================================================= */

  const {
    user,
  } = useAuth();


  /* =========================================================
     KHATM CONTEXT
  ========================================================= */

  const {
    getKhatm,
  } = useKhatms();


  /* =========================================================
     STATE
  ========================================================= */

  const [
    khatm,
    setKhatm,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    notFound,
    setNotFound,
  ] = useState(false);


  /* =========================================================
     LOAD KHATM
  ========================================================= */

  useEffect(() => {
    const loadKhatm =
      async () => {
        try {
          setLoading(true);

          const data =
            await getKhatm(id);

          if (!data) {
            setNotFound(true);

            return;
          }

          setKhatm(data);
        } catch (
          error
        ) {
          console.error(
            "Failed to load Khatm:",
            error.message,
          );

          setNotFound(true);
        } finally {
          setLoading(false);
        }
      };

    loadKhatm();
  }, [id, getKhatm]);


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">

        <TopBar
          title="Khatm Progress"
        />

        <div className="flex justify-center items-center pt-20">

          <p className="text-ink-soft">
            Loading Khatm...
          </p>

        </div>

      </div>
    );
  }


  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (
    notFound ||
    !khatm
  ) {
    return (
      <Navigate
        to="/khatms"
        replace
      />
    );
  }


  /* =========================================================
     PROGRESS
  ========================================================= */

  const progress =
    paraProgress(
      khatm,
    );


  const memberCount =
    khatm.members?.length ||
    0;


  /* =========================================================
     FULL KHATM COMPLETION
     
     IMPORTANT:
     The special Khatm Dua button is unlocked only when
     all 30 Juz are completed.
  ========================================================= */

  const completedJuzCount =
    Number(
      progress.completed,
    ) || 0;


  const isFullKhatmCompleted =
    completedJuzCount >=
    30;


  /* =========================================================
     CREATOR CHECK
     
     Only the creator of this Khatm should see the final
     "Make Dua for This Khatm" button.
  ========================================================= */

  const currentUserId =
    user?._id ||
    user?.id ||
    null;


  const creatorId =
    typeof khatm.createdBy ===
    "object"
      ? khatm.createdBy?._id ||
        khatm.createdBy?.id
      : khatm.createdBy;


  const isKhatmCreator =
    currentUserId &&
    creatorId &&
    String(
      currentUserId,
    ) ===
      String(
        creatorId,
      );


  const showKhatmDuaButton =
    isFullKhatmCompleted &&
    isKhatmCreator;


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-cream">

      <TopBar
        title="Khatm Progress"
      />


      <div className="px-5 pb-10">

        {/* ===================================================
            PROGRESS RING
        ==================================================== */}

        <div className="flex justify-center mb-6 mt-2">

          <ParaRing
            paras={
              khatm.paras ||
              []
            }
            size={190}
            label="Juz Completed"
          />

        </div>


        {/* ===================================================
            FINAL KHATM STATE
        ==================================================== */}

        {isFullKhatmCompleted && (
          <Card className="mb-6 overflow-hidden border border-gold/30 bg-gradient-to-br from-[#FFFDF8] to-[#F8F2DF]">

            <div className="text-center">

              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gold-dim">

                <Heart
                  size={20}
                  className="text-gold"
                  fill="currentColor"
                />

              </div>


              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
                Khatm Complete
              </p>


              <h2 className="mt-1 font-display text-xl font-semibold text-emerald-deep">
                All 30 Juz Completed
              </h2>


              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Alhamdulillah, all 30 Juz
                of this Khatm have been
                completed.
              </p>


              {/* =================================================
                  CREATOR-ONLY BUTTON
              ================================================== */}

              {showKhatmDuaButton && (
                <Button
                  className="mt-5 w-full"
                  variant="gold"
                  icon={ArrowRight}
                  onClick={() =>
                    navigate(
                      `/khatm/${id}/dua`,
                    )
                  }
                >
                  Make Dua for This Khatm
                </Button>
              )}

            </div>

          </Card>
        )}


        {/* ===================================================
            PROGRESS COUNTS
        ==================================================== */}

        <Card className="grid grid-cols-3 divide-x divide-emerald-deep/8 !p-0 mb-6">

          {/* MEMBERS */}

          <div className="text-center py-4">

            <p className="font-display text-lg font-semibold text-ink">
              {memberCount}
            </p>

            <p className="text-[11px] text-ink-soft mt-0.5">
              Members
            </p>

          </div>


          {/* COMPLETED */}

          <div className="text-center py-4">

            <p className="font-display text-lg font-semibold text-gold">
              {progress.completed}
            </p>

            <p className="text-[11px] text-ink-soft mt-0.5">
              Completed
            </p>

          </div>


          {/* REMAINING */}

          <div className="text-center py-4">

            <p className="font-display text-lg font-semibold text-ink-faint">
              {Math.max(
                0,
                30 -
                  progress.completed,
              )}
            </p>

            <p className="text-[11px] text-ink-soft mt-0.5">
              Remaining
            </p>

          </div>

        </Card>


        {/* ===================================================
            JUZ GRID
        ==================================================== */}

        <div className="grid grid-cols-6 gap-2 mb-6">

          {(khatm.paras || []).map(
            (
              p,
            ) => (
              <div
                key={
                  p.number
                }
                className={`aspect-square rounded-xl flex items-center justify-center text-xs font-semibold ${
                  dotStyles[
                    p.status
                  ] ||
                  dotStyles.available
                }`}
              >
                {p.number}
              </div>
            ),
          )}

        </div>


        {/* ===================================================
            LEGEND
        ==================================================== */}

        <div className="flex items-center justify-center gap-5 text-xs text-ink-soft">

          <span className="flex items-center gap-1.5">

            <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block" />

            Completed

          </span>


          <span className="flex items-center gap-1.5">

            <span className="w-2.5 h-2.5 rounded-full bg-emerald inline-block" />

            In Progress

          </span>


          <span className="flex items-center gap-1.5">

            <span className="w-2.5 h-2.5 rounded-full bg-ink-faint/30 inline-block" />

            Available

          </span>

        </div>

      </div>

    </div>
  );
}