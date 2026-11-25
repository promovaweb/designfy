# Modelo: plano da tela

Mostre depois de montar o viewspec. É um resumo para a pessoa conferir em
vinte segundos; o detalhe está no arquivo.

```text
Viewspec {id} · {título} ({kind}, {rota})
Ação principal: {ação}

Regiões, de cima para baixo:
1. {região}: {fragmento do catálogo} ({fonte: designfy, shadcn, reui ou próprio})
2. {região}: {fragmento} ({fonte})
3. ...

Estados previstos: {vazio, carregando, erro, ...}
No celular: {o que empilha, o que vira gaveta, o que some}
Movimento: {entrada}, {rolagem}, {hover}, {troca de estado}
Regras do guia aplicadas: {#id}, {#id}, {#id}
Lacunas: {conteúdo que falta e de quem depende}

Especialistas, na ordem: {lista}
Arquivo: viewspec/{id}-{slug}/VIEWSPEC.md
```

Quando houver duas estruturas plausíveis, mostre as duas lado a lado só nas
linhas que mudam e diga qual é a recomendada e por quê:

```text
Estrutura A (recomendada: {motivo})
  2. {região}: {fragmento}
Estrutura B
  2. {região}: {outro fragmento}
```
