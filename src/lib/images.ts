type PortraitVariant = "card" | "profile" | "staff" | "avatar";
type FlyerVariant = "card" | "event" | "thumb" | "lightbox";

const portraitSizes: Record<PortraitVariant, string> = {
  card: "400x533",
  profile: "600x800",
  staff: "400x500",
  avatar: "128x128",
};

const flyerSizes: Record<FlyerVariant, string> = {
  card: "640x800",
  event: "640x360",
  thumb: "96x128",
  lightbox: "1024",
};

function filenameWithoutExtension(src = "") {
  const cleanSrc = src.split("?")[0].split("#")[0];
  const file = cleanSrc.split("/").pop() || "";
  return file.replace(/\.[^.]+$/, "");
}

export function portraitImage(src: string | undefined, variant: PortraitVariant) {
  if (!src) return "";
  return `/portraits/${filenameWithoutExtension(src)}-${variant}-${portraitSizes[variant]}.jpg`;
}

export function flyerImage(src: string, variant: FlyerVariant) {
  return `/flyers/${filenameWithoutExtension(src)}-${variant}-${flyerSizes[variant]}.jpg`;
}
