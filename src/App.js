import React, { useState } from 'react';
import './App.css';
import Sidebar from './modules/sidebar/Sidebar';
import Dashboard from './modules/dashboard/Dashboard';
import ListaClientes from './modules/clientes/ListaClientes';
import ListaServicos from './modules/servicos/ListaServicos';
import ListaAgendamentos from './modules/agendamentos/ListaAgendamentos';
import AgendaLivre from './modules/agenda-livre/AgendaLivre';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderActiveModule = () => {
    switch(activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'clientes':
        return <ListaClientes />;
      case 'servicos':
        return <ListaServicos />;
      case 'agendamentos':
        return <ListaAgendamentos />;
      case 'agenda-livre':
        return <AgendaLivre />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="main-content" style={{ flex: 1, padding: '40px' }}>
        {renderActiveModule()}
      </main>
    </div>
  );
}

export default App;
