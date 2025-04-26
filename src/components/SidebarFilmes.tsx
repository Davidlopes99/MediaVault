// SidebarFilmes.tsx
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; // estilos do slider

const classifications = ['L', '10', '12', '14', '16', '18'];

type SidebarFilmesProps = {
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
  minRating: number;
  setMinRating: (value: number) => void;
  maxRating: number;
  setMaxRating: (value: number) => void;
  countries: { iso_3166_1: string; english_name: string }[];
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
};

const SidebarFilmes: React.FC<SidebarFilmesProps> = ({
  sortBy, setSortBy,
  genres, selectedGenre, setSelectedGenre,
  providers, selectedProvider, setSelectedProvider,
  searchTerm, setSearchTerm,
  classification, setClassification,
  minRating, setMinRating,
  maxRating, setMaxRating,
  countries, selectedCountry, setSelectedCountry,
}) => {
  // Estados locais
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [localSelectedGenre, setLocalSelectedGenre] = useState(selectedGenre);
  const [localSelectedProvider, setLocalSelectedProvider] = useState(selectedProvider);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localClassification, setLocalClassification] = useState(classification);
  const [localMinRating, setLocalMinRating] = useState(minRating);
  const [localMaxRating, setLocalMaxRating] = useState(maxRating);
  const [localSelectedCountry, setLocalSelectedCountry] = useState(selectedCountry);

  const handleRangeChange = (values: number | number[]) => {
    const [novoMin, novoMax] = values as number[];
    setLocalMinRating(novoMin);
    setLocalMaxRating(novoMax);
  };

  const applyFilters = () => {
    setSortBy(localSortBy);
    setSelectedGenre(localSelectedGenre);
    setSelectedProvider(localSelectedProvider);
    setSearchTerm(localSearchTerm);
    setClassification(localClassification);
    setMinRating(localMinRating);
    setMaxRating(localMaxRating);
    setSelectedCountry(localSelectedCountry);
  };

  return (
    <Form className="mb-4">
      {/* Ordenar por */}
      <Form.Group controlId="sortSelect" className="mb-4">
        <Form.Label>Ordenar por:</Form.Label>
        <Form.Select value={localSortBy} onChange={e => setLocalSortBy(e.target.value)}>
          <option value="popularity.desc">Mais populares</option>
          <option value="popularity.asc">Menos populares</option>
          <option value="vote_average.desc">Mais bem avaliados</option>
          <option value="vote_average.asc">Piores avaliados</option>
          <option value="release_date.desc">Mais recentes</option>
          <option value="release_date.asc">Mais antigos</option>
          <option value="title.asc">Título A-Z (português)</option>
          <option value="title.desc">Título Z-A (português)</option>
        </Form.Select>
      </Form.Group>

      {/* Gêneros como botões */}
      <div className="mb-4">
        <Form.Label>Gêneros:</Form.Label>
        <div>
          {genres.map(g => (
            <Button
              key={g.id}
              variant={localSelectedGenre === String(g.id) ? 'secondary' : 'outline-secondary'}
              size="sm"
              className="me-2 mb-2 rounded-pill"
              onClick={() =>
                setLocalSelectedGenre(localSelectedGenre === String(g.id) ? '' : String(g.id))
              }
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
              variant={localClassification === c ? 'secondary' : 'outline-secondary'}
              size="sm"
              className="me-2 mb-2 rounded-pill"
              onClick={() => setLocalClassification(localClassification === c ? '' : c)}
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
          value={localSelectedProvider}
          onChange={e => setLocalSelectedProvider(e.target.value)}
        >
          <option value="">Todos</option>
          {providers.map(p => (
            <option key={p.provider_id} value={p.provider_id}>
              {p.provider_name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* País de produção */}
      <Form.Group controlId="countrySelect" className="mb-4">
        <Form.Label>País de produção:</Form.Label>
        <Form.Select
          value={localSelectedCountry}
          onChange={e => setLocalSelectedCountry(e.target.value)}
        >
          <option value="">Todos</option>
          {countries.map(c => (
            <option key={c.iso_3166_1} value={c.iso_3166_1}>
              {c.english_name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Busca por nome */}
      <Form.Group controlId="searchInput" className="mb-4">
        <Form.Label>Buscar por nome:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Exemplo: Vingadores"
          value={localSearchTerm}
          onChange={e => setLocalSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* Filtro de nota com slider de intervalo */}
      <div className="mb-4">
        <Form.Label>Pontuação: {localMinRating} – {localMaxRating}</Form.Label>
        <div className="px-2">
          <Slider
            range
            min={0}
            max={10}
            step={0.5}
            allowCross={false}
            value={[localMinRating, localMaxRating]}
            onChange={handleRangeChange}
            marks={{ 0: '0', 5: '5', 10: '10' }}
          />
        </div>
      </div>

      {/* Botão Filtrar */}
      <div className="d-grid">
        <Button variant="primary" onClick={applyFilters}>
          Filtrar
        </Button>
      </div>
    </Form>
  );
};

export default SidebarFilmes;
