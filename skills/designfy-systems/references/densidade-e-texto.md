# Densidade, texto de interface e formatos

## Densidade

Escolhida no guia, uma para o sistema.

| Densidade | Quem usa | Controle | Linha de tabela | Texto base | Espaço entre regiões |
| --- | --- | --- | --- | --- | --- |
| arejada | uso ocasional, público amplo | 44 px | 52 a 56 px | 16 px | 32 px |
| média | uso semanal | 40 px | 44 a 48 px | 14 a 16 px | 24 px |
| compacta | operação diária, muitos dados | 32 a 36 px | 36 a 40 px | 14 px | 16 px |

- No toque, toda área clicável tem 44 por 44 px, mesmo na densidade
  compacta (a área de toque pode ser maior que o desenho).
- Texto nunca abaixo de 12 px; 14 px é o mínimo para leitura contínua.
- Mais densidade pede mais alinhamento: colunas fixas, números à direita,
  linhas finas.
- Espaço em branco agrupa. Antes de pôr uma caixa, aumente a distância
  entre grupos.

## Hierarquia numa tela de trabalho

| Nível | Tratamento |
| --- | --- |
| título da tela | `h1`, `text-2xl`, `font-heading`, peso 600 |
| título de região | `h2`, `text-lg` ou `text-base` em peso 600 |
| rótulo | `text-sm`, `muted-foreground` |
| valor | `text-sm` ou `text-base`, `foreground` |
| dado secundário | `text-sm`, `muted-foreground` |
| estado | selo com texto |
| número em destaque | `text-2xl` ou `text-3xl`, algarismos tabulares |

Um ponto de ênfase por região. Cor para estado e ação, não para enfeite.

## Texto de interface

| Elemento | Regra | Exemplo |
| --- | --- | --- |
| botão | verbo com objeto | "Criar pedido", "Exportar CSV" |
| título de tela | o nome do recurso ou do registro | "Pedidos", "Pedido 1042" |
| rótulo de campo | substantivo curto | "E-mail de cobrança" |
| ajuda | o que evita erro | "Usado só para enviar a fatura" |
| erro | o que corrigir | "Informe um CNPJ com 14 dígitos" |
| vazio | o que é e como começar | "Nenhum cliente ainda. Importe uma planilha ou crie o primeiro." |
| confirmação destrutiva | ação, objeto e consequência | "Excluir o pedido 1042? Esta ação apaga os itens e não pode ser desfeita." |
| aviso de sucesso | o que foi feito | "Pedido criado" |
| item de menu | substantivo ou verbo curto | "Duplicar", "Arquivar" |

- Mesma palavra para a mesma coisa em todo o sistema. Escolha entre
  "excluir" e "remover", "cliente" e "conta", e registre no guia.
- Frase em caixa normal. Sem caixa alta em rótulo e botão.
- Sem ponto final em rótulo, botão e item de lista; com ponto em frase
  completa.
- Trate a pessoa do jeito definido no guia e mantenha.
- Números e limites escritos: "até 10 MB", não "arquivos grandes".

## Formatos

| Dado | Formato (público brasileiro) |
| --- | --- |
| data | `24/11/2026`; em texto, "24 de novembro de 2026" |
| hora | `14:30`, 24 horas |
| data relativa | "há 5 minutos", com a data exata na dica |
| número | `1.250`, `1.250,50` |
| abreviado | `1,2 mil`, `3,4 mi`, com o exato na dica |
| moeda | `R$ 1.250,00` |
| percentual | `12,5%` |
| telefone | `(11) 91234-5678` |
| documento | `123.456.789-09`, `12.345.678/0001-90` |
| intervalo | "1 a 20 de 1.240" |
| duração | `2 h 30 min` |

Use a API de internacionalização (`Intl.NumberFormat`,
`Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`) com o idioma do
sistema; não monte formato à mão. Fuso horário: mostre no fuso da pessoa
e diga qual quando importa.

## Truncar

- Uma linha com reticências e o texto completo na dica ou no detalhe.
- Identificadores longos: começo e fim, com copiar.
- Nunca trunque número, valor ou estado.
- Nome de pessoa e de empresa: teste com o mais longo real.

## Ícones

Sempre com rótulo, exceto os universais em contexto claro (fechar,
buscar, menu, mais opções), e mesmo esses com nome acessível e dica.
Uma biblioteca, um traço, 16 px ao lado de `text-sm`.

## Cor em sistema

- Fundo neutro; cor para ação principal, estado e dado.
- Estados com os papéis `success`, `warning`, `destructive`, `info`, com
  fundo tingido (`bg-warning/15`) e texto do mesmo papel, mais ícone e
  palavra.
- Séries de gráfico iguais em todas as telas: a mesma série, a mesma cor.

## Atalhos de teclado

Para quem usa todo dia: paleta de comandos, atalho de criar, de buscar na
lista e de salvar. Mostre o atalho ao lado da ação e numa lista de ajuda.
Não sobrescreva atalhos do navegador.
