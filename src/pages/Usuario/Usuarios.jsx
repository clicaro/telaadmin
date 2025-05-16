import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Style from './styles.css';
import Header from '../../components/Headeradmin/Header';
import ModalConfirmacao from '../../components/ModalConf/ModalConfirmacao';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: 'Junior Nascimento',
      cpf: '123.456.789-0',
      email: 'junin.minecraft@gmail.com',
      status: 'Ativo',
    },
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    cpf: '',
    email: '',
    status: 'Ativo',
  });

  // NOVOS estados para edição
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  const abrirModal = () => setMostrarModal(true);
  const fecharModal = () => {
    setMostrarModal(false);
    setModoEdicao(false);
    setIdEdicao(null);
    setNovoUsuario({ nome: '', cpf: '', email: '', status: 'Ativo' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  // Alterei aqui para incluir o modo edição
  const handleSalvar = (e) => {
    e.preventDefault();

    if (
      novoUsuario.nome.trim() &&
      novoUsuario.cpf.trim() &&
      novoUsuario.email.trim() &&
      novoUsuario.status.trim()
    ) {
      if (modoEdicao) {
        // Atualiza usuário existente
        setUsuarios((prev) =>
          prev.map((usuario) =>
            usuario.id === idEdicao ? { ...usuario, ...novoUsuario, id: idEdicao } : usuario
          )
        );
      } else {
        // Adiciona novo usuário
        const novo = { ...novoUsuario, id: Date.now() };
        setUsuarios((prev) => [...prev, novo]);
      }

      fecharModal();
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  const handleExcluir = (id) => {
    setIdParaExcluir(id);
    setMostrarConfirmacao(true);
  };

  const confirmarExclusao = () => {
    setUsuarios((prev) => prev.filter((usuario) => usuario.id !== idParaExcluir));
    setMostrarConfirmacao(false);
    setIdParaExcluir(null);
  };

  const cancelarExclusao = () => {
    setMostrarConfirmacao(false);
    setIdParaExcluir(null);
  };

  // Função para abrir modal no modo edição
  const handleEditar = (usuario) => {
    setNovoUsuario({
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      status: usuario.status,
    });
    setModoEdicao(true);
    setIdEdicao(usuario.id);
    abrirModal();
  };

  return (
    <>
      <Header />
      <main className="usuarios-container">
        <div className="usuarios-card">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Email</th>
                <th>Status</th>
                <th className="acoes-coluna"></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nome}</td>
                  <td>{usuario.cpf}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.status}</td>
                  <td className="acoes">
                    <button
                      className="editar-btn"
                      onClick={() => handleEditar(usuario)}
                      aria-label={`Editar ${usuario.nome}`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="excluir-btn"
                      onClick={() => handleExcluir(usuario.id)}
                      aria-label={`Excluir ${usuario.nome}`}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="novo-usuario-container">
            <button
              className="novo-usuario-btn"
              onClick={abrirModal}
              aria-label="Adicionar novo usuário"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </main>

      {mostrarModal && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modoEdicao ? 'Editar Usuário' : 'Novo Usuário'}</h2>
            <form onSubmit={handleSalvar}>
              <label>
                Nome
                <input
                  type="text"
                  name="nome"
                  value={novoUsuario.nome}
                  onChange={handleChange}
                  autoFocus
                />
              </label>
              <label>
                CPF
                <input
                  type="text"
                  name="cpf"
                  value={novoUsuario.cpf}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={novoUsuario.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Status
                <select
                  name="status"
                  value={novoUsuario.status}
                  onChange={handleChange}
                >
                  <option>Ativo</option>
                  <option>Inativo</option>
                </select>
              </label>
              <div className="botoes-modal">
                <button type="submit" className="botao-submit">
                  {modoEdicao ? 'Salvar Alterações' : 'Salvar'}
                </button>
                <button type="button" className="botao-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarConfirmacao && (
        <ModalConfirmacao
          titulo="Excluir Usuário"
          mensagem="Tem certeza que deseja excluir este usuário?"
          onConfirmar={confirmarExclusao}
          onCancelar={cancelarExclusao}
        />
      )}
    </>
  );
};

export default Usuarios;

