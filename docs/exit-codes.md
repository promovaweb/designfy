# Exit codes

Zero é sucesso. Cada família de falha tem um número fixo. Scripts e agentes
devem tratar o code antes de interpretar a mensagem.

| Code | Name | Quando |
| --- | --- | --- |
| 0 | `SUCCESS` | operação concluída |
| 1 | `GENERIC_ERROR` | falha inesperada sem classificação |
| 2 | `USAGE` | arguments, options ou subcommand inválidos; também quando o binário roda sem argumentos fora de um TTY |
| 3 | `CONFIG` | settings.json ausente, inválido ou key desconhecida |
| 4 | `CREDENTIALS` | credentials.json ilegível, master key ausente ou credencial não encontrada |
| 5 | `NETWORK_OR_API` | falha de rede, resposta de API fora do esperado ou falha de processo externo |
| 6 | `NOT_FOUND` | recurso solicitado não existe |
| 7 | `PERMISSION` | permissão negada no sistema de arquivos |
| 8 | `NO_TTY` | a TUI exige um terminal interativo |
| 9 | `MCP` | o servidor MCP falhou ao iniciar ou perdeu o transporte |
| 10 | `CHECK_FAILED` | conferência reprovada, por exemplo dependência ausente, contraste insuficiente ou viewspec inválido |
| 130 | `INTERRUPTED` | entrada cancelada ou processo interrompido com Ctrl+C |

A fonte única é `src/app/exit-codes.ts`. A mesma tabela aparece em `--help`,
em `--opencli`, na tool MCP `exit_codes` e na resource `{{bin}}://exit-codes`.

## Em shell

```bash
status=0
{{bin}} deps check --group motion --json > deps-check.json || status=$?
case "$status" in
  0) echo "dependency check passed" ;;
  10) echo "check deps-check.json for missing or outdated packages" ;;
  *) echo "command failed with exit code $status" ;;
esac
```

## No código

```ts
import { error } from "../app/errors.ts";

throw error.network("The API responded 503.", { status: 503 }); // exits with 5
```

Para uma família nova, acrescente a constante e a description em
`src/app/exit-codes.ts` e um atalho em `src/app/errors.ts`. Não reutilize
números.
