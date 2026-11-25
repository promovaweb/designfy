# Entrada, cadastro e recuperação de acesso

As telas de acesso são a porta do sistema. Precisam ser rápidas, claras e
seguras, e funcionar com gerenciador de senhas.

## Telas

| Tela | Conteúdo |
| --- | --- |
| entrar | e-mail, senha, entrar, esqueci a senha, criar conta, provedores |
| criar conta | os campos mínimos, criar conta, já tenho conta, termos |
| recuperar | e-mail, enviar instruções, voltar para entrar |
| redefinir | nova senha, confirmar, salvar |
| verificar | código de uso único, reenviar, usar outro método |
| convite | nome, senha, aceitar |

Fragmento: `auth-card`.

## Layout

| Variação | Uso |
| --- | --- |
| cartão central | padrão; marca acima, formulário no cartão |
| dividido | formulário de um lado e painel de marca do outro, com fundo de padrão e uma frase |
| página simples | sem cartão, para produto minimalista |

No celular, o painel de marca some e o formulário ocupa a largura, com
margem de 16 px. A marca continua no topo.

## Campos

| Campo | Atributos |
| --- | --- |
| e-mail | `type="email"`, `autocomplete="username"` ou `email`, `inputmode="email"` |
| senha (entrar) | `type="password"`, `autocomplete="current-password"` |
| senha (criar, redefinir) | `autocomplete="new-password"`, requisitos visíveis antes de digitar |
| código | `autocomplete="one-time-code"`, `inputmode="numeric"` |
| nome | `autocomplete="name"` |

- Botão de mostrar a senha, com nome acessível.
- Colar é permitido em todos os campos.
- Requisitos de senha escritos e marcados conforme são cumpridos; prefira
  comprimento a regras de composição.
- Um campo de senha só no cadastro, com mostrar; confirmar senha é
  dispensável quando há mostrar.
- "Manter conectado" explicado em uma linha, quando existe.

## Provedores e outros métodos

Botões de provedor (com o nome do provedor no rótulo) acima ou abaixo do
formulário, separados por uma linha com "ou". Link mágico por e-mail e
chave de acesso (passkey) como opções quando o sistema tem. O último
método usado aparece primeiro.

## Erros

- Entrada: "E-mail ou senha incorretos", sem dizer qual. O e-mail fica
  preenchido e o foco vai para a senha.
- Recuperação: a mesma mensagem exista ou não a conta ("Se houver uma
  conta com este e-mail, enviamos as instruções").
- Cadastro com e-mail já usado: trate sem expor, conforme a política do
  projeto.
- Muitas tentativas: diga quando tentar de novo.
- Erro de rede: diga que nada foi enviado e ofereça tentar de novo.

Mensagens ligadas ao campo ou num alerta acima do formulário, com
`role="alert"`.

## Fluxo

1. Envio com o botão em progresso.
2. Sucesso: vai para o destino que a pessoa queria antes de ser barrada,
   ou para a tela inicial.
3. Primeira entrada: leva à configuração inicial, curta.
4. Sessão expirada: volta para entrar com a mensagem e, depois, retorna
   à tela e ao que estava sendo feito.

## Verificação por código

Campo de dígitos que avança sozinho e aceita colar o código inteiro;
envio automático ao completar; reenviar com contagem regressiva; opção
de outro método; código de recuperação como saída.

## Texto

- Títulos diretos: "Entrar", "Criar conta", "Recuperar acesso".
- Sem marketing na tela de entrar.
- Links de termos e privacidade no cadastro, em uma linha.
- Idioma e formato do público.

## Acessibilidade

- Um `h1` por tela.
- Rótulos visíveis; nada só com texto de exemplo.
- Foco inicial no primeiro campo.
- Erros anunciados.
- Tempo de expiração de código informado.
- Verificação anti-robô, quando existe, com alternativa acessível.

## Movimento

Cartão sobe e ganha opacidade na carga; troca entre entrar e criar conta
desliza o formulário; erro com tremor único e a mensagem; painel de marca
com um fundo que se move devagar; botão com progresso.

## Segurança que aparece na interface

- Não revele se uma conta existe.
- Não limite o tamanho da senha para baixo de 64 caracteres.
- Não impeça gerenciador de senhas.
- Mostre o último acesso e os aparelhos nas configurações.
- Saia de todas as sessões ao redefinir a senha, e avise.

A regra de negócio de autenticação é do projeto; esta referência cuida do
que a pessoa vê.
