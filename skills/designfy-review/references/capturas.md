# Capturas

Como tirar as capturas que a revisão precisa. O comando roda o Playwright
pelo Node do projeto.

## Preparar

```bash
designfy deps install testing
npx playwright install chromium
```

O projeto precisa estar servindo. Prefira o build de produção com o
servidor de prévia (`astro preview`, `vite preview`): é o que a pessoa
vai receber, sem as marcas do modo de desenvolvimento.

## Comando

```bash
designfy capture run <urls...> [--viewport lista] [--theme light|dark] [--fold] [--reduced-motion]
                               [--wait ms] [--selector css] [--out pasta] [--name execução]
```

| Opção | Efeito |
| --- | --- |
| `--viewport` | `mobile` (390 x 844), `tablet` (820 x 1180), `desktop` (1440 x 900), `wide` (1920 x 1080) ou `LARGURAxALTURA`; lista com vírgulas ou a opção repetida |
| `--theme` | define o esquema de cores do navegador |
| `--fold` | só a primeira dobra; sem ela, a página inteira |
| `--reduced-motion` | liga a preferência de movimento reduzido |
| `--wait` | espera extra em milissegundos depois da carga |
| `--selector` | captura só o elemento |
| `--name` | nome da execução (pasta); sem ela, data e hora |
| `--out` | pasta base; padrão `.designfy/captures` |

Saída: `.designfy/captures/<execução>/` com um PNG por URL e largura e o
`manifest.json`. `designfy capture list` mostra as execuções.

Códigos de saída: 0 certo; 10 quando falta o Playwright (com a dica de
instalação); 5 quando a URL não responde.

## Conjunto mínimo de uma revisão

| Execução | Comando | Para ver |
| --- | --- | --- |
| página inteira | `--viewport mobile,tablet,desktop,wide` | layout em cada faixa |
| dobra | `--viewport 320x640,mobile,1280x800,desktop --fold` | o que aparece sem rolar |
| tema escuro | `--viewport mobile,desktop --theme dark` | contraste e bordas no escuro |
| parado | `--viewport mobile,desktop --reduced-motion` | tudo visível sem movimento |

Em projeto com um tema só, a terceira execução não existe.

## Movimento na captura

A captura é feita depois da carga, com as animações de entrada já
terminadas na primeira dobra. Na página inteira, o que entra por
revelação ao rolar pode aparecer no estado inicial:

- a execução `--reduced-motion` mostra o estado final de tudo; use-a para
  julgar o layout abaixo da dobra;
- `--wait 800` dá tempo para animações de carga longas;
- a execução normal serve para conferir a primeira dobra em movimento
  terminado e os laços.

Elemento invisível na captura `--reduced-motion` é defeito: conteúdo
escondido que depende de script ou de animação.

## Estados

A captura pega a página como ela carrega. Para os outros estados:

| Estado | Como capturar |
| --- | --- |
| carregando | parâmetro de desenvolvimento que segura a resposta (`?estado=carregando`) |
| vazio | filtro sem resultado na URL, ou conta de teste vazia |
| erro | parâmetro que força a falha |
| formulário com erro | rota de exemplo com os erros renderizados |
| menu, gaveta, diálogo abertos | parâmetro que abre ao carregar, só em desenvolvimento |
| hover e foco | recorte do componente numa página de exemplo com as variações lado a lado |

Com o servidor MCP do Playwright (`designfy mcp setup playwright`), o
agente navega, clica, preenche e captura depois da interação.

## Recortes

```bash
designfy capture run <url> --selector "header" --viewport mobile,desktop --name cabecalho
designfy capture run <url> --selector "[data-region=tabela]" --viewport mobile --name tabela-celular
```

Recorte serve para olhar um componente de perto e para o antes e depois
de um ajuste pontual.

## Nomes de execução

`<slug-da-tela>-r<rodada>[-variação]`: `precos-r1`, `precos-r1-escuro`,
`precos-r2`. Em redesenho: `<slug>-antes` e `<slug>-depois`. Nome
repetido não sobrescreve: a execução falha e pede outro nome.

## Várias páginas

```bash
designfy capture run http://localhost:4321/ http://localhost:4321/precos/ http://localhost:4321/blog/ \
  --viewport mobile,desktop --name site-r1
```

Para o site inteiro, gere a lista de URLs do mapa do site do projeto.

## Guardar ou não

`.designfy/captures/` é material de trabalho. O padrão é deixar fora do
Git (`.gitignore`) e registrar no viewspec só o nome da execução. Projeto
que quer histórico visual guarda as execuções finais.

## Quando a captura falha

| Sintoma | Causa | O que fazer |
| --- | --- | --- |
| saída 10 | Playwright ausente | `designfy deps install testing` e `npx playwright install chromium` |
| saída 5 | URL não responde | subir o servidor; conferir porta e barra final da rota |
| imagem em branco | página depende de script que falhou | ler `consoleErrors` e `pageErrors` no manifesto |
| fontes erradas | fonte não carregou a tempo | `--wait 500`; conferir se a fonte está no projeto |
| página cortada | altura fixa ou rolagem interna | capturar o contêiner com `--selector` |
| tema escuro igual ao claro | o projeto só troca por classe salva | respeitar `prefers-color-scheme` quando não há escolha salva |
