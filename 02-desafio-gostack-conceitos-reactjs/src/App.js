import React from "react";

import "./styles.css";
import { useState } from "react";
import { useEffect } from "react";
import api from "./services/api";

function App() {
  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data)
    })
  }, [])

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `Novo repositório ${Date.now()}`
    })
    const repositorie = response.data
    setRepositories([...repositories, repositorie])
  }

  async function handleRemoveRepository(id) {
    api.delete(`repositories/${id}`)
    setRepositories(repositories.filter(repo => repo.id !== id));
  }

  return (
    <div>
      <ul data-testid="repository-list">
          {repositories.map(repositorie => (
            <li key={repositorie.id}>{repositorie.title}
              <button onClick={() => handleRemoveRepository(repositorie.id)}>Remover</button>
            </li>
          ))}
      </ul>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
