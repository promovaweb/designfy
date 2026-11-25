# Fieldnote em Astro

O exemplo usa dados fictícios para apresentar os componentes de site do Designfy. A página inicial mostra o workspace, a página `/landing/` exercita a validação do formulário e `/pricing/` reúne os planos, a comparação e as perguntas.

Rode a partir desta pasta.

```sh
bun install
bun run designfy:sync
bun run build
bun run preview
```

Em outro terminal, execute `bun run capture --theme dark` para capturar as três páginas nas larguras de 390 e 1440 px. A opção `--reduced-motion` ativa a preferência de movimento reduzido.

## Tema

Coloque o script inline de [Layout.astro](src/Layout.astro) no início do `<head>`, antes de carregar o CSS. Ele lê a preferência `designfy-theme` e, quando a pessoa escolhe o modo de sistema ou visita o site pela primeira vez, usa `prefers-color-scheme`. O componente `ThemeToggle` usa a mesma chave para aplicar a escolha e manter os controles sincronizados.

O layout também chama `initDesignfyMotion()` para iniciar as revelações e pausar animações fora da área visível. Com navegação via Astro, repete a chamada no evento `astro:page-load`.

## Formulário

O exemplo deixa `endpoint` vazio para demonstrar a mensagem de formulário desconectado. Para receber inscrições, forneça uma URL que aceite o campo `email` em um POST codificado como formulário. O componente só exibe a confirmação depois de uma resposta HTTP bem-sucedida.

O CSS de entrada aponta `@source` para a pasta ignorada onde o CLI instala os componentes. Isso inclui os utilitários do registro no build do Tailwind.
