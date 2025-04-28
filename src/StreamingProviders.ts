// src/services/streamingProviders.ts

// Define os tipos de provedores suportados
export type StreamerType = 'netflix' | 'prime' | 'disney' | 'hbomax' | 'hulu' | 'all';

// Interface para os provedores de streaming com suas propriedades
export interface StreamingProvider {
  id: StreamerType; // ID interno do aplicativo - agora usando diretamente o tipo StreamerType
  name: string; // Nome para exibição
  logo: string; // Caminho para o logo
  tmdbId?: number; // ID correspondente no TMDB API
}

// Mapeamento de IDs do TMDB para nossos IDs internos
const tmdbProviderMap: Record<number, StreamerType> = {
  8: 'netflix',   // Netflix
  9: 'prime',     // Amazon Prime
  337: 'disney',  // Disney Plus
  384: 'hbomax',  // HBO Max
  15: 'hulu'      // Hulu
};

// Lista de provedores de streaming disponíveis no aplicativo
export const streamingProviders: StreamingProvider[] = [
  {
    id: 'all',
    name: 'Todos os Streamers',
    logo: '/assets/icons/all-streamers.png',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    logo: '/assets/icons/netflix.png',
    tmdbId: 8
  },
  {
    id: 'prime',
    name: 'Amazon Prime',
    logo: '/assets/icons/prime.png',
    tmdbId: 9
  },
  {
    id: 'disney',
    name: 'Disney+',
    logo: '/assets/icons/disney.png',
    tmdbId: 337
  },
  {
    id: 'hbomax',
    name: 'HBO Max',
    logo: '/assets/icons/hbomax.png',
    tmdbId: 384
  },
  {
    id: 'hulu',
    name: 'Hulu',
    logo: '/assets/icons/hulu.png',
    tmdbId: 15
  }
];

/**
 * Obtém todos os provedores de streaming disponíveis
 */
export const getAllStreamingProviders = (): StreamingProvider[] => {
  return streamingProviders;
};

/**
 * Obtém um provedor de streaming pelo seu ID
 */
export const getStreamingProviderById = (id: StreamerType): StreamingProvider | undefined => {
  return streamingProviders.find(provider => provider.id === id);
};

/**
 * Mapeia os provedores de streaming do TMDB para nossos IDs internos
 * @param watchProviders Array de provedores retornado pela API TMDB
 * @returns Array de IDs de streaming internos
 */
export const mapTMDBProvidersToInternal = (watchProviders: any): StreamerType[] => {
  if (!watchProviders || !watchProviders.results) {
    return [];
  }

  // Vamos verificar para BR, US e global
  const regions = ['BR', 'US', 'global'];
  const providers: StreamerType[] = [];

  for (const region of regions) {
    const regionData = watchProviders.results[region];
    if (!regionData) continue;

    // Verificar nos serviços flatrate (assinatura)
    if (regionData.flatrate) {
      for (const provider of regionData.flatrate) {
        const providerId = provider.provider_id;
        if (tmdbProviderMap[providerId] && !providers.includes(tmdbProviderMap[providerId])) {
          providers.push(tmdbProviderMap[providerId]);
        }
      }
    }

    // Também verificar nos serviços buy (compra)
    if (regionData.buy) {
      for (const provider of regionData.buy) {
        const providerId = provider.provider_id;
        if (tmdbProviderMap[providerId] && !providers.includes(tmdbProviderMap[providerId])) {
          providers.push(tmdbProviderMap[providerId]);
        }
      }
    }
  }

  return providers;
};

/**
 * Função para buscar os provedores de streaming de um filme ou série
 * @param mediaType 'movie' ou 'tv'
 * @param mediaId ID do filme ou série no TMDB
 */
export const fetchMediaProviders = async (mediaType: 'movie' | 'tv', mediaId: number): Promise<StreamerType[]> => {
  try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const response = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${mediaId}/watch/providers?api_key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar provedores: ${response.status}`);
    }
    
    const data = await response.json();
    return mapTMDBProvidersToInternal(data);
  } catch (error) {
    console.error(`Erro ao buscar provedores para ${mediaType} ${mediaId}:`, error);
    return [];
  }
};

// Função auxiliar para verificar se uma string é uma StreamerType válida
export const isValidStreamerType = (value: string): value is StreamerType => {
  return ['netflix', 'prime', 'disney', 'hbomax', 'hulu', 'all'].includes(value);
};

// Função para converter strings para StreamerType com segurança
export const toStreamerType = (value: string): StreamerType | null => {
  return isValidStreamerType(value) ? value : null;
};