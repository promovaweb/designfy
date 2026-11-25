# CLI

## Convenções

- `{{bin}} <command> [subcommand] [arguments] [options]`.
- Options aceitam `--key value` e `--key=value`. Não há agrupamento de flags
  curtas (`-abc`).
- `--` encerra a leitura de options; o que vem depois é argument.
- Options globais valem em qualquer posição, antes ou depois do command.
- Sem argumentos, em terminal interativo, o binário abre a TUI. Sem TTY,
  imprime o help e sai com exit code 2.
- Toda saída de dados vai para stdout. Avisos, progresso e erros em modo
  texto vão para stderr.
- Nomes de commands, subcommands, options, arguments, keys e campos de saída
  são em inglês. Mensagens do binário também.

## Options globais

| Option | Efeito |
| --- | --- |
| `-h`, `--help` | Help do command atual. Exit code 0. |
| `-V`, `--version` | Imprime `{{bin}} <version>`. Exit code 0. |
| `--json` | Saída em JSON com envelope estável. Erros também saem em JSON, em stdout. |
| `--skill [topic]` | Documentação embutida. Topics: `cli`, `tui`, `mcp`, `config`, `exit-codes`, `reference`. |
| `--opencli` | Descrição OpenCLI 0.1 da árvore de commands em JSON. |
| `--no-color` | Desliga cores ANSI. `NO_COLOR=1` tem o mesmo efeito. |
| `--project <dir>`, `-C <dir>` | Executa na pasta indicada. Sobrescreve `DESIGNFY_PROJECT`. Pasta inexistente sai com 6. |

## Saída em texto e em JSON

Texto é o padrão quando `output.format` em settings.json é `text`. Com
`--json`, ou com `output.format = json`, a saída usa um envelope com o command e seus dados.

```json
{ "ok": true, "command": "{{bin}} config get", "data": { "key": "tui.theme", "value": "terminal" } }
```

Uma credencial ausente produz este erro.

```json
{
  "ok": false,
  "command": "{{bin}} credentials get",
  "error": { "code": 4, "name": "CREDENTIALS", "message": "Credential \"x\" not found. Save it with: {{bin}} credentials set x", "details": { "name": "x" } }
}
```

O exit code do processo é sempre o mesmo de `error.code`. Um agente deve ler
a mensagem do envelope e usar o exit code para tratar a classe da falha.
Algumas conferências entregam dados com exit code diferente de zero.
Confira `data.ok` em `doctor`, `data.valid` em `viewspec validate` e
`data.errors` nas consultas de viewspecs.

## Commands

Os commands de projeto usam a pasta de trabalho. Use `{{bin}} -C ./website status`
para selecionar a raiz do site a partir de outra pasta. Caminhos relativos
passados aos commands (como `theme show --file`) partem da raiz selecionada.
As options globais também valem para os subcommands. Use `--skill reference` para
consultar argumentos, valores aceitos e exit codes pelo registry.

