import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Usuarios from './pages/Usuario/Usuarios';
import Empresas from './pages/Empresa/Empresas';
import Servicos from './pages/Servicos/Servicos';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Usuarios />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/servicos" element={<Servicos />} />
      </Routes>
    </Router>
  );
};

export default App;
