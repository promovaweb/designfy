# Página de documentação

Documentação é conteúdo de consulta: a pessoa chega com uma pergunta, acha
a resposta e sai. A diagramação favorece achar e copiar.

## Layout

| Largura | Colunas |
| --- | --- |
| desktop largo | navegação da documentação (240 a 280 px), conteúdo na medida, índice da página (200 a 240 px) |
| desktop médio | navegação e conteúdo; o índice da página vira bloco recolhido no topo |
| tablet e celular | conteúdo; a navegação abre em gaveta por um botão fixo no topo |

- As duas laterais são `sticky`, abaixo do cabeçalho, com rolagem própria.
- O conteúdo usa `minmax(0, 1fr)` e a medida de 70 a 80 caracteres.
- A navegação da documentação não é o menu do site: fica dentro de `nav`
  com rótulo próprio.

## Navegação

- Grupos com título e páginas dentro, em ordem de aprendizado ou de uso.
- Página atual marcada com `aria-current="page"` e um marcador visual.
- Grupos recolhíveis quando há muitos; o grupo da página atual abre
  sozinho.
- "Anterior" e "próxima" no fim de cada página.
- Trilha no topo quando há mais de dois níveis.

Encontrar sem campo de busca: índice geral com todas as páginas agrupadas,
âncoras em todos os títulos e a paleta de comandos do navegador
(`Ctrl+F`) funcionando porque o conteúdo está no HTML. Busca própria é uma
escolha do projeto, registrada no guia.

## Página

| Parte | Regra |
| --- | --- |
| título | `h1` com o nome da tarefa ou do recurso |
| abertura | uma ou duas frases com o que a página resolve |
| pré-requisitos | lista curta, quando há |
| corpo | passos numerados para tarefas; seções por assunto para referência |
| exemplos | código real, testado, com copiar |
| resultado | o que a pessoa vê quando deu certo |
| problemas comuns | tabela de sintoma, causa e correção |
| próximos passos | links para as páginas seguintes |

## Código na documentação

- Um bloco por comando ou por arquivo, com o nome do arquivo no
  cabeçalho.
- Abas para variações (gerenciador de pacotes, sistema, linguagem), com a
  escolha lembrada entre páginas.
- Saída esperada separada do comando.
- Valores que a pessoa precisa trocar marcados (`<seu-projeto>`) e
  explicados.
- Linhas alteradas realçadas quando o bloco mostra uma mudança.

## Tabelas de referência

Opções, propriedades e códigos de saída em tabela: nome em `font-mono`,
tipo, padrão e descrição. Tabela larga rola na própria caixa com a
primeira coluna fixa. No celular, cada linha pode virar um bloco com o
nome como título.

## Avisos

Os quatro tipos de `callout`, com parcimônia. "Atenção" para o que causa
perda de dado ou de tempo; "nota" para contexto; "dica" para atalho.

## Versão

Documentação de produto com versões mostra a versão da página no topo e
um seletor quando há mais de uma. Página de versão antiga avisa e aponta
para a atual.

## Movimento

Contido: marcador do índice deslizando, grupos da navegação abrindo,
confirmação de cópia, transição entre páginas curta. Nenhuma revelação no
corpo.

## Acessibilidade

- Três marcos de navegação com rótulos distintos (site, documentação,
  nesta página).
- Link de pular para o conteúdo.
- A gaveta da navegação com foco preso e Escape.
- Código com contraste conferido nos dois temas.

## Em Astro

Coleção de conteúdo por seção, barra lateral gerada dos arquivos, MDX para
componentes dentro do texto. Em projeto com o
[Astrofy](https://github.com/promovaweb/astrofy), a estrutura de rotas e
de conteúdo é dele e o desenho é do Designfy.
