import React, { useState, useEffect } from 'react';
import ModalCadastroServico from './ModalCadastroServico';
import IconEdit from '../../components/IconEdit';
import IconDelete from '../../components/IconDelete';
import './ListaServicos.css';

function ListaServicos() {
  // Estados
  const [servicos, setServicos] = useState(() => {
    const dadosSalvos = localStorage.getItem('servicos');
    const servicosSalvos = dadosSalvos ? JSON.parse(dadosSalvos) : [
      { id: Date.now() + 1, nome: 'Aplicação Normal', valor: 50.00, custo: 15.00 },
      { id: Date.now() + 2, nome: 'Aplicação Gel', valor: 70.00, custo: 20.00 },
      { id: Date.now() + 3, nome: 'Manutenção Normal', valor: 35.00, custo: 10.00 },
      { id: Date.now() + 4, nome: 'Manutenção Gel', valor: 45.00, custo: 12.00 }
    ];
    
    // Adicionar IDs aos serviços que não têm e converter valores em string para número
    return servicosSalvos.map(servico => ({
      ...servico,
      id: servico.id || Date.now() + Math.random(),
      valor: typeof servico.valor === 'string' ? parseFloat(servico.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0 : servico.valor,
      custo: servico.custo !== undefined ? (typeof servico.custo === 'string' ? parseFloat(servico.custo.replace(/[^\d,]/g, '').replace(',', '.')) || 0 : servico.custo) : 0
    }));
  });
  const [showCadastro, setShowCadastro] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [ordenacao, setOrdenacao] = useState('nome');

  // Função para formatar valor monetário
  function formatValor(value) {
    const numbers = (value || '').replace(/\D/g, '');
    if (!numbers) return '';
    
    const valorFloat = parseFloat(numbers) / 100;
    return valorFloat.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  // Função para calcular margem de lucro
  const calcularMargemLucro = (valor, custo) => {
    if (!valor || valor === 0) return 0;
    const margem = ((valor - custo) / valor) * 100;
    return Math.max(0, margem);
  };

  // Função para formatar moeda
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  // Salvar serviços no localStorage
  useEffect(() => {
    localStorage.setItem('servicos', JSON.stringify(servicos));
  }, [servicos]);

  // Função para adicionar serviço
  const adicionarServico = (novoServico) => {
    if (editIndex !== null) {
      // Editar serviço existente
      const novosServicos = [...servicos];
      novosServicos[editIndex] = { ...novoServico, id: novosServicos[editIndex].id };
      setServicos(novosServicos);
      setEditIndex(null);
      setEditData(null);
    } else {
      // Adicionar novo serviço
      const servicoComId = { ...novoServico, id: Date.now() + Math.random() };
      setServicos([...servicos, servicoComId]);
    }
    setShowCadastro(false);
  };

  // Função para editar serviço
  const editarServico = (index) => {
    setEditIndex(index);
    setEditData(servicos[index]);
    setShowCadastro(true);
  };

  // Função para excluir serviço
  const excluirServico = (index) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      const novosServicos = servicos.filter((_, i) => i !== index);
      setServicos(novosServicos);
    }
  };

  // Função para exportar dados
  const exportarDados = () => {
    const dados = {
      servicos: servicos,
      exportadoEm: new Date().toISOString(),
      versao: "1.0"
    };
    
    const dataStr = JSON.stringify(dados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `servicos_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Função para importar dados
  const importarDados = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target.result);
        if (dados.servicos && Array.isArray(dados.servicos)) {
          setServicos(dados.servicos);
          alert(`Importados ${dados.servicos.length} serviços com sucesso!`);
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

  // Função para filtrar e ordenar serviços
  const servicosFiltrados = servicos
    .filter(servico => {
      if (!filtroTexto) return true;
      
      const textoLowerCase = filtroTexto.toLowerCase();
      const nome = servico.nome.toLowerCase();
      const valor = servico.valor.toLowerCase();
      
      return nome.includes(textoLowerCase) || valor.includes(textoLowerCase);
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        
        case 'valor':
          const valorA = parseFloat(a.valor.replace(/[R$\s.,]/g, '')) || 0;
          const valorB = parseFloat(b.valor.replace(/[R$\s.,]/g, '')) || 0;
          return valorA - valorB;
        
        default:
          return 0;
      }
    });

  return (
    <div className="servicos-lista-container">
      <h2 className="servicos-titulo">Serviços</h2>
      
      <div className="servicos-toolbar">
        <button className="servicos-adicionar-btn" onClick={() => setShowCadastro(true)}>
          Novo Serviço
        </button>
        
        <div className="servicos-filtros">
          <input
            type="text"
            placeholder="Pesquisar por nome ou valor..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="servicos-filtro-input"
          />
          
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className="servicos-filtro-select"
          >
            <option value="">Ordenar por...</option>
            <option value="nome">Nome</option>
            <option value="valor">Valor</option>
          </select>
        </div>
        
        <div className="servicos-import-export">
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

      <ModalCadastroServico
        open={showCadastro}
        onAdd={adicionarServico}
        onClose={() => {
          setShowCadastro(false);
          setEditIndex(null);
          setEditData(null);
        }}
        editData={editData}
      />

      <div className="servicos-grid">
        {servicosFiltrados.length === 0 && filtroTexto && (
          <div className="servicos-vazio">Nenhum serviço encontrado para "{filtroTexto}".</div>
        )}
        {servicosFiltrados.length === 0 && !filtroTexto && (
          <div className="servicos-vazio">Nenhum serviço cadastrado.</div>
        )}
        {servicosFiltrados.map((servico, idx) => {
          // Encontrar o índice original do serviço na lista completa
          const originalIndex = servicos.findIndex(s => 
            s.nome === servico.nome && s.valor === servico.valor
          );
          
          return (
            <div key={originalIndex} className="servico-card">
              <div className="servico-card-header">
                <div className="servico-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="servico-actions">
                  <button 
                    className="icon-btn edit" 
                    title="Editar" 
                    onClick={() => editarServico(originalIndex)}
                  >
                    <IconEdit />
                  </button>
                  <button 
                    className="icon-btn delete" 
                    title="Excluir" 
                    onClick={() => excluirServico(originalIndex)}
                  >
                    <IconDelete />
                  </button>
                </div>
              </div>
              
              <div className="servico-content">
                <h3 className="servico-nome">{servico.nome}</h3>
                <div className="servico-financeiro">
                  <div className="servico-valores">
                    <div className="valor-item">
                      <span className="valor-label">Valor:</span>
                      <span className="valor-preco">{formatarMoeda(servico.valor)}</span>
                    </div>
                    {servico.custo > 0 && (
                      <div className="valor-item">
                        <span className="valor-label">Custo:</span>
                        <span className="valor-custo">{formatarMoeda(servico.custo)}</span>
                      </div>
                    )}
                    {servico.custo > 0 && (
                      <div className="valor-item">
                        <span className="valor-label">Lucro:</span>
                        <span className="valor-lucro">{formatarMoeda(servico.valor - servico.custo)}</span>
                      </div>
                    )}
                  </div>
                  {servico.custo > 0 && (
                    <div className="margem-lucro">
                      <span className="margem-label">Margem:</span>
                      <span className={`margem-valor ${calcularMargemLucro(servico.valor, servico.custo) >= 50 ? 'alta' : calcularMargemLucro(servico.valor, servico.custo) >= 30 ? 'media' : 'baixa'}`}>
                        {calcularMargemLucro(servico.valor, servico.custo).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListaServicos;
