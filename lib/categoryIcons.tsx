import {
  Wrench,
  Gauge,
  Zap,
  Lightbulb,
  PaintBucket,
  CircleDot,
  Wind,
  Thermometer,
  Armchair,
  Package,
  type LucideIcon,
} from "lucide-react";

const REGLAS: { match: string; icon: LucideIcon }[] = [
  { match: "motor", icon: Wrench },
  { match: "transmision", icon: Wrench },
  { match: "freno", icon: Gauge },
  { match: "suspension", icon: Gauge },
  { match: "electric", icon: Zap },
  { match: "bateria", icon: Zap },
  { match: "iluminacion", icon: Lightbulb },
  { match: "luz", icon: Lightbulb },
  { match: "foco", icon: Lightbulb },
  { match: "carroceria", icon: PaintBucket },
  { match: "pintura", icon: PaintBucket },
  { match: "neumatic", icon: CircleDot },
  { match: "llanta", icon: CircleDot },
  { match: "escape", icon: Wind },
  { match: "emision", icon: Wind },
  { match: "refrigera", icon: Thermometer },
  { match: "radiador", icon: Thermometer },
  { match: "accesorio", icon: Armchair },
  { match: "interior", icon: Armchair },
];

export function getCategoryIcon(slug: string): LucideIcon {
  const encontrada = REGLAS.find((r) => slug.includes(r.match));
  return encontrada?.icon ?? Package;
}
