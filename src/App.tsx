/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "./components/Navbar";
import GlobalDisclaimer from "./components/GlobalDisclaimer";

const Footer = lazy(() => import("./components/Footer"));
const ArenaAtmosphere = lazy(() => import("./components/ArenaAtmosphere"));
const IntroVideo = lazy(() => import("./components/IntroVideo"));
const FeaturedVideo = lazy(() => import("./components/FeaturedVideo"));
const MerchSection = lazy(() => import("./components/MerchSection"));
const UpcomingEventLanding = lazy(() =>
  import("./components/UpcomingEventLanding").then((module) => ({ default: module.UpcomingEventLanding }))
);
const RecentBattles = lazy(() => import("./components/RecentBattles"));
const MCBios = lazy(() => import("./components/MCBios"));
const LostPropertyPreview = lazy(() => import("./components/LostPropertyPreview"));

const ApplyPage = lazy(() => import("./pages/ApplyPage"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const MCProfile = lazy(() => import("./components/MCProfile"));
const HostProfile = lazy(() => import("./components/HostProfile"));
const JudgeProfile = lazy(() => import("./components/JudgeProfile"));
const League = lazy(() => import("./pages/League"));
const MCsPage = lazy(() => import("./pages/MCsPage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const BattlesPage = lazy(() => import("./pages/BattlesPage"));
const StaffPage = lazy(() => import("./pages/StaffPage"));
const MerchPage = lazy(() => import("./pages/MerchPage"));
const PromoMaterialPage = lazy(() => import("./pages/PromoMaterialPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const PhotosPage = lazy(() => import("./pages/PhotosPage"));
const BattleDetail = lazy(() => import("./pages/BattleDetail"));
const LostProperty = lazy(() => import("./components/LostProperty"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const VotePage = lazy(() => import("./pages/VotePage"));
const VoteLivePage = lazy(() => import("./pages/VoteLivePage"));
const GzoneStreetFreestyles = lazy(() => import("./pages/GzoneStreetFreestyles"));
const GzoneCyphers = lazy(() => import("./pages/GzoneCyphers"));
const RoyalRumblePage = lazy(() => import("./pages/RoyalRumblePage"));

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

function StandaloneRouteFallback() {
  return (
    <div className="min-h-[100dvh] bg-black flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-zinc-800 border-t-orange-500 animate-spin" />
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
      <RecentBattles />
      <MerchSection showShopAll={false} />
      <MCBios />
      <LostPropertyPreview />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <GlobalDisclaimer />
      </div>
    </main>
  );
}

function Main() {
  const location = useLocation();
  const [showAtmosphere, setShowAtmosphere] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const isStandaloneVoteLive = location.pathname === "/vote/live";

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
        <title>Gzone Rap Battle League, Where we dont play!</title>
        <meta name="description" content="The Gzone Rap Battle League - Where reputations are built or buried. Watch the best MCs clash in the UK's premier battle rap arena." />
      </Helmet>
      <ScrollToTop />
      {showAtmosphere && !isStandaloneVoteLive && (
        <Suspense fallback={null}>
          <ArenaAtmosphere />
        </Suspense>
      )}
      {!isStandaloneVoteLive && <Navbar />}
      
      {!isStandaloneVoteLive && location.pathname === '/' && location.hash === '' && (
        <Suspense fallback={null}>
          <IntroVideo />
        </Suspense>
      )}
      
      <Suspense fallback={isStandaloneVoteLive ? <StandaloneRouteFallback /> : <RouteFallback />}>
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
          <Route path="/battles" element={<BattlesPage />} />
          <Route path="/freestyle" element={<BattlesPage variant="freestyle" />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/merch" element={<MerchPage />} />
          <Route path="/flyers" element={<PromoMaterialPage />} />
          <Route path="/promo" element={<Navigate to="/flyers" replace />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/battle/:slug" element={<BattleDetail />} />
          <Route path="/lost-property" element={<LostProperty />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/vote/live" element={<VoteLivePage />} />
          <Route path="/gzone-street-freestyles" element={<GzoneStreetFreestyles />} />
          <Route path="/GzoneStreetFreestyles" element={<Navigate to="/gzone-street-freestyles" replace />} />
          <Route path="/gzonestreetfreestyles" element={<Navigate to="/gzone-street-freestyles" replace />} />
          <Route path="/street" element={<Navigate to="/gzone-street-freestyles" replace />} />
          <Route path="/cyphers" element={<GzoneCyphers />} />
          <Route path="/gzone-cyphers" element={<Navigate to="/cyphers" replace />} />
          <Route path="/gzonecyphers" element={<Navigate to="/cyphers" replace />} />
          <Route path="/cypher" element={<Navigate to="/cyphers" replace />} />
          <Route path="/royal-rumble" element={<RoyalRumblePage />} />
          <Route path="/royalrumble" element={<Navigate to="/royal-rumble" replace />} />
          <Route path="/RoyalRumble" element={<Navigate to="/royal-rumble" replace />} />
        </Routes>
      </Suspense>
      
      {showFooter && !isStandaloneVoteLive && (
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
