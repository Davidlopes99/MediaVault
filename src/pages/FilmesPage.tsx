import React, { useState, useEffect } from "react";
import { Row, Col, Spinner, Button, Badge, Container } from "react-bootstrap";
import MovieCard from "../components/MovieCard";
import Sidebar from "../components/SidebarFilmes";
import styles from "../styles/FilmesPage.module.css";
import MovieDetailModal from "../components/MovieDetailModal";
import { useMovies } from "../hooks/useMovies";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FilmesPage: React.FC = () => {
  const {
    movies,
    page,
    loading,
    totalPages,
    selectedMovie,
    genres,
    selectedGenre,
    providers,
    selectedProvider,
    countries,
    selectedCountry,
    sortBy,
    searchTerm,
    classification,
    minRating,
    maxRating,
    setPage,
    setSortBy,
    setSelectedGenre,
    setSelectedProvider,
    setSearchTerm,
    setClassification,
    setMinRating,
    setMaxRating,
    setSelectedCountry,
    handleCardClick,
    handleCloseModal,
  } = useMovies();

  // Novos estados para funcionalidades adicionais
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [releaseYear, setReleaseYear] = useState<number | null>(null);
  const [onlyWithTrailer, setOnlyWithTrailer] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState<number[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Filmes em destaque (hardcoded para exemplo)
  const featuredMovies = movies.slice(0, 3).map(movie => ({
    ...movie,
    isFeatured: true
  }));

  // Estatísticas
  const stats = {
    totalMovies: movies.length > 0 ? totalPages * 20 : 0,
    averageRating: movies.length > 0 ? (movies.reduce((sum, movie) => sum + movie.vote_average, 0) / movies.length).toFixed(1) : 0,
    topGenre: selectedGenre || "Todos"
  };

  // Toggle favorito
  const toggleFavorite = (movieId: number) => {
    setFavoriteMovies(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  // Filtrar filmes baseado em novos filtros
  const filteredMovies = movies.filter(movie => {
    if (showOnlyFavorites && !favoriteMovies.includes(movie.id)) return false;
    if (releaseYear && movie.release_date?.split('-')[0] !== releaseYear.toString()) return false;
    if (onlyWithTrailer && !movie.video) return false;
    return true;
  });

  return (
    <Container fluid className={styles.container}>
      {/* Banner de destaque */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <h1 className={styles.title}>Descubra Novos Filmes</h1>
          <p className={styles.subtitle}>
            Explore nossa coleção de filmes de diferentes gêneros, países e plataformas.
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <span>Home</span> &gt; <span className={styles.activeBreadcrumb}>Filmes</span>
      </div>

      {/* Estatísticas rápidas */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.totalMovies}</span>
          <span className={styles.statLabel}>Filmes disponíveis</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.averageRating}</span>
          <span className={styles.statLabel}>Nota média</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.topGenre}</span>
          <span className={styles.statLabel}>Gênero selecionado</span>
        </div>
      </div>

      {/* Filmes em destaque */}
      {featuredMovies.length > 0 && !showOnlyFavorites && (
        <div className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Em Destaque</h2>
          <Row className="g-4">
            {featuredMovies.map((movie) => (
              <Col key={`featured-${movie.id}`} md={4}>
                <div className={styles.featuredCard}>
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title}
                    className={styles.featuredPoster}
                  />
                  <div className={styles.featuredContent}>
                    <h3>{movie.title}</h3>
                    <div className={styles.featuredRating}>
                      <FaStar /> {movie.vote_average.toFixed(1)}
                    </div>
                    <Button 
                      variant="warning" 
                      className={styles.featuredButton}
                      onClick={() => handleCardClick(movie.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <Row className="mt-4">
        <Col md={3}>
          <Sidebar
            sortBy={sortBy}
            setSortBy={(value) => {
              setSortBy(value);
              setPage(1);
            }}
            genres={genres}
            selectedGenre={selectedGenre}
            setSelectedGenre={(value) => {
              setSelectedGenre(value);
              setPage(1);
            }}
            providers={providers}
            selectedProvider={selectedProvider}
            setSelectedProvider={(value) => {
              setSelectedProvider(value);
              setPage(1);
            }}
            searchTerm={searchTerm}
            setSearchTerm={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            classification={classification}
            setClassification={(value) => {
              setClassification(value);
              setPage(1);
            }}
            minRating={minRating}
            setMinRating={setMinRating}
            maxRating={maxRating}
            setMaxRating={setMaxRating}
            countries={countries}
            selectedCountry={selectedCountry}
            setSelectedCountry={(value) => {
              setSelectedCountry(value);
              setPage(1);
            }}
            // Novos filtros adicionados
            releaseYear={releaseYear}
            setReleaseYear={(value) => {
              setReleaseYear(value);
              setPage(1);
            }}
            onlyWithTrailer={onlyWithTrailer}
            setOnlyWithTrailer={(value) => {
              setOnlyWithTrailer(value);
              setPage(1);
            }}
            showOnlyFavorites={showOnlyFavorites}
            setShowOnlyFavorites={(value) => {
              setShowOnlyFavorites(value);
              setPage(1);
            }}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </Col>
        <Col md={9}>
          {/* Topo da lista com total e seletores */}
          <div className={styles.resultsHeader}>
            <span className={styles.resultCount}>
              Mostrando {filteredMovies.length} filme(s)
            </span>
            <div className={styles.viewToggle}>
              <Button 
                variant={viewMode === 'grid' ? 'warning' : 'outline-warning'} 
                onClick={() => setViewMode('grid')}
                className={styles.viewButton}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'warning' : 'outline-warning'}
                onClick={() => setViewMode('list')}
                className={styles.viewButton}
              >
                Lista
              </Button>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <Spinner animation="border" className={styles.spinner} />
              <p>Carregando filmes...</p>
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className={styles.noResults}>
              <h3>Nenhum filme encontrado</h3>
              <p>Tente mudar os filtros de busca</p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <Row xs={1} sm={2} md={3} lg={3} className="g-4">
                  {filteredMovies.map((movie) => (
                    <Col key={movie.id}>
                      <div className={styles.movieCardWrapper}>
                        <MovieCard
                          title={movie.title}
                          imageUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          description={movie.overview}
                          rating={movie.vote_average}
                          onClick={() => handleCardClick(movie.id)}
                          isFavorite={favoriteMovies.includes(movie.id)}
                          onToggleFavorite={() => toggleFavorite(movie.id)}
                          releaseYear={movie.release_date?.split('-')[0]}
                          genres={movie.genre_ids?.map(id => 
                            genres.find(g => g.id === id)?.name
                          ).filter(Boolean).slice(0, 2)}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className={styles.listView}>
                  {filteredMovies.map((movie) => (
                    <div key={movie.id} className={styles.listItem}>
                      <div className={styles.listPoster}>
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                          alt={movie.title} 
                        />
                      </div>
                      <div className={styles.listContent}>
                        <h3>{movie.title} <span className={styles.year}>({movie.release_date?.split('-')[0]})</span></h3>
                        <div className={styles.listMeta}>
                          <span className={styles.rating}>
                            <FaStar /> {movie.vote_average.toFixed(1)}
                          </span>
                          {movie.genre_ids?.map(id => {
                            const genre = genres.find(g => g.id === id)?.name;
                            return genre ? (
                              <Badge key={id} className={styles.genreBadge}>{genre}</Badge>
                            ) : null;
                          }).filter(Boolean).slice(0, 3)}
                        </div>
                        <p className={styles.listOverview}>
                          {movie.overview?.substring(0, 150)}
                          {movie.overview?.length > 150 ? '...' : ''}
                        </p>
                        <div className={styles.listActions}>
                          <Button 
                            variant="warning" 
                            size="sm"
                            onClick={() => handleCardClick(movie.id)}
                          >
                            Ver Detalhes
                          </Button>
                          <Button 
                            variant={favoriteMovies.includes(movie.id) ? "danger" : "outline-danger"}
                            size="sm"
                            onClick={() => toggleFavorite(movie.id)}
                          >
                            {favoriteMovies.includes(movie.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Paginação aprimorada */}
              <div className={styles.pagination}>
                <Button
                  className={styles.pageButton}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <FaChevronLeft /> Anterior
                </Button>
                
                <div className={styles.pageInfo}>
                  {page > 2 && (
                    <Button 
                      variant="link" 
                      className={styles.pageLink}
                      onClick={() => setPage(1)}
                    >
                      1
                    </Button>
                  )}
                  
                  {page > 3 && <span className={styles.pageDots}>...</span>}
                  
                  {page > 1 && (
                    <Button 
                      variant="link" 
                      className={styles.pageLink}
                      onClick={() => setPage(page - 1)}
                    >
                      {page - 1}
                    </Button>
                  )}
                  
                  <Button 
                    variant="warning" 
                    className={styles.currentPage}
                  >
                    {page}
                  </Button>
                  
                  {page < totalPages && (
                    <Button 
                      variant="link" 
                      className={styles.pageLink}
                      onClick={() => setPage(page + 1)}
                    >
                      {page + 1}
                    </Button>
                  )}
                  
                  {page < totalPages - 2 && <span className={styles.pageDots}>...</span>}
                  
                  {page < totalPages - 1 && (
                    <Button 
                      variant="link" 
                      className={styles.pageLink}
                      onClick={() => setPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </div>
                
                <Button
                  className={styles.pageButton}
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Próxima <FaChevronRight />
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>

      {/* Modal com melhorias */}
      <MovieDetailModal
        show={!!selectedMovie}
        movie={selectedMovie}
        onHide={handleCloseModal}
        isFavorite={selectedMovie ? favoriteMovies.includes(selectedMovie.id) : false}
        onToggleFavorite={() => selectedMovie && toggleFavorite(selectedMovie.id)}
      />

      {/* Botão de voltar ao topo */}
      <Button 
        className={styles.backToTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </Button>
    </Container>
  );
};

export default FilmesPage;