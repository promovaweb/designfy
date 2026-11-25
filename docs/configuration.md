# Configuração e credenciais

Preferências e credenciais do usuário ficam em `~/.{{bin}}/`.

| Arquivo | Conteúdo | Permissão |
| --- | --- | --- |
| `settings.json` | preferências em texto claro | 0600 |
| `credentials.json` | envelope AES-256-GCM com os segredos | 0600 |
| `master.key` | master key em hexadecimal, criada na primeira gravação | 0600 |

A pasta é criada com 0700. A variável `{{BIN}}_HOME` troca a raiz, útil em
testes e CI.

## settings.json

Use notação de ponto para acessar as keys pelo CLI.

| Key | Tipo | Padrão | Função |
| --- | --- | --- | --- |
| `output.format` | `text` ou `json` | `text` | formato padrão da saída do CLI |
| `output.colors` | boolean | `true` | cores ANSI na saída de texto |
| `tui.icons` | `auto`, `nerd`, `unicode` ou `ascii` | `auto` | conjunto de ícones da TUI; `auto` usa `nerd` no Ghostty, no Kitty, no WezTerm e no Omarchy, `ascii` no console Linux e `unicode` nos demais terminais |
| `tui.initialTab` | `overview`, `theme`, `catalog`, `components`, `skills`, `deps`, `mcp`, `viewspecs`, `captures`, `project`, `settings`, `credentials`, `docs` ou `about` | `overview` | tela aberta ao iniciar a TUI. `overview` abre a Home |
| `tui.motion` | boolean | `true` | animações curtas de diálogos e toasts; `false` deixa a interface estática |
| `tui.mouse` | boolean | `true` | mouse na TUI: clique, hover e roda. `false` devolve a seleção de texto ao terminal |
| `tui.theme` | `terminal`, `night` ou `day` | `terminal` | paleta da TUI |
| `skills.source` | string | `promovaweb/designfy` | repositório das skills internas |
| `skills.agents` | string | `universal,claude-code,codex,opencode` | agentes de destino, separados por vírgula |
| `deps.packageManager` | `auto`, `npm`, `pnpm`, `bun` ou `yarn` | `auto` | gerenciador usado na instalação. `auto` usa a configuração do projeto ou o lockfile |
| `capture.viewports` | string | `mobile,desktop` | viewports separados por vírgula |
| `capture.outDir` | string | `.designfy/captures` | pasta das capturas, relativa ao projeto por padrão |
| `telemetry.enabled` | boolean | `false` | reservado para projetos derivados |

Commands:

```bash
{{bin}} config list
{{bin}} config get tui.theme
{{bin}} config set output.format json
{{bin}} config unset telemetry.enabled
{{bin}} config path
{{bin}} config schema
```

Keys fora do schema são aceitas como texto. Para que uma key nova ganhe tipo,
padrão e documentação, acrescente-a a `SETTINGS_SCHEMA` em
`src/config/settings.ts`.

## designfy.json

`init` grava a configuração na raiz do projeto. Quando o arquivo existe,
os campos definidos nele prevalecem sobre os valores detectados. Os caminhos
de projeto e o alias podem ser ajustados no próprio arquivo.

| Campo | Valor |
| --- | --- |
| `schemaVersion` | `1` |
| `framework` | `astro`, `next`, `react-vite`, `react` ou `unknown` |
| `typescript` | Booleano detectado pelo `tsconfig.json` ou pela dependência `typescript` |
| `packageManager` | `bun`, `pnpm`, `yarn` ou `npm`, escolhido pelo lockfile. O padrão é `npm` |
| `tailwind` | Versão maior de `tailwindcss` ou `null` |
| `shadcn` | Booleano que indica a presença de `components.json` |
| `paths.components` | Pasta para os componentes copiados. Padrão `src/components/designfy` |
| `paths.styles` | Pasta para estilos copiados e entrada de busca do tema. Padrão `src/styles` |
| `paths.viewspec` | Pasta das especificações de tela. Padrão `viewspec` |
| `aliases.components` | Alias que substitui `@designfy/components` nos arquivos copiados. Padrão `@/components/designfy` |

