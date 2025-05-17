// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Usuarios from './pages/Usuario/Usuarios';
import Empresas from './pages/Empresa/Empresas';
import Servicos from './pages/Servicos/Servicos';
import { ServicosProvider } from './components/ServicosContext/ServicosContext';

const App = () => {
  return (
    <Router>
      <ServicosProvider>
        <Routes>
          <Route path="/" element={<Usuarios />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/servicos" element={<Servicos />} />
        </Routes>
      </ServicosProvider>
    </Router>
  );
};

export default App;

