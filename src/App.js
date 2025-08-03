import React, { useState } from 'react';
import './App.css';
import Sidebar from './modules/sidebar/Sidebar';
import ListaClientes from './modules/clientes/ListaClientes';
import ListaServicos from './modules/servicos/ListaServicos';
import ListaAgendamentos from './modules/agendamentos/ListaAgendamentos';

function App() {
  const [activeModule, setActiveModule] = useState('clientes');

  const renderActiveModule = () => {
    switch(activeModule) {
      case 'clientes':
        return <ListaClientes />;
      case 'servicos':
        return <ListaServicos />;
      case 'agendamentos':
        return <ListaAgendamentos />;
      default:
        return <ListaClientes />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main style={{ flex: 1, padding: '40px' }}>
        {renderActiveModule()}
      </main>
    </div>
  );
}

export default App;
