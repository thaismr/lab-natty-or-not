import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizData, QuizQuestion, QuizProgress } from '../types/quiz';
import { QUIZ_STORAGE_KEY } from '../types/quiz';

const loadProgress = (): QuizProgress | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizProgress;
  } catch {
    return null;
  }
};

const saveProgress = (progress: QuizProgress) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Erro ao salvar progresso do quiz:', e);
  }
};

const Quiz = () => {
  const [data, setData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetch('/jsons/quizz.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json as QuizData);
        const saved = loadProgress();
        if (saved && saved.completedAt === null) {
          setCurrentIndex(saved.currentIndex);
          setAnswers(saved.answers);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar quiz:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!data) return;
    saveProgress({
      currentIndex,
      answers,
      completedAt: isFinished ? Date.now() : null,
    });
  }, [data, currentIndex, answers, isFinished]);

  if (loading) {
    return (
      <div className="w-full min-h-[300px] p-6 bg-pergaminho flex items-center justify-center rounded-lg">
        <p className="text-chumbo-suave text-lg">Carregando quiz...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full min-h-[300px] p-6 bg-pergaminho flex items-center justify-center rounded-lg">
        <p className="text-chumbo-suave text-lg">Erro ao carregar o quiz.</p>
      </div>
    );
  }

  const questions = data.questions;
  const currentQuestion = questions[currentIndex] as QuizQuestion | undefined;
  const totalQuestions = questions.length;

  const handleSelectOption = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIndex);
    setShowFeedback(true);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setIsFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setShowFeedback(false);
    setIsFinished(false);
    saveProgress({ currentIndex: 0, answers: {}, completedAt: null });
  };

  if (isFinished) {
    const correctCount = questions.filter(
      (q) => answers[q.id] === q.answer
    ).length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="w-full min-h-[300px] p-6 bg-pergaminho rounded-lg">
        <h2 className="text-3xl font-serif text-terra-umbro mb-6 text-center">
          {data.quizTitle}
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-areia-clara rounded-lg p-8 shadow-card-flutuante border-2 border-azul-sereno text-center"
        >
          <h3 className="font-serif text-2xl text-terra-umbro mb-4">
            Quiz concluído!
          </h3>
          <p className="text-4xl font-bold text-ouro-velho mb-2">
            {correctCount} / {totalQuestions}
          </p>
          <p className="text-chumbo-suave mb-6">
            {percentage}% de acertos
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-azul-sereno text-white rounded-lg font-semibold hover:bg-ouro-velho hover:text-terra-umbro transition-colors"
          >
            Refazer quiz
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const isCorrect = selectedOption === currentQuestion.answer;

  return (
    <div className="w-full min-h-[300px] p-6 bg-pergaminho rounded-lg">
      <h2 className="text-2xl md:text-3xl font-serif text-terra-umbro mb-4 text-center">
        {data.quizTitle}
      </h2>

      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1 h-2 bg-areia-clara rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-ouro-velho rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm text-chumbo-suave font-medium whitespace-nowrap">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-areia-clara rounded-lg p-6 shadow-card-flutuante border-2 border-azul-sereno"
      >
        <h3 className="font-serif text-xl text-terra-umbro mb-6">
          {currentQuestion.question}
        </h3>

        {!showFeedback && currentQuestion.hint && (
          <div className="mb-4">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-azul-sereno hover:text-ouro-velho border border-azul-sereno rounded-lg hover:border-ouro-velho transition-colors"
                aria-expanded={false}
              >
                💡 Ver dica
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-areia-clara border-l-4 border-ouro-velho"
              >
                <p className="text-xs font-semibold text-terra-umbro uppercase tracking-wide mb-1">
                  Dica
                </p>
                <p className="text-sm text-chumbo-suave">{currentQuestion.hint}</p>
              </motion.div>
            )}
          </div>
        )}

        <div className="space-y-3" role="group" aria-label="Opções de resposta">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQuestion.answer;
            const showResult = showFeedback && (isSelected || isCorrectOption);

            let borderClass = 'border-azul-sereno hover:border-ouro-velho';
            if (showResult) {
              if (isCorrectOption) borderClass = 'border-green-500 bg-green-50';
              else if (isSelected && !isCorrect)
                borderClass = 'border-terracota bg-red-50';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${borderClass} ${
                  showFeedback ? 'cursor-default' : 'cursor-pointer'
                }`}
                aria-pressed={isSelected}
                aria-describedby={
                  showFeedback && isSelected ? `feedback-${currentQuestion.id}` : undefined
                }
              >
                <span className="font-medium text-chumbo-suave">{option}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              id={`feedback-${currentQuestion.id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 rounded-lg bg-pergaminho border-l-4 border-ouro-velho"
            >
              <p
                className={`font-semibold mb-2 ${
                  isCorrect ? 'text-green-700' : 'text-terracota'
                }`}
              >
                {isCorrect ? '✓ Correto!' : '✗ Resposta incorreta'}
              </p>
              <p className="text-chumbo-suave text-sm leading-relaxed">
                {currentQuestion.rationale}
              </p>
              <button
                onClick={handleNext}
                className="mt-4 px-4 py-2 bg-azul-sereno text-white rounded-lg font-semibold hover:bg-ouro-velho hover:text-terra-umbro transition-colors"
              >
                {currentIndex + 1 >= totalQuestions ? 'Ver resultado' : 'Próxima'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Quiz;
