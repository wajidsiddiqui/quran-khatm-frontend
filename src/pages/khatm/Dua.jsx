import {
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  useKhatms,
} from "../../context/KhatmContext";

import TopBar from "../../components/common/TopBar";

import Button from "../../components/common/Button";

import Card from "../../components/common/Card";

import duaCalligraphyBg from "../../assets/dua-calligraphy-bg.jpg";


/* =========================================================
   JUZ COMPLETION DUA

   This is the composed dua shown after completing
   an individual Juz.

   It is intentionally separate from the future
   full-Khatm Fatiha / Khatm Dua flow.
========================================================= */

const juzCompletionDua = [
  "O Allah, if I made any mistakes while reciting Your Noble Qur’an, knowingly or unknowingly, then for the sake of Your beloved Messenger Muhammad ﷺ, please forgive my mistakes and accept my recitation from me.",

  "O Allah, accept this recitation from me, accept my effort, and make the blessings of Your Noble Qur’an a means of mercy, guidance, and goodness for me.",

  "O Allah, overlook my shortcomings, accept what I have recited, and allow me to continue reading Your Book with sincerity, understanding, and devotion.",
];


export default function Dua() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();


  const {
    getKhatm,
  } = useKhatms();


  const khatm =
    getKhatm(id);


  /* =========================================================
     KHATM NOT FOUND
  ========================================================= */

  if (!khatm) {
    return (
      <Navigate
        to="/khatms"
        replace
      />
    );
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cream"
      style={{
        backgroundImage: `url(${duaCalligraphyBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >

      {/* =====================================================
          SOFT BACKGROUND OVERLAY
          Keeps the calligraphy visible while maintaining
          comfortable contrast for the dua.
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 bg-cream/55" />


      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}

      <div className="relative z-10">

        <TopBar
          title="Make Dua"
        />


        <div className="mx-auto max-w-md px-5 pb-10 pt-5">

          {/* =================================================
              PAGE INTRO
          ================================================== */}

          <div className="mb-6 text-center">

            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
              Juz Completion Dua
            </p>


            <div className="mx-auto mt-3 flex items-center justify-center gap-2">

              <span className="h-px w-12 bg-gold/50" />

              <span className="font-display text-base text-gold">
                ✦
              </span>

              <span className="h-px w-12 bg-gold/50" />

            </div>

          </div>


          {/* =================================================
              DUA CARD
          ================================================== */}

          <Card
            className="relative mb-6 overflow-hidden border border-gold/20 bg-[#FFFDF8]/92 shadow-soft backdrop-blur-[2px]"
          >

            {/* Subtle inner glow */}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-gold/[0.03]" />


            <div className="relative z-10">

              {/* Decorative top ornament */}

              <div className="mb-6 flex items-center justify-center gap-2">

                <span className="h-px flex-1 bg-gold/30" />

                <span className="text-sm text-gold">
                  ✦
                </span>

                <span className="h-px flex-1 bg-gold/30" />

              </div>


              {/* =================================================
                  CONTINUOUS DUA
              ================================================== */}

              <div className="text-left">

                {juzCompletionDua.map(
                  (
                    paragraph,
                    index,
                  ) => (
                    <p
                      key={index}
                      className={`text-[15px] leading-8 text-ink ${
                        index > 0
                          ? "mt-7"
                          : ""
                      }`}
                    >
                      {paragraph}
                    </p>
                  ),
                )}

              </div>


              {/* Decorative bottom ornament */}

              <div className="mt-7 flex items-center justify-center gap-2">

                <span className="h-px flex-1 bg-gold/30" />

                <span className="text-sm text-gold">
                  ✦
                </span>

                <span className="h-px flex-1 bg-gold/30" />

              </div>

            </div>

          </Card>


          {/* =================================================
              AMEEN
          ================================================== */}

          <Button
            className="w-full bg-emerald-deep hover:bg-emerald-deep/90"
            onClick={() =>
              navigate("/home")
            }
          >
            Ameen
          </Button>

        </div>

      </div>

    </div>
  );
}