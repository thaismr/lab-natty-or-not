# Escopo de Funcionalidades e Estado

## 1. Mapa Mental (Recurso Principal)
- **Tecnologia:** React + Framer Motion.
- **Conteúdo**: Conforme o arquivo jsons/mindmap.json.
- **Comportamento:** Os nós principais do mapa mental devem iniciar compactos. Ao clicar, devem usar a funcionalidade de "Shared Layout" do Framer Motion para expandir de forma fluida para o centro da tela, revelando a descrição do tópico e seus sub-itens.

## 2. Quizz Interativo
- **Tecnologia:** React.
- **Conteúdo**: Conforme o arquivo jsons/quizz.json.
- **Estado:** O progresso do quizz e o resultado final devem ser salvos no `localStorage` do navegador para que o aluno não perca os dados ao recarregar a página.
- Não usar contextos globais pesados (como Redux); React Context ou estados locais (`useState`/`useEffect`) são suficientes.

## 3. Apresentação de Slides
- **Tecnologia:** React + Embla Carousel.
- **Conteúdo**: Conforme as imagens SVG dentro da pasta /slides.
- **Comportamento:** Exibição horizontal dos resumos dos módulos do curso. Deve suportar swipe no mobile.

## 4. Flashcards
- **Tecnologia:** React + Framer Motion.
- **Conteúdo**: Conforme o arquivo jsons/flashcards_simples.json.
- **Comportamento:** Efeito de flip (giro 3D) na carta ao clicar (frente: conceito / verso: explicação teológica).

## 5. Vídeo Resumo
- **Conteúdo**: Conforme o arquivo videos/Fundamentos_da_Teologia.mp4
- **Comportamento:** Player de vídeo incorporado (YouTube/Vimeo ou arquivo estático leve). Estilizado com bordas arredondadas e sombra suave de aquarela via Tailwind.