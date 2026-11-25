---
schemaVersion: "1.0.0"
scope: project
name: NOME DO SITE OU SISTEMA
description: UMA FRASE SOBRE O PRODUTO E QUEM USA.
surfaces: [site]
frameworks: [astro]
tokensFile: src/styles/designfy-theme.css
themes: [light, dark]
createdAt: AAAA-MM-DDTHH:MM:SS-03:00
updatedAt: AAAA-MM-DDTHH:MM:SS-03:00
---

## Visão geral

Quem usa, em qual situação e o que a interface precisa transmitir. Três
palavras e a densidade (arejada, média ou compacta).

- REGRA. `@pessoa` {#v001}

## Cores

A cor base, a harmonia da roda de cores e o papel de cada cor. Os valores
ficam em `tokensFile`.

- Cores saem dos papéis do tema; nenhum componente leva cor literal. `@agente` {#c001}
- Texto e fundo com contraste de 4.5:1 ou mais, conferido com `designfy theme check`. `@agente` {#c002}

## Tipografia

- `font-heading` nos títulos e `font-sans` no texto e na interface. `@agente` {#y001}
- Um `h1` por tela; níveis sem salto. `@agente` {#y002}

## Layout

- Container com largura máxima e centralizado; as margens crescem, a grade não. `@agente` {#l001}
- Espaçamento só pela escala do tema. `@agente` {#l002}

## Fundos e profundidade

- REGRA SOBRE O FUNDO DE CADA TIPO DE SEÇÃO. `@agente` {#f001}

## Formas

- REGRA SOBRE RAIOS E ÍCONES. `@agente` {#s001}

## Movimento

- Toda tela tem movimento com função; todo movimento tem versão parada em `prefers-reduced-motion`. `@pessoa` {#m001}
- Animação só com `transform` e `opacity`; nunca `transition: all`. `@agente` {#m002}

## Voz e conteúdo

- REGRA SOBRE RÓTULOS DE AÇÃO, ERROS E FORMATOS. `@agente` {#w001}

## Componentes

- Uma ação principal por tela, com o botão `primary`. `@agente` {#k001}

## Padrões de tela

- Toda região que carrega dados tem carregando, vazio e erro. `@agente` {#t001}

## Responsivo

- Nenhuma tela rola na horizontal entre 320 e 1920 px. `@agente` {#r001}
- Alvo de toque de 44 por 44 px no celular. `@agente` {#r002}

## Acessibilidade

- WCAG 2.2 AA; todo elemento interativo tem foco visível, sem atraso. `@agente` {#a001}

## Faça e não faça

- Use números, depoimentos e logos reais. Sem o dado, a seção não entra. `@agente` {#d001}

## Aprendizados

- AAAA-MM-DD `@pessoa` Toda tela tem algum movimento. → {#m001}
