// Serviço para gerenciar histórico de clientes
class HistoricoService {
  // Tipos de eventos do histórico
  static TIPOS_EVENTO = {
    CLIENTE_CRIADO: 'cliente_criado',
    CLIENTE_EDITADO: 'cliente_editado',
    AGENDAMENTO_CRIADO: 'agendamento_criado',
    AGENDAMENTO_CONCLUIDO: 'agendamento_concluido',
    AGENDAMENTO_CANCELADO: 'agendamento_cancelado',
    AGENDAMENTO_EDITADO: 'agendamento_editado',
    PAGAMENTO_RECEBIDO: 'pagamento_recebido',
    OBSERVACAO_ADICIONADA: 'observacao_adicionada'
  };

  // Adicionar evento ao histórico do cliente
  static adicionarEvento(clienteId, tipo, detalhes = {}) {
    const evento = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      clienteId,
      tipo,
      detalhes,
      dataHora: new Date().toISOString(),
      timestamp: Date.now()
    };

    const historico = this.obterHistorico();
    historico.push(evento);
    
    localStorage.setItem('historico_clientes', JSON.stringify(historico));
    return evento;
  }

  // Obter todo o histórico
  static obterHistorico() {
    const historico = localStorage.getItem('historico_clientes');
    return historico ? JSON.parse(historico) : [];
  }

  // Obter histórico de um cliente específico
  static obterHistoricoCliente(clienteId) {
    const todoHistorico = this.obterHistorico();
    return todoHistorico
      .filter(evento => evento.clienteId === clienteId)
      .sort((a, b) => b.timestamp - a.timestamp); // Mais recente primeiro
  }

  // Formatar evento para exibição
  static formatarEvento(evento, clientes = [], servicos = []) {
    const data = new Date(evento.dataHora);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let descricao = '';
    let icone = '📝';
    let cor = '#6c757d';

    switch (evento.tipo) {
      case this.TIPOS_EVENTO.CLIENTE_CRIADO:
        descricao = 'Cliente cadastrado no sistema';
        icone = '👤';
        cor = '#28a745';
        break;

      case this.TIPOS_EVENTO.CLIENTE_EDITADO:
        descricao = 'Informações do cliente atualizadas';
        icone = '✏️';
        cor = '#ffc107';
        break;

      case this.TIPOS_EVENTO.AGENDAMENTO_CRIADO:
        const servico = servicos.find(s => s.id === evento.detalhes.servicoId);
        descricao = `Agendamento criado - ${servico?.nome || 'Serviço'}`;
        if (evento.detalhes.data && evento.detalhes.hora) {
          descricao += ` para ${evento.detalhes.data} às ${evento.detalhes.hora}`;
        }
        icone = '📅';
        cor = '#007bff';
        break;

      case this.TIPOS_EVENTO.AGENDAMENTO_CONCLUIDO:
        const servicoConcluido = servicos.find(s => s.id === evento.detalhes.servicoId);
        descricao = `Serviço concluído - ${servicoConcluido?.nome || 'Serviço'}`;
        if (evento.detalhes.valor) {
          descricao += ` - R$ ${evento.detalhes.valor.toFixed(2).replace('.', ',')}`;
        }
        icone = '✅';
        cor = '#28a745';
        break;

      case this.TIPOS_EVENTO.AGENDAMENTO_CANCELADO:
        const servicoCancelado = servicos.find(s => s.id === evento.detalhes.servicoId);
        descricao = `Agendamento cancelado - ${servicoCancelado?.nome || 'Serviço'}`;
        icone = '❌';
        cor = '#dc3545';
        break;

      case this.TIPOS_EVENTO.AGENDAMENTO_EDITADO:
        descricao = 'Agendamento modificado';
        icone = '📝';
        cor = '#ffc107';
        break;

      case this.TIPOS_EVENTO.PAGAMENTO_RECEBIDO:
        descricao = `Pagamento recebido - R$ ${evento.detalhes.valor?.toFixed(2).replace('.', ',') || '0,00'}`;
        icone = '💰';
        cor = '#28a745';
        break;

      case this.TIPOS_EVENTO.OBSERVACAO_ADICIONADA:
        descricao = `Observação: ${evento.detalhes.texto}`;
        icone = '📝';
        cor = '#17a2b8';
        break;

      default:
        descricao = evento.detalhes.descricao || 'Evento registrado';
        break;
    }

    return {
      ...evento,
      descricao,
      icone,
      cor,
      dataFormatada,
      horaFormatada
    };
  }

  // Obter estatísticas do cliente
  static obterEstatisticasCliente(clienteId) {
    const historico = this.obterHistoricoCliente(clienteId);
    
    const agendamentos = historico.filter(e => e.tipo === this.TIPOS_EVENTO.AGENDAMENTO_CRIADO).length;
    const servicosConcluidos = historico.filter(e => e.tipo === this.TIPOS_EVENTO.AGENDAMENTO_CONCLUIDO).length;
    const cancelamentos = historico.filter(e => e.tipo === this.TIPOS_EVENTO.AGENDAMENTO_CANCELADO).length;
    
    const pagamentos = historico
      .filter(e => e.tipo === this.TIPOS_EVENTO.PAGAMENTO_RECEBIDO)
      .reduce((total, evento) => total + (evento.detalhes.valor || 0), 0);

    const primeiroAgendamento = historico
      .filter(e => e.tipo === this.TIPOS_EVENTO.AGENDAMENTO_CRIADO)
      .sort((a, b) => a.timestamp - b.timestamp)[0];

    const ultimoServico = historico
      .filter(e => e.tipo === this.TIPOS_EVENTO.AGENDAMENTO_CONCLUIDO)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    return {
      totalAgendamentos: agendamentos,
      servicosConcluidos,
      cancelamentos,
      totalPago: pagamentos,
      primeiroAgendamento: primeiroAgendamento ? new Date(primeiroAgendamento.dataHora) : null,
      ultimoServico: ultimoServico ? new Date(ultimoServico.dataHora) : null,
      clienteDesde: primeiroAgendamento ? new Date(primeiroAgendamento.dataHora) : new Date()
    };
  }

  // Limpar histórico (usar com cuidado)
  static limparHistorico() {
    localStorage.removeItem('historico_clientes');
  }

  // Exportar histórico
  static exportarHistorico() {
    return this.obterHistorico();
  }
}

export default HistoricoService;
