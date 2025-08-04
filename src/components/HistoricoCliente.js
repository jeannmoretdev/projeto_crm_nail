import React, { useState, useEffect } from 'react';
import HistoricoService from '../../services/HistoricoService';
import './HistoricoCliente.css';

function HistoricoCliente({ cliente, servicos = [] }) {
  const [historico, setHistorico] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');

  useEffect(() => {
    if (cliente?.id) {
      const historicoCliente = HistoricoService.obterHistoricoCliente(cliente.id);
      const historicoFormatado = historicoCliente.map(evento => 
        HistoricoService.formatarEvento(evento, [cliente], servicos)
      );
      setHistorico(historicoFormatado);

      const stats = HistoricoService.obterEstatisticasCliente(cliente.id);
      setEstatisticas(stats);
    }
  }, [cliente, servicos]);

  const historicoFiltrado = historico.filter(evento => {
    if (filtroTipo === 'todos') return true;
    return evento.tipo === filtroTipo;
  });

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return data.toLocaleDateString('pt-BR');
  };

  const calcularTempoComoCliente = (dataInicio) => {
    if (!dataInicio) return 'Recente';
    
    const agora = new Date();
    const diffTime = agora - dataInicio;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} dias`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} anos`;
  };

  if (!cliente) return null;

  return (
    <div className="historico-cliente">
      {/* Estatísticas do Cliente */}
      {estatisticas && (
        <div className="cliente-estatisticas">
          <h3>Resumo do Cliente</h3>
          <div className="estatisticas-grid">
            <div className="stat-card">
              <div className="stat-icone">📅</div>
              <div className="stat-info">
                <div className="stat-valor">{estatisticas.totalAgendamentos}</div>
                <div className="stat-label">Agendamentos</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icone">✅</div>
              <div className="stat-info">
                <div className="stat-valor">{estatisticas.servicosConcluidos}</div>
                <div className="stat-label">Serviços Concluídos</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icone">💰</div>
              <div className="stat-info">
                <div className="stat-valor">{formatarValor(estatisticas.totalPago)}</div>
                <div className="stat-label">Total Pago</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icone">⏱️</div>
              <div className="stat-info">
                <div className="stat-valor">{calcularTempoComoCliente(estatisticas.clienteDesde)}</div>
                <div className="stat-label">Cliente há</div>
              </div>
            </div>
          </div>
          
          <div className="datas-importantes">
            <div className="data-item">
              <span className="data-label">Primeiro agendamento:</span>
              <span className="data-valor">{formatarData(estatisticas.primeiroAgendamento)}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Último serviço:</span>
              <span className="data-valor">{formatarData(estatisticas.ultimoServico)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="historico-filtros">
        <h3>Histórico de Atividades</h3>
        <select 
          value={filtroTipo} 
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="filtro-select"
        >
          <option value="todos">Todas as atividades</option>
          <option value={HistoricoService.TIPOS_EVENTO.AGENDAMENTO_CRIADO}>Agendamentos</option>
          <option value={HistoricoService.TIPOS_EVENTO.AGENDAMENTO_CONCLUIDO}>Serviços Concluídos</option>
          <option value={HistoricoService.TIPOS_EVENTO.AGENDAMENTO_CANCELADO}>Cancelamentos</option>
          <option value={HistoricoService.TIPOS_EVENTO.PAGAMENTO_RECEBIDO}>Pagamentos</option>
          <option value={HistoricoService.TIPOS_EVENTO.CLIENTE_EDITADO}>Alterações de Dados</option>
        </select>
      </div>

      {/* Timeline do Histórico */}
      <div className="historico-timeline">
        {historicoFiltrado.length === 0 ? (
          <div className="historico-vazio">
            <div className="vazio-icone">📝</div>
            <p>Nenhuma atividade encontrada para este cliente.</p>
          </div>
        ) : (
          historicoFiltrado.map((evento) => (
            <div key={evento.id} className="timeline-item">
              <div className="timeline-marker" style={{ backgroundColor: evento.cor }}>
                <span className="timeline-icone">{evento.icone}</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-descricao">{evento.descricao}</span>
                  <span className="timeline-data">
                    {evento.dataFormatada} às {evento.horaFormatada}
                  </span>
                </div>
                {evento.detalhes.observacao && (
                  <div className="timeline-observacao">
                    {evento.detalhes.observacao}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistoricoCliente;
