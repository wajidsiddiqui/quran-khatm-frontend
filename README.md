# Quran Khatm

**Complete the Quran together, one Juz at a time.**

Quran Khatm is a full-stack web app I built for families and friends who want to complete a full reading of the Quran (a *Khatm*) together, often for a loved one who has passed away or for a special intention.

One person starts a Khatm and shares an invite link. Everyone who joins picks one or more of the 30 Juz to read. The app shows who is reading what, sends notifications as people make progress, and guides everyone through the Dua when a Juz, and finally the whole Khatm, is complete.

It also works on its own as a clean Quran reader: all 114 Surahs and 30 Juz, Arabic with English translation, recitation audio, and bookmarks.

- **Live app:** _add your Render link here_
- **Backend repo:** [quran-khatm-backend](https://github.com/wajidsiddiqui/quran-khatm-backend)
- **Built by:** Mohammed Abdul Wajid Siddiqui ([GitHub](https://github.com/wajidsiddiqui))

---

## How it works

1. **Create a Khatm.** Give it a name, say who it is for ("In memory of…"), add an optional message, and choose who can join.
2. **Invite people.** Share the invite link or code with family and friends.
3. **Claim a Juz.** Each person picks the Juz they will read. Two people can never end up with the same Juz.
4. **Read inside the app.** Your Juz opens in the reader, which remembers where you stopped.
5. **Mark it as completed.** You're taken to the Juz completion Dua, and everyone in the Khatm gets notified.
6. **Finish the Khatm.** When all 30 Juz are done, the creator is guided through Surah Al-Fatihah and the final Khatm Dua, and the Khatm is marked complete.

---

## Features

### Group Khatm
- Create a Khatm with a dedication, message and privacy setting
- Invite by link or code
- Claim a Juz (safe even if two people tap at the same moment)
- Progress ring and a 30-Juz grid showing available, claimed and completed
- Members list showing who claimed and completed which Juz
- Activity feed: who joined, who claimed, who completed
- **Notifications** for Khatm activity, with "mark all as read"
- **Juz completion Dua** after each Juz, and a **final Khatm Dua** (with the Fatiha method) when all 30 are done

### Quran reader
- All **114 Surahs** with search, and all **30 Juz** listed with their Arabic names
- Opens straight into the text, with a decorative heading for every Surah showing its number of verses, Makki/Madani, number of Rukus and revelation order
- The **Bismillah** appears on its own line at the start of each Surah: as verse 1 only in Al-Fatihah, and not at all in At-Tawbah
- **Quran / Translation** switch (English: Saheeh International)
- **Listen** to a whole Surah, or tap any verse to hear just that verse (Mishary Alafasy)
- **Bookmarks and reading progress:** save a verse and continue later from the **Saved** tab or the Home screen
- Adjustable Quran font size

### Account
- Sign up and log in (secure passwords, stays logged in)
- Profile with your active and completed Khatms
- Settings page

---

## Tech stack

| Part | What I used |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Lucide icons |
| Backend | Node.js, Express, MongoDB Atlas with Mongoose ([backend repo](https://github.com/wajidsiddiqui/quran-khatm-backend)) |
| Auth | JWT tokens, bcrypt-hashed passwords |
| Quran text and translation | [AlQuran Cloud API](https://alquran.cloud/api) (free, no key needed) |
| Recitation audio | Islamic Network CDN (Mishary Rashid Alafasy) |
| Hosting | Render |

---

## Project structure

```
src/
├── pages/
│   ├── onboarding/     Splash and intro screens
│   ├── auth/           Welcome, sign up, log in
│   ├── home/           Home dashboard
│   ├── khatm/          Create, details, Juz list, members, invite, progress, reading, Duas
│   ├── quran/          Quran home, Surah reading, Juz reading
│   ├── saved/          Bookmarks and reading progress
│   └── profile/        Profile and settings
├── components/         Reusable UI (cards, Surah heading, progress ring, bottom nav…)
├── context/            AuthContext (login) and KhatmContext (Khatm data and actions)
├── services/           API calls: our backend, reading progress, Quran text
├── hooks/              Verse and Surah audio player, Juz progress
└── utils/              Quran helpers
```

---

## Run it on your computer

You need **Node.js 18+**, and the [backend](https://github.com/wajidsiddiqui/quran-khatm-backend) running on port 5000.

```bash
git clone https://github.com/wajidsiddiqui/quran-khatm-frontend.git
cd quran-khatm-frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

Then start it:

```bash
npm run dev
```

Open **http://localhost:5173**. The app is designed mobile-first, so it looks best at phone width.

> If Vite starts on **5174** instead of 5173, another dev server is still running. The backend only accepts 5173, so you'll see "Failed to fetch". Stop the other server and start again.

---

## Recent updates (November 2026)

- **Bismillah** is now shown on its own line instead of being joined to verse 1
- **Juz 29 and 30 load reliably.** They contain many short Surahs and used to fail when they were all requested at once; they now load a few at a time.
- **Create Khatm** now waits for the save, keeps your privacy choice and opens the invite page
- **Refreshing** a Khatm page no longer sends you back to My Khatms, and opening a Khatm shows other members' latest claims
- Member counts show correctly on My Khatms
- Dark green backgrounds restored on the Splash and Khatm Complete screens
- "Para" renamed to **"Juz"** everywhere in the app

---

## What's next

- Invite links for new users: open an invite, sign up, and land back on the Khatm
- Email verification and password reset (built, currently switched off)
- Leave a Khatm, or give back a Juz you can't finish

---

## Credits

- Quran text and translation: [AlQuran Cloud](https://alquran.cloud) (Tanzil Uthmani text, Saheeh International translation)
- Recitation audio: [Islamic Network](https://islamic.network), recited by Mishary Rashid Alafasy
- Reading experience inspired by [Quran.com](https://quran.com)

May Allah accept it from all of us.
