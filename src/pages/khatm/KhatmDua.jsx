import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  CheckCircle2,
  ChevronDown,
  Heart,
  Sparkles,
  Loader2,
  AlertCircle,
  BookOpen,
  HandHeart,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useKhatms,
} from "../../context/KhatmContext";

import TopBar from "../../components/common/TopBar";

import Button from "../../components/common/Button";

import Card from "../../components/common/Card";

import duaKhatmBg from "../../assets/dua-khatm-bg.jpg";


/* =========================================================
   DUROOD SHAREEF
========================================================= */

const duroodShareef =
  "اللَّهُمَّ صَلِّ عَلَىٰ سَیِّدِنَا مُحَمَّدٍ وَعَلَىٰ آلِهِ وَسَلِّمْ";


/* =========================================================
   FATIHA METHOD

   Quran content is stored as individual Ayahs so that the
   UI can render them as a continuous Mushaf-style flow
   with inline Arabic Ayah markers.
========================================================= */

const fatihaMethod = [
  {
    number: 1,
    title: "Durood Shareef",
    count: "11 times",
    description:
      "Recite Durood Shareef eleven times.",
    type: "durood",
    repeat: 11,
  },

  {
    number: 2,
    title: "Surah Al-Fatiha",
    count: "Once",
    description:
      "Recite Surah Al-Fatiha once.",
    type: "quran",

    /*
     * Bismillah is displayed separately and the
     * actual Surah Ayahs receive Arabic numbers.
     */
    bismillah:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",

    content: [
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ",
      "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    ],
  },

  {
    number: 3,
    title: "Surah Al-Baqarah — First 5 Ayahs",
    count: "Once",
    description:
      "Recite the first five Ayahs of Surah Al-Baqarah.",
    type: "quran",

    bismillah:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",

    content: [
      "الم",
      "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
      "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
      "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
      "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
    ],
  },

  {
    number: 4,
    title: "Surah Al-Kafirun",
    count: "Once",
    description:
      "Recite Surah Al-Kafirun once.",
    type: "quran",

    bismillah:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",

    content: [
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
      "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ",
      "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    ],
  },

  {
    number: 5,
    title: "Surah Al-Ikhlas",
    count: "3 times",
    description:
      "Recite Surah Al-Ikhlas three times.",
    type: "quran",
    repeat: 3,

    bismillah:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",

    content: [
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "اللَّهُ الصَّمَدُ",
      "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    ],
  },

  {
    number: 6,
    title: "Surah Al-Falaq",
    count: "Once",
    description:
      "Recite Surah Al-Falaq once.",
    type: "quran",

    bismillah:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",

    content: [
      "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
      "مِن شَرِّ مَا خَلَقَ",
      "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
      "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    ],
  },

  {
    number: 7,
    title: "Surah An-Naas",
    count: "Once",
    description:
      "Recite Surah An-Naas once.",
    type: "quran",

    bismillah:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",

    content: [
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      "مَلِكِ النَّاسِ",
      "إِلَٰهِ النَّاسِ",
      "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
      "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
      "مِنَ الْجِنَّةِ وَالنَّاسِ",
    ],
  },

  {
    number: 8,
    title: "Durood Shareef",
    count: "11 times",
    description:
      "Recite Durood Shareef eleven times again.",
    type: "durood",
    repeat: 11,
  },
];


/* =========================================================
   SPECIFIC KHATM / FATIHA DUA
========================================================= */

const khatmDuaText =
  "O Allah, please forgive any mistakes that I may have made, knowingly or unknowingly, while reciting Durood Shareef and the Noble Qur’an. Grant acceptance to this recitation and this niyaz (Fatiha). I first present its reward in the blessed court of the Messenger of Allah ﷺ, please accept it. Through the intercession of the Messenger of Allah ﷺ, I present its reward to all the Prophets, the Companions, the Ahl al-Bayt, the Awliya, and to all Muslim men and Muslim women, all believing men and believing women, please accept it. O Allah, for the sake of Your beloved Messenger Muhammad ﷺ, grant Your mercy and forgiveness to the one for whom this Khatm has been completed. Overlook their shortcomings, forgive their sins, fill their grave with light and mercy, and grant them the highest and most beautiful ranks in Jannat-ul-Firdaws. Accept this Khatm for them and shower them with Your mercy and blessings. O Allah, accept this humble offering from us, and through Your mercy grant us the ability to continue upon the path of the Noble Qur’an. Ameen.";


/* =========================================================
   ARABIC NUMBER
========================================================= */

function toArabicNumber(number) {
  return String(number)
    .split("")
    .map(
      (digit) =>
        "٠١٢٣٤٥٦٧٨٩"[digit],
    )
    .join("");
}


/* =========================================================
   QURAN FLOW

   Mushaf-style continuous Quran rendering.

   Each Ayah is kept inline instead of being rendered as
   separate block paragraphs.

   The Ayah marker is inline, similar to the main Quran
   reader used in ParaReading.jsx.
========================================================= */

function QuranFlow({
  step,
}) {
  const repeatCount =
    step.repeat || 1;

  const renderSurah =
    () => (
      <div
        dir="rtl"
        className="
          font-quran
          font-bold
          text-emerald-deep
        "
        style={{
          fontSize:
            "clamp(23px, 3.5vw, 29px)",

          lineHeight:
            2.35,

          textAlign:
            "justify",

          textAlignLast:
            "right",
        }}
      >
        {/* ===============================================
            BISMILLAH
        ================================================ */}

        {step.bismillah && (
          <span className="inline">
            {step.bismillah}

            {" "}
          </span>
        )}


        {/* ===============================================
            AYAH FLOW
        ================================================ */}

        {step.content.map(
          (
           ayah,
            index,
          ) => (
            <span
              key={index}
              className="inline"
            >

              {ayah}

              {" "}

              <span
                className="
                  inline-flex
                  items-center
                  justify-center
                  align-middle
                  mx-1
                  text-[0.55em]
                  font-semibold
                  text-gold
                "
                aria-label={`Ayah ${
                  index + 1
                }`}
              >
                ﴿
                {toArabicNumber(
                  index + 1,
                )}
                ﴾
              </span>

              {" "}
            </span>
          ),
        )}

      </div>
    );


  /* =======================================================
     SINGLE RECITATION
  ======================================================= */

  if (
    repeatCount === 1
  ) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-gold/15
          bg-[#FFFDF8]/85
          px-4
          py-5
          md:px-6
          md:py-6
        "
      >
        {renderSurah()}
      </div>
    );
  }


  /* =======================================================
     MULTIPLE RECITATIONS

     Example:
     Surah Al-Ikhlas ×3
  ======================================================= */

  return (
    <div className="space-y-4">

      {Array.from({
        length:
          repeatCount,
      }).map(
        (
          _,
          repeatIndex,
        ) => (
          <div
            key={
              repeatIndex
            }
            className="
              rounded-2xl
              border
              border-gold/15
              bg-[#FFFDF8]/85
              px-4
              py-5
              md:px-6
              md:py-6
            "
          >

            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
              Recitation{" "}
              {repeatIndex + 1}{" "}
              /{" "}
              {repeatCount}
            </p>


            {renderSurah()}

          </div>
        ),
      )}

    </div>
  );
}


/* =========================================================
   DUROOD FLOW

   Durood is not Quranic Ayah text, so it remains as separate
   repeated recitation blocks rather than using Ayah markers.
========================================================= */

function DuroodFlow({
  repeat = 11,
}) {
  return (
    <div className="space-y-3">

      {Array.from({
        length:
          repeat,
      }).map(
        (
          _,
          index,
        ) => (
          <div
            key={
              index
            }
            className="
              rounded-2xl
              border
              border-gold/15
              bg-[#FFFDF8]/85
              px-4
              py-4
              md:px-6
              md:py-5
            "
          >

            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
              Recitation{" "}
              {index + 1}{" "}
              /{" "}
              {repeat}
            </p>


            <p
              dir="rtl"
              className="
                font-quran
                text-right
                text-[25px]
                font-bold
                leading-[2.2]
                text-emerald-deep
              "
            >
              {
                duroodShareef
              }
            </p>

          </div>
        ),
      )}

    </div>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function KhatmDua() {
  const {
    id,
  } = useParams();


  const navigate =
    useNavigate();


  const {
    getKhatm,
    completeKhatm,
  } = useKhatms();


  const [
    openStep,
    setOpenStep,
  ] = useState(null);


  const [
    completing,
    setCompleting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


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
     TOGGLE FATIHA STEP

     Only one step remains open at a time.
  ========================================================= */

  const toggleStep =
    (stepNumber) => {
      setOpenStep(
        (current) =>
          current === stepNumber
            ? null
            : stepNumber,
      );
    };


  /* =========================================================
     FINAL AMEEN

     Only this final Ameen completes the overall Khatm.
  ========================================================= */

  const handleAmeen =
    async () => {
      if (completing) {
        return;
      }


      try {
        setCompleting(
          true,
        );

        setError("");


        await completeKhatm(
          id,
        );


        navigate(
          "/home",
          {
            replace: true,
          },
        );

      } catch (
        error
      ) {
        console.error(
          "Failed to complete Khatm:",
          error.message,
        );


        setError(
          error.message ||
            "Failed to complete this Khatm. Please try again.",
        );

      } finally {
        setCompleting(
          false,
        );
      }
    };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#71836A]
      "
      style={{
        backgroundImage:
          `url(${duaKhatmBg})`,
        backgroundSize:
          "cover",
        backgroundPosition:
          "center",
        backgroundRepeat:
          "no-repeat",
        backgroundAttachment:
          "fixed",
      }}
    >

      {/* =====================================================
          BACKGROUND OVERLAY
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-emerald-deep/20
        "
      />


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10">

        <TopBar
          title="Khatm Dua"
          
        />


        <main
          className="
            mx-auto
            w-full
            max-w-3xl
            px-5
            pb-16
            pt-6
            md:px-6
          "
        >

          {/* =================================================
              HERO HEADER
          ================================================== */}

          <section className="mb-7 text-center">

            <div
              className="
                mx-auto
                mb-4
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-gold/50
                bg-[#FFFDF8]/95
                shadow-soft
              "
            >

              <Heart
                size={27}
                className="text-gold"
                fill="currentColor"
              />

            </div>


            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#F5DA90]
              "
            >
              Complete Khatm
            </p>


            <h1
              className="
                mt-1
                font-display
                text-3xl
                font-semibold
                text-[#FFFDF8]
                md:text-4xl
              "
            >
              Make Dua for This Khatm
            </h1>


            <div
              className="
                mx-auto
                mt-4
                flex
                items-center
                justify-center
                gap-3
              "
            >

              <span className="h-px w-12 bg-gold/70" />

              <Sparkles
                size={15}
                className="text-[#E8C76B]"
              />

              <span className="h-px w-12 bg-gold/70" />

            </div>

          </section>


          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div
              className="
                mb-5
                rounded-2xl
                border
                border-red-200
                bg-red-50/95
                px-4
                py-3
                shadow-card
              "
            >

              <div className="flex items-start gap-3">

                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <p className="text-sm leading-6 text-red-700">
                  {error}
                </p>

              </div>

            </div>
          )}


          {/* =================================================
              KHATM COMPLETED CARD
          ================================================== */}

          <Card
            className="
              mb-7
              overflow-hidden
              border
              border-gold/35
              bg-[#FFFDF8]/96
              shadow-soft
            "
          >

            <div className="p-5 md:p-7">

              <div
                className="
                  grid
                  items-center
                  gap-6
                  md:grid-cols-[175px_1fr]
                "
              >

                {/* ILLUSTRATION */}

                <div
                  className="
                    mx-auto
                    flex
                    h-36
                    w-36
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-gold/30
                    bg-emerald-soft/65
                  "
                >

                  <BookOpen
                    size={56}
                    strokeWidth={1.5}
                    className="text-emerald-deep"
                  />

                </div>


                {/* INFORMATION */}

                <div className="text-center md:text-left">

                  <div
                    className="
                      mb-3
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-emerald-deep/10
                      bg-emerald-soft
                      px-3
                      py-1
                    "
                  >

                    <CheckCircle2
                      size={14}
                      className="text-emerald-deep"
                    />

                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-emerald-deep
                      "
                    >
                      Khatm Completed
                    </span>

                  </div>


                  <h2
                    className="
                      font-display
                      text-3xl
                      font-semibold
                      text-ink
                    "
                  >
                    30 / 30 Juz
                  </h2>


                  <p
                    className="
                      mt-2
                      max-w-xl
                      text-sm
                      leading-7
                      text-ink-soft
                    "
                  >
                    Alhamdulillah, all 30 Juz of
                    this Khatm have been completed.
                  </p>


                  <div
                    className="
                      mt-5
                      rounded-2xl
                      border
                      border-emerald-deep/8
                      bg-emerald-soft/45
                      px-4
                      py-3
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-ink-faint
                      "
                    >
                      Khatm For
                    </p>


                    <p
                      className="
                        mt-1
                        font-display
                        text-xl
                        font-semibold
                        text-emerald-deep
                      "
                    >
                      {
                        khatm.dedicatedTo
                      }
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </Card>


          {/* =================================================
              METHOD OF OFFERING FATIHA
          ================================================== */}

          <Card
            className="
              mb-7
              overflow-hidden
              border
              border-gold/25
              bg-[#FFFDF8]/97
              shadow-soft
            "
          >

            {/* SECTION HEADER */}

            <div
              className="
                border-b
                border-emerald-deep/8
                px-5
                py-5
                md:px-6
              "
            >

              <div className="flex items-start gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-gold/30
                    bg-gold-dim
                  "
                >

                  <BookOpen
                    size={19}
                    className="text-gold"
                  />

                </div>


                <div>

                  <p
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-gold
                    "
                  >
                    Method of Offering Fatiha
                  </p>


                  <h2
                    className="
                      mt-1
                      font-display
                      text-xl
                      font-semibold
                      text-emerald-deep
                    "
                  >
                    Recite the following in order
                  </h2>


                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    Beginning and ending with
                    Durood Shareef.
                  </p>

                </div>

              </div>

            </div>


            {/* STEPS */}

            <div className="space-y-2 p-4 md:p-5">

              {fatihaMethod.map(
                (
                  step,
                ) => {
                  const isOpen =
                    openStep ===
                    step.number;


                  return (
                    <div
                      key={
                        step.number
                      }
                      className={`
                        overflow-hidden
                        rounded-2xl
                        border
                        transition-all
                        duration-200
                        ${
                          isOpen
                            ? "border-gold/35 bg-cream shadow-sm"
                            : "border-emerald-deep/8 bg-cream/55"
                        }
                      `}
                    >

                      {/* =================================================
                          STEP HEADER
                      ================================================== */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleStep(
                            step.number,
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          px-4
                          py-4
                          text-left
                        "
                        aria-expanded={
                          isOpen
                        }
                      >

                        {/* NUMBER */}

                        <div
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            text-sm
                            font-bold
                            transition-colors
                            ${
                              isOpen
                                ? "border-emerald-deep bg-emerald-deep text-cream"
                                : "border-gold/35 bg-gold-dim text-gold"
                            }
                          `}
                        >
                          {
                            step.number
                          }
                        </div>


                        {/* TITLE */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <p className="text-sm font-semibold text-ink">
                              {
                                step.title
                              }
                            </p>


                            <span
                              className="
                                rounded-full
                                bg-emerald-soft
                                px-2
                                py-0.5
                                text-[10px]
                                font-semibold
                                text-emerald-deep
                              "
                            >
                              {
                                step.count
                              }
                            </span>

                          </div>


                          <p className="mt-0.5 text-xs leading-5 text-ink-soft">
                            {
                              step.description
                            }
                          </p>

                        </div>


                        {/* CHEVRON */}

                        <ChevronDown
                          size={18}
                          className={`
                            shrink-0
                            text-emerald-deep
                            transition-transform
                            duration-200
                            ${
                              isOpen
                                ? "rotate-180"
                                : ""
                            }
                          `}
                        />

                      </button>


                      {/* =================================================
                          STEP CONTENT
                      ================================================== */}

                      {isOpen && (
                        <div
                          className="
                            border-t
                            border-gold/15
                            px-4
                            pb-5
                            pt-4
                          "
                        >

                          {step.type ===
                            "durood" && (
                            <DuroodFlow
                              repeat={
                                step.repeat
                              }
                            />
                          )}


                          {step.type ===
                            "quran" && (
                            <QuranFlow
                              step={
                                step
                              }
                            />
                          )}

                        </div>
                      )}

                    </div>
                  );
                },
              )}

            </div>

          </Card>


          {/* =================================================
              AFTER THE RECITATION
          ================================================== */}

          <Card
            className="
              mb-7
              overflow-hidden
              border
              border-gold/25
              bg-[#FFFDF8]/97
              shadow-soft
            "
          >

            {/* SECTION HEADER */}

            <div
              className="
                border-b
                border-emerald-deep/8
                px-5
                py-5
                md:px-6
              "
            >

              <div className="flex items-start gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-gold/30
                    bg-gold-dim
                  "
                >

                  <HandHeart
                    size={19}
                    className="text-gold"
                  />

                </div>


                <div>

                  <p
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-gold
                    "
                  >
                    After the Recitation
                  </p>


                  <h2
                    className="
                      mt-1
                      font-display
                      text-xl
                      font-semibold
                      text-emerald-deep
                    "
                  >
                    Make Your Dua
                  </h2>

                </div>

              </div>

            </div>


            <div className="space-y-4 p-5 md:p-6">

              {/* =================================================
                  SPECIFIC KHATM DUA
              ================================================== */}

              <div
                className="
                  rounded-2xl
                  border
                  border-gold/20
                  bg-gold/[0.045]
                  p-4
                  md:p-5
                "
              >

                <div className="mb-4 flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-gold-dim
                    "
                  >

                    <Sparkles
                      size={17}
                      className="text-gold"
                    />

                  </div>


                  <div>

                    <p className="text-sm font-semibold text-emerald-deep">
                      Specific Khatm Dua
                    </p>


                    <p className="text-xs text-ink-soft">
                      Make this dua after the recitations.
                    </p>

                  </div>

                </div>


                <p className="text-[14px] leading-8 text-ink">
                  {
                    khatmDuaText
                  }
                </p>

              </div>


              {/* =================================================
                  PERSONAL DUA
              ================================================== */}

              <div
                className="
                  rounded-2xl
                  border
                  border-emerald-deep/10
                  bg-emerald-soft/45
                  p-4
                  md:p-5
                "
              >

                <div className="mb-3 flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-deep
                      text-cream
                    "
                  >

                    <Heart
                      size={17}
                      fill="currentColor"
                    />

                  </div>


                  <div>

                    <p className="text-sm font-semibold text-emerald-deep">
                      Now make whatever
                      du’a you wish.
                    </p>

                  </div>

                </div>


                <p className="text-sm leading-7 text-ink-soft">
                  Ask Allah for whatever is
                  in your heart, with sincerity
                  and humility. You may make
                  du’a for yourself, your family,
                  your loved ones, and for whatever
                  you hope Allah grants.
                </p>

              </div>


              {/* =================================================
                  FINAL REMINDER
              ================================================== */}

              <div className="flex items-center gap-3 px-1 py-2">

                <span className="h-px flex-1 bg-gold/30" />

                <p className="text-center text-xs font-medium text-ink-soft">
                  Conclude your du’a with
                  Durood Shareef, then press Ameen.
                </p>

                <span className="h-px flex-1 bg-gold/30" />

              </div>

            </div>

          </Card>


          {/* =================================================
              FINAL AMEEN
          ================================================== */}

          <Button
            className="
              w-full
              bg-emerald-deep
              text-cream
              hover:bg-emerald-deep/90
            "
            onClick={
              handleAmeen
            }
            disabled={
              completing
            }
          >

            {completing ? (
              <>
                <Loader2
                  size={17}
                  className="mr-2 animate-spin"
                />

                Completing Khatm...
              </>
            ) : (
              <>
                Ameen

                <span className="ml-2">
                  →
                </span>
              </>
            )}

          </Button>


          <p
            className="
              mt-3
              text-center
              text-[11px]
              text-[#F7F1E6]/80
            "
          >
            May Allah accept this Khatm.
          </p>

        </main>

      </div>

    </div>
  );
}