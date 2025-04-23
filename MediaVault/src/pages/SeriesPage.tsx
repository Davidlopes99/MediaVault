import { Row, Col } from 'react-bootstrap';
import SeriesCard from '../components/SeriesCard';

const seriesList = [
  {
    title: 'Stranger Things',
    imageUrl: 'https://wallpapers.com/images/hd/fourth-season-poster-stranger-things-phone-fj1kxgudm81wpirf.jpg',
    description: 'Um grupo de amigos enfrenta mistérios sobrenaturais em Hawkins.',
    seasons: 4
  },
  {
    title: 'Dark',
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BOWJjMGViY2UtNTAzNS00ZGFjLWFkNTMtMDBiMDMyZTM1NTY3XkEyXkFqcGc@._V1_.jpg',
    description: 'Viagens no tempo e segredos de uma pequena cidade alemã.',
    seasons: 3
  },
  {
    title: 'The Witcher',
    imageUrl: 'https://pipocamoderna.com.br/storage/2019/06/the-witcher-poster.jpg',
    description: 'Geralt de Rívia luta contra monstros e intrigas políticas.',
    seasons: 2
  },
  // … outras séries
];

export default function SeriesPage() {
  const handleClick = (title: string) => {
    alert(`Você clicou em: ${title}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Séries em destaque</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {seriesList.map((s, idx) => (
          <Col key={idx}>
            <SeriesCard
              title={s.title}
              imageUrl={s.imageUrl}
              description={s.description}
              seasons={s.seasons}
              onClick={() => handleClick(s.title)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
