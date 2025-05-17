// src/context/ServicosProvider.js
import React, { createContext, useState, useEffect, useContext } from 'react';

export const ServicosContext = createContext();

export const ServicosProvider = ({ children }) => {
  const [servicos, setServicos] = useState([]);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('servicos');
    if (dadosSalvos) {
      setServicos(JSON.parse(dadosSalvos));
    }
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('servicos', JSON.stringify(servicos));
  }, [servicos]);

  return (
    <ServicosContext.Provider value={{ servicos, setServicos }}>
      {children}
    </ServicosContext.Provider>
  );
};

// ✅ Adicione isso no final
export const useServicos = () => useContext(ServicosContext);
