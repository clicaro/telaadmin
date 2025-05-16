import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import Header from '../../components/Headeradmin/Header';
import ModalConfirmacao from '../../components/ModalConf/ModalConfirmacao';
import Style from './styles.css';

const Servicos = () => {
  const [servicos, setServicos] = useState([
    {
      id: 1,
      nome: 'Uber',
      tiposCotacao: ['UberX', 'Uber Black'],
    },
    {
      id: 2,
      nome: '99',
      tiposCotacao: ['99Pop', '99 Comfort'],
    },
    {
      id: 3,
      nome: 'Buser',
      tiposCotacao: ['Executivo', 'Semi Leito'],
    },
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const [novoServico, setNovoServico] = useState({
    nome: '',
    tiposCotacao: [''],
  });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  const abrirModal = () => setMostrarModal(true);
  const fecharModal = () => {
    setMostrarModal(false);
    setModoEdicao(false);
    setIdEdicao(null);
    setNovoServico({ nome: '', tiposCotacao: [''] });
  };

  const handleChangeNome = (e) => {
    setNovoServico((prev) => ({ ...prev, nome: e.target.value }));
  };

  const handleChangeCotacao = (index, value) => {
    const novaLista = [...novoServico.tiposCotacao];
    novaLista[index] = value;
    setNovoServico((prev) => ({ ...prev, tiposCotacao: novaLista }));
  };

  const adicionarCampoCotacao = () => {
    setNovoServico((prev) => ({
      ...prev,
      tiposCotacao: [...prev.tiposCotacao, ''],
    }));
  };

  const removerCampoCotacao = (index) => {
    const novaLista = [...novoServico.tiposCotacao];
    novaLista.splice(index, 1);
    setNovoServico((prev) => ({ ...prev, tiposCotacao: novaLista }));
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    const nomeValido = novoServico.nome.trim();
    const cotacoesValidas = novoServico.tiposCotacao.filter((c) => c.trim() !== '');

    if (nomeValido && cotacoesValidas.length > 0) {
      if (modoEdicao) {
        setServicos((prev) =>
          prev.map((s) =>
            s.id === idEdicao ? { id: idEdicao, nome: nomeValido, tiposCotacao: cotacoesValidas } : s
          )
        );
      } else {
        const novo = {
          id: Date.now(),
          nome: nomeValido,
          tiposCotacao: cotacoesValidas,
        };
        setServicos((prev) => [...prev, novo]);
      }
      fecharModal();
    } else {
      alert('Preencha o nome e pelo menos um tipo de cotação.');
    }
  };

  const handleEditar = (servico) => {
    setNovoServico({
      nome: servico.nome,
      tiposCotacao: [...servico.tiposCotacao],
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

  const cancelarExclusao = () => {
    setMostrarConfirmacao(false);
    setIdParaExcluir(null);
  };

  return (
    <>
      <Header />
      <main className="servicos-container">
        <div className="servicos-card">
          <table className="servicos-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipos de Cotação</th>
                <th className="acoes-coluna"></th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((servico) => (
                <tr key={servico.id}>
                  <td>{servico.nome}</td>
                  <td>{servico.tiposCotacao.join(', ')}</td>
                  <td className="acoes">
                    <button onClick={() => handleEditar(servico)} className="editar-btn" aria-label="Editar">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleExcluir(servico.id)} className="excluir-btn" aria-label="Excluir">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="novo-servico-container">
            <button onClick={abrirModal} className="novo-servico-btn" aria-label="Adicionar novo serviço">
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
                <input type="text" value={novoServico.nome} onChange={handleChangeNome} autoFocus />
              </label>

              <label>Tipos de Cotação</label>
              {novoServico.tiposCotacao.map((cotacao, index) => (
                <div key={index} className="linha-cotacao">
                  <input
                    type="text"
                    value={cotacao}
                    onChange={(e) => handleChangeCotacao(index, e.target.value)}
                  />
                  {novoServico.tiposCotacao.length > 1 && (
                    <button type="button" className="remover-tipo-btn" onClick={() => removerCampoCotacao(index)}>
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className='adicionar-tipo-btn' onClick={adicionarCampoCotacao}>
                <FaPlus /> Adicionar Cotação
              </button>

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
          titulo="Excluir Serviço"
          mensagem="Tem certeza que deseja excluir este serviço?"
          onConfirmar={confirmarExclusao}
          onCancelar={cancelarExclusao}
        />
      )}
    </>
  );
};

export default Servicos;
