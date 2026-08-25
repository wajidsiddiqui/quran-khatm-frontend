import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";


import {
  KhatmProvider,
} from "./context/KhatmContext";


import AppLayout from "./layouts/AppLayout";


import AuthLoadingScreen from "./components/common/AuthLoadingScreen";


import ProtectedRoute from "./components/auth/ProtectedRoute";

import PublicRoute from "./components/auth/PublicRoute";


/* =========================
   ONBOARDING
========================= */

import Splash from "./pages/onboarding/Splash";

import Onboarding from "./pages/onboarding/Onboarding";


/* =========================
   AUTH
========================= */

import Welcome from "./pages/auth/Welcome";

import Signup from "./pages/auth/Signup";

import Login from "./pages/auth/Login";

import ForgotPassword from "./pages/auth/ForgotPassword";

import VerifyEmail from "./pages/auth/VerifyEmail";


/* =========================
   HOME
========================= */

import Home from "./pages/home/Home";


/* =========================
   KHATM
========================= */

import MyKhatms from "./pages/khatm/MyKhatms";

import CreateKhatm from "./pages/khatm/CreateKhatm";

import KhatmDetails from "./pages/khatm/KhatmDetails";

import ParaList from "./pages/khatm/ParaList";

import Members from "./pages/khatm/Members";

import Invite from "./pages/khatm/Invite";

import JoinKhatm from "./pages/khatm/JoinKhatm";

import ActivityLog from "./pages/khatm/ActivityLog";

import KhatmProgress from "./pages/khatm/KhatmProgress";

import KhatmComplete from "./pages/khatm/KhatmComplete";

import Dua from "./pages/khatm/Dua";

import KhatmDua from "./pages/khatm/KhatmDua";

import ParaReading from "./pages/khatm/ParaReading";


/* =========================
   QURAN
========================= */

import QuranHome from "./pages/quran/QuranHome";

import JuzReading from "./pages/quran/JuzReading";

import SurahReading from "./pages/quran/SurahReading";


/* =========================
   SAVED
========================= */

import Saved from "./pages/saved/Saved";


/* =========================
   PROFILE
========================= */

import Profile from "./pages/profile/Profile";

import Settings from "./pages/profile/Settings";


/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <AuthProvider>

      <KhatmProvider>

        <BrowserRouter>

          <AppRoutes />

        </BrowserRouter>

      </KhatmProvider>

    </AuthProvider>
  );
}


/* =========================================================
   APP ROUTES
========================================================= */

function AppRoutes() {
  const {
    authLoading,
  } = useAuth();


  /* =========================================================
     AUTH LOADING
  ========================================================= */

  if (authLoading) {
    return (
      <AuthLoadingScreen />
    );
  }


  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ====================================================== */}

      <Route
        path="/"
        element={
          <Splash />
        }
      />


      <Route
        path="/onboarding"
        element={
          <Onboarding />
        }
      />


      <Route
        path="/welcome"
        element={
          <Welcome />
        }
      />


      <Route
        path="/forgot-password"
        element={
          <ForgotPassword />
        }
      />


      <Route
        path="/join/:inviteCode"
        element={
          <JoinKhatm />
        }
      />


      {/* =====================================================
          AUTH ROUTES
      ====================================================== */}

      <Route
        element={
          <PublicRoute />
        }
      >

        <Route
          path="/signup"
          element={
            <Signup />
          }
        />


        <Route
          path="/verify-email"
          element={
            <VerifyEmail />
          }
        />


        <Route
          path="/login"
          element={
            <Login />
          }
        />

      </Route>


      {/* =====================================================
          PROTECTED ROUTES
      ====================================================== */}

      <Route
        element={
          <ProtectedRoute />
        }
      >

        {/* ===================================================
            APP LAYOUT ROUTES
        ==================================================== */}

        <Route
          element={
            <AppLayout />
          }
        >

          <Route
            path="/home"
            element={
              <Home />
            }
          />


          <Route
            path="/khatms"
            element={
              <MyKhatms />
            }
          />


          <Route
            path="/quran"
            element={
              <QuranHome />
            }
          />


          <Route
            path="/saved"
            element={
              <Saved />
            }
          />


          <Route
            path="/profile"
            element={
              <Profile />
            }
          />

        </Route>


        {/* ===================================================
            KHATM ROUTES
        ==================================================== */}

        {/* CREATE KHATM */}

        <Route
          path="/khatms/create"
          element={
            <CreateKhatm />
          }
        />


        {/* KHATM DETAILS */}

        <Route
          path="/khatm/:id"
          element={
            <KhatmDetails />
          }
        />


        {/* JUZ DIVISION */}

        <Route
          path="/khatm/:id/paras"
          element={
            <ParaList />
          }
        />


        {/* MEMBERS */}

        <Route
          path="/khatm/:id/members"
          element={
            <Members />
          }
        />


        {/* INVITE */}

        <Route
          path="/khatm/:id/invite"
          element={
            <Invite />
          }
        />


        {/* ACTIVITY */}

        <Route
          path="/khatm/:id/activity"
          element={
            <ActivityLog />
          }
        />


        {/* KHATM PROGRESS */}

        <Route
          path="/khatm/:id/progress"
          element={
            <KhatmProgress />
          }
        />


        {/* OLD / OPTIONAL KHATM COMPLETE PAGE */}

        <Route
          path="/khatm/:id/complete"
          element={
            <KhatmComplete />
          }
        />


        {/* =================================================
            INDIVIDUAL JUZ COMPLETION DUA

            Flow:
            Juz completed
            ↓
            /khatm/:id/dua
            ↓
            Ameen
            ↓
            /home
        ================================================== */}

        <Route
          path="/khatm/:id/dua"
          element={
            <Dua />
          }
        />


        {/* =================================================
            FINAL FULL KHATM DUA

            Flow:
            30 / 30 Juz
            ↓
            Creator sees final button
            ↓
            /khatm/:id/khatm-dua
            ↓
            Fatiha + final Dua
            ↓
            Final Ameen
            ↓
            completeKhatm()
            ↓
            Khatm becomes completed
        ================================================== */}

        <Route
          path="/khatm/:id/khatm-dua"
          element={
            <KhatmDua />
          }
        />


        {/* =================================================
            KHATM JUZ READING
        ================================================== */}

        <Route
          path="/khatm/:id/para/:num/read"
          element={
            <ParaReading />
          }
        />


        {/* ===================================================
            QURAN ROUTES
        ==================================================== */}

        {/* SURAH READING */}

        <Route
          path="/quran/surah/:id"
          element={
            <SurahReading />
          }
        />


        {/* JUZ READING */}

        <Route
          path="/quran/juz/:num/read"
          element={
            <JuzReading />
          }
        />


        {/* ===================================================
            SETTINGS
        ==================================================== */}

        <Route
          path="/settings"
          element={
            <Settings />
          }
        />

      </Route>


      {/* =====================================================
          FALLBACK
      ====================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}