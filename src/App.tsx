/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "./components/Navbar";

const Footer = lazy(() => import("./components/Footer"));
const ArenaAtmosphere = lazy(() => import("./components/ArenaAtmosphere"));
const IntroVideo = lazy(() => import("./components/IntroVideo"));
const FeaturedVideo = lazy(() => import("./components/FeaturedVideo"));
const UpcomingEventLanding = lazy(() =>
  import("./components/UpcomingEventLanding").then((module) => ({ default: module.UpcomingEventLanding }))
);
const HostsAndJudges = lazy(() => import("./components/HostsAndJudges"));
const RecentBattles = lazy(() => import("./components/RecentBattles"));
const MCBios = lazy(() => import("./components/MCBios"));

const ApplyPage = lazy(() => import("./pages/ApplyPage"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const MCProfile = lazy(() => import("./components/MCProfile"));
const HostProfile = lazy(() => import("./components/HostProfile"));
const JudgeProfile = lazy(() => import("./components/JudgeProfile"));
const League = lazy(() => import("./pages/League"));
const MCsPage = lazy(() => import("./pages/MCsPage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const BattlesPage = lazy(() => import("./pages/BattlesPage"));
const StaffPage = lazy(() => import("./pages/StaffPage"));
const PromoMaterialPage = lazy(() => import("./pages/PromoMaterialPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const PhotosPage = lazy(() => import("./pages/PhotosPage"));
const BattleDetail = lazy(() => import("./pages/BattleDetail"));
const LostProperty = lazy(() => import("./components/LostProperty"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));

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

function RouteFallback() {
  return (
    <div className="min-h-[60vh] pt-44 flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
    </div>
  );
}

function Home() {
  const { hash } = useLocation();
  const showIntro = hash === '';

  return (
    <main className={showIntro ? "" : "pt-28 md:pt-32"}>
      <FeaturedVideo />
      <UpcomingEventLanding />
      <HostsAndJudges />
      <RecentBattles />
      <MCBios />
    </main>
  );
}

function Main() {
  const location = useLocation();
  const [showAtmosphere, setShowAtmosphere] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const loadDeferredChrome = () => {
      setShowFooter(true);
      if (!isMobile) {
        setShowAtmosphere(true);
      }
    };
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const hasIdleCallback = typeof idleWindow.requestIdleCallback === "function";
    const idleId = hasIdleCallback
      ? idleWindow.requestIdleCallback(loadDeferredChrome, { timeout: 1800 })
      : window.setTimeout(loadDeferredChrome, 900);

    return () => {
      if (hasIdleCallback && typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen selection:bg-brand selection:text-black bg-black">
      <Helmet>
        <title>Lord of the Archives | UK Battle Rap & MC Battles</title>
        <meta name="description" content="The Gzone Rap Battle League - Where reputations are built or buried. Watch the best MCs clash in the UK's premier battle rap arena." />
      </Helmet>
      <ScrollToTop />
      {showAtmosphere && (
        <Suspense fallback={null}>
          <ArenaAtmosphere />
        </Suspense>
      )}
      <Navbar />
      
      {location.pathname === '/' && location.hash === '' && (
        <Suspense fallback={null}>
          <IntroVideo />
        </Suspense>
      )}
      
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/mc/:slug" element={<MCProfile />} />
          <Route path="/host/:id" element={<HostProfile />} />
          <Route path="/judge/:id" element={<JudgeProfile />} />
          <Route path="/league" element={<League />} />
          <Route path="/battles/mc" element={<MCsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/battles" element={<BattlesPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/promo" element={<PromoMaterialPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/battle/:slug" element={<BattleDetail />} />
          <Route path="/lost-property" element={<LostProperty />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </Suspense>
      
      {showFooter && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
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
