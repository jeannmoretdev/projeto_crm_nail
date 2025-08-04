import React, { useState, useEffect } from 'react';
import './HistoricoCliente.css';

function HistoricoCliente({ cliente, servicos = [] }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cliente?.id) {
      carregarHistoricoCliente();
    }
  }, [cliente]);

  const carregarHistoricoCliente = () => {
    setLoading(true);
    try {
      // Buscar agendamentos do localStorage
      const agendamentosData = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const servicosData = JSON.parse(localStorage.getItem('servicos') || '[]');
      
      // Filtrar agendamentos do cliente
      const agendamentosCliente = agendamentosData
        .filter(agendamento => agendamento.clienteId === cliente.id)
        .map(agendamento => {
          // Adicionar informações do serviço
          const servico = servicosData.find(s => s.id === agendamento.servicoId);
          return {
            ...agendamento,
            servico: servico || { nome: 'Serviço não encontrado', valor: 0 }
          };
        })
        .sort((a, b) => {
          // Ordenar por data (mais recente primeiro)
          const dateA = new Date(a.data.split('/').reverse().join('-'));
          const dateB = new Date(b.data.split('/').reverse().join('-'));
          return dateB - dateA;
        });

      setAgendamentos(agendamentosCliente);
    } catch (error) {
      console.error('Erro ao carregar histórico do cliente:', error);
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return '';
    
    try {
      // Se a data já está no formato DD/MM/YYYY
      if (data.includes('/')) {
        const [dia, mes, ano] = data.split('/');
        const date = new Date(ano, mes - 1, dia);
        return date.toLocaleDateString('pt-BR', { 
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      
      // Se a data está em outro formato
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return data;
    }
  };

  const formatarValor = (valor) => {
    if (!valor) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularEstatisticas = () => {
    const totalAtendimentos = agendamentos.length;
    const valorTotal = agendamentos.reduce((total, agendamento) => {
      return total + (agendamento.valor || agendamento.servico?.valor || 0);
    }, 0);
    
    const servicosRealizados = agendamentos.reduce((acc, agendamento) => {
      const nomeServico = agendamento.servico?.nome || 'Serviço não identificado';
      acc[nomeServico] = (acc[nomeServico] || 0) + 1;
      return acc;
    }, {});
    
    const servicoMaisRealizado = Object.entries(servicosRealizados)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalAtendimentos,
      valorTotal,
      servicoMaisRealizado: servicoMaisRealizado ? servicoMaisRealizado[0] : 'Nenhum',
      quantidadeServicoMaisRealizado: servicoMaisRealizado ? servicoMaisRealizado[1] : 0
    };
  };

  if (loading) {
    return (
      <div className="historico-loading">
        <div className="loading-spinner"></div>
        <p>Carregando histórico...</p>
      </div>
    );
  }

  const estatisticas = calcularEstatisticas();

  return (
    <div className="historico-cliente">
      {/* Estatísticas do Cliente */}
      <div className="historico-estatisticas">
        <h3>📊 Resumo do Cliente</h3>
        <div className="estatisticas-grid">
          <div className="estatistica-item">
            <span className="estatistica-label">Total de Atendimentos</span>
            <span className="estatistica-valor destaque">{estatisticas.totalAtendimentos}</span>
          </div>
          <div className="estatistica-item">
            <span className="estatistica-label">Valor Total Gasto</span>
            <span className="estatistica-valor positivo">{formatarValor(estatisticas.valorTotal)}</span>
          </div>
          <div className="estatistica-item">
            <span className="estatistica-label">Serviço Favorito</span>
            <span className="estatistica-valor">{estatisticas.servicoMaisRealizado}</span>
          </div>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="historico-lista">
        <h3>📅 Histórico de Atendimentos</h3>
        {agendamentos.length === 0 ? (
          <div className="historico-vazio">
            <p>Este cliente ainda não possui histórico de atendimentos.</p>
          </div>
        ) : (
          <div className="agendamentos-historico">
            {agendamentos.map((agendamento, index) => (
              <div key={agendamento.id || index} className="agendamento-historico-item">
                <div className="agendamento-info">
                  <div className="agendamento-data">
                    <span className="data-valor">{formatarData(agendamento.data)}</span>
                    <span className="hora-valor">{agendamento.hora}</span>
                  </div>
                  <div className="agendamento-detalhes">
                    <h4 className="servico-nome">{agendamento.servico.nome}</h4>
                    <div className="agendamento-valor">
                      <span className="valor-cobrado">
                        {formatarValor(agendamento.valor || agendamento.servico.valor)}
                      </span>
                    </div>
                  </div>
                </div>
                {agendamento.observacao && (
                  <div className="agendamento-observacao">
                    <strong>Observação:</strong> {agendamento.observacao}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoricoCliente;
