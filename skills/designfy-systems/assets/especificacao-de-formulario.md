# Modelo: especificação de formulário

Preencha antes de escrever código. Cole o resultado em `## Estrutura` e
`## Estados` do viewspec.

```markdown
### Formulário: {criar ou editar o quê}

Tarefa: {o que a pessoa conclui}.
Onde: {página | gaveta | etapas}. Envio para: {endpoint ou ação}.
Depois de enviar: {vai para onde; o que confirma}.

#### Seção: {nome}

{uma linha de explicação}

| Campo | Rótulo | Controle | Obrigatório | Validação | Mensagem de erro | `autocomplete` | Ajuda |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `name` | Nome completo | texto | sim | 2 a 120 caracteres | "Informe o nome completo" | `name` | |
| `email` | E-mail | e-mail | sim | formato de e-mail | "Informe um e-mail com @" | `email` | "Usado para enviar a fatura" |
| `plan` | Plano | grupo de opções | sim | um dos valores | "Escolha um plano" | | |
| `notes` | Observações | área de texto | não | até 500 caracteres | "Use até 500 caracteres" | | contador |

Regras entre campos: {por exemplo: data final depois da inicial}.
Erros do servidor esperados: {por exemplo: e-mail já usado} e onde aparecem.

Ações: principal "{rótulo}"; secundária "Cancelar" ({para onde volta}).
Alteração não salva: {aviso ao sair | salva a cada campo}.

Estados:
- intocado, em edição, enviando, erro no envio (resumo no topo), enviado.

Celular: uma coluna; barra de ações fixa no pé.
```

## Em etapas

```markdown
Etapas: 1 {nome} · 2 {nome} · 3 {nome} · 4 Revisão.
Avançar valida a etapa. Voltar preserva. Progresso salvo: {sim | não}.
```

## Perguntas que a especificação responde

1. Cada campo é mesmo necessário agora?
2. Em qual ordem a pessoa tem a informação em mãos?
3. O que acontece depois de enviar?
4. O que acontece se ela sair no meio?
5. Quais erros o servidor pode devolver?
