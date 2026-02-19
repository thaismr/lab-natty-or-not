# Natty or Not Lab: Teologia em Aquarela 🕊️

Este projeto foi desenvolvido como parte de um Desafio de Lab na DIO (Digital Innovation One), com o objetivo de explorar o potencial das IAs Generativas.

Aproveitei esta oportunidade técnica para criar uma plataforma de apoio aos meus estudos pessoais no Curso de Teologia do Padre Daniel Ribeiro. O site funciona como um hub de recursos educacionais interativos, transformando materiais densos e aulas em vídeo em ferramentas práticas de aprendizado, como mapas mentais dinâmicos, flashcards e quizzes.

## 🤖 Tecnologias Utilizadas
* **Astro.build**: Framework base para entrega de performance extrema e HTML estático.
* **React + Framer Motion**: Para a lógica das "Islands" e as animações fluidas de expansão dos nós.
* **Tailwind CSS**: Estilização personalizada com paleta de tons pastéis e identidade visual "sagrada".
* **NotebookLM**: IA do Google utilizada para processar as transcrições do curso e gerar vídeos, mapas mentais, flashcards e os resumos estruturados iniciais.
* **Gemini 2.0**: Responsável pela geração inteligente do banco de questões do Quizz, integrado ao NotebookLM.
* **ChatGPT (OpenAI)**: Utilizado na revisão pedagógica do questionário e na conversão técnica do Mapa Mental (de imagem PNG para estrutura de dados JSON).
* **Cursor IDE**: Editor de código com IA integrada para acelerar o desenvolvimento e garantir a arquitetura do projeto.

## 🧐 Processo de Criação
O projeto foi concebido para transformar um conteúdo denso em uma experiência visual leve:
1.  **Curadoria de Conteúdo**: As fontes primárias foram as aulas do [Curso de Teologia do Padre Daniel Ribeiro](https://www.padredanielribeiroscj.com.br/curso/modulo-1/) e sua respectiva playlist oficial.
2.  **Processamento de Dados**: O **NotebookLM** extraiu os pontos-chave, enquanto o **ChatGPT** atuou como ponte de dados, convertendo as visualizações gráficas em arquivos JSON estruturados para o código.
3.  **Refino de Questões**: O **Gemini** gerou a base do Quizz, que foi posteriormente revisada pelo **ChatGPT** para garantir clareza e tom pedagógico.
4.  **Desenvolvimento**: Utilizei o **Cursor IDE** para orquestrar o uso do Astro e React, garantindo que o site fosse totalmente funcional no **GitHub Pages**.

## 🚀 Resultados
Uma plataforma de estudos estática e elegante que oferece:
* **Mapa Mental Dinâmico**: Navegação visual que se expande via *Shared Layout* do Framer Motion.
* **Quizz com Persistência**: Resultados salvos no `localStorage` do navegador.
* **Performance Imbatível**: Carregamento instantâneo focado na experiência do usuário.

## 💭 Reflexão
O desafio de criar algo 'natty' (natural) com IA neste projeto revelou o poder da **interoperabilidade**. Nenhuma IA sozinha entregaria o resultado final com a mesma qualidade. Enquanto o **NotebookLM** brilhou na síntese do conhecimento, o **ChatGPT** foi essencial para a tradução técnica de formatos (PNG para JSON) e o **Gemini** na criatividade das questões. 

A combinação dessas ferramentas permitiu compensar os pontos fracos de uma com os pontos fortes de outra. O "toque humano" foi a maestria em orquestrar esse fluxo, garantindo que a estética (aquarela e tons pastéis) e a reverência ao tema teológico fossem mantidas, evitando a sensação de um conteúdo "mecanizado".

## Links Interessantes
* [Site Oficial do Curso - Padre Daniel Ribeiro](https://www.padredanielribeiroscj.com.br/curso/modulo-1/)
* [Playlist das Aulas no YouTube](https://youtube.com/playlist?list=PLu_S_2ZIakYFdXFApHGxEWlFNCQoh5rOF)
* [NotebookLM](https://notebooklm.google/)
* [Cursor IDE](https://www.cursor.com/)
* [Astro.build Docs](https://docs.astro.build/)