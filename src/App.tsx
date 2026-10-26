/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "./components/Navbar";
import GlobalDisclaimer from "./components/GlobalDisclaimer";
import BackstagePromo from "./components/BackstagePromo";

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
const PersonProfile = lazy(() => import("./components/PersonProfile"));


const League = lazy(() => import("./pages/League"));
const MCsPage = lazy(() => import("./pages/MCsPage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const BattlesPage = lazy(() => import("./pages/BattlesPage"));

const MerchPage = lazy(() => import("./pages/MerchPage"));
const PromoMaterialPage = lazy(() => import("./pages/PromoMaterialPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const PhotosPage = lazy(() => import("./pages/PhotosPage"));
const BattleDetail = lazy(() => import("./pages/BattleDetail"));
const LostProperty = lazy(() => import("./components/LostProperty"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const BackstagePage = lazy(() => import("./pages/BackstagePage"));
const GingerifyPage = lazy(() => import("./pages/GingerifyPage"));
const VotePage = lazy(() => import("./pages/VotePage"));
const VoteLivePage = lazy(() => import("./pages/VoteLivePage"));
const Outside = lazy(() => import("./pages/Outside"));

function LegacyVoteRedirect() {
  const { search, hash } = useLocation();
  const view = new URLSearchParams(search).get("view");
  const target = view === "admin" || view === "display" ? "/backstage/voting" : "/backstage";
  return <Navigate to={`${target}${search}${hash}`} replace />;
}

function LegacyProfileRedirect() {
  const { id, slug } = useParams();
  return <Navigate to={`/${id || slug}`} replace />;
}

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
      <BackstagePromo />
      <LostPropertyPreview />
      <section className="relative w-full overflow-hidden pt-6 pb-16 sm:pt-10 md:pb-24">
        <div className="relative z-20 w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-6">
          <div className="mb-8">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight leading-[1.05] text-brand">
              Ginga Entertainment Ltd presents
            </h2>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
              TRICKYY - THE FALL OF THE ROMAN EMPIRE
            </p>
          </div>
          <div className="relative w-full aspect-video rounded-sm sm:rounded-lg overflow-hidden border border-white/10 bg-[#050505]">
            <iframe
              className="w-full h-full border-0"
              src="https://www.youtube-nocookie.com/embed/tBspxqBPZ1I"
              title="Latest Gzone video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>
      <RecentBattles />
      <MerchSection showShopAll={false} />
      <MCBios />
      <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-6 py-8 md:py-10">
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
      <a href="#main-content" className="skip-link">Skip to content</a>
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
      
      <div id="main-content" tabIndex={-1} className="outline-none">
        <Suspense fallback={isStandaloneVoteLive ? <StandaloneRouteFallback /> : <RouteFallback />}>
          <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/mc/:slug" element={<LegacyProfileRedirect />} />
          <Route path="/host/:id" element={<LegacyProfileRedirect />} />
          <Route path="/judge/:id" element={<LegacyProfileRedirect />} />
          <Route path="/league" element={<League />} />
          <Route path="/whoswho" element={<MCsPage />} />
          <Route path="/battles/mc" element={<Navigate to="/whoswho" replace />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/battles" element={<BattlesPage />} />
          <Route path="/freestyle" element={<Navigate to="/battles#freestyle" replace />} />
          <Route path="/staff" element={<Navigate to="/whoswho" replace />} />
          <Route path="/merch" element={<MerchPage />} />
          <Route path="/flyers" element={<PromoMaterialPage />} />
          <Route path="/promo" element={<Navigate to="/flyers" replace />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/battle/:slug" element={<BattleDetail />} />
          <Route path="/gingabay" element={<LostProperty />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/backstage" element={<BackstagePage />} />
          <Route path="/backstage/gingerify" element={<GingerifyPage />} />
          <Route path="/backstage/settings" element={<BackstagePage />} />
          <Route path="/backstage/voting" element={<VotePage />} />
          <Route path="/vote" element={<LegacyVoteRedirect />} />
          <Route path="/vote/live" element={<VoteLivePage />} />
          <Route path="/outside" element={<Outside />} />
          <Route path="/gzone-street-freestyles" element={<Navigate to="/outside?series=freestyles" replace />} />
          <Route path="/GzoneStreetFreestyles" element={<Navigate to="/outside?series=freestyles" replace />} />
          <Route path="/gzonestreetfreestyles" element={<Navigate to="/outside?series=freestyles" replace />} />
          <Route path="/street" element={<Navigate to="/outside?series=freestyles" replace />} />
          <Route path="/cyphers" element={<Navigate to="/outside?series=cyphers" replace />} />
          <Route path="/gzone-cyphers" element={<Navigate to="/outside?series=cyphers" replace />} />
          <Route path="/gzonecyphers" element={<Navigate to="/outside?series=cyphers" replace />} />
          <Route path="/cypher" element={<Navigate to="/outside?series=cyphers" replace />} />
          <Route path="/royal-rumble" element={<Navigate to="/battles#royal-rumble" replace />} />
          <Route path="/royalrumble" element={<Navigate to="/battles#royal-rumble" replace />} />
          <Route path="/RoyalRumble" element={<Navigate to="/battles#royal-rumble" replace />} />
          <Route path="/1flaymr" element={<Navigate to="/1flaymah" replace />} />
          <Route path="/:slug" element={<PersonProfile />} />
        </Routes>
      </Suspense>
      </div>
      
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
