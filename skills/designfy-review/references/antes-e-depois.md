# Antes e depois

Em redesenho e em otimização, a prova do trabalho é a comparação da mesma
tela, na mesma largura, antes e depois.

## Capturar o antes

Antes de mudar qualquer coisa:

```bash
designfy capture run <url> --viewport mobile,tablet,desktop,wide --name <slug>-antes
designfy capture run <url> --viewport mobile,desktop --theme light,dark --name <slug>-antes-temas
```

Registre no viewspec, em `## Notas`, o nome da execução e o que precisa
permanecer: rotas, textos, dados, eventos de medição, âncoras e
identificadores usados por outras páginas.

## Diagnóstico

Passe a tela atual pela revisão completa, como se fosse nova: manifesto,
imagens, lista do tipo de tela, vícios de página gerada. O relatório
desse diagnóstico é a origem da checklist do viewspec de redesenho. Assim
o redesenho resolve problemas nomeados, em vez de trocar um gosto por
outro.

Separe o que encontrou em três grupos:

| Grupo | Exemplos | No redesenho |
| --- | --- | --- |
| defeitos | estouro, contraste, conteúdo cortado, sem estado de erro | corrigir |
| fraquezas | página genérica, sem hierarquia, parada, celular esquecido | redesenhar |
| acertos | conteúdo bom, estrutura que funciona, identidade reconhecível | manter, e dizer que mantém |

## O que manter

- O conteúdo real e a ordem que já funciona.
- As rotas e as âncoras. Rota que muda ganha redirecionamento permanente.
- A identidade: cores, fontes e marca vêm do tema do projeto; redesenho
  de uma tela não troca a marca.
- Os componentes que o guia já adotou.
- O que a pessoa disse que gosta.

## Capturar o depois

```bash
designfy capture run <url> --viewport mobile,tablet,desktop,wide --name <slug>-depois
```

Mesmas larguras, mesmo tema, mesma URL.

## Comparar

Abra as imagens em par, por largura. Para cada achado do diagnóstico:

| Achado do antes | Depois | Estado |
| --- | --- | --- |
| ação fora da dobra em 390 px | ação visível, texto antes do visual | resolvido |
| três colunas de ícone | bento com capturas reais | resolvido |
| tabela estoura no celular | um plano por vez com seletor | resolvido |
| tema escuro sem bordas | bordas com valor próprio | resolvido |

E pergunte do conjunto:

- A tela nova resolve os defeitos sem criar outros?
- O que era acerto continua lá?
- A página ainda é reconhecível como do mesmo projeto?
- A altura da página no celular mudou muito? Por quê?
- A primeira dobra diz mais, com menos?

## Mostrar à pessoa

Envie os pares de imagens (celular e desktop) com três linhas: o que
mudou, o que foi mantido de propósito e o que depende dela. Par de
imagens lado a lado vale mais que descrição.

## Regressão em outras telas

Mudança em tema, cabeçalho, rodapé ou componente compartilhado afeta
outras telas. Capture uma tela de cada tipo que usa a peça, antes e
depois, e confira.

```bash
designfy capture run <url-1> <url-2> <url-3> --viewport mobile,desktop --name tema-antes
# mudança
designfy capture run <url-1> <url-2> <url-3> --viewport mobile,desktop --name tema-depois
```

## Limites

O Designfy não compara imagens ponto a ponto. A comparação é feita
olhando os pares. Projeto que precisa de teste visual automático no CI
usa a comparação de capturas do próprio Playwright Test; as capturas do
Designfy servem à revisão, não à automação de regressão.