| Command | Options locais e comportamento |
| --- | --- |
| `init` | Detecta framework e Tailwind pelo `package.json`, shadcn pelo `components.json` e gerenciador pelo lockfile. `--framework <framework>`, `--components-path <path>` e `--styles-path <path>` ajustam o resultado. `--dry-run` exibe a proposta. `--force` substitui o arquivo. Sem `package.json`, sai com 6. |
| `status` | Compara a detecção atual com a configuração em vigor. Conta skills, dependências, itens copiados e viewspecs válidos por status. Mostra o próximo ID livre, o guia com suas contagens, o major do Tailwind e o caminho do CSS. |
| `skills list` | Lista skills internas e externas com estado `project`, `global` ou `no`. `--internal` e `--external` selecionam os tipos. |
| `skills install [names...]` | Instala nomes indicados ou as recomendações compatíveis com o projeto. `--all` inclui todos os frameworks. `--internal` e `--external` filtram. `--agent <agents>` aceita nomes separados por vírgula. `--global` instala no escopo global. `--dry-run` imprime o plano. Nome desconhecido sai com 6. |
| `skills update [names...]` | Atualiza as skills instaladas. Sem nomes, atualiza todas no escopo escolhido. `--global` seleciona o escopo global. |
| `skills remove <names...>` | Remove as skills indicadas do projeto. Instalação, atualização e remoção usam o Skills CLI via `npx`. Falha do processo externo sai com 5. |
| `deps list` | Mostra as faixas do catálogo e do `package.json`, com os estados `ok`, `missing` e `outdated`. `--group <id>` restringe a lista. |
| `deps check` | Confere as recomendações do framework ou o grupo de `--group <id>`, além das exigências dos componentes copiados. Sai com 10 se houver pacote ausente ou desatualizado. |
| `deps install [groups-or-packages...]` | Instala grupos ou pacotes indicados. Sem argumentos, instala o que falta nas recomendações compatíveis. `--pm <manager>` seleciona `npm`, `pnpm`, `bun` ou `yarn`. `--dry-run` mostra os comandos. Falha do gerenciador sai com 5. |
| `catalog list` | Lista fragmentos por `--surface <surface>` (`site`, `system`, `both`), `--category <id>` e `--kind <kind>` (tipo de tela do viewspec). |
| `catalog show <id>` | Exibe propósito, anatomia, estados, tokens e fontes de implementação. ID desconhecido sai com 6. |
| `catalog search <text>` | Busca uma expressão no catálogo. Use aspas quando houver espaços. |
| `components list` | Lista itens do registro por `--framework <framework>`, `--category <category>` e `--surface <surface>`. Usa o framework do projeto por padrão. Next.js e React com Vite usam o registro React. Em Tailwind 3, avisa que os itens usam Tailwind 4. |
| `components show <name>` | Exibe arquivos e dependências. `--framework <framework>` escolhe o registro e `--source` inclui o código-fonte. Nome desconhecido sai com 6. Em Tailwind 3, exibe o aviso de compatibilidade. |
| `components add <names...>` | Copia cada item e suas dependências do registro. `--framework <framework>` escolhe o registro. `--path <dir>` substitui a pasta de destino. `--overwrite` substitui arquivos diferentes. `--dry-run` exibe o plano, inclusive dependências pendentes. Sem `--overwrite`, o comando preserva arquivos diferentes e avisa. Em Tailwind 3, sai com 10. `--allow-tailwind3` permite copiar os arquivos com aviso. |
| `theme show` | Mostra o major, o CSS do Tailwind, seus imports locais e o arquivo de configuração do Tailwind 3, quando encontrado. `--file <path>` escolhe o CSS. `--group <group>` restringe a `colors`, `fonts`, `text`, `radius`, `spacing`, `shadows`, `breakpoints` ou `motion`. Sem CSS, sai com 6. |
| `theme check` | Mede o contraste claro e escuro e verifica os papéis do registro, incluindo os declarados na configuração do Tailwind 3. `--file <path>` escolhe o CSS. Sai com 10 por reprovação de contraste, par sem resolução ou papel obrigatório ausente. Pares opcionais com tokens ausentes são pulados e aparecem no resultado. |
| `palette generate` | Gera escalas e tokens claros e escuros com `--base <color>`. `--harmony <harmony>` acrescenta escalas de acento. `--format <format>` aceita `css` (padrão), `json` ou `tailwind`. `--out <file>` grava o resultado. |
| `palette wheel <color>` | Mostra todas as harmonias em hex e OKLCH. |
| `palette contrast <foreground> <background>` | Mede WCAG e APCA. `--min <ratio>` faz o command sair com 10 abaixo da razão WCAG indicada, de 1 a 21. |
| `viewspec guide` | Lê o `VIEWSPEC.md` da raiz e mostra regras por seção e origem, além de propostas pendentes. Guia ausente sai com 6. |
| `viewspec list` | Lista o progresso da checklist de cada tela. `--status <status>` e `--kind <kind>` filtram. |
| `viewspec show <id>` | Lê front matter, seções e checklist. O ID tem quatro dígitos. ID inexistente sai com 6. |
| `viewspec progress` | Conta viewspecs por status, mostra itens feitos e totais da checklist e o próximo ID livre. |
| `viewspec validate [id]` | Valida todas as telas ou a tela indicada e o guia da raiz. Um guia ausente gera aviso. Arquivo inválido sai com 10, também nos demais subcommands que analisam viewspecs. |
| `capture run <urls...>` | Captura URLs HTTP(S) com o Playwright do projeto. `--viewport <viewport>` se repete ou aceita lista por vírgula. `--theme <theme>` aceita `light` (padrão) ou `dark`. `--full-page` captura a página inteira por padrão. `--fold` captura só a área visível. `--reduced-motion` emula a preferência por movimento reduzido. `--wait <ms>` espera após o carregamento e `--selector <css>` limita a captura ao elemento. `--out <dir>` e `--name <run>` definem a pasta e o nome da execução. Sem Playwright, sai com 10. Falha da captura sai com 5. |
| `capture list` | Lê os manifestos da execução mais recente à mais antiga. `--out <dir>` seleciona a pasta. |
| `tui [--tab <tab>]` | Abre a Home de módulos. Passe `--tab <tab>` com um ID de `tui.initialTab` para abrir uma tela diretamente. Sai com 8 quando não há TTY. |
| `about` | Mostra versão, executável, runtime, plataforma e créditos. |
| `config list\|get\|set\|unset\|path\|schema` | Lê ou edita preferências em `settings.json`. |
| `credentials set\|get\|list\|remove\|status\|clear\|rotate-key` | Gerencia o cofre cifrado. Alias `cred`. Veja [configuração](configuration.md). |
| `mcp` | Inicia o servidor stdio. `--list` mostra a superfície sem iniciar. `--read-only` retira as tools que gravam e pode ser combinado com `--list`. Falha no transporte sai com 9. |
| `mcp servers` | Lista servidores sugeridos e seu estado nos arquivos de configuração do projeto. |
| `mcp setup [servers...]` | Configura os servidores indicados ou os recomendados. `--client <clients>` aceita `claude`, `codex`, `opencode`, `cursor` e `gemini`, separados por vírgula. Usa os clientes detectados ou `claude`. `--force` substitui entradas diferentes e `--dry-run` imprime o plano. ID desconhecido sai com 6. |
| `skill [topic]` | Tem o mesmo efeito de `--skill`. |
| `doctor` | Confere o ambiente e a configuração local. Sai com 3 se uma verificação tiver estado `fail`. Mostra o major do Tailwind e avisa sobre o requisito do registro em projetos Tailwind 3. |
| `completion <shell>` | Gera script para `bash`, `zsh` ou `fish`. |

