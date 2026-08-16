import { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  Type,
  Globe,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Card from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";

function Row({ icon: Icon, label, right }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-soft flex items-center justify-center shrink-0">
          <Icon size={16} className="text-emerald-deep" />
        </div>

        <span className="font-semibold text-ink text-[15px]">
          {label}
        </span>
      </div>

      {right}
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("quranFontSize") || "Medium";
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("translationLanguage") || "English";
  });

  const [showFontOptions, setShowFontOptions] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("quranFontSize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("translationLanguage", language);
  }, [language]);

  const selectFontSize = (size) => {
    setFontSize(size);
    setShowFontOptions(false);
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageOptions(false);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-[#121212] transition-colors duration-300">
      <TopBar title="Settings" />

      <div className="px-5 pb-10">
        {/* APPEARANCE */}
        <p className="text-xs font-semibold text-ink-soft dark:text-gray-400 uppercase tracking-wide mb-2 mt-2">
          Appearance
        </p>

        <Card className="!p-0 divide-y divide-emerald-deep/6 mb-5">
          {/* THEME */}
          <Row
            icon={theme === "light" ? Sun : Moon}
            label="Appearance"
            right={
              <div className="flex bg-emerald-soft rounded-full p-1">
                {["light", "dark"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize transition-all ${
                      theme === t
                        ? "bg-emerald text-cream shadow-sm"
                        : "text-emerald-deep/70"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            }
          />

          {/* FONT SIZE */}
          <div>
            <button
              onClick={() => {
                setShowFontOptions(!showFontOptions);
                setShowLanguageOptions(false);
              }}
              className="w-full"
            >
              <Row
                icon={Type}
                label="Quran Font Size"
                right={
                  <div className="flex items-center gap-1 text-sm text-ink-soft">
                    <span>{fontSize}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        showFontOptions ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                }
              />
            </button>

            {showFontOptions && (
              <div className="px-5 pb-4 flex gap-2">
                {["Small", "Medium", "Large"].map((size) => (
                  <button
                    key={size}
                    onClick={() => selectFontSize(size)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      fontSize === size
                        ? "bg-emerald text-cream"
                        : "bg-emerald-soft text-emerald-deep"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LANGUAGE */}
          <div>
            <button
              onClick={() => {
                setShowLanguageOptions(!showLanguageOptions);
                setShowFontOptions(false);
              }}
              className="w-full"
            >
              <Row
                icon={Globe}
                label="Translation Language"
                right={
                  <div className="flex items-center gap-1 text-sm text-ink-soft">
                    <span>{language}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        showLanguageOptions ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                }
              />
            </button>

            {showLanguageOptions && (
              <div className="px-5 pb-4 flex gap-2">
                {["English", "Urdu"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => selectLanguage(lang)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      language === lang
                        ? "bg-emerald text-cream"
                        : "bg-emerald-soft text-emerald-deep"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* ACCOUNT */}
        <p className="text-xs font-semibold text-ink-soft dark:text-gray-400 uppercase tracking-wide mb-2">
          Account
        </p>

        <Card className="!p-0 divide-y divide-emerald-deep/6 mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="w-full"
          >
            <Row
              icon={User}
              label="Account Settings"
              right={
                <span className="text-sm text-ink-soft">
                  Profile
                </span>
              }
            />
          </button>
        </Card>

        {/* LOGOUT */}
        <button
          onClick={() => {
            logout();
            navigate("/welcome");
          }}
          className="w-full flex items-center justify-center gap-2 text-red-600 font-semibold py-3.5"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );
}