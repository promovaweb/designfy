# Parcel Lab

Exemplo React do registro de componentes de sistema do Designfy. Parcel Lab é
uma operação de remessas fictícia. Os pedidos, a autenticação e os uploads
são simulados em memória.

```sh
npm ci
npm run designfy:sync
npm run build
npm run preview -- --host 127.0.0.1 --port 4373 --strictPort
```

Com o preview em execução, rode `npm run capture` para gerar os PNGs e os
manifestos em `.designfy/captures`. Use `DESIGNFY_CAPTURE_DIR` para escolher
outro destino. A captura usa Chromium. Instale-o com
`npx playwright install chromium` caso ainda não esteja disponível.

| Rota | Demonstração |
| --- | --- |
| `/app` | Indicadores, gráficos, pedidos recentes e histórico |
| `/app/orders` | Filtros, seleção, paginação, edição e exclusão |
| `/app/orders/new` | Formulário com React Hook Form e Zod |
| `/app/orders/import` | Upload simulado e revisão em etapas |
| `/app/orders/PL-1040` | Detalhes, cópia e histórico |
| `/app/settings` | Perfil e salvamento local |
| `/app/settings/notifications` | Preferências de salvamento imediato |
| `/app/settings/workspace` | Alteração com confirmação |
| `/login` | Entrada, cadastro, recuperação e código de verificação |

Em `/app` e `/app/orders`, use `?state=loading`, `?state=empty` ou
`?state=error` para fixar o estado, ou `?latency=1500` para simular o tempo
de resposta em milissegundos. `?mutations=error` simula uma falha de gravação
nos pedidos. Um CSV com `fail` no nome simula uma falha no upload.
`/login?state=error` simula uma rejeição de credenciais.
