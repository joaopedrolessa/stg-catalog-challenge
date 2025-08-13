
# Catálogo de Produtos - Challenge

## ✅ Tecnologias Utilizadas

- **Next.js** (React)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Banco de dados e autenticação)
- **React Toastify** (Popups e notificações)
- **Vercel/Netlify** (Deploy)
- **ESLint** (Padronização de código)

## ✅ IA Utilizada

- **GitHub Copilot**  
  Utilizada para acelerar o desenvolvimento, sugerir código, corrigir bugs, gerar testes e refatorar componentes.
- **ChatGPT**  
  Auxílio na documentação, revisão de lógica, sugestões de UX e tradução de mensagens.

## ✅ Como Rodar Localmente

1. **Clone o repositório:**
	```bash
	git clone https://github.com/seu-usuario/seu-repo.git
	cd seu-repo
	```

2. **Instale as dependências:**
	```bash
	npm install
	```

3. **Configure o arquivo `.env.local`:**
	```
	NEXT_PUBLIC_SUPABASE_URL=...
	NEXT_PUBLIC_SUPABASE_ANON_KEY=...
	NEXT_PUBLIC_WHATSAPP_NUMBER=...
	```

4. **Inicie o projeto:**
	```bash
	npm run dev
	```

5. **Acesse:**  
	[http://localhost:3000](http://localhost:3000)

## ✅ Links Funcionais

- **Deploy:** [https://seu-projeto.netlify.app](https://seu-projeto.netlify.app)
- **Supabase:** [https://app.supabase.com](https://app.supabase.com)
- **Documentação Next.js:** [https://nextjs.org/docs](https://nextjs.org/docs)

## ✅ Checklist de Funcionalidades

- [x] Cadastro e login de usuário
- [x] Listagem de produtos do banco de dados
- [x] Adicionar ao carrinho (com proteção e popup)
- [x] Checkout de pedidos
- [x] Histórico de compras do usuário
- [x] Barra de pesquisa funcional e responsiva
- [x] Mensagens e popups em português
- [x] Responsividade para desktop, tablet e smartphone
- [x] Proteção de rotas sensíveis
- [x] Visual consistente e acessível

---
Se encontrar algum bug ou quiser sugerir melhorias, abra uma issue!
