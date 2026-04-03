/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import IntroVideo from "./components/IntroVideo";
import Events from "./components/Events";
import MCBios from "./components/MCBios";
import GZoneMap from "./components/GZoneMap";
import RecentBattles from "./components/RecentBattles";
import Footer from "./components/Footer";
import MCProfile from "./components/MCProfile";
import HostProfile from "./components/HostProfile";
import JudgeProfile from "./components/JudgeProfile";
import HostsAndJudges from "./components/HostsAndJudges";
import LeaguePreview from "./components/LeaguePreview";
import League from "./pages/League";
import BattleDetail from "./pages/BattleDetail";
import BattlesPage from "./pages/BattlesPage";

import EventsPage from "./pages/EventsPage";
import ApplyPage from "./pages/ApplyPage";
import SuccessPage from "./pages/SuccessPage";
import MCsPage from "./pages/MCsPage";
import ChatPage from "./pages/ChatPage";
import MapPage from "./pages/MapPage";
import PrivacyPage from "./pages/PrivacyPage";

import StaffPage from "./pages/StaffPage";
import FeaturedVideo from "./components/FeaturedVideo";
import LostProperty from "./components/LostProperty";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
}

function Home() {
  const { hash } = useLocation();
  const showIntro = hash === '';

  return (
    <main className={showIntro ? "" : "pt-28 md:pt-32"}>
      <FeaturedVideo />
      <HostsAndJudges />
      <RecentBattles />
      <MCBios />
      <LeaguePreview />
      <GZoneMap />
      <Events limit={2} />
    </main>
  );
}

function Main() {
  const location = useLocation();
  console.log("Current path:", location.pathname);
  return (
    <div className="min-h-screen selection:bg-brand selection:text-black">
      <ScrollToTop />
      <Navbar />
      {location.pathname === '/' && location.hash === '' && <IntroVideo />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/mc/:slug" element={<MCProfile />} />
        <Route path="/host/:id" element={<HostProfile />} />
        <Route path="/judge/:id" element={<JudgeProfile />} />
        <Route path="/league" element={<League />} />
        <Route path="/mcs" element={<MCsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/battles" element={<BattlesPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/battle/:slug" element={<BattleDetail />} />
        <Route path="/lost-property" element={<LostProperty />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Main />
    </Router>
  );
}
