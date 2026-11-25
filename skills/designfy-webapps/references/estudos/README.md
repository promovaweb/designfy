# Estudos de telas de sistema

Telas reais de sistema, em uso e aprovadas, lidas por inteiro: shell,
painel, listagem com tabela, formulário, detalhe, configurações, entrada.
Cada estudo registra a tarefa que a tela resolve, as regiões, os estados de
cada região (carregando, vazio, erro, sucesso), a densidade, o teclado e as
técnicas que valem para outros sistemas. Os componentes reaproveitáveis
viram itens do registro do Designfy e o estudo aponta para eles.

Os estudos de páginas de site (landing, home, artigo) ficam na skill
`designfy-websites`, em `references/estudos/`, com o formato equivalente.

## Quando ler

- Antes de desenhar uma tela do mesmo tipo: as regiões e os estados de um
  estudo são um ponto de partida testado.
- Ao revisar uma tela: compare os estados cobertos e o caminho de teclado
  com o estudo.

Copie a estrutura, a anatomia, os estados e as técnicas. Nunca copie dados,
nomes de clientes ou a marca do sistema estudado.

## Estudos

Ainda não há estudo de tela de sistema. O primeiro entra quando houver uma
tela de sistema real, em uso, para ler do começo ao fim. Até lá, os
exemplos de `examples/react-system` no repositório do Designfy e as
referências desta skill cobrem as telas comuns.

## Formato de um estudo

1. **Ficha**: sistema, tela, quem usa, tarefa principal, frequência de uso,
   data da leitura e captura usada.
2. **Regiões**: tabela com cada região da tela, o que mostra e o componente.
3. **Estados**: carregando, vazio, erro, sucesso e permissão de cada região,
   como a tela real resolve.
4. **Interação**: teclado, atalhos, seleção, ações em lote, confirmação,
   desfazer.
5. **Densidade e ritmo**: tamanho de linha, espaçamento, hierarquia de
   números e rótulos.
6. **Responsivo**: o que muda em tablet e celular.
7. **O que copiar** e **O que não copiar**.
8. **Peças no registro**: os itens do Designfy que saíram do estudo.
