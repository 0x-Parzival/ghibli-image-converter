import React from 'react';
import GhibliGenerator from './components/GhibliGenerator';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Instagram to Ghibli Portrait</h1>
      </header>
      <main>
        <GhibliGenerator />
      </main>
      <footer className="app-footer">
        <p>© 2025 Ghibli Portrait Generator</p>
      </footer>
    </div>
  );
}

export default App;
