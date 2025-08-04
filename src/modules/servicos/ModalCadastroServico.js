import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';

function ModalCadastroServico({ open, onAdd, onClose, editData }) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [custo, setCusto] = useState('');

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

  const handleCustoChange = (e) => {
    const custoFormatado = formatarValor(e.target.value);
    setCusto(custoFormatado);
  };

  // Carregar dados para edição
  useEffect(() => {
    if (editData) {
      setNome(editData.nome);
      // Converter valores numéricos para string formatada
      setValor(editData.valor ? formatarValor((editData.valor * 100).toString()) : '');
      setCusto(editData.custo ? formatarValor((editData.custo * 100).toString()) : '');
    } else {
      setNome('');
      setValor('');
      setCusto('');
    }
  }, [editData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      alert('Por favor, preencha o nome do serviço.');
      return;
    }
    
    if (!valor || valor.trim() === '' || valor.trim() === 'R$ 0,00') {
      alert('Por favor, preencha o valor do serviço.');
      return;
    }

    const parseValor = (valorString) => {
      if (!valorString) return 0;
      // Remove R$, espaços e substitui vírgula por ponto
      const numeroLimpo = valorString.replace(/[R$\s]/g, '').replace(',', '.');
      const numero = parseFloat(numeroLimpo);
      return isNaN(numero) ? 0 : numero;
    };

    const novoServico = {
      nome: nome.trim(),
      valor: parseValor(valor),
      custo: parseValor(custo) || 0
    };

    onAdd(novoServico);
    
    // Limpar formulário
    setNome('');
    setValor('');
    setCusto('');
  };

  const handleClose = () => {
    setNome('');
    setValor('');
    setCusto('');
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
          
          <div className="form-group">
            <Input
              label="Custo"
              type="text"
              value={custo}
              onChange={handleCustoChange}
              placeholder="R$ 0,00"
              inputMode="numeric"
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Custo dos materiais/produtos utilizados (opcional)
            </small>
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
