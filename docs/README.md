# Documentação do {{title}}

O {{title}} prepara projetos web para trabalhar com um design system
Tailwind. O binário detecta o projeto, consulta catálogos de interface,
skills e dependências, copia componentes React e Astro, gera paletas,
confere temas e viewspecs e organiza capturas com Playwright.

O mesmo executável oferece três modos.

| Modo | Como entrar | Para quem |
| --- | --- | --- |
| TUI | `{{bin}}` sem argumentos em um terminal interativo | pessoas |
| CLI | `{{bin}} <command> [options]`, com saída em texto ou `--json` | pessoas, scripts e agentes |
| MCP | `{{bin}} mcp`, servidor Model Context Protocol via stdio | agentes de IA |

Os três modos compartilham a mesma identidade (`src/app/manifest.ts`), a
mesma configuração (`~/.{{bin}}/settings.json`), o mesmo cofre de credenciais
(`~/.{{bin}}/credentials.json`, cifrado) e a mesma tabela de exit codes.

## Arquivos do projeto

| Caminho | Conteúdo |
| --- | --- |
| `designfy.json` | Framework, gerenciador de pacotes e caminhos usados pelo binário. `init` grava o arquivo na raiz do projeto. |
| `VIEWSPEC.md` | Guia de interface da raiz, com regras e aprendizados que valem para as telas. |
| `viewspec/<id>-<slug>/VIEWSPEC.md` | Especificação e checklist de uma tela. O CLI e o MCP leem esses arquivos. |
| `.designfy/captures/<run>/` | Imagens e `manifest.json` de uma execução do Playwright. |

## Mapa

- Commands, options e formatos de saída. [CLI](cli.md)
- Contrato do guia e das telas. [Viewspec](viewspec.md)
- Abas, teclas e tema. [TUI](tui.md)
- Tools, resources, prompts e configuração nos clientes. [MCP](mcp.md)
- Preferências, arquivos do projeto, cofre e variáveis de ambiente. [Configuração](configuration.md)
- Códigos de processo e tratamento em scripts. [Exit codes](exit-codes.md)
- Pastas, camadas e fluxo de execução. [Arquitetura](architecture.md)
- Personalização do starter kit. [Template](customize-template.md)
- Changelog, tags e binários. [Releases](release.md)
- Descrição gerada por `bun run opencli`. [OpenCLI](opencli.json)

## Documentação embutida

O manual de uso, a arquitetura e o contrato de viewspec vêm embutidos.
Leia a documentação com o binário instalado, sem precisar do repositório.

```bash
{{bin}} --skill          # tudo
{{bin}} --skill cli      # só a seção do CLI, com a referência gerada
{{bin}} --skill mcp --json
```

Os tópicos aceitos são `cli`, `tui`, `mcp`, `config`, `exit-codes` e
`reference`. O topic `reference` contém somente a referência gerada do
registry, com commands, options e exit codes.

## Idioma

O código, os nomes de commands, options, keys de configuração, campos do
`--json` e as mensagens do binário são em inglês. Esta documentação e as
skills do framework são em português do Brasil, com os termos técnicos
preservados em inglês.
