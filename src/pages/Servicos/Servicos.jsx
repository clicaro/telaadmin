import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Header from '../../components/Headeradmin/Header';
import ModalConfirmacao from '../../components/ModalConf/ModalConfirmacao';
import { useServicos } from '../../components/ServicosContext/ServicosContext';
import Style from './styles.css';

const Servicos = () => {
  const { servicos, setServicos } = useServicos();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const [novoServico, setNovoServico] = useState({
    nome: '',
    tiposCotacao: [''],
    status: 'Ativo',
  });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  const abrirModal = () => setMostrarModal(true);
  const fecharModal = () => {
    setMostrarModal(false);
    setModoEdicao(false);
    setIdEdicao(null);
    setNovoServico({ nome: '', tiposCotacao: [''], status: 'Ativo' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoServico((prev) => ({ ...prev, [name]: value }));
  };

  const handleCotacaoChange = (index, value) => {
    const novasCotacoes = [...novoServico.tiposCotacao];
    novasCotacoes[index] = value;
    setNovoServico((prev) => ({ ...prev, tiposCotacao: novasCotacoes }));
  };

  const adicionarCotacao = () => {
    setNovoServico((prev) => ({ ...prev, tiposCotacao: [...prev.tiposCotacao, ''] }));
  };

  const removerCotacao = (index) => {
    const novasCotacoes = novoServico.tiposCotacao.filter((_, i) => i !== index);
    setNovoServico((prev) => ({ ...prev, tiposCotacao: novasCotacoes }));
  };

  const handleSalvar = (e) => {
    e.preventDefault();

    const nomeValido = novoServico.nome.trim();
    const cotacoesValidas = novoServico.tiposCotacao.map((c) => c.trim()).filter((c) => c);

    if (!nomeValido || cotacoesValidas.length === 0) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const servicoFinal = {
      id: modoEdicao ? idEdicao : Date.now(),
      nome: nomeValido,
      tiposCotacao: cotacoesValidas,
      status: novoServico.status,
    };

    if (modoEdicao) {
      setServicos((prev) =>
        prev.map((s) => (s.id === idEdicao ? servicoFinal : s))
      );
    } else {
      setServicos((prev) => [...prev, servicoFinal]);
    }

    fecharModal();
  };

  const handleEditar = (servico) => {
    setNovoServico({
      nome: servico.nome,
      tiposCotacao: [...servico.tiposCotacao],
      status: servico.status,
    });
    setModoEdicao(true);
    setIdEdicao(servico.id);
    abrirModal();
  };

  const handleExcluir = (id) => {
    setIdParaExcluir(id);
    setMostrarConfirmacao(true);
  };

  const confirmarExclusao = () => {
    setServicos((prev) => prev.filter((s) => s.id !== idParaExcluir));
    setMostrarConfirmacao(false);
    setIdParaExcluir(null);
  };

  return (
    <>
      <Header />
      <main className="empresas-container">
        <div className="empresas-card">
          <table className="empresas-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipos de Cotação</th>
                <th>Status</th>
                <th className="acoes-coluna"></th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((servico) => (
                <tr key={servico.id}>
                  <td>{servico.nome}</td>
                  <td>{servico.tiposCotacao.join(', ')}</td>
                  <td>{servico.status}</td>
                  <td className="acoes">
                    <button onClick={() => handleEditar(servico)} className="editar-btn">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleExcluir(servico.id)} className="excluir-btn">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="novo-empresa-container">
            <button onClick={abrirModal} className="novo-empresa-btn">
              <FaPlus />
            </button>
          </div>
        </div>
      </main>

      {mostrarModal && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modoEdicao ? 'Editar Serviço' : 'Novo Serviço'}</h2>
            <form onSubmit={handleSalvar}>
              <label>
                Nome
                <input
                  type="text"
                  name="nome"
                  value={novoServico.nome}
                  onChange={handleChange}
                />
              </label>
              <label>Tipos de Cotação</label>
              {novoServico.tiposCotacao.map((cotacao, index) => (
                <div key={index} className="cotacao-item">
                  <input
                    type="text"
                    value={cotacao}
                    onChange={(e) => handleCotacaoChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removerCotacao(index)}
                    className="remover-tipo-btn"
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={adicionarCotacao}
                className="adicionar-tipo-btn"
              >
                + Adicionar Cotação
              </button>

              <label>
                Status
                <select
                  name="status"
                  value={novoServico.status}
                  onChange={handleChange}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </label>

              <div className="botoes-modal">
                <button type="submit" className="botao-submit">
                  {modoEdicao ? 'Salvar Alterações' : 'Salvar'}
                </button>
                <button
                  type="button"
                  className="botao-cancelar"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarConfirmacao && (
        <ModalConfirmacao
          titulo="Excluir Serviço"
          mensagem="Tem certeza que deseja excluir este serviço?"
          onConfirmar={confirmarExclusao}
          onCancelar={() => setMostrarConfirmacao(false)}
        />
      )}
    </>
  );
};

export default Servicos;

