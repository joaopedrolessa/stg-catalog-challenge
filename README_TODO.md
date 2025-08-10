# STG Catalog Challenge — Checklist do que falta implementar

## Funcionalidades Obrigatórias Restantes

- [ ] **Autenticação**
  - [ ] Recuperação de senha (opcional, mas diferencial)
  - [ ] Garantir proteção de rotas para todas páginas privadas
  - [ ] Feedback visual para login/registro/erros

- [ ] **Catálogo de Produtos**
  - [ ] Garantir grid responsivo com 12+ produtos reais do Supabase
  - [ ] Busca/filtro por nome funcionando
  - [ ] Visualização detalhada (modal ou página) com informações completas
  - [ ] Adicionar ao carrinho (persistência por usuário)
  - [ ] Loading states e feedback visual

- [ ] **Carrinho**
  - [ ] Editar quantidades de produtos
  - [ ] Remover produto do carrinho
  - [ ] Calcular total corretamente
  - [ ] Finalizar pedido via WhatsApp (gerar mensagem formatada, abrir wa.me)
  - [ ] Limpar carrinho após envio
  - [ ] Loading/feedback ao finalizar

- [ ] **Integração WhatsApp**
  - [ ] Mensagem no formato exigido (cliente, email, produtos, total)
  - [ ] Link wa.me funcional

- [ ] **Banco Supabase**
  - [ ] Popular com 12+ produtos variados (eletrônicos, roupas, casa, esportes)
  - [ ] Garantir estrutura: products, cart_items, users

- [ ] **Design/UX**
  - [ ] Garantir responsividade (mobile/tablet/desktop)
  - [ ] Loading states e feedback visual em todas ações
  - [ ] Ícones Lucide/Heroicons
  - [ ] Cores profissionais (verde/azul)
  - [ ] Cards de produto atrativos

- [ ] **Deploy**
  - [ ] Deploy público (Vercel/Netlify)
  - [ ] Link funcional no README

- [ ] **README Completo**
  - [ ] Descrição do projeto
  - [ ] Tecnologias utilizadas
  - [ ] IA utilizada (quais e como)
  - [ ] Como rodar localmente
  - [ ] Links funcionais (deploy, supabase)
  - [ ] Checklist funcionalidades

## Diferenciais (Opcional — Pontuam Mais)
- [ ] Histórico de pedidos do usuário
- [ ] Filtros avançados (categoria, preço)
- [ ] Dark mode
- [ ] PWA
- [ ] Testes unitários
- [ ] Animações suaves (Framer Motion)
- [ ] Toast notifications
- [ ] Skeleton loading
- [ ] Breadcrumbs
- [ ] Infinite scroll/paginação
- [ ] Busca com autocomplete

## Técnicos
- [ ] Context API para estado global
- [ ] Custom hooks
- [ ] Error boundary
- [ ] SEO otimizado
- [ ] Performance (lazy loading, memoization)
- [ ] Internacionalização (i18n)

## Observações
- Priorize funcionalidades obrigatórias!
- Documente o uso de IA no README principal.
- Teste toda a integração WhatsApp.
- Garanta deploy público e links funcionais.

---

> **Este arquivo é um checklist de tudo que falta para o desafio STG Catalog Challenge, baseado no escopo oficial da vaga.**
