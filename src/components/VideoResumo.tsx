import { useState } from 'react';

const VideoResumo = () => {
  const [error, setError] = useState(false);

  return (
    <div
      className="w-full p-6 bg-pergaminho rounded-lg"
      role="region"
      aria-label="Vídeo resumo do curso"
    >
      <h2 className="text-2xl md:text-3xl font-serif text-terra-umbro mb-6 text-center">
        🎥 Vídeo Resumo
      </h2>

      <div className="max-w-4xl mx-auto">
        {error ? (
          <div className="bg-areia-clara rounded-lg p-8 border-2 border-azul-sereno shadow-aquarela text-center">
            <p className="text-chumbo-suave mb-2">
              O vídeo não pôde ser carregado.
            </p>
            <p className="text-sm text-chumbo-suave">
              Certifique-se de que o arquivo{' '}
              <code className="text-xs bg-pergaminho px-2 py-1 rounded">
                videos/Fundamentos_da_Teologia.mp4
              </code>{' '}
              está na pasta <code className="text-xs bg-pergaminho px-2 py-1 rounded">public</code>.
            </p>
          </div>
        ) : (
          <div className="relative w-full rounded-lg overflow-hidden shadow-aquarela border-2 border-azul-sereno bg-areia-clara">
            <video
              className="w-full h-auto"
              controls
              preload="metadata"
              onError={() => setError(true)}
              aria-label="Vídeo resumo: Fundamentos da Teologia"
            >
              <source
                src="/videos/Fundamentos_da_Teologia.mp4"
                type="video/mp4"
              />
              <track
                kind="captions"
                srcLang="pt-BR"
                label="Português"
                default
              />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoResumo;
