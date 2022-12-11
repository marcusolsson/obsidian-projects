export interface FitProp {
  readonly label: string;
  readonly icon: string;
  readonly style: string;
}

export let Crop: FitProp = {
  label: "Crop",
  icon: "crop",
  style: "cover",
};

export let Fit: FitProp = {
  label: "Fit",
  icon: "maximize",
  style: "contain",
};

export let Undefined: FitProp = {
  label: "Unset",
  icon: "slash",
  style: "fill",
};

export interface GalleryConfig {
  readonly coverField?: string;
  readonly objectFit?: FitProp;
}
