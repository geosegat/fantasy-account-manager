
import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderTitle: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center sm:text-left">
      <h1
        className="text-3xl sm:text-4xl font-medieval text-white cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="text-mu-gold">MU</span>
        <span className="tracking-wide"> Gerenciador de Contas</span>
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Acompanhe, analise e gerencie a progressão dos seus personagens
      </p>
    </div>
  );
};

export default HeaderTitle;
