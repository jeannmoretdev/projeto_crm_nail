import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    topClientes: [],
    clientesManutencao: [],
    estatisticasGerais: {},
    loading: true
  });

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  const carregarDadosDashboard = () => {
    try {
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');

      // Calcular top 5 clientes mais assíduos
      const topClientes = calcularTopClientes(clientes, agendamentos, servicos);
      
      // Calcular clientes próximos da manutenção
      const clientesManutencao = calcularClientesManutencao(clientes, agendamentos, servicos);
      
      // Calcular estatísticas gerais
      const estatisticasGerais = calcularEstatisticasGerais(clientes, agendamentos, servicos);

      setDashboardData({
        topClientes,
        clientesManutencao,
        estatisticasGerais,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setDashboardData({
        topClientes: [],
        clientesManutencao: [],
        estatisticasGerais: {},
        loading: false
      });
    }
  };

  const calcularTopClientes = (clientes, agendamentos, servicos) => {
    const clientesStats = clientes.map(cliente => {
      const agendamentosCliente = agendamentos.filter(ag => ag.clienteId === cliente.id);
      const totalAtendimentos = agendamentosCliente.length;
      const valorTotal = agendamentosCliente.reduce((total, ag) => {
        return total + (ag.valor || 0);
      }, 0);
      
      // Calcular última visita
      const ultimaVisita = agendamentosCliente.length > 0 
        ? new Date(Math.max(...agendamentosCliente.map(ag => {
            const [dia, mes, ano] = ag.data.split('/');
            return new Date(ano, mes - 1, dia).getTime();
          })))
        : null;

      return {
        ...cliente,
        totalAtendimentos,
        valorTotal,
        ultimaVisita,
        frequencia: totalAtendimentos > 0 ? calcularFrequencia(agendamentosCliente) : 0
      };
    });

    return clientesStats
      .filter(cliente => cliente.totalAtendimentos > 0)
      .sort((a, b) => {
        // Ordenar por frequência (atendimentos por mês) e valor total
        const scoreA = a.frequencia * 2 + (a.valorTotal / 1000);
        const scoreB = b.frequencia * 2 + (b.valorTotal / 1000);
        return scoreB - scoreA;
      })
      .slice(0, 5);
  };

  const calcularFrequencia = (agendamentos) => {
    if (agendamentos.length < 2) return agendamentos.length;
    
    const datas = agendamentos.map(ag => {
      const [dia, mes, ano] = ag.data.split('/');
      return new Date(ano, mes - 1, dia).getTime();
    }).sort((a, b) => a - b);

    const primeiraVisita = new Date(datas[0]);
    const ultimaVisita = new Date(datas[datas.length - 1]);
    const mesesDecorridos = Math.max(1, (ultimaVisita - primeiraVisita) / (1000 * 60 * 60 * 24 * 30));
    
    return agendamentos.length / mesesDecorridos;
  };

  const calcularClientesManutencao = (clientes, agendamentos, servicos) => {
    const hoje = new Date();
    const clientesProximaManutencao = [];

    clientes.forEach(cliente => {
      const agendamentosCliente = agendamentos.filter(ag => ag.clienteId === cliente.id);
      
      if (agendamentosCliente.length === 0) return;

      // Encontrar o último serviço
      const ultimoAgendamento = agendamentosCliente.reduce((ultimo, atual) => {
        const dataAtual = new Date(atual.data.split('/').reverse().join('-'));
        const dataUltimo = new Date(ultimo.data.split('/').reverse().join('-'));
        return dataAtual > dataUltimo ? atual : ultimo;
      });

      const ultimaData = new Date(ultimoAgendamento.data.split('/').reverse().join('-'));
      const diasDesdeUltimo = Math.floor((hoje - ultimaData) / (1000 * 60 * 60 * 24));
      
      // Verificar se está no período de manutenção (25-35 dias)
      if (diasDesdeUltimo >= 20 && diasDesdeUltimo <= 40) {
        const servico = servicos.find(s => s.id === ultimoAgendamento.servicoId);
        const diasParaManutencao = 30 - diasDesdeUltimo; // Ideal em 30 dias
        
        clientesProximaManutencao.push({
          ...cliente,
          ultimoServico: servico?.nome || 'Serviço não encontrado',
          ultimaData: ultimaData,
          diasDesdeUltimo,
          diasParaManutencao,
          prioridade: diasDesdeUltimo >= 28 ? 'alta' : diasDesdeUltimo >= 25 ? 'media' : 'baixa',
          valorUltimoServico: ultimoAgendamento.valor || servico?.valor || 0
        });
      }
    });

    return clientesProximaManutencao
      .sort((a, b) => b.diasDesdeUltimo - a.diasDesdeUltimo)
      .slice(0, 10);
  };

  const calcularEstatisticasGerais = (clientes, agendamentos, servicos) => {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const agendamentosMes = agendamentos.filter(ag => {
      const dataAgendamento = new Date(ag.data.split('/').reverse().join('-'));
      return dataAgendamento >= inicioMes && dataAgendamento <= fimMes;
    });

    const receitaMes = agendamentosMes.reduce((total, ag) => total + (ag.valor || 0), 0);
    
    // Calcular custos e lucro real
    const custoMes = agendamentosMes.reduce((total, ag) => {
      const servico = servicos.find(s => s.id === ag.servicoId);
      return total + (servico?.custo || 0);
    }, 0);
    
    const lucroMes = receitaMes - custoMes;
    const margemLucroMes = receitaMes > 0 ? (lucroMes / receitaMes) * 100 : 0;
    
    const clientesAtivos = new Set(agendamentos.map(ag => ag.clienteId)).size;
    const servicoMaisRealizado = calcularServicoMaisRealizado(agendamentos, servicos);

    return {
      totalClientes: clientes.length,
      clientesAtivos,
      atendimentosMes: agendamentosMes.length,
      receitaMes,
      custoMes,
      lucroMes,
      margemLucroMes,
      servicoMaisRealizado: servicoMaisRealizado?.nome || 'Nenhum',
      quantidadeServicoMaisRealizado: servicoMaisRealizado?.quantidade || 0
    };
  };

  const calcularServicoMaisRealizado = (agendamentos, servicos) => {
    const servicosCount = agendamentos.reduce((acc, ag) => {
      acc[ag.servicoId] = (acc[ag.servicoId] || 0) + 1;
      return acc;
    }, {});

    const servicoMaisRealizado = Object.entries(servicosCount)
      .sort(([,a], [,b]) => b - a)[0];

    if (!servicoMaisRealizado) return null;

    const servico = servicos.find(s => s.id === servicoMaisRealizado[0]);
    return {
      nome: servico?.nome || 'Serviço não encontrado',
      quantidade: servicoMaisRealizado[1]
    };
  };

  const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit'
    });
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'alta': return '#e74c3c';
      case 'media': return '#f39c12';
      case 'baixa': return '#27ae60';
      default: return '#666';
    }
  };

  const getPrioridadeTexto = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'URGENTE';
      case 'media': return 'EM BREVE';
      case 'baixa': return 'AGENDAR';
      default: return '';
    }
  };

  if (dashboardData.loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard - Insights do Negócio</h1>
        <p>Informações estratégicas para impulsionar seu crescimento</p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="estatisticas-gerais">
        <div className="estatistica-card">
          <div className="estatistica-icon">👥</div>
          <div className="estatistica-info">
            <h3>{dashboardData.estatisticasGerais.totalClientes}</h3>
            <p>Total de Clientes</p>
          </div>
        </div>
        
        <div className="estatistica-card">
          <div className="estatistica-icon">⭐</div>
          <div className="estatistica-info">
            <h3>{dashboardData.estatisticasGerais.clientesAtivos}</h3>
            <p>Clientes Ativos</p>
          </div>
        </div>
        
        <div className="estatistica-card">
          <div className="estatistica-icon">📅</div>
          <div className="estatistica-info">
            <h3>{dashboardData.estatisticasGerais.atendimentosMes}</h3>
            <p>Atendimentos Este Mês</p>
          </div>
        </div>
        
        <div className="estatistica-card receita">
          <div className="estatistica-icon">💰</div>
          <div className="estatistica-info">
            <h3>{formatarValor(dashboardData.estatisticasGerais.receitaMes)}</h3>
            <p>Receita Este Mês</p>
          </div>
        </div>

        <div className="estatistica-card custo">
          <div className="estatistica-icon">📊</div>
          <div className="estatistica-info">
            <h3>{formatarValor(dashboardData.estatisticasGerais.custoMes)}</h3>
            <p>Custos Este Mês</p>
          </div>
        </div>

        <div className="estatistica-card lucro">
          <div className="estatistica-icon">💎</div>
          <div className="estatistica-info">
            <h3>{formatarValor(dashboardData.estatisticasGerais.lucroMes)}</h3>
            <p>Lucro Real Este Mês</p>
          </div>
        </div>

        <div className="estatistica-card margem">
          <div className="estatistica-icon">📈</div>
          <div className="estatistica-info">
            <h3>{dashboardData.estatisticasGerais.margemLucroMes.toFixed(1)}%</h3>
            <p>Margem de Lucro</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Top 5 Clientes */}
        <div className="dashboard-section">
          <h2>🏆 Top 5 Clientes Mais Assíduos</h2>
          <div className="top-clientes">
            {dashboardData.topClientes.length === 0 ? (
              <div className="secao-vazia">
                <p>Ainda não há dados suficientes para ranking de clientes</p>
              </div>
            ) : (
              dashboardData.topClientes.map((cliente, index) => (
                <div key={cliente.id} className="cliente-card">
                  <div className="cliente-posicao">
                    <span className={`posicao pos-${index + 1}`}>#{index + 1}</span>
                  </div>
                  <div className="cliente-info">
                    <h3>{cliente.nome}</h3>
                    <div className="cliente-stats">
                      <span className="stat">
                        <strong>{cliente.totalAtendimentos}</strong> atendimentos
                      </span>
                      <span className="stat">
                        <strong>{formatarValor(cliente.valorTotal)}</strong> investido
                      </span>
                      <span className="stat">
                        <strong>{cliente.frequencia.toFixed(1)}</strong> por mês
                      </span>
                      {cliente.ultimaVisita && (
                        <span className="stat ultima-visita">
                          Última: {formatarData(cliente.ultimaVisita)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Clientes para Manutenção */}
        <div className="dashboard-section">
          <h2>⏰ Clientes Próximos da Manutenção</h2>
          <div className="clientes-manutencao">
            {dashboardData.clientesManutencao.length === 0 ? (
              <div className="secao-vazia">
                <p>Nenhum cliente próximo do período de manutenção no momento</p>
              </div>
            ) : (
              dashboardData.clientesManutencao.map((cliente) => (
                <div key={cliente.id} className="manutencao-card">
                  <div className="manutencao-header">
                    <h3>{cliente.nome}</h3>
                    <span 
                      className="prioridade-badge"
                      style={{ backgroundColor: getPrioridadeColor(cliente.prioridade) }}
                    >
                      {getPrioridadeTexto(cliente.prioridade)}
                    </span>
                  </div>
                  <div className="manutencao-info">
                    <div className="info-item">
                      <span className="label">Último serviço:</span>
                      <span className="value">{cliente.ultimoServico}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Data:</span>
                      <span className="value">{formatarData(cliente.ultimaData)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Dias atrás:</span>
                      <span className="value">{cliente.diasDesdeUltimo} dias</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Valor último serviço:</span>
                      <span className="value">{formatarValor(cliente.valorUltimoServico)}</span>
                    </div>
                  </div>
                  <div className="manutencao-acoes">
                    <button className="btn-contatar">
                      📱 Entrar em Contato
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
