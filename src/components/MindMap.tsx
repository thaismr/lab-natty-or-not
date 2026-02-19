import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import type { MindMapData } from '../types/mindmap';

const MindMap = () => {
  const [expandedTema, setExpandedTema] = useState<string | null>(null);
  const [expandedSubtema, setExpandedSubtema] = useState<string | null>(null);
  const [data, setData] = useState<MindMapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/jsons/mindmap.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json as MindMapData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar mapa mental:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[600px] p-6 bg-pergaminho flex items-center justify-center">
        <p className="text-chumbo-suave text-lg">Carregando mapa mental...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full min-h-[600px] p-6 bg-pergaminho flex items-center justify-center">
        <p className="text-chumbo-suave text-lg">Erro ao carregar o mapa mental.</p>
      </div>
    );
  }

  const handleTemaClick = (temaKey: string) => {
    if (expandedTema === temaKey) {
      setExpandedTema(null);
      setExpandedSubtema(null);
    } else {
      setExpandedTema(temaKey);
      setExpandedSubtema(null);
    }
  };

  const handleSubtemaClick = (subtemaKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (expandedSubtema === subtemaKey) {
      setExpandedSubtema(null);
    } else {
      setExpandedSubtema(subtemaKey);
    }
  };

  return (
    <div className="w-full min-h-[600px] p-6 bg-pergaminho">
      <h2 className="text-3xl font-serif text-terra-umbro mb-8 text-center">
        {data.titulo}
      </h2>
      
      <LayoutGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {data.estrutura.map((tema, temaIndex) => {
            const temaKey = `tema-${temaIndex}`;
            const isExpanded = expandedTema === temaKey;
            
            return (
              <motion.div
                key={temaKey}
                layoutId={`card-${temaKey}`}
                layout
                className={`cursor-pointer ${isExpanded ? 'z-50' : 'z-10'}`}
                onClick={() => handleTemaClick(temaKey)}
                initial={false}
              >
                {!isExpanded ? (
                  <motion.div
                    layout
                    className="bg-areia-clara rounded-lg p-4 shadow-card-flutuante border-2 border-azul-sereno hover:border-ouro-velho transition-colors"
                  >
                    <motion.h3
                      layout
                      className="font-serif text-xl text-terra-umbro font-semibold"
                    >
                      {tema.tema}
                    </motion.h3>
                  </motion.div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>
      
      <AnimatePresence>
        {expandedTema && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center p-4"
            onClick={() => {
              setExpandedTema(null);
              setExpandedSubtema(null);
            }}
          >
            <LayoutGroup>
              {data.estrutura.map((tema, temaIndex) => {
                const temaKey = `tema-${temaIndex}`;
                if (expandedTema !== temaKey) return null;
                
                return (
                  <motion.div
                    key={temaKey}
                    layoutId={`card-${temaKey}`}
                    layout
                    className="bg-areia-clara rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-card-flutuante border-2 border-ouro-velho"
                    onClick={(e) => e.stopPropagation()}
                    initial={false}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="font-serif text-3xl text-terra-umbro font-bold">
                        {tema.tema}
                      </h3>
                      <button
                        onClick={() => {
                          setExpandedTema(null);
                          setExpandedSubtema(null);
                        }}
                        className="text-terra-umbro hover:text-ouro-velho text-2xl font-bold transition-colors"
                        aria-label="Fechar"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {tema.subtemas.map((subtema, subtemaIndex) => {
                        const subtemaKey = `${temaKey}-subtema-${subtemaIndex}`;
                        const subtemaTitle = subtema.tema || subtema.topico || '';
                        const isSubtemaExpanded = expandedSubtema === subtemaKey;
                        
                        return (
                          <motion.div
                            key={subtemaKey}
                            layout
                            className="bg-pergaminho rounded-md p-4 border-2 border-azul-sereno"
                          >
                            <button
                              onClick={(e) => handleSubtemaClick(subtemaKey, e)}
                              className="w-full text-left"
                            >
                              <h4 className="font-serif text-xl text-terra-umbro mb-2 font-semibold flex items-center justify-between">
                                <span>{subtemaTitle}</span>
                                <span className="text-ouro-velho text-lg">
                                  {isSubtemaExpanded ? '−' : '+'}
                                </span>
                              </h4>
                            </button>
                            
                            <AnimatePresence>
                              {isSubtemaExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-3 space-y-3"
                                >
                                  <p className="text-chumbo-suave leading-relaxed">
                                    {subtema.descricao}
                                  </p>
                                  
                                  {subtema.filosofos && (
                                    <div className="mt-4 space-y-3">
                                      <h5 className="font-serif text-lg text-terra-umbro font-semibold">
                                        Filósofos:
                                      </h5>
                                      {subtema.filosofos.map((filosofo, idx) => (
                                        <div key={idx} className="pl-4 border-l-4 border-ouro-velho bg-areia-clara p-3 rounded">
                                          <p className="font-semibold text-terra-umbro">
                                            {filosofo.nome}
                                          </p>
                                          <p className="text-sm text-chumbo-suave mt-1">
                                            {filosofo.descricao}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {subtema.correntes && (
                                    <div className="mt-4 space-y-3">
                                      <h5 className="font-serif text-lg text-terra-umbro font-semibold">
                                        Correntes:
                                      </h5>
                                      {subtema.correntes.map((corrente, idx) => (
                                        <div key={idx} className="pl-4 border-l-4 border-ouro-velho bg-areia-clara p-3 rounded">
                                          <p className="font-semibold text-terra-umbro">
                                            {corrente.nome}
                                          </p>
                                          <p className="text-sm text-chumbo-suave mt-1">
                                            {corrente.descricao}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </LayoutGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MindMap;
