
import React from "react";
import { exportCharacters } from "../utils/localStorage";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { AppIcons } from "./ui/appicons";

const ExportDataButton: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={exportCharacters}
            className="secondary-button flex items-center gap-2"
          >
            <AppIcons.Download />
            Exportar Dados
          </button>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExportDataButton;
