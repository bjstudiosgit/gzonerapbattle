import React from "react";

interface GlobalDisclaimerProps {
  className?: string;
}

export default function GlobalDisclaimer({ className = "" }: GlobalDisclaimerProps) {
  return (
    <p className={`text-zinc-200 text-base md:text-lg leading-relaxed font-medium text-left w-full ${className}`}>
      All performances occur within a <span className="text-brand">controlled environment</span> and are for <span className="text-brand">entertainment purposes only</span>. The G-Zone provides a platform where MCs can express themselves freely in a setting built on <span className="text-brand">respect, discipline, and behavioural standards</span>. <span className="text-brand">Licensed security</span> is present at all events. The G-Zone <span className="text-brand">does not endorse prejudice, racism, discrimination, or violence of any kind</span>.
    </p>
  );
}
