import React, { useState, useEffect } from 'react';
import './AgendaLivre.css';

function AgendaLivre() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [dataAtual, setDataAtual] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [agendamentosDia, setAgendamentosDia] = useState([]);

  // Horários de funcionamento (8h às 18h, de 2 em 2 horas)
  const horariosTrabalho = [
    '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'
  ];

  // Carregar agendamentos do localStorage
  useEffect(() => {
    const dadosAgendamentos = localStorage.getItem('agendamentos');
    if (dadosAgendamentos) {
      setAgendamentos(JSON.parse(dadosAgendamentos));
    }

    const dadosClientes = localStorage.getItem('clientes');
    if (dadosClientes) {
      setClientes(JSON.parse(dadosClientes));
    }

    const dadosServicos = localStorage.getItem('servicos');
    if (dadosServicos) {
      setServicos(JSON.parse(dadosServicos));
    }
  }, []);

  // Gerar calendário do mês
  const gerarCalendario = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasDoMes = [];

    // Adicionar dias em branco no início
    const diaSemanaInicio = primeiroDia.getDay();
    for (let i = 0; i < diaSemanaInicio; i++) {
      diasDoMes.push(null);
    }

    // Adicionar todos os dias do mês
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      diasDoMes.push(new Date(ano, mes, dia));
    }

    return diasDoMes;
  };

  // Verificar se um dia tem agendamentos
  const verificarAgendamentosDia = (data) => {
    if (!data) return [];
    
    const dataFormatada = data.toLocaleDateString('pt-BR');
    return agendamentos.filter(ag => ag.data === dataFormatada);
  };

  // Calcular horários livres de um dia
  const calcularHorariosLivres = (data) => {
    if (!data) return [];
    
    const agendamentosDia = verificarAgendamentosDia(data);
    const horariosOcupados = agendamentosDia.map(ag => ag.hora);
    
    return horariosTrabalho.filter(horario => !horariosOcupados.includes(horario));
  };

  // Formatar data para exibição
  const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Navegar entre meses
  const mudarMes = (direcao) => {
    const novaMes = new Date(dataAtual);
    novaMes.setMonth(novaMes.getMonth() + direcao);
    setDataAtual(novaMes);
    setSelectedDate(null);
  };

  // Selecionar data
  const selecionarData = (data) => {
    if (!data) return;
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Não permitir seleção de datas passadas
    if (data < hoje) return;
    
    setSelectedDate(data);
    const horariosLivres = calcularHorariosLivres(data);
    const agendamentosDoDia = verificarAgendamentosDia(data);
    
    setHorariosDisponiveis(horariosLivres);
    setAgendamentosDia(agendamentosDoDia);
  };

  // Copiar horários disponíveis para o clipboard
  const copiarHorarios = async () => {
    if (!selectedDate || horariosDisponiveis.length === 0) return;
    
    const dataFormatada = selectedDate.toLocaleDateString('pt-BR');
    const diaSemana = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' });
    
    let texto = `🗓️ *Horários disponíveis para ${diaSemana}, ${dataFormatada}:*\n\n`;
    
    horariosDisponiveis.forEach((horario, index) => {
      texto += `⏰ ${horario}\n`;
    });
    
    texto += `\n💅 Qual horário você gostaria de agendar?\n`;
    texto += `📱 Responda com o horário escolhido!`;
    
    try {
      await navigator.clipboard.writeText(texto);
      alert('Horários copiados para a área de transferência! 📋✨');
    } catch (err) {
      // Fallback para navegadores que não suportam clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = texto;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Horários copiados para a área de transferência! 📋✨');
    }
  };

  // Verificar se é fim de semana
  const isFimDeSemana = (data) => {
    const diaSemana = data.getDay();
    return diaSemana === 0 || diaSemana === 6; // Domingo ou Sábado
  };

  // Obter status do dia
  const getStatusDia = (data) => {
    if (!data) return '';
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (data < hoje) return 'passado';
    if (isFimDeSemana(data)) return 'fim-semana';
    
    const horariosLivres = calcularHorariosLivres(data);
    if (horariosLivres.length === 0) return 'ocupado';
    if (horariosLivres.length <= 2) return 'poucos';
    return 'livre';
  };

  const diasCalendario = gerarCalendario();
  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="agenda-livre-container">
      <div className="agenda-livre-header">
        <h2>📅 Agenda Livre do Mês</h2>
        <p>Visualize horários disponíveis e copie para enviar via WhatsApp</p>
      </div>

      {/* Navegação do mês */}
      <div className="mes-navegacao">
        <button className="nav-btn" onClick={() => mudarMes(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        <h3 className="mes-titulo">
          {nomesMeses[dataAtual.getMonth()]} {dataAtual.getFullYear()}
        </h3>
        
        <button className="nav-btn" onClick={() => mudarMes(1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Legenda */}
      <div className="legenda">
        <div className="legenda-item">
          <span className="cor-livre"></span>
          <span>Muitos horários livres</span>
        </div>
        <div className="legenda-item">
          <span className="cor-poucos"></span>
          <span>Poucos horários livres</span>
        </div>
        <div className="legenda-item">
          <span className="cor-ocupado"></span>
          <span>Totalmente ocupado</span>
        </div>
        <div className="legenda-item">
          <span className="cor-fim-semana"></span>
          <span>Fim de semana</span>
        </div>
      </div>

      <div className="calendario-container">
        {/* Cabeçalho dos dias da semana */}
        <div className="calendario-header">
          <div className="dia-semana">Dom</div>
          <div className="dia-semana">Seg</div>
          <div className="dia-semana">Ter</div>
          <div className="dia-semana">Qua</div>
          <div className="dia-semana">Qui</div>
          <div className="dia-semana">Sex</div>
          <div className="dia-semana">Sáb</div>
        </div>

        {/* Grid do calendário */}
        <div className="calendario-grid">
          {diasCalendario.map((data, index) => {
            const status = data ? getStatusDia(data) : '';
            const isSelected = selectedDate && data && 
              data.toDateString() === selectedDate.toDateString();
            
            return (
              <div
                key={index}
                className={`calendario-dia ${status} ${isSelected ? 'selected' : ''} ${data ? 'clickable' : ''}`}
                onClick={() => selecionarData(data)}
              >
                {data && (
                  <>
                    <span className="dia-numero">{data.getDate()}</span>
                    {status !== 'passado' && status !== 'fim-semana' && (
                      <span className="horarios-count">
                        {calcularHorariosLivres(data).length} livres
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalhes do dia selecionado */}
      {selectedDate && (
        <div className="dia-detalhes">
          <h3>📋 {formatarData(selectedDate)}</h3>
          
          {/* Agendamentos já marcados */}
          {agendamentosDia.length > 0 && (
            <div className="agendamentos-marcados">
              <h4>📅 Agendamentos Marcados:</h4>
              <div className="agendamentos-grid">
                {agendamentosDia
                  .sort((a, b) => a.hora.localeCompare(b.hora))
                  .map((agendamento, index) => {
                    const cliente = clientes.find(c => c.id === agendamento.clienteId);
                    const servico = servicos.find(s => s.id === agendamento.servicoId);
                    
                    return (
                      <div key={index} className="agendamento-item">
                        <div className="agendamento-hora">{agendamento.hora}</div>
                        <div className="agendamento-info">
                          <div className="cliente-nome">{cliente?.nome || agendamento.clienteNome}</div>
                          <div className="servico-nome">{servico?.nome || agendamento.servicoNome}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          
          {/* Horários disponíveis */}
          {horariosDisponiveis.length > 0 ? (
            <>
              <div className="horarios-disponiveis">
                <h4>⏰ Horários Disponíveis:</h4>
                <div className="horarios-grid">
                  {horariosDisponiveis.map(horario => (
                    <div key={horario} className="horario-item">
                      {horario}
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="copiar-btn" onClick={copiarHorarios}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                📱 Copiar para WhatsApp
              </button>
            </>
          ) : (
            <div className="sem-horarios">
              <p>😔 Não há horários disponíveis neste dia</p>
              <span>Todos os horários já estão ocupados</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AgendaLivre;
