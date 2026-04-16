import React from "react";

interface GlobalDisclaimerProps {
  className?: string;
}

export default function GlobalDisclaimer({ className = "" }: GlobalDisclaimerProps) {
  return (
    <p className={`text-zinc-500 tracking-normal leading-relaxed ${className}`}>
      No filters. No protection. All performances occur within a controlled environment and are for entertainment purposes only. The GZone does not endorse prejudice, racism, or discrimination of any kind.
    </p>
  );
}
