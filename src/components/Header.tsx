
import React from "react";
import HeaderTitle from "./HeaderTitle";
import ExportDataButton from "./ExportDataButton";
import ImportDataButton from "./ImportDataButton";

interface HeaderProps {
  onImportSuccess?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onImportSuccess }) => {
  return (
    <header className="w-full glass-panel p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <HeaderTitle />
      <div className="flex items-center gap-4">
        <ExportDataButton />
        <ImportDataButton onImportSuccess={onImportSuccess} />
      </div>
    </header>
  );
};

export default Header;
