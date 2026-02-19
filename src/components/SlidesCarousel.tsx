import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const SLIDE_COUNT = 15;

const SlidesCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div
      className="w-full p-6 bg-pergaminho rounded-lg"
      role="region"
      aria-label="Apresentação de slides dos resumos dos módulos"
    >
      <h2 className="text-2xl md:text-3xl font-serif text-terra-umbro mb-6 text-center">
        📊 Resumos dos Módulos
      </h2>

      <div className="relative overflow-hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div
            className="flex touch-pan-y"
            style={{ touchAction: 'pan-y pinch-zoom' }}
          >
            {Array.from({ length: SLIDE_COUNT }, (_, i) => i + 1).map(
              (num) => (
                <div
                  key={num}
                  className="flex-[0_0_100%] min-w-0 flex items-center justify-center"
                >
                  <img
                    src={`/slides/${num}.svg`}
                    alt={`Slide ${num} - Resumo do módulo`}
                    className="max-h-[70vh] w-auto object-contain"
                  />
                </div>
              )
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-azul-sereno/90 text-white hover:bg-ouro-velho hover:text-terra-umbro transition-colors z-10"
          aria-label="Slide anterior"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-azul-sereno/90 text-white hover:bg-ouro-velho hover:text-terra-umbro transition-colors z-10"
          aria-label="Próximo slide"
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === selectedIndex
                ? 'bg-ouro-velho scale-125'
                : 'bg-azul-sereno/50 hover:bg-azul-sereno'
            }`}
            aria-label={`Ir para slide ${i + 1}`}
            aria-current={i === selectedIndex ? 'true' : undefined}
          />
        ))}
      </div>

      <p className="text-center text-sm text-chumbo-suave mt-2">
        {selectedIndex + 1} / {SLIDE_COUNT}
      </p>
    </div>
  );
};

export default SlidesCarousel;
