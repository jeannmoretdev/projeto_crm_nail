import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';

function ModalCadastroServico({ open, onAdd, onClose, editData }) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  // Função para formatar valor monetário em tempo real
  const formatarValor = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    // Converte para centavos e depois para reais
    const valorFloat = parseFloat(numbers) / 100;
    
    return valorFloat.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleValorChange = (e) => {
    const valorFormatado = formatarValor(e.target.value);
    setValor(valorFormatado);
  };

  // Carregar dados para edição
  useEffect(() => {
    if (editData) {
      setNome(editData.nome);
      setValor(editData.valor);
    } else {
      setNome('');
      setValor('');
    }
  }, [editData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      alert('Por favor, preencha o nome do serviço.');
      return;
    }
    
    if (!valor.trim()) {
      alert('Por favor, preencha o valor do serviço.');
      return;
    }

    const parseValor = (valorString) => {
      const numero = parseFloat(valorString.replace(',', '.'));
      return isNaN(numero) ? 0 : numero;
    };

    const novoServico = {
      nome: nome.trim(),
      valor: parseValor(valor)
    };

    onAdd(novoServico);
    
    // Limpar formulário
    setNome('');
    setValor('');
  };

  const handleClose = () => {
    setNome('');
    setValor('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="modal-cadastro-servico">
        <h2>{editData ? 'Editar Serviço' : 'Novo Serviço'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              label="Nome do Serviço"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Aplicação Gel"
              required
            />
          </div>
          
          <div className="form-group">
            <Input
              label="Valor"
              type="text"
              value={valor}
              onChange={handleValorChange}
              placeholder="R$ 0,00"
              required
              inputMode="numeric"
            />
          </div>
          
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {editData ? 'Salvar Alterações' : 'Adicionar Serviço'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ModalCadastroServico;
