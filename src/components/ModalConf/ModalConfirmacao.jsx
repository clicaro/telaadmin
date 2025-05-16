
import React from 'react';
import Style from './styles.css';

const ModalConfirmacao = ({ titulo, mensagem, onConfirmar, onCancelar }) => {
  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{titulo || "Confirmação"}</h2>
        <p>{mensagem}</p>
        <div className="botoes-modal">
          <button className="botao-submit" onClick={onConfirmar}>
            Confirmar
          </button>
          <button className="botao-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;
