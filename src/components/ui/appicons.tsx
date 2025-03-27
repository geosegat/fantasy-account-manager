import {
  Check,
  ArrowLeft,
  Save,
  Upload,
  Download,
  File,
  ChartLine,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowUpDown,
  X,
} from "lucide-react";
import { RefAttributes, SVGProps } from "react";

export const AppIcons = {
  Check,
  ArrowLeft,
  Save,
  Upload,
  Download,
  File,
  ChartLine,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowUpDown,
  X,
} as const;

export type APP_ICON_ID = keyof typeof AppIcons;

export type APP_ICON_ICON_PROPS = RefAttributes<SVGSVGElement> &
  Partial<SVGProps<SVGSVGElement>>;
