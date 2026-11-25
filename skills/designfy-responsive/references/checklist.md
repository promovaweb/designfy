# Checklist de responsividade

## Plano

- [ ] `## Responsivo` do viewspec diz o que muda em 390, 820 e 1440 px, região por região.
- [ ] O formato da tabela, da navegação e das ações no celular está escrito.
- [ ] Nenhum conteúdo some no celular; só enfeite.

## Capturas

- [ ] Capturas em 320, 390, 820, 1280, 1440 e 1920 px.
- [ ] `overflowX` falso em todas.
- [ ] Sem erro de console no manifesto.
- [ ] Tema escuro capturado em celular e desktop, quando o projeto tem.

## Layout

- [ ] Classes sem prefixo formam o layout do celular.
- [ ] Trilhas com `minmax(0, 1fr)` ou `min-w-0` onde há imagem, tabela ou texto longo.
- [ ] Nenhum `w-screen`, `100vw` ou largura fixa em pixels sem `max-w`.
- [ ] Altura de tela com `svh` ou `dvh`.
- [ ] Componentes reutilizados com consulta de contêiner.
- [ ] Container limitado em 1920 px; grades sem colunas a mais.
- [ ] Ordem do DOM igual à ordem de leitura.

## Texto

- [ ] Corpo com 16 px ou mais no celular.
- [ ] Linhas entre 45 e 75 caracteres no desktop.
- [ ] Títulos quebram sem cortar palavra em 320 px.
- [ ] Nenhum botão ou link de menu quebra linha.
- [ ] Página utilizável com texto do navegador em 200%.

## Toque

- [ ] Alvos de 44 por 44 px, com 8 px entre vizinhos.
- [ ] Nada depende de hover.
- [ ] Ação principal alcançável com o polegar.
- [ ] Campos com 16 px, `type`, `inputmode` e `autocomplete` certos.
- [ ] Barra fixa do pé respeita a área segura e não cobre o conteúdo.
- [ ] Ampliação da tela permitida.

## Componentes

- [ ] Menu vira gaveta com foco preso; ação principal continua no cabeçalho.
- [ ] Hero empilha com o texto primeiro.
- [ ] Grades refluem para duas e uma coluna.
- [ ] Tabela no formato planejado; larga rola na própria caixa.
- [ ] Diálogo vira folha inferior.
- [ ] Barra lateral de sistema vira gaveta ou trilho.
- [ ] Imagens com `srcset`, `sizes` e proporção reservada.

## Fechamento

- [ ] Tarefa principal feita num celular de verdade, com uma mão.
- [ ] Execução de captura final registrada no viewspec.
- [ ] Padrões novos levados a `## Responsivo` do guia.
