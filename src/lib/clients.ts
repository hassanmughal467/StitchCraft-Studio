/**
 * Reserved client display slots.
 * REPLACE_WITH_CLIENT:
 * - clientName (only with permission)
 * - image.src with a real sew-out or logo
 * Do not invent brand names or results.
 */
import type { PortfolioCategory } from "@/lib/portfolio";

export type ClientSlot = {
  id: string;
  slot: string;
  category: Exclude<PortfolioCategory, "All" | "Clients">;
  placement: string;
  industry: string;
  /** Leave empty until the client approves being shown. */
  clientName: string;
  image?: {
    src: string;
    alt: string;
    placeholder: true;
    credit: string;
  };
};

export const clientSlots: ClientSlot[] = [
  { id: "client-01", slot: "01", category: "Logos", placement: "Left chest", industry: "Apparel brand", clientName: "" },
  { id: "client-02", slot: "02", category: "Caps", placement: "Cap front", industry: "Sports team", clientName: "" },
  { id: "client-03", slot: "03", category: "Jackets", placement: "Jacket back", industry: "Merchandise", clientName: "" },
  { id: "client-04", slot: "04", category: "Patches", placement: "Merrowed badge", industry: "Workwear", clientName: "" },
  { id: "client-05", slot: "05", category: "Uniforms", placement: "Shirt + cap set", industry: "Hospitality", clientName: "" },
  { id: "client-06", slot: "06", category: "3D Puff", placement: "Raised lettering", industry: "Campus / team", clientName: "" },
  { id: "client-07", slot: "07", category: "Appliqué", placement: "Fleece mark", industry: "Fashion", clientName: "" },
  { id: "client-08", slot: "08", category: "Workwear", placement: "Industrial chest", industry: "Uniform program", clientName: "" },
];

export const clientLogoSlots = [
  { id: "logo-01", label: "Client mark 01" },
  { id: "logo-02", label: "Client mark 02" },
  { id: "logo-03", label: "Client mark 03" },
  { id: "logo-04", label: "Client mark 04" },
  { id: "logo-05", label: "Client mark 05" },
  { id: "logo-06", label: "Client mark 06" },
] as const;
