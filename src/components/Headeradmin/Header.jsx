import React from 'react';
import { NavLink } from 'react-router-dom';
import Style from './styles.css'; // só remover o "Style from" que não está sendo usado

const Header = () => {
  return (
    <header className="header">
      {/* Menu de navegação */}
      <nav className="header-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
          end // para que o '/' só seja ativo na rota raiz
        >
          Usuarios
        </NavLink>
        <NavLink
          to="/empresas"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          Empresas
        </NavLink>
        <NavLink
          to="/servicos"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          Serviços
        </NavLink>
      </nav>

      <div className="header-right" />
    </header>
  );
};

export default Header;

