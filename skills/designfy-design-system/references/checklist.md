# Checklist do design system

Rode antes de entregar o tema ou qualquer mudança nele.

## Arquivo de tokens

- [ ] Existe um arquivo de tokens só, e o caminho está em `tokensFile` do guia.
- [ ] `:root` e `.dark` têm os mesmos papéis.
- [ ] Todo papel de superfície tem o seu `*-foreground`.
- [ ] Cada papel tem a linha correspondente em `@theme inline`.
- [ ] Todas as cores em `oklch()`.
- [ ] Nenhum preto ou branco absoluto como superfície; neutros com matiz.
- [ ] `designfy theme show` lista todos os papéis esperados.

## Cores e contraste

- [ ] Cor base e harmonia registradas em `## Cores` do guia.
- [ ] `designfy theme check` sai com 0.
- [ ] `foreground` em `background` com 7:1 ou mais nos dois temas.
- [ ] `muted-foreground` com 4.5:1 ou mais em `background`, `muted` e `card`.
- [ ] `ring` com 3:1 sobre `background` e `card`.
- [ ] Séries de gráfico distinguíveis sem depender só do matiz.
- [ ] Estados (`success`, `warning`, `destructive`, `info`) sempre com texto ou ícone.

## Código

- [ ] Nenhuma cor literal fora do arquivo de tokens (`grep` por `#`, `rgb(`, `oklch(` nos componentes).
- [ ] Nenhuma classe de paleta fixa do Tailwind (`bg-slate-900`, `text-indigo-600`).
- [ ] Nenhuma `font-family` literal fora dos tokens.
- [ ] Nenhum `dark:` para cor.

## Tipografia

- [ ] No máximo duas famílias, mais a mono.
- [ ] Fontes servidas do projeto, só os pesos usados.
- [ ] Corpo em 16 px ou mais; nada abaixo de 12 px.
- [ ] Um `h1` por tela; níveis sem salto.
- [ ] Texto corrido entre 45 e 75 caracteres por linha.
- [ ] Números tabulares onde há comparação.

## Forma, espaço e fundos

- [ ] `--radius` definido e usado pelas classes `rounded-*`.
- [ ] Espaçamento só pela escala; nenhum valor arbitrário.
- [ ] `df-container` nas seções; container limitado em 1920 px.
- [ ] Nenhum cartão dentro de cartão; borda ou sombra, nunca as duas.
- [ ] Presets de fundo adotados listados no guia, com o `fade` de cada um.
- [ ] Texto sobre padrão ou imagem com contraste medido.

## Temas

- [ ] Captura clara e escura de pelo menos uma tela.
- [ ] Página sem clarão ao carregar com o tema escuro salvo.
- [ ] Sem tema escuro: `themes: [light]` no guia e `color-scheme: light`.

## Guia

- [ ] Seções Cores, Tipografia, Layout, Fundos e profundidade e Formas atualizadas.
- [ ] Pares medidos escritos como regras `@revisão`.
- [ ] Entradas em `## Aprendizados` para o que mudou.
