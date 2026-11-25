# Estudo: configurações de equipe do Larafy

## Ficha

| Campo | Valor |
| --- | --- |
| Sistema | Larafy, a aplicação Laravel da Promovaweb (React com Inertia, componentes shadcn) |
| Tela | Equipe, aba de edição (`resources/js/pages/teams/edit.tsx`, versão 0.1.2) |
| Quem usa | dono e administradores de uma equipe; membros comuns veem a mesma tela em leitura |
| Tarefa principal | gerenciar quem pertence à equipe e com qual papel |
| Frequência | baixa: entra quando alguém chega, sai ou muda de papel |
| Leitura | 25/11/2026, pelo código da página e dos cinco modais que ela abre |
| Captura | nenhuma; a leitura foi do código. A primeira revisão com `designfy capture run` completa o estudo |

A tela é de configurações, com ações que mexem em acesso de outras contas.
Por isso ela vale como estudo para qualquer área de conta, workspace ou
organização: o que pesa aqui é a permissão de cada controle e o cuidado com
as ações sem volta, não a densidade.

## Regiões

| Região | O que mostra | Componente no Larafy |
| --- | --- | --- |
| Migalhas | Equipes › nome da equipe | `breadcrumbs` do layout |
| Título | nome da equipe; `h1` só para leitor de tela, com "Edit" ou "View" conforme a permissão | `h1.sr-only` |
| Configurações da equipe | campo do nome com erro abaixo e botão Save | `Heading` + `Form` do Inertia |
| Membros | lista em linhas com avatar, nome, e-mail, papel e remoção; botão "Invite member" no cabeçalho da seção | linhas em `div` com borda, `DropdownMenu`, `Tooltip` |
| Convites pendentes | e-mail e papel de cada convite, com cancelamento | mesma linha dos membros, ícone de envelope no lugar do avatar |
| Excluir equipe | aviso em caixa vermelha e botão destrutivo | `Button variant="destructive"` |
| Modais | convidar, remover membro, cancelar convite, excluir equipe | `Dialog` do shadcn |

## Estados

- **Permissão.** Cada controle depende de um campo de `permissions`:
  `canUpdateTeam` troca o formulário pelo nome em texto, `canCreateInvitation`
  esconde o botão de convite e a descrição da seção, `canUpdateMember` troca o
  seletor de papel por um `Badge`, `canRemoveMember` e `canCancelInvitation`
  escondem os botões de remoção, `canDeleteTeam` esconde a zona de exclusão.
  O resultado é uma única tela que serve de edição e de consulta, sem
  controle desabilitado à vista. O papel `owner` nunca recebe seletor nem
  remoção, mesmo para quem pode editar.
- **Equipe pessoal.** A zona de exclusão some quando `team.isPersonal` é
  verdadeiro: a conta sempre conserva uma equipe.
- **Vazio.** A lista de membros nunca fica vazia, porque o dono está nela.
  A seção de convites some inteira quando não há convite pendente, sem
  estado vazio.
- **Carregando.** A página chega pronta do servidor pelo Inertia. Durante o
  envio, o botão Save e o botão do modal ficam desabilitados por
  `processing`. A troca de papel não mostra progresso: a visita do Inertia
  recarrega a página e preserva a rolagem.
- **Erro.** O erro de validação aparece abaixo do campo (`InputError`), no
  formulário do nome e no modal de exclusão.
- **Sucesso.** O modal fecha em `onSuccess`. A página não mostra confirmação
  de gravação além da lista atualizada.

## Interação

- **Ação sem volta pede o nome.** O modal de exclusão só habilita o botão
  quando o texto digitado é igual ao nome da equipe. O campo zera ao fechar o
  modal, então quem desistiu e voltou digita de novo.
- **Ação reversível pede só confirmação.** Remover membro e cancelar convite
  abrem um modal com Cancel e o botão destrutivo, sem digitação.
- **Troca de papel imediata.** Escolher outro papel no menu grava na hora,
  sem modal e sem desfazer.
- **Ação de ícone.** Remover e cancelar são botões só com o ícone X e um
  tooltip. O tooltip aparece com o mouse e com o foco, mas o botão não tem
  `aria-label`, então o leitor de tela anuncia um botão sem nome.
- **Teclado.** Os componentes do shadcn levam o foco para dentro do modal,
  fecham com Esc e devolvem o foco ao botão que abriu. O menu de papel abre
  com Enter e navega com as setas.

## Densidade e ritmo

Seções separadas por `space-y-10`, linhas com `p-4` e avatar de 40 px:
espaço de configurações, não de listagem operacional. Nome em peso médio e
e-mail em `text-muted-foreground` menor fazem a hierarquia de cada linha. As
seções usam o mesmo `Heading` pequeno com título e descrição, o que deixa a
ordem da tela legível de relance: o que é a equipe, quem está nela, quem foi
chamado, como encerrar.

## Responsivo

As linhas usam `flex justify-between` sem quebra. Em largura de celular, um
e-mail longo e o seletor de papel disputam a mesma linha. A conferência em
320 px fica para a primeira captura.

## O que copiar

1. Uma tela para editar e consultar, com cada controle ligado a uma
   permissão e escondido quando ela falta, em vez de desabilitado.
2. O papel de dono fora do alcance de qualquer ação na própria linha.
3. Confirmação proporcional ao estrago: digitar o nome para excluir a
   equipe, um clique de confirmação para remover alguém, nada para trocar o
   papel.
4. Convites pendentes como seção própria, com a mesma anatomia de linha dos
   membros e um ícone que diferencia quem ainda não entrou.
5. O campo de confirmação que zera quando o modal fecha.
6. A zona de exclusão por último, separada das outras seções.

## O que não copiar

1. Botão só com ícone sem nome acessível. Dê `aria-label` com o objeto da
   ação ("Remover Ana Souza da equipe"); o tooltip continua como reforço
   visual.
2. Cores fixas na zona de exclusão (`bg-red-50`, `text-red-600`,
   `border-red-100`). Use os papéis do tema: `border-destructive/40` e
   `text-destructive`, como faz o `settings-section` do registro.
3. Troca de papel sem retorno. Uma confirmação curta junto da linha
   ("Papel alterado para Admin") e a opção de desfazer por alguns segundos
   evitam a dúvida sobre se a escolha gravou.
4. Seção que some quando fica vazia, se a pessoa acabou de cancelar o último
   convite: um estado vazio curto ("Nenhum convite pendente") confirma que a
   ação terminou.
5. Linha sem quebra no celular: empilhe nome e e-mail acima do papel e das
   ações abaixo de `sm`.

## Peças no registro

O estudo não gerou componente novo. As peças do Designfy que cobrem esta
tela são:

- `settings-layout` e `settings-section`, que já trazem a seção com título,
  descrição e gravação própria, além da variante `danger` com confirmação em
  diálogo e cores do papel `destructive`;
- `dialog`, para convite, remoção e cancelamento;
- `empty-state`, para a seção de convites sem item;
- `page-header`, para o topo da tela, com as migalhas do padrão
  `breadcrumbs` do catálogo, que vem do shadcn.

A lista de membros com papel editável na linha é o candidato a item novo do
registro, uma lista de membros, quando um segundo sistema repetir a mesma anatomia.
