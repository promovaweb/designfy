# Páginas de configuração

Configurações são visitadas raramente e mexem em coisas que importam. O
desenho ajuda a achar a opção, entender o efeito e confirmar que salvou.

## Estrutura

`settings-layout` com `settings-section`.

| Tamanho | Navegação |
| --- | --- |
| até quatro áreas | abas no topo da página |
| cinco áreas ou mais | navegação lateral própria das configurações |
| uma área longa | página única com índice de âncoras |

Áreas comuns: perfil, conta e segurança, notificações, aparência, equipe
e permissões, plano e cobrança, integrações, chaves de acesso, zona de
ações destrutivas. Cada área tem endereço próprio.

Separe o que é da pessoa (perfil, notificações, aparência) do que é da
organização (equipe, cobrança, integrações).

## Seção

| Parte | Regra |
| --- | --- |
| título | o nome da configuração, em `h2` |
| explicação | uma ou duas frases com o efeito de mudar |
| controles | campos ou linhas de alternador |
| ações | salvar e desfazer da seção, ou salvamento imediato |
| confirmação | "Salvo" ao lado do botão ou do controle |

Layout no desktop: título e explicação à esquerda (um terço), controles à
direita (dois terços), com linha fina entre seções. No celular, a
explicação fica acima dos controles.

## Salvar

Escolha um padrão por tipo de controle e mantenha no sistema inteiro:

| Controle | Padrão |
| --- | --- |
| alternador, seletor simples | salva na hora, com "Salvo" ao lado |
| campos de texto de uma seção | botão "Salvar" da seção, ativo quando há alteração |
| conjunto que precisa valer junto (cobrança, domínio) | botão da seção com confirmação |

- Nunca um botão "Salvar" no fim de uma página longa valendo para tudo:
  a pessoa não sabe o que salvou.
- Falha ao salvar: o controle volta ao valor anterior e a mensagem
  explica.
- Sair com alteração não salva pede confirmação.

## Linha de alternador

```text
Resumo semanal por e-mail                                   [ ● ]
Enviado toda segunda às 8h com os pedidos da semana.
```

- Rótulo e descrição ligados ao alternador (`aria-describedby`).
- A linha inteira é clicável.
- O efeito é imediato e visível.

## Dados sensíveis

| Item | Padrão |
| --- | --- |
| e-mail e senha | alteração com a senha atual e confirmação por e-mail |
| chave de acesso | mostrada uma vez na criação, com copiar; depois só os últimos caracteres |
| verificação em duas etapas | fluxo guiado com códigos de recuperação |
| sessões ativas | lista com aparelho, local e data, e encerrar |
| exportar dados | pedido com aviso quando fica pronto |

## Zona de ações destrutivas

`danger-zone`: última seção da área, separada por borda em `destructive`.
Cada linha traz o que a ação faz, a consequência em uma frase e o botão.
Toda ação confirma; excluir conta ou organização pede o nome digitado.

## Equipe e permissões

Tabela de pessoas com papel, estado do convite e ações. Convite por
e-mail com o papel escolhido. Papel explicado em uma frase. Remover
pessoa confirma e diz o que acontece com o que era dela.

## Plano e cobrança

Plano atual com o que inclui e o uso (barra de progresso com o limite),
data da próxima cobrança, forma de pagamento, histórico de faturas com
baixar, e trocar de plano com a diferença de valor antes de confirmar.

## Aparência

Tema claro, escuro e do sistema (grupo de opções com prévia), densidade
quando o sistema oferece, idioma e formato de data.

## Integrações

Cartão por integração com nome, o que ela faz, estado (conectada ou não)
e a ação. Conectada: conta ligada, última sincronização e desconectar com
confirmação.

## Estados

- Carregando: esqueleto das seções.
- Sem permissão para uma área: a área aparece desativada com o motivo, ou
  some, conforme o guia.
- Salvando, salvo, erro: em cada seção.

## Movimento

Alternador desliza em 150 ms; "Salvo" aparece e some em 2 s; troca de
área com opacidade; seção condicional abre por linhas de grade.

## No celular

A navegação das áreas vira uma lista que leva a cada área (com voltar),
ou um seletor. Botões em largura total. Tabelas de equipe e faturas como
cartões.
