import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Header from '../../components/Headeradmin/Header';
import ModalConfirmacao from '../../components/ModalConf/ModalConfirmacao';
import { useServicos } from '../../components/ServicosContext/ServicosContext';
import Style from './styles.css';

const Empresas = () => {
  const { servicos } = useServicos();

  const [empresas, setEmpresas] = useState([
    {
      id: 1,
      nome: 'Empresa Exemplo LTDA',
      cnpj: '12.345.678/0001-90',
      transportadoras: [1, 2], // IDs dos serviços
      status: 'Ativo',
      usuariosVinculados: [
        { nome: 'João da Silva', email: 'joao@empresa.com', cargo: 'Gerente' },
        { nome: 'Maria Souza', email: 'maria@empresa.com', cargo: 'Analista' },
      ],
    },
  ]);

  const [empresaExpandidaId, setEmpresaExpandidaId] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const [novaEmpresa, setNovaEmpresa] = useState({
    nome: '',
    cnpj: '',
    transportadoras: [],
    status: 'Ativo',
  });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  const abrirModal = () => setMostrarModal(true);
  const fecharModal = () => {
    setMostrarModal(false);
    setModoEdicao(false);
    setIdEdicao(null);
    setNovaEmpresa({ nome: '', cnpj: '', transportadoras: [], status: 'Ativo' });
  };

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === 'transportadoras') {
      const selecionados = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => parseInt(option.value));
      setNovaEmpresa((prev) => ({ ...prev, transportadoras: selecionados }));
    } else {
      setNovaEmpresa((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    if (
      novaEmpresa.nome.trim() &&
      novaEmpresa.cnpj.trim() &&
      novaEmpresa.transportadoras.length > 0 &&
      novaEmpresa.status.trim()
    ) {
      if (modoEdicao) {
        setEmpresas((prev) =>
          prev.map((empresa) =>
            empresa.id === idEdicao
              ? { ...empresa, ...novaEmpresa, id: idEdicao }
              : empresa
          )
        );
      } else {
        const novo = {
          ...novaEmpresa,
          id: Date.now(),
          usuariosVinculados: [],
        };
        setEmpresas((prev) => [...prev, novo]);
      }
      fecharModal();
    } else {
      alert('Por favor, preencha todos os campos, incluindo pelo menos uma transportadora.');
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

  const toggleExpandirEmpresa = (id) => {
    setEmpresaExpandidaId((prevId) => (prevId === id ? null : id));
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
                <th>Serviços</th>
                <th>Status</th>
                <th className="acoes-coluna"></th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => {
                const transportadorasNomes = empresa.transportadoras
                  .map((id) => servicos.find((s) => s.id === id)?.nome)
                  .filter(Boolean);

                return (
                  <React.Fragment key={empresa.id}>
                    <tr>
                      <td onClick={() => toggleExpandirEmpresa(empresa.id)} style={{ cursor: 'pointer' }}>
                        {empresa.nome}
                      </td>
                      <td>{empresa.cnpj}</td>
                      <td>{transportadorasNomes.join(', ')}</td>
                      <td>{empresa.status}</td>
                      <td className="acoes">
                        <button className="editar-btn" onClick={() => handleEditar(empresa)}>
                          <FaEdit />
                        </button>
                        <button className="excluir-btn" onClick={() => handleExcluir(empresa.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                    {empresaExpandidaId === empresa.id && (
                      <tr className="usuarios-vinculados-row">
                        <td colSpan="5">
                          <strong>Usuários vinculados:</strong>
                          <ul>
                            {empresa.usuariosVinculados?.length > 0 ? (
                              empresa.usuariosVinculados.map((user, index) => (
                                <li key={index}>
                                  {user.nome} – {user.email} ({user.cargo})
                                </li>
                              ))
                            ) : (
                              <li>Nenhum usuário vinculado.</li>
                            )}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          <div className="novo-empresa-container">
            <button className="novo-empresa-btn" onClick={abrirModal}>
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
                Transportadoras (Selecione uma ou mais)
                <select
                  name="transportadoras"
                  multiple
                  size={Math.min(servicos.length, 5)}
                  value={novaEmpresa.transportadoras}
                  onChange={handleChange}
                >
                  {servicos.map((servico) => (
                    <option key={servico.id} value={servico.id}>
                      {servico.nome}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select name="status" value={novaEmpresa.status} onChange={handleChange}>
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