No Tailwind 3, a descoberta do tema procura `@tailwind base` ou
`@import "tailwindcss/base"` e `tailwind.config.*` na raiz para completar
os tokens. Se a configuração não carregar, o resultado traz um aviso e
os tokens do CSS. Inspecione apenas projetos cujo código você confia,
pois o comando executa o módulo de configuração.

A paleta aceita `#RGB`, `#RRGGBB` e `oklch(L C H)`. As harmonias são
`complementary`, `analogous`, `triadic`, `split-complementary`, `tetradic` e
`monochromatic`. Use aspas em valores de cor no shell. O formato `css`
gera variáveis no formato do shadcn com `@theme inline`. O formato
`tailwind` gera o bloco `@theme`. A flag global `--json` seleciona o
envelope do CLI.

Os presets de captura são `mobile` (390×844), `tablet` (820×1180),
`desktop` (1440×900) e `wide` (1920×1080). Use `LARGURAxALTURA` para
outra dimensão. O padrão vem de `capture.viewports`. O `manifest.json`
registra, por captura, o título, as medidas da página, erros do console e
`overflowX` para detectar conteúdo mais largo que o viewport.

Argumentos inválidos saem com 2. Configuração inválida sai com 3 e
permissão negada sai com 7. Consulte a [tabela de exit codes](exit-codes.md).

