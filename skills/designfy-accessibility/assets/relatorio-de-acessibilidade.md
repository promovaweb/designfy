# Modelo: relatório de acessibilidade

```markdown
# Acessibilidade: {tela ou fluxo}

Data: {AAAA-MM-DD} · Nível: WCAG 2.2 AA · Viewspec: {id}
Auditado: {URLs} em {larguras}, temas {claro, escuro}.

## Resumo

- Automática (axe): {n} críticas, {n} sérias, {n} moderadas, {n} menores.
- Teclado: {passou | n falhas}.
- Leitor de tela ({leitor e navegador}): {passou | n falhas}.
- Contraste do tema: {theme check: passou | n pares abaixo}.

## Achados

| # | Gravidade | Onde | O que acontece | Quem é afetado | WCAG | Correção | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | crítica | `/pedidos`, botão de ações da linha | botão de ícone sem nome; o leitor diz só "botão" | leitor de tela | 4.1.2 | `aria-label="Ações do pedido {número}"` | corrigido |
| 2 | séria | `/pedidos`, texto de ajuda dos filtros | contraste de 3.2:1 no tema escuro | baixa visão | 1.4.3 | `muted-foreground` com L 0.72 no escuro | corrigido |
| 3 | moderada | diálogo de exclusão | foco não volta ao gatilho ao fechar | teclado | 2.4.3 | usar o `alert-dialog` do shadcn | aberto |

## Conferido à mão

- [x] Tab do início ao fim, com anel visível.
- [x] Menu, diálogo e abas por teclado.
- [x] Formulário enviado com erro.
- [x] Títulos e marcos pelo leitor de tela.
- [ ] Alto contraste forçado.

## Ficou aberto

- {achado, motivo e quem resolve}

## Para o guia

- {regra nova para `## Acessibilidade`, com origem `@revisão`}
```

Gravidade:

| Gravidade | Sentido |
| --- | --- |
| crítica | impede a tarefa para algum grupo |
| séria | dificulta muito ou esconde conteúdo |
| moderada | confunde ou atrasa |
| menor | incomoda |
