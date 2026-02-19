/** @type {import('tailwindcss').Config} */
export default {
  // Indica ao Tailwind onde procurar pelas classes no projeto Astro/React
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Tons de Fundo (Sensação de papel e aquarela)
        'pergaminho': '#FDFBF7', // Off-white quente, base da página (não cansa a vista)
        'areia-clara': '#F5F2EB', // Bege muito leve para o fundo dos flashcards ou cards do quizz
        'ceu-pastel': '#E3EDF2', // Azul celestial bem diluído, ótimo para o fundo do Carousel

        // Tons de Texto (Foco e Leitura)
        'chumbo-suave': '#4A4A4A', // Cinza escuro para textos longos, substituindo o preto puro
        'terra-umbro': '#5C4A3D', // Marrom terroso para subtítulos ou textos secundários

        // Cores de Destaque e Interação (O "Toque Sagrado")
        'ouro-velho': '#D4AF37', // Dourado suave para botões, ícones ou nós selecionados no mapa mental
        'terracota': '#E2856E', // Tom quente e acolhedor para alertas, tags ou correções no quizz
        'azul-sereno': '#8BADC1', // Azul acinzentado para links e contornos
      },
      fontFamily: {
        // As fontes precisarão ser importadas no seu arquivo Layout.astro principal
        sans: ['"Inter"', 'sans-serif'], // Fonte limpa e sem serifa para o corpo do texto
        serif: ['"Playfair Display"', 'serif'], // Fonte serifada clássica para os títulos de Teologia
      },
      boxShadow: {
        // Sombras personalizadas para dar o efeito "Shared Layout" com leveza
        'aquarela': '0 4px 14px 0 rgba(139, 173, 193, 0.15)', // Sombra azulada bem suave
        'card-flutuante': '0 10px 25px -5px rgba(92, 74, 61, 0.08)', // Sombra terrosa para dar profundidade aos flashcards
      }
    },
  },
  plugins: [],
}