## credentials.json

O arquivo guarda um envelope:

```json
{ "version": 1, "algorithm": "aes-256-gcm", "iv": "<base64>", "tag": "<base64>", "data": "<base64>" }
```

`data` é o JSON `{ "name": "value" }` cifrado. Names seguem
`[a-z0-9][a-z0-9_.-]{0,63}`, por exemplo `openai.api_key` ou `github.token`.

A master key tem 32 bytes e vem, nesta ordem:

1. da variável `{{BIN}}_MASTER_KEY` (64 caracteres hexadecimais);
2. do arquivo `master.key`, gerado automaticamente.

Gere uma chave para a variável com `openssl rand -hex 32`. Quando a variável
está definida, `master.key` é ignorado.

Commands:

```bash
{{bin}} credentials set openai.api_key            # digita sem eco
printf '%s' "$TOKEN" | {{bin}} credentials set github.token --stdin
{{bin}} credentials get openai.api_key            # mascarado
{{bin}} credentials get openai.api_key --reveal   # em claro
{{bin}} credentials list
{{bin}} credentials remove github.token
{{bin}} credentials status
{{bin}} credentials clear --yes
```

## O que a cifra protege

A cifra protege o arquivo contra leitura casual, cópia em backup e varredura
do disco por outras ferramentas. Um processo que roda com o mesmo usuário do
sistema consegue ler `master.key` e decifrar o conteúdo. Para um nível acima, injete a
chave por `{{BIN}}_MASTER_KEY` a partir de um gerenciador de segredos e não
grave `master.key` em disco.

## Usar uma credencial no código

```ts
import { getCredential } from "../config/credentials.ts";

const token = getCredential("github.token"); // lança AppError(4) quando não existe
```

O valor fica fora de log, de mensagem de erro, de `data` do `--json` e de
resposta de tool MCP.

## Variáveis de ambiente

| Variável | Efeito |
| --- | --- |
| `{{BIN}}_HOME` | troca `~/.{{bin}}/` por outra pasta |
| `{{BIN}}_MASTER_KEY` | master key em hex; dispensa `master.key` |
| `DESIGNFY_PROJECT` | diretório padrão do projeto para o CLI e o servidor MCP. `--project` tem precedência |
| `DESIGNFY_CATALOG_DIR` | pasta com JSONs de catálogo para substituir os embutidos |
| `DESIGNFY_REGISTRY_FILE` | caminho de um JSON com os registros embutidos `react` e `astro`, incluindo `content` por arquivo |
| `DESIGNFY_E2E` | `1` habilita o teste de captura com Playwright |
| `NO_COLOR` | desliga cores na saída de texto |

## Rotação da master key

| Command ou option | Efeito |
| --- | --- |
| `credentials rotate-key` | Gera chave aleatória, recifra o cofre e grava `master.key` com 0600. |
| `credentials rotate-key --from-env` | Lê a chave atual de `master.key` e usa `{{BIN}}_MASTER_KEY` como chave nova. |

`{{bin}} credentials rotate-key` abre o cofre com a chave atual e preserva
seus valores ao recifrar. A opção `--from-env` exige a chave atual em disco
e uma chave nova de 64 caracteres hexadecimais na variável. A chave nova
também é gravada em `master.key` com 0600. Sem cofre ou chave atual, o command
retorna exit code 4 (`CREDENTIALS`). Em JSON, retorna `{ rotated, source }`,
sem o conteúdo das chaves.

Sem `--from-env`, se a chave anterior veio da variável, remova essa variável
do shell após a rotação: `unset {{BIN}}_MASTER_KEY`. Ela tem prioridade sobre
o arquivo nas próximas execuções. Não execute gravações no cofre durante a
rotação. Os dois arquivos são preparados antes da substituição; falhas de
gravação comuns restauram a chave anterior por substituição atômica. Se essa
restauração também falhar, os arquivos de recuperação ficam na pasta
`.rotate-*` indicada pelo erro; a cópia `previous.key` mantém permissão 0600. Como são dois arquivos, uma
interrupção do processo entre as substituições exige recuperação de backup.
