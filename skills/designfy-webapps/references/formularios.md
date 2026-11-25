# Formulários

Um formulário bom é o que a pessoa termina sem errar e sem perder o que
digitou.

Preencha [assets/especificacao-de-formulario.md](../assets/especificacao-de-formulario.md)
antes de escrever código.

## Estrutura

- **Uma coluna.** Campos empilhados na ordem de preenchimento. Dois
  campos lado a lado só quando são um par curto (cidade e estado, validade
  e código).
- **Seções** com título e uma linha de explicação, quando há mais de seis
  campos.
- **Largura** de 480 a 640 px para a coluna de campos. Campo com o
  tamanho do que recebe: CEP curto, endereço longo.
- **Só o necessário.** Cada campo opcional é uma chance de desistência;
  pergunte se o dado pode ser pedido depois.
- **Ações no fim**: a principal à esquerda ou à direita conforme o guia,
  cancelar como ação secundária. Em formulário longo, barra de ações fixa
  no pé.

Fragmentos: `form-layout`, `form-field`, `stepper`, `file-upload`. Base:
`field`, `input`, `select`, `checkbox`, `radio-group`, `switch`,
`textarea`, `calendar` do shadcn, com `react-hook-form` e `zod`.

## Campo

| Parte | Regra |
| --- | --- |
| rótulo | sempre visível, acima do campo, ligado por `for` |
| obrigatório | marque os opcionais com "(opcional)" quando a maioria é obrigatória |
| ajuda | abaixo do rótulo ou do campo, em `muted-foreground`, só quando evita erro |
| texto de exemplo | mostra o formato; nunca substitui o rótulo |
| erro | abaixo do campo, em `destructive`, com ícone, dizendo o que corrigir |
| contador | em campo com limite |

Atributos: `type` certo (`email`, `tel`, `url`, `number` só para
quantidade), `inputmode`, `autocomplete` com o valor da especificação
(`name`, `email`, `tel`, `street-address`, `postal-code`, `cc-number`),
`required`, `name`.

Fonte de 16 px nos campos no celular, para o navegador não ampliar.
Altura de 40 a 44 px (44 px no toque), igual à do botão ao lado.

## Qual controle

| Escolha | Controle |
| --- | --- |
| sim ou não com efeito imediato | alternador (`switch`) |
| sim ou não que vale ao enviar | caixa de seleção |
| uma entre duas a cinco opções | grupo de opções (`radio-group`) ou controle segmentado |
| uma entre seis ou mais | seletor; com mais de quinze, combobox com busca |
| várias entre poucas | caixas de seleção |
| várias entre muitas | combobox múltiplo com fichas |
| data | campo com calendário e digitação aceita |
| período | calendário de intervalo com atalhos |
| número com passo | campo numérico com unidade |
| texto longo | área de texto que cresce |
| arquivo | zona de envio com botão |
| código de verificação | campo de dígitos (`input-otp`) |

Não use seletor para duas opções, nem alternador para algo que só vale
depois de salvar.

## Validação

| Momento | O que valida |
| --- | --- |
| ao digitar | só o que ajuda no ato: força de senha, contador, máscara |
| ao sair do campo | formato e obrigatoriedade daquele campo |
| ao enviar | tudo, mais as regras entre campos e as do servidor |

- Erro não aparece em campo intocado.
- Depois de mostrado, o erro some assim que o valor passa a valer.
- A mensagem diz o que fazer: "Informe um e-mail com @" em vez de
  "inválido".
- Erro do servidor volta ao campo certo; erro geral vai para o resumo.
- No envio com falha: resumo no topo com a contagem e um link para cada
  campo, foco no resumo, e os valores digitados preservados.
- O esquema `zod` é o mesmo no cliente e no servidor.

```tsx
const form = useForm<Values>({ resolver: zodResolver(schema), mode: "onBlur", reValidateMode: "onChange" });
```

## Envio

1. Clique: o botão mostra progresso e fica com `aria-busy`, sem mudar de
   largura. Os campos seguem legíveis.
2. Sucesso: a tela mostra o resultado (vai para o registro criado, ou a
   linha aparece na lista). Aviso curto só quando o efeito não está à
   vista.
3. Falha: resumo de erros, valores preservados, foco no resumo.

O botão de enviar fica ativo antes do envio. Desativar o botão até o
formulário "estar certo" esconde da pessoa o que falta.

Envio duplo: o segundo clique é ignorado enquanto o primeiro está em
curso.

## Alteração não salva

- A barra de ações mostra "Alterações não salvas" quando o formulário
  está diferente do salvo.
- Sair da tela com alteração pede confirmação.
- Formulário de configuração pode salvar a cada campo, com "Salvo" ao
  lado; nesse caso não há botão de enviar.

## Em etapas

`stepper`, quando o formulário não cabe numa tela ou tem partes com
públicos diferentes.

- Três a seis etapas, com nome em cada uma.
- A lista de etapas mostra feita, atual e a fazer; no celular vira "Etapa
  2 de 4" com barra.
- Cada etapa valida antes de avançar.
- Voltar não perde dado.
- Última etapa: revisão com link para editar cada parte.
- O progresso é salvo quando o fluxo é longo.
- O foco vai para o título da etapa a cada troca.

## Edição em linha e em gaveta

| Situação | Padrão |
| --- | --- |
| um campo de um registro | edição em linha: clique, edite, Enter salva, Escape cancela |
| poucos campos, sem sair da lista | gaveta lateral com o formulário |
| muitos campos ou seções | página própria |

## Envio de arquivo

Zona com botão (o botão é o caminho principal no toque), limites escritos
(tipos e tamanho), lista dos arquivos com progresso, remover e erro por
arquivo. A zona reage ao arrastar. O envio continua enquanto a pessoa
preenche o resto.

## Acessibilidade

- Rótulo ligado a cada controle; grupo de opções em `fieldset` com
  `legend`.
- Erro ligado por `aria-describedby`, com `aria-invalid`.
- Resumo de erros com `role="alert"` e foco.
- Ordem de tabulação igual à ordem visual.
- Nada depende só de cor: erro tem ícone e texto.
- Colar não é impedido em nenhum campo.
- Tempo limite, quando existe, avisa e permite estender.

## Movimento

Foco com transição de borda em 150 ms; erro desce 4 px com opacidade;
tremor único no envio com falha; seção condicional abre por linhas de
grade; botão com progresso e depois a marca de feito; etapas deslizam na
direção do avanço.
