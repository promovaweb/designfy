# Modelo: pedido ao revisor independente

Para passar a revisão a um agente que não participou da construção. Ele
recebe caminhos de arquivo e este pedido, sem a conversa anterior.

```text
Você vai revisar uma interface que não construiu. Seu trabalho é achar
defeitos, não confirmar que está boa. Não edite nenhum arquivo.

Leia, nesta ordem:
1. {caminho}/VIEWSPEC.md (guia do projeto): as regras que valem para todas as telas.
2. {caminho}/viewspec/{id}-{slug}/VIEWSPEC.md: o que esta tela deve ser.
3. As referências da skill designfy-review em {caminho da skill}/references/:
   leitura-das-imagens.md, revisao-por-tipo.md, lista-de-acabamento.md e
   gravidade-e-encaminhamento.md.

Depois abra cada arquivo destas execuções de captura, um por um:
- {caminho}/.designfy/captures/{slug}-r1/ (manifest.json e os PNG)
- {caminho}/.designfy/captures/{slug}-r1-dobra/
- {caminho}/.designfy/captures/{slug}-r1-escuro/
- {caminho}/.designfy/captures/{slug}-r1-parado/

Faça, nesta ordem:
1. Leia cada manifest.json e anote estouro horizontal e erros.
2. Examine as imagens: celular primeiro, depois desktop, tablet, tela
   larga, tema escuro e movimento reduzido.
3. Confira cada linha das seções Estrutura, Estados, Responsivo e
   Movimento do viewspec contra o que as imagens mostram.
4. Passe a lista do tipo de tela ({kind}) e a lista de acabamento.
5. Procure os vícios de página gerada.

Entregue um relatório em Markdown em {caminho do relatório}, no formato:
- veredito (aprovada, aprovada com ressalvas ou reprovada) com uma frase;
- achados numerados, cada um com: gravidade (alta, média, baixa), captura
  e posição, o que você vê, a regra ferida (viewspec, guia com o
  identificador, ou lista) e a especialista dona;
- o que está bom e deve ser mantido, em até três linhas;
- o que só a pessoa responsável pelo projeto pode responder.

Regras:
- Descreva o que está na imagem. Não suponha o que o código faz.
- Um achado por causa.
- Sem nota e sem percentual.
- Se uma imagem não abrir ou estiver em branco, diga qual e pare nesse
  ponto, em vez de revisar pelo código.
- Não elogie por educação. Se não achou defeito numa imagem, diga que
  olhou e o que conferiu.
```

## Como usar

- Preencha os caminhos e o `kind`.
- Em ambiente com subagentes, abra o revisor numa sessão nova. Em
  ambiente do Hub da Promovaweb, o revisor é um agente Codex ou OpenCode
  numa aba própria.
- Leia o relatório, corrija com as especialistas donas e capture de novo.
- A conferência das correções é de quem construiu, imagem por imagem; o
  revisor volta só quando o veredito foi "reprovada".
