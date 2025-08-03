import React from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import IconBirthday from '../../components/IconBirthday';
import './ModalDetalhesCliente.css';

function ModalDetalhesCliente({ open, onClose, cliente }) {
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
    const diaAtual = hoje.getDate();

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

  if (!cliente) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="detalhes-cliente-container">
        <h2 className="detalhes-titulo">Detalhes do Cliente</h2>
        
        <div className="detalhes-info">
          <div className="detalhes-campo">
            <label className="detalhes-label">Nome:</label>
            <span className="detalhes-valor">{cliente.nome}</span>
          </div>
          
          <div className="detalhes-campo">
            <label className="detalhes-label">Telefone:</label>
            <span className="detalhes-valor">{formatTelefone(cliente.telefone) || 'Não informado'}</span>
          </div>
          
          <div className="detalhes-campo">
            <label className="detalhes-label">Aniversário:</label>
            <span className="detalhes-valor aniversario-detalhes">
              <IconBirthday size={18} />
              <span 
                style={{ color: getAniversarioStatus(cliente.aniversario).cor }}
              >
                {formatAniversario(cliente.aniversario) || 'Não informado'}
              </span>
              {getAniversarioStatus(cliente.aniversario).diasRestantes && (
                <span 
                  className={`dias-restantes-modal ${getAniversarioStatus(cliente.aniversario).destaque ? 'destaque' : ''}`}
                  style={{ color: getAniversarioStatus(cliente.aniversario).cor }}
                >
                  {getAniversarioStatus(cliente.aniversario).diasRestantes}
                </span>
              )}
            </span>
          </div>
          
          <div className="detalhes-campo">
            <label className="detalhes-label">Observações:</label>
            <span className="detalhes-valor observacoes">{cliente.observacoes || 'Nenhuma observação cadastrada'}</span>
          </div>

          {/* Futuramente aqui virão os históricos de serviços */}
          <div className="detalhes-campo">
            <label className="detalhes-label">Histórico de Serviços:</label>
            <span className="detalhes-valor observacoes">Em breve - histórico completo de serviços, preços e datas</span>
          </div>
        </div>

        <div className="detalhes-actions">
          <Button variant="primary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalDetalhesCliente;
