# Formulários acessíveis

O desenho de formulários está na `designfy-systems`. Aqui fica o que
torna cada campo usável por teclado e por leitor de tela.

## Rótulo

```html
<label for="email">E-mail</label>
<input id="email" name="email" type="email" autocomplete="email" required aria-describedby="email-ajuda email-erro">
<p id="email-ajuda">Usado para enviar a fatura.</p>
<p id="email-erro" role="alert" hidden>Informe um e-mail com @.</p>
```

- Todo campo tem `label` visível e ligado (`for` e `id`, ou o campo
  dentro do `label`).
- Texto de exemplo não é rótulo: some ao digitar e tem pouco contraste.
- Campo sem espaço para rótulo (busca num cabeçalho): `aria-label`, e
  ainda assim um ícone ou texto que identifique.
- Clicar no rótulo foca o campo; em caixa e opção, marca.

## Grupo

```html
<fieldset>
  <legend>Forma de entrega</legend>
  <label><input type="radio" name="entrega" value="retirada"> Retirar na loja</label>
  <label><input type="radio" name="entrega" value="envio"> Receber em casa</label>
</fieldset>
```

Opções e caixas relacionadas ficam em `fieldset` com `legend`. Seção de
formulário com título usa `role="group"` com `aria-labelledby`, ou um
`fieldset`.

## Obrigatório e formato

- `required` no campo. Marque os opcionais com "(opcional)" quando a
  maioria é obrigatória, ou os obrigatórios com asterisco e legenda.
- Formato exigido dito antes, na ajuda: "Use DD/MM/AAAA".
- Limites ditos antes: "até 500 caracteres", com contador.
- Máscara que formata enquanto a pessoa digita aceita colar o valor com
  ou sem pontuação.

## Preenchimento automático

`autocomplete` com o valor da especificação em todo campo de dado
pessoal:

| Campo | `autocomplete` |
| --- | --- |
| nome completo | `name` |
| e-mail | `email` |
| telefone | `tel` |
| endereço | `street-address`, `address-level2` (cidade), `address-level1` (estado), `postal-code` |
| usuário | `username` |
| senha atual, senha nova | `current-password`, `new-password` |
| código de verificação | `one-time-code` |
| cartão | `cc-name`, `cc-number`, `cc-exp`, `cc-csc` |
| empresa | `organization` |
| nascimento | `bday` |

Nunca `autocomplete="off"` em campo de dado pessoal, nem impedir colar.

## Erro

- O erro aparece em texto, junto ao campo, com ícone.
- `aria-invalid="true"` no campo e a mensagem em `aria-describedby`.
- A mensagem diz o que corrigir e, quando dá, sugere: "Você quis dizer
  ana@exemplo.com?".
- Validação ao sair do campo anuncia a mensagem (`role="alert"` na
  mensagem, ou região viva).
- No envio com falha: resumo no topo com `role="alert"`, contagem de
  erros e link para cada campo; o foco vai para o resumo.

```html
<div role="alert" tabindex="-1" id="erros">
  <h2>Corrija 2 campos para continuar</h2>
  <ul>
    <li><a href="#email">E-mail: informe um endereço com @</a></li>
    <li><a href="#cep">CEP: use 8 dígitos</a></li>
  </ul>
</div>
```

- Erro não se comunica só por cor nem só por borda.
- O que a pessoa digitou fica; ninguém preenche de novo por um erro.

## Ajuda

Texto de ajuda ligado por `aria-describedby`, visível o tempo todo (não
só no foco, não só em dica). Ajuda longa vai para um botão "O que é
isto?" que abre um popover acessível.

## Botões

- `type="submit"` no que envia; `type="button"` nos demais.
- Enter num campo envia o formulário.
- Enviando: `aria-busy="true"` e o rótulo continua legível.
- Botão desativado não recebe foco e não explica por quê: prefira deixar
  ativo e validar no clique. Se precisar desativar, use `aria-disabled`
  com a explicação ligada.

## Controles próprios

Use os do shadcn ou do ReUI, que já implementam o padrão:

| Controle | Papel e teclas |
| --- | --- |
| alternador | `role="switch"`, `aria-checked`, Espaço alterna |
| combobox | `role="combobox"` com lista; setas, Enter, Escape, digitar filtra |
| seletor de data | campo que aceita digitar, mais calendário com setas e Page Up e Down |
| controle deslizante | `role="slider"` com valor, setas, Home e End |
| envio de arquivo | `input type="file"` real por trás da zona |
| campo de código | um campo com `autocomplete="one-time-code"` que aceita colar |
| avaliação por estrelas | grupo de opções |

## Tempo e sessão

- Limite de tempo avisa antes e permite estender.
- Sessão que expira preserva o que foi digitado e devolve a pessoa ao
  formulário depois de entrar.
- Salvar rascunho em formulário longo.

## Prevenção

Ação com efeito legal, financeiro ou destrutivo oferece revisão antes de
confirmar, ou pode ser desfeita. O resumo da revisão permite editar cada
parte.

## Autenticação

Entrar não depende de memória nem de transcrição: gerenciador de senhas e
colar funcionam; código por e-mail pode ser colado; desafio visual tem
alternativa.

## Conferir

- [ ] Todo campo tem rótulo visível e ligado.
- [ ] Grupos em `fieldset` com `legend`.
- [ ] `autocomplete`, `type` e `inputmode` certos.
- [ ] Erro em texto, ligado ao campo, com `aria-invalid`.
- [ ] Resumo de erros recebe o foco no envio com falha.
- [ ] Ajuda ligada por `aria-describedby`.
- [ ] Formulário inteiro preenchido e enviado só com o teclado.
- [ ] Leitor de tela anuncia rótulo, tipo, obrigatoriedade, ajuda e erro
      de cada campo.
