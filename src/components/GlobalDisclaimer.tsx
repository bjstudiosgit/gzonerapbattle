import React from "react";

interface GlobalDisclaimerProps {
  className?: string;
}

export default function GlobalDisclaimer({ className = "" }: GlobalDisclaimerProps) {
  return (
    <p className={`text-zinc-400 text-base md:text-lg leading-relaxed font-medium ${className}`}>
      All performances occur within a controlled environment and are for entertainment purposes only. The G-Zone provides a platform where MCs can express themselves freely in a setting built on respect, discipline, and behavioural standards.
      {" "}
      Licensed security is present at all events. The G-Zone does not endorse prejudice, racism, discrimination, or violence of any kind.
    </p>
  );
}
