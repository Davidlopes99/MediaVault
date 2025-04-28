import React from "react";
import { Row, Col, Spinner, Button } from "react-bootstrap";
import SeriesCard from "../components/SeriesCard";
import SidebarSeries from "../components/SidebarSeries";
import styles from "../styles/SeriesPage.module.css";
import TVShowDetailModal from "../components/SeriesDetailModal";
import { useSeries } from "../hooks/useSeries";

const SeriesPage: React.FC = () => {
  const {
    series,
    page,
    loading,
    totalPages,
    selectedSeries,
    episodesBySeason,
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
    handleSeriesClick,
    handleFetchEpisodes,
    handleCloseModal,
  } = useSeries();

  return (
    <div className="container mt-4">
      <h2 className={`${styles["page-title"]} mb-4`}>Séries</h2>

      <Row>
        <Col md={3}>
          <SidebarSeries
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
          />
        </Col>
        <Col md={9}>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" />
              <p>Carregando séries...</p>
            </div>
          ) : (
            <>
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {series.map((s) => (
                  <Col key={s.id}>
                    <SeriesCard
                      title={s.name}
                      imageUrl={`https://image.tmdb.org/t/p/w500${s.poster_path}`}
                      description={s.overview}
                      seasons={s.number_of_seasons}
                      rating={s.vote_average}
                      onClick={() => handleSeriesClick(s)}
                    />
                  </Col>
                ))}
              </Row>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className={`${styles["pagination-button"]} ${styles["previous"]}`}
                >
                  Página Anterior
                </Button>
                <span className={styles["pagination-info"]}>
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="primary"
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`${styles["pagination-button"]} ${styles["next"]}`}
                >
                  Próxima Página
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>

      <TVShowDetailModal
        show={!!selectedSeries}
        tvShow={selectedSeries}
        onHide={handleCloseModal}
        fetchEpisodes={handleFetchEpisodes}
        episodesBySeason={episodesBySeason}
      />
    </div>
  );
};

export default SeriesPage;