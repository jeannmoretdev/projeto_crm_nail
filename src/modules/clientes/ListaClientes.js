import React, { useState, useEffect } from 'react';
import ModalCadastroCliente from './ModalCadastroCliente';
import ModalDetalhesCliente from './ModalDetalhesCliente';
import IconEdit from '../../components/IconEdit';
import IconDelete from '../../components/IconDelete';
import IconBirthday from '../../components/IconBirthday';
import './ListaClientes.css';

function ListaClientes() {
  // Função para formatar telefone: (xx) xxxxx-xxxx
  function formatTelefone(value) {
    const numbers = (value || '').replace(/\D/g, '');
    if (!numbers) return '';
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0,2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0,2)}) ${numbers.slice(2,7)}-${numbers.slice(7,11)}`;
  }

  // Função para formatar aniversário: xx/xx
  function formatAniversario(value) {
    const numbers = (value || '').replace(/\D/g, '');
    if (!numbers) return '';
    if (numbers.length <= 2) return numbers;
    return `${numbers.slice(0,2)}/${numbers.slice(2,4)}`;
  }

  // Função para calcular status do aniversário
  function getAniversarioStatus(aniversario) {
    if (!aniversario || aniversario.length < 4) {
      return { cor: '#666', diasRestantes: null };
    }

    const dia = parseInt(aniversario.slice(0, 2));
    const mes = parseInt(aniversario.slice(2, 4));
    
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
      return { cor: '#666', diasRestantes: null };
    }

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();

    // Data do aniversário neste ano
    const aniversarioEsteAno = new Date(anoAtual, mes - 1, dia);
    const agora = new Date();

    // Se o aniversário já passou este ano
    if (aniversarioEsteAno < agora) {
      return { cor: '#e74c3c', diasRestantes: null }; // Vermelho - já passou
    }
    
    // Calcular dias restantes para o aniversário
    const diffTime = aniversarioEsteAno - agora;
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diasRestantes === 0) {
      return { cor: '#ff6b35', diasRestantes: 'HOJE!', destaque: true }; // Laranja - é hoje!
    } else if (diasRestantes > 0) {
      return { cor: '#27ae60', diasRestantes: `${diasRestantes} dias`, destaque: diasRestantes <= 7 }; // Verde - ainda não chegou
    }
    
    return { cor: '#e74c3c', diasRestantes: null }; // Vermelho - já passou
  }

  const [clientes, setClientes] = useState(() => {
    const dadosSalvos = localStorage.getItem('clientes');
    const clientesSalvos = dadosSalvos ? JSON.parse(dadosSalvos) : [];
    
    // Adicionar IDs aos clientes que não têm
    return clientesSalvos.map(cliente => ({
      ...cliente,
      id: cliente.id || Date.now() + Math.random()
    }));
  });
  const [showCadastro, setShowCadastro] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  
  // Estados para filtros e busca
  const [filtroTexto, setFiltroTexto] = useState('');
  const [ordenacao, setOrdenacao] = useState('nome'); // nome, telefone, aniversario

  useEffect(() => {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [clientes]);

  const adicionarCliente = (novoCliente) => {
    if (editIndex !== null) {
      // Editar cliente existente
      const novosClientes = [...clientes];
      novosClientes[editIndex] = { ...novoCliente, id: novosClientes[editIndex].id };
      setClientes(novosClientes);
      setEditIndex(null);
      setEditData(null);
    } else {
      // Adicionar novo cliente
      const clienteComId = { ...novoCliente, id: Date.now() + Math.random() };
      setClientes([...clientes, clienteComId]);
    }
    setShowCadastro(false);
  };

  const excluirCliente = (idx) => {
    const novosClientes = clientes.filter((_, i) => i !== idx);
    setClientes(novosClientes);
  };

  const editarCliente = (idx) => {
    setEditIndex(idx);
    setEditData(clientes[idx]);
    setShowCadastro(true);
  };

  const visualizarCliente = (idx) => {
    setClienteSelecionado(clientes[idx]);
    setShowDetalhes(true);
  };

  const exportarDados = () => {
    const dados = {
      clientes: clientes,
      exportadoEm: new Date().toISOString(),
      versao: "1.0"
    };
    
    const dataStr = JSON.stringify(dados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes_backup_${new Date().toISOString().split('T')[0]}.json`;
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
        if (dados.clientes && Array.isArray(dados.clientes)) {
          setClientes(dados.clientes);
          alert(`Importados ${dados.clientes.length} clientes com sucesso!`);
        } else {
          alert('Formato de arquivo inválido!');
        }
      } catch (error) {
        alert('Erro ao ler o arquivo. Verifique se é um JSON válido.');
      }
    };
    reader.readAsText(file);
    // Limpar o input para permitir reimportar o mesmo arquivo
    event.target.value = '';
  };

  // Função para filtrar e ordenar clientes
  const clientesFiltrados = clientes
    .filter(cliente => {
      if (!filtroTexto) return true;
      
      const textoLowerCase = filtroTexto.toLowerCase();
      const nome = cliente.nome.toLowerCase();
      const telefone = formatTelefone(cliente.telefone) || '';
      const aniversario = formatAniversario(cliente.aniversario) || '';
      
      return nome.includes(textoLowerCase) || 
             telefone.includes(textoLowerCase) || 
             aniversario.includes(textoLowerCase);
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        
        case 'telefone':
          const telefoneA = a.telefone || '';
          const telefoneB = b.telefone || '';
          return telefoneA.localeCompare(telefoneB);
        
        case 'aniversario':
          const anivA = a.aniversario || '9999';
          const anivB = b.aniversario || '9999';
          // Ordenar por mês e depois por dia
          const mesA = anivA.slice(2, 4);
          const mesB = anivB.slice(2, 4);
          const diaA = anivA.slice(0, 2);
          const diaB = anivB.slice(0, 2);
          
          if (mesA !== mesB) {
            return mesA.localeCompare(mesB);
          }
          return diaA.localeCompare(diaB);
        
        default:
          return 0;
      }
    });

  return (
    <div className="clientes-lista-container">
      <h2 className="clientes-titulo">Clientes</h2>
      
      <div className="clientes-toolbar">
        <button className="clientes-adicionar-btn" onClick={() => setShowCadastro(true)}>
          Adicionar Cliente
        </button>
        
        <div className="clientes-filtros">
          <input
            type="text"
            placeholder="Pesquisar por nome, telefone ou aniversário..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="clientes-filtro-input"
          />
          
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className="clientes-filtro-select"
          >
            <option value="">Ordenar por...</option>
            <option value="nome">Nome</option>
            <option value="telefone">Telefone</option>
            <option value="aniversario">Aniversário</option>
          </select>
        </div>
        
        <div className="clientes-import-export">
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

      <ModalCadastroCliente
        open={showCadastro}
        onAdd={adicionarCliente}
        onClose={() => {
          setShowCadastro(false);
          setEditIndex(null);
          setEditData(null);
        }}
        editData={editData}
      />

      <ModalDetalhesCliente
        open={showDetalhes}
        onClose={() => {
          setShowDetalhes(false);
          setClienteSelecionado(null);
        }}
        cliente={clienteSelecionado}
      />

      <ul className="clientes-lista">
        {clientesFiltrados.length === 0 && filtroTexto && (
          <li className="clientes-vazio">Nenhum cliente encontrado para "{filtroTexto}".</li>
        )}
        {clientesFiltrados.length === 0 && !filtroTexto && (
          <li className="clientes-vazio">Nenhum cliente cadastrado.</li>
        )}
        {clientesFiltrados.map((cliente, idx) => {
          // Encontrar o índice original do cliente na lista completa
          const originalIndex = clientes.findIndex(c => 
            c.nome === cliente.nome && 
            c.telefone === cliente.telefone && 
            c.aniversario === cliente.aniversario
          );
          
          return (
            <li key={originalIndex} className="clientes-card">
              <div className="clientes-card-top">
                <div className="clientes-card-actions">
                  <button className="icon-btn" title="Editar" onClick={() => editarCliente(originalIndex)}>
                    <IconEdit />
                  </button>
                  <button className="icon-btn" title="Excluir" onClick={() => excluirCliente(originalIndex)}>
                    <IconDelete />
                  </button>
                </div>
              </div>
              <div className="clientes-card-info" onClick={() => visualizarCliente(originalIndex)}>
                <span className="clientes-nome">{cliente.nome}</span>
                <span className="clientes-dados">
                  {formatTelefone(cliente.telefone) || '-'} &nbsp;–&nbsp; 
                  <span className="aniversario-container">
                    <IconBirthday size={16} />
                    <span 
                      className="aniversario-data" 
                      style={{ color: getAniversarioStatus(cliente.aniversario).cor }}
                    >
                      {formatAniversario(cliente.aniversario) || '-'}
                    </span>
                    {getAniversarioStatus(cliente.aniversario).diasRestantes && (
                      <span 
                        className={`dias-restantes ${getAniversarioStatus(cliente.aniversario).destaque ? 'destaque' : ''}`}
                        style={{ color: getAniversarioStatus(cliente.aniversario).cor }}
                      >
                        {getAniversarioStatus(cliente.aniversario).diasRestantes}
                      </span>
                    )}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ListaClientes;
