import React from "react";

interface GlobalDisclaimerProps {
  className?: string;
}

export default function GlobalDisclaimer({ className = "" }: GlobalDisclaimerProps) {
  return (
    <p className={`font-sans font-normal text-white text-base md:text-lg leading-relaxed text-left w-full ${className}`}>
      All performances occur within a <span>controlled environment</span> and are for <span>entertainment purposes only</span>. The G-Zone provides a platform where MCs can express themselves freely in a setting built on <span>respect, discipline, and behavioural standards</span>. <span>Licensed security</span> is present at all events. The G-Zone <span>does not endorse prejudice, racism, discrimination, or violence of any kind</span>.
    </p>
  );
}