### Exemplos

```bash
{{bin}} init
{{bin}} status --json
{{bin}} skills install astrofy --agent codex --dry-run
{{bin}} deps install motion --dry-run
{{bin}} catalog list --kind dashboard
{{bin}} catalog show data-table
{{bin}} components add cn --framework react --dry-run
{{bin}} theme show --group colors
{{bin}} palette generate --base "#2AD5BE" --harmony triadic
{{bin}} palette contrast "#00161E" "#C6F4ED"
{{bin}} viewspec progress
{{bin}} viewspec validate
{{bin}} capture list
{{bin}} mcp setup --dry-run
{{bin}} mcp --list --read-only
```

A comparação de cores do exemplo retorna estas medidas e vereditos.

```text
  Foreground    #00161e
  Background    #c6f4ed
  WCAG ratio    15.50:1
  APCA          Lc 93.0
  Normal text   AA pass, AAA pass
  Large text    AA pass, AAA pass
  UI component  AA pass, AAA N/A
```

## Como adicionar um command

1. Copie `template/command/example.ts` para `src/cli/commands/<name>.ts`.
2. Preencha `name`, `description`, `arguments`, `options`, `examples` e
   `exitCodes`. Toda option precisa de `description`; é ela que aparece no
   `--help`, no `--skill` e no OpenCLI.
3. Implemente `run(ctx)` devolvendo `{ data, text }`. `data` é o que sai em
   `--json`; `text` é o que sai para humanos. Lance `AppError` (ou use
   `error.*`) para falhas previstas, com o exit code certo.
4. Registre o command em `src/cli/commands.ts`.
5. Rode `bun test`, `bun run opencli` e confira `docs/opencli.json`.

Segredos nunca entram por argument de linha de comando. Leia pelo stdin ou
por `readSecret()`; grave com `setCredential()`; recupere com
`getCredential()`, que encerra com exit code 4 quando o valor não existe.

## Diagnóstico e completion

`{{bin}} doctor` confere Bun 1.4.4 ou superior, TTY de stdin/stdout,
pasta de dados com 0700, leitura de settings.json, origem da master key,
decifragem do cofre, versão e plataforma. Também procura `node` e `npx`
no PATH, `designfy.json`, o CSS do Tailwind e o `VIEWSPEC.md` da raiz.
Essas cinco verificações adicionais usam apenas `ok` ou `warn`. Cada linha usa ✓, ! ou ✗.
Em JSON, `data` contém `{ checks, ok }`; cada check tem `name`, `status`
e `detail`. A falta de TTY ou de arquivos ainda não criados gera `warn`.
Uma verificação com `fail` produz exit code 3; as demais retornam 0.
O diagnóstico não cria arquivos nem mostra segredos.

`{{bin}} completion <shell>` imprime o script em stdout. O argument `shell`
aceita `bash`, `zsh` ou `fish`; subcommands, options locais e globais e valores
de enum vêm do registry. Com `--json`, `data` contém `{ shell, script }`.
O script Zsh usa `compdef` e `compadd`, sem `bashcompinit`.
Instale na sessão atual ou acrescente a linha ao arquivo de inicialização:

```bash
eval "$({{bin}} completion bash)"
eval "$({{bin}} completion zsh)"
# fish
{{bin}} completion fish | source
```

`{{bin}} --skill reference` retorna somente a referência gerada, com
commands, arguments, options e exit codes. `skill reference` tem o mesmo
resultado, sem os capítulos da documentação.
