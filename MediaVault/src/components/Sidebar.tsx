import React from 'react';
import { Form, Button } from 'react-bootstrap';

// Adiciona classificação baseada em faixas etárias
const classifications = ['L', '10', '12', '14', '16', '18'];

type SidebarProps = {
  sortBy: string;
  setSortBy: (value: string) => void;
  genres: { id: number; name: string }[];
  selectedGenre: string;
  setSelectedGenre: (value: string) => void;
  providers: { provider_id: number; provider_name: string }[];
  selectedProvider: string;
  setSelectedProvider: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  classification: string;
  setClassification: (value: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  sortBy,
  setSortBy,
  genres,
  selectedGenre,
  setSelectedGenre,
  providers,
  selectedProvider,
  setSelectedProvider,
  searchTerm,
  setSearchTerm,
  classification,
  setClassification
}) => {
  return (
    <Form className="mb-4">
      {/* Ordenar por */}
      <Form.Group controlId="sortSelect" className="mb-4">
        <Form.Label>Ordenar por:</Form.Label>
        <Form.Select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="popularity.desc">Mais populares</option>
          <option value="popularity.asc">Menos populares</option>
          <option value="vote_average.desc">Mais bem avaliados</option>
          <option value="vote_average.asc">Piores avaliados</option>
          <option value="release_date.desc">Mais recentes</option>
          <option value="release_date.asc">Mais antigos</option>
          <option value="original_title.asc">Título A-Z</option>
          <option value="original_title.desc">Título Z-A</option>
        </Form.Select>
      </Form.Group>

      {/* Gêneros como botões */}
      <div className="mb-4">
        <Form.Label>Gêneros:</Form.Label>
        <div>
          {genres.map(g => (
            <Button
              key={g.id}
              variant={selectedGenre === String(g.id) ? 'secondary' : 'outline-secondary'}
              size="sm"
              className="me-2 mb-2 rounded-pill"
              onClick={() => setSelectedGenre(
                selectedGenre === String(g.id) ? '' : String(g.id)
              )}
            >
              {g.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Classificação Etária */}
      <div className="mb-4">
        <Form.Label>Classificação:</Form.Label>
        <div>
          {classifications.map(c => (
            <Button
              key={c}
              variant={classification === c ? 'secondary' : 'outline-secondary'}
              size="sm"
              className="me-2 mb-2 rounded-pill"
              onClick={() => setClassification(
                classification === c ? '' : c
              )}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {/* Onde assistir */}
      <Form.Group controlId="providerSelect" className="mb-4">
        <Form.Label>Onde assistir:</Form.Label>
        <Form.Select
          value={selectedProvider}
          onChange={e => setSelectedProvider(e.target.value)}
        >
          <option value="">Todos</option>
          {providers.map(p => (
            <option key={p.provider_id} value={p.provider_id}>
              {p.provider_name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Busca por nome */}
      <Form.Group controlId="searchInput">
        <Form.Label>Buscar por nome:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Digite o nome do filme"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Form.Group>
    </Form>
  );
};

export default Sidebar;
