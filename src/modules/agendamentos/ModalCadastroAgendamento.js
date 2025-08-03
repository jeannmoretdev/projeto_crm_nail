import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';

function ModalCadastroAgendamento({ 
  open, 
  onAdd, 
  onClose, 
  editData, 
  clientes, 
  servicos, 
  onNovoCliente, 
  onNovoServico 
}) {
  const [clienteId, setClienteId] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [valorCobrado, setValorCobrado] = useState('');
  const [observacao, setObservacao] = useState('');
  const [buscaCliente, setBuscaCliente] = useState('');
  const [mostrarListaClientes, setMostrarListaClientes] = useState(false);

  useEffect(() => {
    if (editData) {
      setClienteId(editData.clienteId || '');
      setServicoId(editData.servicoId || '');
      setData(editData.data || '');
      setHora(editData.hora || '');
      setObservacao(editData.observacao || '');
      
      // Definir nome do cliente para busca
      const cliente = clientes.find(c => c.id === editData.clienteId);
      setBuscaCliente(cliente ? cliente.nome : '');
    } else {
      setClienteId('');
      setServicoId('');
      setData('');
      setHora('');
      setValorCobrado('');
      setObservacao('');
      setBuscaCliente('');
    }
    setMostrarListaClientes(false);
  }, [editData, open, clientes]);

  // Atualizar valor cobrado quando o serviço mudar (apenas para novos agendamentos)
  useEffect(() => {
    if (servicoId && !editData) {
      const servico = servicos.find(s => s.id == servicoId);
      if (servico) {
        const valorFormatado = servico.valor.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        setValorCobrado(valorFormatado);
      }
    }
  }, [servicoId, servicos, editData]);

  // Para edição, formatar o valor cobrado existente
  useEffect(() => {
    if (editData && editData.valorCobrado) {
      const valorFormatado = editData.valorCobrado.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setValorCobrado(valorFormatado);
    }
  }, [editData]);

  const formatarValor = (valor) => {
    // Remove tudo que não é dígito
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Converte para número e divide por 100 para ter os centavos
    const numero = parseFloat(apenasNumeros) / 100;
    
    // Formata como moeda brasileira
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleValorChange = (e) => {
    const valorFormatado = formatarValor(e.target.value);
    setValorCobrado(valorFormatado);
  };

  // Funções para busca de clientes
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(buscaCliente.toLowerCase())
  );

  const handleBuscaClienteChange = (e) => {
    const valor = e.target.value;
    setBuscaCliente(valor);
    setMostrarListaClientes(valor.length > 0);
    
    // Se limpar o campo, limpar o cliente selecionado
    if (valor === '') {
      setClienteId('');
    }
  };

  const selecionarCliente = (cliente) => {
    setClienteId(cliente.id);
    setBuscaCliente(cliente.nome);
    setMostrarListaClientes(false);
  };

  // Função para formatar data com máscara dd/mm/aaaa
  const aplicarMascaraData = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length <= 2) {
      return apenasNumeros;
    } else if (apenasNumeros.length <= 4) {
      return `${apenasNumeros.slice(0,2)}/${apenasNumeros.slice(2)}`;
    } else {
      return `${apenasNumeros.slice(0,2)}/${apenasNumeros.slice(2,4)}/${apenasNumeros.slice(4,8)}`;
    }
  };

  // Função para formatar hora com máscara HH:MM
  const aplicarMascaraHora = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length <= 2) {
      return apenasNumeros;
    } else {
      return `${apenasNumeros.slice(0,2)}:${apenasNumeros.slice(2,4)}`;
    }
  };

  const validarData = (dataStr) => {
    if (!dataStr || dataStr.length < 10) return false;
    const [dia, mes, ano] = dataStr.split('/');
    const data = new Date(ano, mes - 1, dia);
    return data.getDate() == dia && data.getMonth() == mes - 1 && data.getFullYear() == ano;
  };

  const validarHora = (horaStr) => {
    if (!horaStr || horaStr.length < 5) return false;
    const [hora, minuto] = horaStr.split(':');
    const h = parseInt(hora);
    const m = parseInt(minuto);
    return h >= 0 && h <= 23 && m >= 0 && m <= 59;
  };

  const handleDataChange = (e) => {
    const valorFormatado = aplicarMascaraData(e.target.value);
    setData(valorFormatado);
  };

  const handleHoraChange = (e) => {
    const valorFormatado = aplicarMascaraHora(e.target.value);
    setHora(valorFormatado);
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.cliente-search-container')) {
        setMostrarListaClientes(false);
      }
    };

    if (mostrarListaClientes) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mostrarListaClientes]);

  const parseValor = (valorFormatado) => {
    // Remove pontos e substitui vírgula por ponto
    const valorLimpo = valorFormatado.replace(/\./g, '').replace(',', '.');
    return parseFloat(valorLimpo) || 0;
  };

  const servicoSelecionado = servicos.find(s => s.id == servicoId);
  const valorServico = servicoSelecionado?.valor || 0;
  const valorCobradoNumerico = valorCobrado ? parseValor(valorCobrado) : valorServico;
  const diferenca = valorCobradoNumerico - valorServico;

  // Debug
  const formatarValorMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clienteId || !servicoId || !data || !hora) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validar formato da data
    if (!validarData(data)) {
      alert('Por favor, insira uma data válida no formato dd/mm/aaaa.');
      return;
    }

    // Validar formato da hora
    if (!validarHora(hora)) {
      alert('Por favor, insira uma hora válida no formato HH:MM (00:00 - 23:59).');
      return;
    }

    // Verificar se o cliente existe
    const clienteExiste = clientes.find(c => c.id == clienteId);
    if (!clienteExiste) {
      alert('Por favor, selecione um cliente válido da lista.');
      return;
    }

    const novoAgendamento = {
      id: editData ? editData.id : Date.now(),
      clienteId: parseInt(clienteId),
      servicoId: parseInt(servicoId),
      clienteNome: clienteExiste.nome,
      servicoNome: servicos.find(s => s.id == servicoId)?.nome || '',
      data,
      hora,
      valor: valorCobrado ? parseValor(valorCobrado) : valorServico,
      observacao: observacao.trim()
    };

    onAdd(novoAgendamento);
    onClose();
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-header">
        <h3>{editData ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-row">
          <div className="form-group cliente-group">
            <label htmlFor="cliente">Cliente *</label>
            <div className="select-with-button">
              <div className="cliente-search-container">
                <input
                  type="text"
                  id="cliente"
                  value={buscaCliente}
                  onChange={handleBuscaClienteChange}
                  onFocus={() => buscaCliente && setMostrarListaClientes(true)}
                  placeholder="Digite o nome do cliente..."
                  className="cliente-search-input"
                  required
                />
                {mostrarListaClientes && clientesFiltrados.length > 0 && (
                  <div className="clientes-dropdown">
                    {clientesFiltrados.slice(0, 5).map(cliente => (
                      <div 
                        key={cliente.id} 
                        className="cliente-option"
                        onClick={() => selecionarCliente(cliente)}
                      >
                        {cliente.nome}
                      </div>
                    ))}
                    {clientesFiltrados.length > 5 && (
                      <div className="cliente-option-info">
                        +{clientesFiltrados.length - 5} clientes...
                      </div>
                    )}
                  </div>
                )}
                {mostrarListaClientes && clientesFiltrados.length === 0 && buscaCliente && (
                  <div className="clientes-dropdown">
                    <div className="cliente-option-info">
                      Nenhum cliente encontrado
                    </div>
                  </div>
                )}
              </div>
              <button 
                type="button" 
                className="btn-novo"
                onClick={onNovoCliente}
                title="Cadastrar novo cliente"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group servico-group">
            <label htmlFor="servico">Serviço *</label>
            <div className="select-with-button">
              <select
                id="servico"
                value={servicoId}
                onChange={(e) => setServicoId(e.target.value)}
                required
              >
                <option value="">Selecione um serviço</option>
                {servicos.map(servico => (
                  <option key={servico.id} value={servico.id}>
                    {servico.nome} - {formatarValorMoeda(servico.valor)}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                className="btn-novo"
                onClick={onNovoServico}
                title="Cadastrar novo serviço"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="data">Data *</label>
            <Input
              type="text"
              id="data"
              value={data}
              onChange={handleDataChange}
              required
              placeholder="dd/mm/aaaa"
              maxLength="10"
              inputMode="numeric"
            />
          </div>
          <div className="form-group">
            <label htmlFor="hora">Hora *</label>
            <Input
              type="text"
              id="hora"
              value={hora}
              onChange={handleHoraChange}
              required
              placeholder="HH:MM (00:00 - 23:59)"
              maxLength="5"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="form-row valores-row">
          <div className="form-group">
            <label htmlFor="valorServico">Valor do Serviço</label>
            <Input
              type="text"
              id="valorServico"
              value={formatarValorMoeda(valorServico)}
              disabled
              className="valor-servico"
            />
          </div>
          <div className="form-group">
            <label htmlFor="valorCobrado">Valor Cobrado</label>
            <Input
              type="text"
              id="valorCobrado"
              value={valorCobrado}
              onChange={handleValorChange}
              placeholder="Será preenchido automaticamente"
              inputMode="numeric"
            />
          </div>
          <div className="form-group">
            <label htmlFor="diferenca">Diferença</label>
            <Input
              type="text"
              id="diferenca"
              value={diferenca >= 0 ? `+${formatarValorMoeda(diferenca)}` : formatarValorMoeda(diferenca)}
              disabled
              className={`diferenca ${diferenca >= 0 ? 'positiva' : 'negativa'}`}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="observacao">Observação</label>
            <textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Observações sobre o agendamento (será adicionada ao histórico do cliente)"
              rows="3"
              className="form-textarea"
            />
          </div>
        </div>

        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {editData ? 'Salvar Alterações' : 'Criar Agendamento'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalCadastroAgendamento;
