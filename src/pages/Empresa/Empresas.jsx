import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Header from '../../components/Headeradmin/Header';
import ModalConfirmacao from '../../components/ModalConf/ModalConfirmacao';
import Style from './styles.css';

const Empresas = () => {
  const [empresas, setEmpresas] = useState([
    {
      id: 1,
      nome: 'Empresa Exemplo LTDA',
      cnpj: '12.345.678/0001-90',
      transportadoras: 'Transportadora XYZ',
      status: 'Ativo',
    },
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const [novaEmpresa, setNovaEmpresa] = useState({
    nome: '',
    cnpj: '',
    transportadoras: '',
    status: 'Ativo',
  });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  const abrirModal = () => setMostrarModal(true);
  const fecharModal = () => {
    setMostrarModal(false);
    setModoEdicao(false);
    setIdEdicao(null);
    setNovaEmpresa({ nome: '', cnpj: '', transportadoras: '', status: 'Ativo' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaEmpresa((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = (e) => {
    e.preventDefault();

    if (
      novaEmpresa.nome.trim() &&
      novaEmpresa.cnpj.trim() &&
      novaEmpresa.transportadoras.trim() &&
      novaEmpresa.status.trim()
    ) {
      if (modoEdicao) {
        setEmpresas((prev) =>
          prev.map((empresa) =>
            empresa.id === idEdicao ? { ...empresa, ...novaEmpresa, id: idEdicao } : empresa
          )
        );
      } else {
        const novo = { ...novaEmpresa, id: Date.now() };
        setEmpresas((prev) => [...prev, novo]);
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
    setEmpresas((prev) => prev.filter((empresa) => empresa.id !== idParaExcluir));
    setMostrarConfirmacao(false);
    setIdParaExcluir(null);
  };

  const cancelarExclusao = () => {
    setMostrarConfirmacao(false);
    setIdParaExcluir(null);
  };

  const handleEditar = (empresa) => {
    setNovaEmpresa({
      nome: empresa.nome,
      cnpj: empresa.cnpj,
      transportadoras: empresa.transportadoras,
      status: empresa.status,
    });
    setModoEdicao(true);
    setIdEdicao(empresa.id);
    abrirModal();
  };

  return (
    <>
      <Header />
      <main className="empresas-container">
        <div className="empresas-card">
          <table className="empresas-table">
            <thead>
              <tr>
                <th>Razão Social</th>
                <th>CNPJ</th>
                <th>Transportadoras</th>
                <th>Status</th>
                <th className="acoes-coluna"></th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id}>
                  <td>{empresa.nome}</td>
                  <td>{empresa.cnpj}</td>
                  <td>{empresa.transportadoras}</td>
                  <td>{empresa.status}</td>
                  <td className="acoes">
                    <button
                      className="editar-btn"
                      onClick={() => handleEditar(empresa)}
                      aria-label={`Editar ${empresa.nome}`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="excluir-btn"
                      onClick={() => handleExcluir(empresa.id)}
                      aria-label={`Excluir ${empresa.nome}`}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="novo-empresa-container">
            <button
              className="novo-empresa-btn"
              onClick={abrirModal}
              aria-label="Adicionar nova empresa"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </main>

      {mostrarModal && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modoEdicao ? 'Editar Empresa' : 'Nova Empresa'}</h2>
            <form onSubmit={handleSalvar}>
              <label>
                Razão Social
                <input
                  type="text"
                  name="nome"
                  value={novaEmpresa.nome}
                  onChange={handleChange}
                  autoFocus
                />
              </label>
              <label>
                CNPJ
                <input
                  type="text"
                  name="cnpj"
                  value={novaEmpresa.cnpj}
                  onChange={handleChange}
                />
              </label>
              <label>
                Transportadoras
                <input
                  type="text"
                  name="transportadoras"
                  value={novaEmpresa.transportadoras}
                  onChange={handleChange}
                />
              </label>
              <label>
                Status
                <select
                  name="status"
                  value={novaEmpresa.status}
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
          titulo="Excluir Empresa"
          mensagem="Tem certeza que deseja excluir esta empresa?"
          onConfirmar={confirmarExclusao}
          onCancelar={cancelarExclusao}
        />
      )}
    </>
  );
};

export default Empresas;
