"use client";
import IntroVideo from "../components/IntroVideo";
import RecentBattles from "../components/RecentBattles";
// Assuming there was a RecentBattles or something on the homepage based on App.tsx imports I saw earlier

export default function HomePage() {
  return (
    <main>
      <IntroVideo />
      <RecentBattles />
    </main>
  );
}
