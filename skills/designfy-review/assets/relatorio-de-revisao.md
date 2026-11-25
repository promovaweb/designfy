# Modelo: relatório de revisão

```markdown
# Revisão: {tela} · viewspec {id}

Data: {AAAA-MM-DD} · Rodada: {1 | 2 | 3} · Revisão por: {agente separado | mesma sessão com material frio | pessoa}
Capturas: `.designfy/captures/{execução}/` ({larguras}; temas {claro, escuro}; parado: {sim | não})

## Veredito

{aprovada | aprovada com ressalvas | reprovada}: {uma frase com o motivo}.

## Manifesto

| Captura | `overflowX` | Erros de console | Altura |
| --- | --- | --- | --- |
| `{arquivo}` (390) | não | 0 | 6.420 px |
| `{arquivo}` (1440) | não | 0 | 4.180 px |

## Achados

### 1. {título curto}

- Gravidade: {alta | média | baixa}
- Captura: `{execução}` / `{arquivo}`, {posição}
- Vejo: {o que está na imagem}
- Regra: {viewspec, seção | guia {#id} | lista do Designfy}
- Dona: `designfy-{skill}`
- Estado: {aberto | resolvido em {execução} | parcial | mantido: motivo}

### 2. …

## Conferência do tipo de tela

{itens reprovados da lista do `kind`, com o número do achado}

## Acabamento

| Item | Onde | Resposta |
| --- | --- | --- |
| {item} | {região, largura} | {corrigido: como | mantido: motivo} |

## O que está bom

{duas ou três linhas do que a tela acerta e deve ser mantido}

## Para a pessoa

- {escolha de produto ou conteúdo que falta}

## Para o guia

- {regra nova, com a seção e a origem `@revisão`}
```

## Regras do relatório

- Um achado por causa, numerado, com a captura e a região.
- "Vejo" descreve a imagem; a correção fica com a dona.
- Sem nota, média ou percentual.
- "O que está bom" existe para a correção não desfazer o acerto, não
  para elogiar.
- Na rodada 2 e na 3, o relatório repete os achados anteriores com o
  estado novo antes de listar os novos.
