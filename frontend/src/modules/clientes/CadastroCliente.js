import React, { useState } from 'react';
import Button from '../../components/Button';

function CadastroCliente({ onAdd, onClose, editData }) {
  const [nome, setNome] = useState(editData?.nome || '');
  const [telefone, setTelefone] = useState(editData?.telefone || '');
  const [aniversario, setAniversario] = useState(editData?.aniversario || '');
  const [observacoes, setObservacoes] = useState(editData?.observacoes || '');
  const [erroNome, setErroNome] = useState(false);

  // Função para formatar telefone: (xx) xxxxx-xxxx
  function formatTelefone(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0,2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0,2)}) ${numbers.slice(2,7)}-${numbers.slice(7,11)}`;
  }

  // Função para formatar aniversário: xx/xx
  function formatAniversario(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    return `${numbers.slice(0,2)}/${numbers.slice(2,4)}`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome) {
      setErroNome(true);
      return;
    }
    setErroNome(false);
    onAdd({ nome, telefone, aniversario, observacoes });
    setNome('');
    setTelefone('');
    setAniversario('');
    setObservacoes('');
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', background: 'var(--color-white)', borderRadius: 12, boxShadow: '0 2px 12px var(--shadow)', padding: 32 }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: 24, fontWeight: 600 }}>Cadastro de Cliente</h2>
      {erroNome && (
        <div style={{ color: 'var(--color-accent)', background: 'var(--color-light)', borderRadius: 6, padding: '8px 12px', marginBottom: 12, fontWeight: 500, boxShadow: '0 1px 4px var(--shadow)' }}>
          O campo <strong>Nome</strong> é obrigatório para cadastrar o cliente.
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="text"
          placeholder="Nome *"
          value={nome}
          onChange={e => setNome(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: erroNome ? '2px solid var(--color-accent)' : '1px solid var(--color-medium)', fontSize: 16, background: erroNome ? 'var(--color-light)' : undefined }}
        />
        <input
          type="tel"
          inputMode="numeric"
          placeholder="Telefone"
          value={formatTelefone(telefone)}
          onChange={e => {
            const raw = e.target.value.replace(/\D/g, '');
            setTelefone(raw.slice(0,11));
          }}
          maxLength={15}
          style={{ padding: 10, borderRadius: 6, border: '1px solid var(--color-medium)', fontSize: 16 }}
        />
        <input
          type="tel"
          inputMode="numeric"
          placeholder="Aniversário (DD/MM)"
          value={formatAniversario(aniversario)}
          onChange={e => {
            const raw = e.target.value.replace(/\D/g, '');
            setAniversario(raw.slice(0,4));
          }}
          maxLength={5}
          style={{ padding: 10, borderRadius: 6, border: '1px solid var(--color-medium)', fontSize: 16 }}
        />
        <textarea
          placeholder="Observações"
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
          rows={3}
          style={{ padding: 10, borderRadius: 6, border: '1px solid var(--color-medium)', fontSize: 16, resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <Button type="submit" variant="primary" style={{ flex: 1 }}>
            Cadastrar
          </Button>
          {onClose && (
            <Button type="button" variant="light" onClick={onClose} style={{ flex: 1 }}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CadastroCliente;
