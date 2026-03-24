/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import IntroVideo from "./components/IntroVideo";
import Events from "./components/Events";
import Merch from "./components/Merch";
import MCBios from "./components/MCBios";
import RecentBattles from "./components/RecentBattles";
import Footer from "./components/Footer";
import MCProfile from "./components/MCProfile";
import HostProfile from "./components/HostProfile";
import JudgeProfile from "./components/JudgeProfile";
import HostsAndJudges from "./components/HostsAndJudges";
import ApplySection from "./components/ApplySection";
import League from "./pages/League";
import BattleDetail from "./pages/BattleDetail";
import BattlesPage from "./pages/BattlesPage";

import EventsPage from "./pages/EventsPage";
import MerchPage from "./pages/MerchPage";
import ApplyPage from "./pages/ApplyPage";
import SuccessPage from "./pages/SuccessPage";
import MCsPage from "./pages/MCsPage";
import ChatPage from "./pages/ChatPage";

import FeaturedVideo from "./components/FeaturedVideo";

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
  return (
    <main>
      <FeaturedVideo />
      <HostsAndJudges />
      <RecentBattles />
      <MCBios />
      <Events />
      <Merch />
    </main>
  );
}

function Main() {
  const location = useLocation();
  console.log("Current path:", location.pathname);
  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-brand selection:text-black">
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
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/battles" element={<BattlesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/merch" element={<MerchPage />} />
        <Route path="/battle/:slug" element={<BattleDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}
