import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Flashcard } from '../types/flashcards';

interface FlashcardCardProps {
  card: Flashcard;
}

const FlashcardCard = ({ card }: FlashcardCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-[1000px] cursor-pointer min-h-[200px]"
      onClick={() => setIsFlipped((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
      aria-label={isFlipped ? 'Clique para ver o conceito' : 'Clique para ver a explicação'}
    >
      <motion.div
        className="relative w-full h-full min-h-[200px]"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Frente: conceito */}
        <div
          className="absolute inset-0 w-full h-full rounded-lg border-2 border-azul-sereno bg-areia-clara shadow-card-flutuante p-6 flex flex-col items-center justify-center [backface-visibility:hidden]"
          style={{ transform: 'rotateY(0deg)' }}
        >
          <p className="text-xs font-semibold text-ouro-velho uppercase tracking-wide mb-2">
            Conceito
          </p>
          <p className="font-serif text-lg text-terra-umbro text-center font-medium">
            {card.pergunta}
          </p>
          <p className="text-xs text-chumbo-suave mt-4">Clique para virar</p>
        </div>

        {/* Verso: explicação teológica */}
        <div
          className="absolute inset-0 w-full h-full rounded-lg border-2 border-ouro-velho bg-pergaminho shadow-card-flutuante p-6 flex flex-col items-center justify-center [backface-visibility:hidden]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <p className="text-xs font-semibold text-ouro-velho uppercase tracking-wide mb-2">
            Explicação
          </p>
          <p className="text-chumbo-suave text-sm leading-relaxed text-center">
            {card.resposta}
          </p>
          <p className="text-xs text-chumbo-suave mt-4">Clique para virar</p>
        </div>
      </motion.div>
    </div>
  );
};

const Flashcards = () => {
  const [data, setData] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/jsons/flashcards_simples.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json as Flashcard[]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar flashcards:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[300px] p-6 bg-pergaminho flex items-center justify-center rounded-lg">
        <p className="text-chumbo-suave text-lg">Carregando flashcards...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full min-h-[300px] p-6 bg-pergaminho flex items-center justify-center rounded-lg">
        <p className="text-chumbo-suave text-lg">Erro ao carregar os flashcards.</p>
      </div>
    );
  }

  const currentCard = data[currentIndex];

  return (
    <div
      className="w-full p-6 bg-pergaminho rounded-lg"
      role="region"
      aria-label="Flashcards de estudo de Teologia"
    >
      <h2 className="text-2xl md:text-3xl font-serif text-terra-umbro mb-6 text-center">
        🎴 Flashcards
      </h2>

      <div className="max-w-md mx-auto">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <FlashcardCard card={currentCard} />
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6 gap-4">
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => (i === 0 ? data.length - 1 : i - 1))}
            className="px-4 py-2 rounded-lg bg-azul-sereno text-white font-semibold hover:bg-ouro-velho hover:text-terra-umbro transition-colors disabled:opacity-50"
            aria-label="Flashcard anterior"
          >
            ‹ Anterior
          </button>
          <span className="text-sm text-chumbo-suave font-medium">
            {currentIndex + 1} / {data.length}
          </span>
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => (i === data.length - 1 ? 0 : i + 1))}
            className="px-4 py-2 rounded-lg bg-azul-sereno text-white font-semibold hover:bg-ouro-velho hover:text-terra-umbro transition-colors disabled:opacity-50"
            aria-label="Próximo flashcard"
          >
            Próximo ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
