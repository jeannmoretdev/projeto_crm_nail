import React from 'react';
import Modal from '../../components/Modal';
import CadastroCliente from './CadastroCliente';

function ModalCadastroCliente({ open, onAdd, onClose, editData }) {
  return (
    <Modal open={open} onClose={onClose}>
      <CadastroCliente onAdd={onAdd} onClose={onClose} editData={editData} />
    </Modal>
  );
}

export default ModalCadastroCliente;
