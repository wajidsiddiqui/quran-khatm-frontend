import {
  useState,
  useEffect,
  useCallback,
} from "react";

import { useLocation } from "react-router-dom";

import {
  Search,
  BookOpenText,
} from "lucide-react";

import {
  fetchSurahList,
} from "../../services/quranApi";

import SurahCard from "../../components/quran/SurahCard";

import Tabs from "../../components/common/Tabs";

import JuzGrid from "../../components/quran/JuzGrid";

import {
  QuranLoading,
  QuranError,
} from "../../components/quran/QuranStateNotice";

export default function QuranHome() {
  const location = useLocation();

  /*
   * DEFAULT:
   * Surah tab.
   *
   * If navigation sends an activeTab
   * (for example from JuzReading),
   * open that tab instead.
   */
  const [tab, setTab] = useState(
    location.state?.activeTab || "surah",
  );

  const [query, setQuery] =
    useState("");

  const [surahs, setSurahs] =
    useState(null);

  const [error, setError] =
    useState(null);

  /*
   * Keep tab updated when this page
   * is navigated to with a tab state.
   */
  useEffect(() => {
    if (location.state?.activeTab) {
      setTab(location.state.activeTab);
    }
  }, [location.state]);

  const load = useCallback(() => {
    setError(null);

    setSurahs(null);

    fetchSurahList()
      .then(setSurahs)
      .catch((e) =>
        setError(e.message),
      );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = surahs?.filter(
    (s) =>
      s.name
        .toLowerCase()
        .includes(
          query.toLowerCase(),
        ),
  );

  return (
    <div className="px-5 pt-14 pb-4">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-11 h-11 rounded-xl bg-emerald-soft flex items-center justify-center shrink-0">

          <BookOpenText
            size={20}
            className="text-emerald-deep"
            strokeWidth={1.7}
          />

        </div>

        <div>

          <h1 className="font-display text-xl font-semibold text-ink">
            The Noble Quran
          </h1>

          <p className="text-xs text-ink-soft">
            114 Surahs · 30 Paras
          </p>

        </div>

      </div>

      {/* SEARCH */}

      <div className="relative mb-5">

        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
        />

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search Surah"
          className="w-full bg-cream-card border border-emerald-deep/10 rounded-2xl pl-11 pr-4 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald/30"
        />

      </div>

      {/* TABS */}

      <Tabs
        tabs={[
          {
            label: "Surah",
            value: "surah",
          },
          {
            label: "Juz / Para",
            value: "juz",
          },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* CONTENT */}

      <div className="mt-4">

        {tab === "surah" ? (

          error ? (

            <QuranError
              onRetry={load}
            />

          ) : !surahs ? (

            <QuranLoading
              label="Loading Surah list..."
            />

          ) : (

            filtered.map((s) => (
              <SurahCard
                key={s.number}
                surah={s}
              />
            ))

          )

        ) : (

          <JuzGrid />

        )}

      </div>

    </div>
  );
}