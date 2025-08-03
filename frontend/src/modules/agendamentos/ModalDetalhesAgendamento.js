import React from 'react';
import Modal from '../../components/Modal';
import './ModalDetalhesAgendamento.css';

function ModalDetalhesAgendamento({ open, onClose, agendamento, cliente, servico }) {
  if (!open || !agendamento) return null;

  const formatarData = (data) => {
    if (!data) return '';
    if (data.includes('/')) {
      const [dia, mes, ano] = data.split('/');
      const date = new Date(ano, mes - 1, dia);
      return date.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatarValor = (valor) => {
    if (!valor) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularDiferenca = (valorCobrado, valorServico) => {
    const diferenca = (valorCobrado || 0) - (valorServico || 0);
    return diferenca;
  };

  const diferenca = calcularDiferenca(agendamento.valor, servico?.valor);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-detalhes-agendamento">
        <div className="modal-header">
          <h2>Detalhes do Agendamento</h2>
        </div>

        <div className="detalhes-content">
          {/* Informações principais */}
          <div className="detalhes-secao">
            <h3>Informações Gerais</h3>
            <div className="detalhes-grid">
              <div className="detalhe-item">
                <span className="detalhe-label">Cliente:</span>
                <span className="detalhe-valor">{cliente?.nome || agendamento.clienteNome || 'Cliente não encontrado'}</span>
              </div>
              
              <div className="detalhe-item">
                <span className="detalhe-label">Serviço:</span>
                <span className="detalhe-valor">{agendamento.servicoNome || servico?.nome || 'Serviço não encontrado'}</span>
              </div>
              
              <div className="detalhe-item">
                <span className="detalhe-label">Data:</span>
                <span className="detalhe-valor">{formatarData(agendamento.data)}</span>
              </div>
              
              <div className="detalhe-item">
                <span className="detalhe-label">Horário:</span>
                <span className="detalhe-valor">{agendamento.hora}</span>
              </div>
            </div>
          </div>

          {/* Informações do cliente */}
          {cliente && (
            <div className="detalhes-secao">
              <h3>Dados do Cliente</h3>
              <div className="detalhes-grid">
                <div className="detalhe-item">
                  <span className="detalhe-label">Nome completo:</span>
                  <span className="detalhe-valor">{cliente.nome}</span>
                </div>
                
                {cliente.telefone && (
                  <div className="detalhe-item">
                    <span className="detalhe-label">Telefone:</span>
                    <span className="detalhe-valor">{cliente.telefone}</span>
                  </div>
                )}
                
                {cliente.email && (
                  <div className="detalhe-item">
                    <span className="detalhe-label">E-mail:</span>
                    <span className="detalhe-valor">{cliente.email}</span>
                  </div>
                )}
                
                {cliente.endereco && (
                  <div className="detalhe-item">
                    <span className="detalhe-label">Endereço:</span>
                    <span className="detalhe-valor">{cliente.endereco}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Informações financeiras */}
          <div className="detalhes-secao">
            <h3>Informações Financeiras</h3>
            <div className="detalhes-valores">
              <div className="valor-item">
                <span className="valor-label">Valor do Serviço:</span>
                <span className="valor-valor">{formatarValor(servico?.valor || 0)}</span>
              </div>
              
              <div className="valor-item">
                <span className="valor-label">Valor Cobrado:</span>
                <span className="valor-valor destaque">{formatarValor(agendamento.valor || 0)}</span>
              </div>
              
              <div className="valor-item diferenca">
                <span className="valor-label">Diferença:</span>
                <span className={`valor-valor ${diferenca >= 0 ? 'positiva' : 'negativa'}`}>
                  {diferenca >= 0 ? '+' : ''}{formatarValor(diferenca)}
                </span>
              </div>
            </div>
          </div>

          {/* Observações */}
          {agendamento.observacao && (
            <div className="detalhes-secao">
              <h3>Observações</h3>
              <div className="observacao-texto">
                {agendamento.observacao}
              </div>
            </div>
          )}

          {/* Histórico do cliente */}
          {cliente?.observacao && (
            <div className="detalhes-secao">
              <h3>Histórico do Cliente</h3>
              <div className="historico-texto">
                {cliente.observacao.split('\n').map((linha, idx) => (
                  <p key={idx}>{linha}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-fechar" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalDetalhesAgendamento;
