
# Podcastr

![MIT License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-blue?logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

<p align="center">
  <img src="public/web-app-manifest-192x192.png" alt="Podcastr Logo" />
</p>

Podcastr é um reprodutor de podcasts moderno, construído com Next.js e React, que permite ouvir seus episódios favoritos diretamente do navegador. O projeto consome dados de um feed RSS e oferece uma interface limpa, responsiva e amigável para navegação e reprodução de áudio.

---

## ✨ Recursos

- **Navegação de Episódios:** Veja os episódios mais recentes e acesse todos os episódios disponíveis.
- **Player de Áudio Integrado:** Ouça episódios com controles intuitivos.
- **Design Responsivo:** Interface adaptável a qualquer dispositivo.
- **Tema Claro/Escuro:** Alternância de tema para melhor experiência visual.

## 🚀 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) – Framework React para SSR e SSG.
- [React](https://reactjs.org/) – Biblioteca para interfaces de usuário.
- [TypeScript](https://www.typescriptlang.org/) – Tipagem estática para JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) – Utilitários CSS para estilização.
- [Radix UI](https://www.radix-ui.com/) – Componentes de UI acessíveis.
- [Lucide React](https://lucide.dev/) – Ícones SVG modernos.

---

## 🛠️ Como começar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v20 ou superior)
- [pnpm](https://pnpm.io/)

### Instalação e Execução

1. **Clone o repositório:**

   ```sh
   git clone https://github.com/ericrocha97/Podcastr.git
   cd Podcastr
   ```

2. **Instale as dependências:**

   ```sh
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto e adicione:

   ```env
   API_RSS=URL_DO_SEU_FEED_RSS
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Inicie o servidor de desenvolvimento:**

   ```sh
   pnpm dev
   ```

Abra [http://localhost:3000](http://localhost:3000) no navegador para ver o resultado.

---

## 📋 Scripts Disponíveis

No diretório do projeto, execute:

- `pnpm dev` — Executa a aplicação em modo de desenvolvimento.
- `pnpm build` — Compila a aplicação para produção.
- `pnpm start` — Inicia o servidor de produção.
- `pnpm lint` — Formata o código usando o Biome.

---

## 💡 Exemplo de Uso

1. Acesse a página inicial para ver os episódios mais recentes.
2. Clique em um episódio para ver detalhes e ouvir no player integrado.
3. Use o botão de alternância de tema para mudar entre claro e escuro.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo para colaborar:

1. Faça um **fork** do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/SuaFeature`)
3. Commit suas alterações (`git commit -m 'feat: adiciona SuaFeature'`)
4. Faça push para a branch (`git push origin feature/SuaFeature`)
5. Abra uma **Pull Request**

Ou abra uma issue com sugestões, dúvidas ou problemas encontrados.

Não se esqueça de deixar uma estrela ⭐ no projeto!

---

## 📄 Licença

Distribuído sob a Licença MIT. Veja o arquivo [`LICENSE`](LICENSE) para mais informações.
