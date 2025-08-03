import React, { useState, useEffect } from 'react';
import ModalCadastroAgendamento from './ModalCadastroAgendamento';
import ModalCadastroCliente from '../clientes/ModalCadastroCliente';
import ModalCadastroServico from '../servicos/ModalCadastroServico';
import ModalDetalhesAgendamento from './ModalDetalhesAgendamento';
import IconEdit from '../../components/IconEdit';
import IconDelete from '../../components/IconDelete';
import './ListaAgendamentos.css';

function ListaAgendamentos() {
  const [agendamentos, setAgendamentos] = useState(() => {
    const dadosSalvos = localStorage.getItem('agendamentos');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const [clientes, setClientes] = useState(() => {
    const dadosSalvos = localStorage.getItem('clientes');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const [servicos, setServicos] = useState(() => {
    const dadosSalvos = localStorage.getItem('servicos');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const [showCadastroAgendamento, setShowCadastroAgendamento] = useState(false);
  const [showCadastroCliente, setShowCadastroCliente] = useState(false);
  const [showCadastroServico, setShowCadastroServico] = useState(false);
  const [showDetalhesAgendamento, setShowDetalhesAgendamento] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [ordenacao, setOrdenacao] = useState('data');

  useEffect(() => {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
  }, [agendamentos]);

  useEffect(() => {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem('servicos', JSON.stringify(servicos));
  }, [servicos]);

  const abrirDetalhesAgendamento = (agendamento) => {
    const cliente = clientes.find(c => c.id === agendamento.clienteId);
    const servico = servicos.find(s => s.id === agendamento.servicoId);
    
    setAgendamentoSelecionado(agendamento);
    setClienteSelecionado(cliente);
    setServicoSelecionado(servico);
    setShowDetalhesAgendamento(true);
  };

  const fecharDetalhesAgendamento = () => {
    setShowDetalhesAgendamento(false);
    setAgendamentoSelecionado(null);
    setClienteSelecionado(null);
    setServicoSelecionado(null);
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    // Se já está no formato brasileiro, converter para Date corretamente
    if (dataString.includes('/')) {
      const [dia, mes, ano] = dataString.split('/');
      const date = new Date(ano, mes - 1, dia); // Mês é 0-indexed
      return date.toLocaleDateString('pt-BR');
    }
    const date = new Date(dataString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatarHora = (hora) => {
    if (!hora) return '';
    return hora;
  };

  const formatarValor = (valor) => {
    if (!valor) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularDiasAteData = (dataAgendamento) => {
    if (!dataAgendamento) return 0;
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    let dataAlvo;
    // Se a data está no formato brasileiro (dd/mm/aaaa), converter corretamente
    if (dataAgendamento.includes('/')) {
      const [dia, mes, ano] = dataAgendamento.split('/');
      dataAlvo = new Date(ano, mes - 1, dia); // Mês é 0-indexed
    } else {
      dataAlvo = new Date(dataAgendamento);
    }
    dataAlvo.setHours(0, 0, 0, 0);
    
    const diferencaMs = dataAlvo.getTime() - hoje.getTime();
    const diferencaDias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));
    
    return diferencaDias;
  };

  const formatarDiasRestantes = (dias) => {
    if (dias === 0) return 'hoje';
    if (dias === 1) return 'amanhã';
    if (dias === -1) return 'ontem';
    if (dias < 0) return `${Math.abs(dias)} dias atrás`;
    return `em ${dias} dias`;
  };

  const obterDiaSemana = (data) => {
    if (!data) return '';
    let date;
    // Se a data está no formato brasileiro (dd/mm/aaaa), converter corretamente
    if (data.includes('/')) {
      const [dia, mes, ano] = data.split('/');
      date = new Date(ano, mes - 1, dia); // Mês é 0-indexed
    } else {
      date = new Date(data);
    }
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return diasSemana[date.getDay()];
  };

  const calcularDiferenca = (valorCobrado, valorServico) => {
    const diferenca = valorCobrado - valorServico;
    return diferenca;
  };

  const adicionarAgendamento = (novoAgendamento) => {
    if (editIndex !== null) {
      const novosAgendamentos = [...agendamentos];
      novosAgendamentos[editIndex] = novoAgendamento;
      setAgendamentos(novosAgendamentos);
      setEditIndex(null);
      setEditData(null);
    } else {
      setAgendamentos([...agendamentos, novoAgendamento]);
    }
    
    // Se há observação, adicionar ao cliente
    if (novoAgendamento.observacao && novoAgendamento.clienteId) {
      const clienteIndex = clientes.findIndex(c => c.id === novoAgendamento.clienteId);
      if (clienteIndex !== -1) {
        const novosClientes = [...clientes];
        const observacaoAtual = novosClientes[clienteIndex].observacao || '';
        const novaObservacao = observacaoAtual 
          ? `${observacaoAtual}\n${new Date().toLocaleDateString('pt-BR')}: ${novoAgendamento.observacao}`
          : `${new Date().toLocaleDateString('pt-BR')}: ${novoAgendamento.observacao}`;
        
        novosClientes[clienteIndex].observacao = novaObservacao;
        setClientes(novosClientes);
      }
    }
    
    setShowCadastroAgendamento(false);
  };

  const adicionarCliente = (novoCliente) => {
    const clienteComId = { ...novoCliente, id: Date.now() };
    setClientes([...clientes, clienteComId]);
    setShowCadastroCliente(false);
  };

  const adicionarServico = (novoServico) => {
    const servicoComId = { ...novoServico, id: Date.now() };
    setServicos([...servicos, servicoComId]);
    setShowCadastroServico(false);
  };

  const excluirAgendamento = (idx) => {
    const novosAgendamentos = agendamentos.filter((_, i) => i !== idx);
    setAgendamentos(novosAgendamentos);
  };

  const editarAgendamento = (idx) => {
    setEditIndex(idx);
    setEditData(agendamentos[idx]);
    setShowCadastroAgendamento(true);
  };

  const agendamentosFiltrados = agendamentos
    .filter(agendamento => {
      if (!filtroTexto) return true;
      
      const textoLowerCase = filtroTexto.toLowerCase();
      const cliente = clientes.find(c => c.id == agendamento.clienteId);
      const servico = servicos.find(s => s.id == agendamento.servicoId);
      
      const nomeCliente = cliente ? cliente.nome.toLowerCase() : '';
      const nomeServico = servico ? servico.nome.toLowerCase() : '';
      const data = formatarData(agendamento.data).toLowerCase();
      
      return nomeCliente.includes(textoLowerCase) || 
             nomeServico.includes(textoLowerCase) || 
             data.includes(textoLowerCase);
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case 'data':
          // Converter datas brasileiras para objetos Date corretamente
          let dataA, dataB;
          if (a.data.includes('/')) {
            const [diaA, mesA, anoA] = a.data.split('/');
            dataA = new Date(anoA, mesA - 1, diaA, ...a.hora.split(':'));
          } else {
            dataA = new Date(a.data + ' ' + a.hora);
          }
          
          if (b.data.includes('/')) {
            const [diaB, mesB, anoB] = b.data.split('/');
            dataB = new Date(anoB, mesB - 1, diaB, ...b.hora.split(':'));
          } else {
            dataB = new Date(b.data + ' ' + b.hora);
          }
          
          return dataA - dataB;
        
        case 'cliente':
          const clienteA = clientes.find(c => c.id === a.clienteId);
          const clienteB = clientes.find(c => c.id === b.clienteId);
          return (clienteA?.nome || '').localeCompare(clienteB?.nome || '');
        
        case 'servico':
          const servicoA = servicos.find(s => s.id === a.servicoId);
          const servicoB = servicos.find(s => s.id === b.servicoId);
          return (servicoA?.nome || '').localeCompare(servicoB?.nome || '');
        
        case 'valor':
          return b.valorCobrado - a.valorCobrado;
        
        default:
          return 0;
      }
    });

  // Agrupar agendamentos por data
  const agendamentosAgrupados = agendamentosFiltrados.reduce((grupos, agendamento) => {
    const dataKey = agendamento.data;
    if (!grupos[dataKey]) {
      grupos[dataKey] = [];
    }
    grupos[dataKey].push(agendamento);
    return grupos;
  }, {});

  // Ordenar as datas
  const datasOrdenadas = Object.keys(agendamentosAgrupados).sort((a, b) => {
    // Converter datas brasileiras para objetos Date corretamente
    let dataA, dataB;
    if (a.includes('/')) {
      const [diaA, mesA, anoA] = a.split('/');
      dataA = new Date(anoA, mesA - 1, diaA);
    } else {
      dataA = new Date(a);
    }
    
    if (b.includes('/')) {
      const [diaB, mesB, anoB] = b.split('/');
      dataB = new Date(anoB, mesB - 1, diaB);
    } else {
      dataB = new Date(b);
    }
    
    return dataA - dataB;
  });

  const exportarDados = () => {
    const dados = {
      agendamentos: agendamentos,
      exportadoEm: new Date().toISOString(),
      versao: "1.0"
    };
    
    const dataStr = JSON.stringify(dados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `agendamentos_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importarDados = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target.result);
        if (dados.agendamentos && Array.isArray(dados.agendamentos)) {
          setAgendamentos(dados.agendamentos);
          alert(`Importados ${dados.agendamentos.length} agendamentos com sucesso!`);
        } else {
          alert('Formato de arquivo inválido!');
        }
      } catch (error) {
        alert('Erro ao ler o arquivo. Verifique se é um JSON válido.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="agendamentos-lista-container">
      <h2 className="agendamentos-titulo">Agendamentos</h2>
      
      <div className="agendamentos-toolbar">
        <button className="agendamentos-adicionar-btn" onClick={() => setShowCadastroAgendamento(true)}>
          Novo Agendamento
        </button>
        
        <div className="agendamentos-filtros">
          <input
            type="text"
            placeholder="Pesquisar por cliente, serviço ou data..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="agendamentos-filtro-input"
          />
          
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className="agendamentos-filtro-select"
          >
            <option value="">Ordenar por...</option>
            <option value="data">Data/Hora</option>
            <option value="cliente">Cliente</option>
            <option value="servico">Serviço</option>
            <option value="valor">Valor</option>
          </select>
        </div>
        
        <div className="agendamentos-import-export">
          <button className="btn-export" onClick={exportarDados}>
            Exportar Dados
          </button>
          <label className="btn-import">
            Importar Dados
            <input
              type="file"
              accept=".json"
              onChange={importarDados}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <ModalDetalhesAgendamento
        open={showDetalhesAgendamento}
        onClose={fecharDetalhesAgendamento}
        agendamento={agendamentoSelecionado}
        cliente={clienteSelecionado}
        servico={servicoSelecionado}
      />

      <ModalCadastroAgendamento
        open={showCadastroAgendamento}
        onAdd={adicionarAgendamento}
        onClose={() => {
          setShowCadastroAgendamento(false);
          setEditIndex(null);
          setEditData(null);
        }}
        editData={editData}
        clientes={clientes}
        servicos={servicos}
        onNovoCliente={() => setShowCadastroCliente(true)}
        onNovoServico={() => setShowCadastroServico(true)}
      />

      <ModalCadastroCliente
        open={showCadastroCliente}
        onAdd={adicionarCliente}
        onClose={() => setShowCadastroCliente(false)}
      />

      <ModalCadastroServico
        open={showCadastroServico}
        onAdd={adicionarServico}
        onClose={() => setShowCadastroServico(false)}
      />

      <div className="agendamentos-lista">
        {agendamentosFiltrados.length === 0 && filtroTexto && (
          <div className="agendamentos-vazio">Nenhum agendamento encontrado para "{filtroTexto}".</div>
        )}
        {agendamentosFiltrados.length === 0 && !filtroTexto && (
          <div className="agendamentos-vazio">Nenhum agendamento cadastrado.</div>
        )}
        
        {datasOrdenadas.map(data => {
          const agendamentosDoDia = agendamentosAgrupados[data];
          const diasRestantes = calcularDiasAteData(data);
          const diaSemana = obterDiaSemana(data);
          
          return (
            <div key={data} className="agendamentos-grupo-dia">
              <div className="agendamentos-header-dia">
                <h3 className="dia-semana">{diaSemana}</h3>
                <div className="data-info">
                  <span className="data-completa">{formatarData(data)}</span>
                  <span className="dias-restantes">{formatarDiasRestantes(diasRestantes)}</span>
                </div>
              </div>
              
              <div className="agendamentos-do-dia">
                {agendamentosDoDia.map((agendamento, idx) => {
                  const originalIndex = agendamentos.findIndex(a => 
                    a.data === agendamento.data && 
                    a.hora === agendamento.hora && 
                    a.clienteId === agendamento.clienteId
                  );
                  
                  const cliente = clientes.find(c => c.id == agendamento.clienteId);
                  const servico = servicos.find(s => s.id == agendamento.servicoId);
                  
                  return (
                    <div 
                      key={`${data}-${idx}`} 
                      className="agendamento-item"
                      onClick={() => abrirDetalhesAgendamento(agendamento)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="agendamento-info">
                        <div className="agendamento-principal">
                          <span className="cliente-nome">{cliente?.nome || agendamento.clienteNome || 'Cliente não encontrado'}</span>
                          <span className="servico-nome">{agendamento.servicoNome || servico?.nome || 'Serviço não encontrado'}</span>
                        </div>
                        <div className="agendamento-hora">
                          <span className="hora">{formatarHora(agendamento.hora)}</span>
                        </div>
                      </div>
                      
                      <div className="agendamento-actions">
                        <button 
                          className="icon-btn" 
                          title="Editar" 
                          onClick={(e) => {
                            e.stopPropagation();
                            editarAgendamento(originalIndex);
                          }}
                        >
                          <IconEdit />
                        </button>
                        <button 
                          className="icon-btn" 
                          title="Excluir" 
                          onClick={(e) => {
                            e.stopPropagation();
                            excluirAgendamento(originalIndex);
                          }}
                        >
                          <IconDelete />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListaAgendamentos;
