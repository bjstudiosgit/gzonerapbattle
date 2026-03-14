/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import IntroVideo from "./components/IntroVideo";
import Events from "./components/Events";
import Merch from "./components/Merch";
import MCBios from "./components/MCBios";
import LeagueTable from "./components/LeagueTable";
import RecentBattles from "./components/RecentBattles";
import Footer from "./components/Footer";
import MCProfile from "./components/MCProfile";
import HostProfile from "./components/HostProfile";
import RingGirlProfile from "./components/RingGirlProfile";
import HostsAndJudges from "./components/HostsAndJudges";
import ApplySection from "./components/ApplySection";
import League from "./pages/League";
import BattleDetail from "./pages/BattleDetail";
import BattlesPage from "./pages/BattlesPage";

import EventsPage from "./pages/EventsPage";
import MerchPage from "./pages/MerchPage";
import ApplyPage from "./pages/ApplyPage";

function Home() {
  return (
    <main>
      <ApplySection />
      <RecentBattles />
      <HostsAndJudges />
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
      <Navbar />
      {location.pathname === '/' && location.hash === '' && <IntroVideo />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/mc/:id" element={<MCProfile />} />
        <Route path="/host/:id" element={<HostProfile />} />
        <Route path="/ringgirl/:id" element={<RingGirlProfile />} />
        <Route path="/league" element={<League />} />
        <Route path="/battles" element={<BattlesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/merch" element={<MerchPage />} />
        <Route path="/battle/:id" element={<BattleDetail />} />
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
