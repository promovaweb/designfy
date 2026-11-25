# Modelo: especificação de tabela

Preencha antes de escrever código. Cole o resultado em `## Estrutura` e
`## Estados` do viewspec.

```markdown
### Tabela: {nome do recurso}

Tarefa: {o que a pessoa faz com esta lista: achar, comparar, agir}.
Origem: {endpoint ou função}; {paginação no servidor ou no cliente}.
Volume: {dezenas | centenas | milhares | mais}.
Ordenação padrão: {coluna, direção}.

| Coluna | Campo | Tipo de célula | Alinha | Ordena | No cartão do celular | Observação |
| --- | --- | --- | --- | --- | --- | --- |
| Pedido | `number` | link para o detalhe | esq. | sim | sim (título) | identifica |
| Cliente | `customer.name` | texto truncado | esq. | sim | sim | |
| Estado | `status` | selo com texto | esq. | sim | sim | |
| Prazo | `dueDate` | data curta | esq. | sim | sim | atrasado em `destructive` com texto |
| Total | `total` | moeda | dir. | sim | sim | algarismos tabulares |
| Canal | `channel` | texto | esq. | não | não | oculta por padrão |
| | | menu de ações | dir. | não | sim | Ver, Editar, Duplicar, Excluir |

Filtros: {texto em: campo}; {atributo: valores}; {período: campo de data}.
Seleção: {sim | não}. Ações em lote: {lista}.
Ação da linha visível: {nenhuma | qual}. No menu: {lista}.
Página: {20} por página; tamanhos {20, 50, 100}.
Na URL: `q`, `status`, `from`, `to`, `sort`, `page`, `size`.

Estados:
- carregando: {n} linhas de esqueleto.
- vazio de primeiro uso: "{texto}" com a ação "{rótulo}".
- sem resultado: "{texto}" com "Limpar filtros".
- erro: "{texto}" com "Tentar de novo".

Celular: {cartões | colunas prioritárias | rolagem com primeira coluna fixa}.
```

## Perguntas que a especificação responde

1. Qual coluna identifica o registro?
2. Quais três atributos a pessoa mais compara?
3. O que ela faz com uma linha? E com várias?
4. Quantas linhas existem hoje e em um ano?
5. O que acontece no celular?
