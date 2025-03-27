
import React from 'react';
import { exportCharacters } from '../utils/localStorage';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full glass-panel p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 medieval-border">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-medieval text-white">
          <span className="text-mu-gold">MU</span>
          <span className="tracking-wide"> Gerenciador de Contas</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe, analise e gerencie a progressão dos seus personagens
        </p>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={exportCharacters}
              className="secondary-button flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Exportar Dados
            </button>
          </TooltipTrigger>
          <TooltipContent className="w-80 p-4">
            <div className="space-y-2">
              <h3 className="font-medium">Como exportar seus dados:</h3>
              <p className="text-sm text-muted-foreground">
                Clique no botão &quot;Exportar Dados&quot; para baixar um arquivo JSON contendo todos os seus personagens cadastrados.
              </p>
              <p className="text-sm text-muted-foreground">
                Este arquivo pode ser salvo como backup e importado posteriormente em outra instalação do sistema.
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                Formato: JSON (JavaScript Object Notation)
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  );
};

export default Header;
