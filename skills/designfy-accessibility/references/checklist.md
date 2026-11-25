# Checklist de acessibilidade

Nível: WCAG 2.2 AA, mais as regras do Designfy.

## Automática

- [ ] axe sem violação crítica ou séria, em celular e desktop, claro e escuro.
- [ ] `designfy theme check` com saída 0.
- [ ] Captura a 320 px com `overflowX` falso.
- [ ] Captura com movimento reduzido mostra todo o conteúdo.

## Estrutura

- [ ] `lang` no `html`; `title` único e descritivo.
- [ ] Um `h1`; níveis sem salto; títulos formam o índice da página.
- [ ] Marcos `header`, `nav`, `main`, `footer`; cada `nav` com rótulo.
- [ ] Link "Pular para o conteúdo" como primeiro foco.
- [ ] Listas e tabelas marcadas como tais.
- [ ] Ordem do DOM igual à ordem de leitura.

## Nomes e alternativas

- [ ] Todo botão, link e campo tem nome que diz a ação ou o destino.
- [ ] Botões de ícone com nome; ícones decorativos com `aria-hidden`.
- [ ] Botões repetidos com contexto no nome.
- [ ] Imagens com informação têm texto alternativo; decorativas com `alt=""`.
- [ ] `iframe` com `title`.

## Teclado e foco

- [ ] Tudo operável por teclado; nenhum `div` clicável.
- [ ] Ordem de foco igual à visual; nenhum `tabindex` positivo.
- [ ] Anel de foco visível em todo elemento, com 3:1, sem transição.
- [ ] Foco nunca encoberto por barra fixa.
- [ ] Camadas: foco entra, fica preso quando modal, Escape fecha, foco volta.
- [ ] Troca de rota leva o foco ao `h1`.
- [ ] Nada acessível só por hover.

## Cor

- [ ] Texto com 4.5:1; texto grande, ícones, bordas de campo e foco com 3:1.
- [ ] Texto sobre imagem ou padrão medido no ponto mais difícil.
- [ ] Nenhuma informação só por cor.
- [ ] Tela compreensível em tons de cinza.
- [ ] Medido no tema claro e no escuro.

## Formulários

- [ ] Rótulo visível e ligado em todo campo.
- [ ] Grupos em `fieldset` com `legend`.
- [ ] `autocomplete`, `type` e `inputmode` certos.
- [ ] Erro em texto, ligado ao campo, com `aria-invalid`, dizendo como corrigir.
- [ ] Resumo de erros recebe o foco.
- [ ] Colar permitido; gerenciador de senhas funciona.

## Componentes

- [ ] Diálogo, menu, abas, combobox e sanfona com o padrão ARIA (primitivos do shadcn ou do ReUI).
- [ ] Estados expostos: `aria-expanded`, `aria-selected`, `aria-current`, `aria-pressed`, `aria-sort`.
- [ ] Mudanças anunciadas por região viva, sem mover o foco.
- [ ] Arrastar tem alternativa por clique.

## Mídia e movimento

- [ ] Vídeo com fala tem legendas; áudio tem transcrição.
- [ ] Nada toca com som sozinho.
- [ ] Movimento contínuo com pausa; nada pisca mais de três vezes por segundo.
- [ ] Versão parada com movimento reduzido.

## Toque e ampliação

- [ ] Alvos de 24 por 24 px no mínimo; 44 no toque.
- [ ] Ampliação por gesto permitida.
- [ ] Texto a 200% e tela a 400% sem perda de conteúdo.
- [ ] Funciona em pé e deitado.

## Manual

- [ ] Roteiro de teclado feito, em desktop e em 390 px.
- [ ] Roteiro de leitor de tela feito no fluxo principal.
- [ ] Alto contraste forçado conferido.

## Fechamento

- [ ] Relatório com os achados, a gravidade e a correção.
- [ ] Itens marcados no viewspec.
- [ ] Padrões novos em `## Acessibilidade` do guia.
