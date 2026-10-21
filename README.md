# Horologia — Avaliador de raridade de relógios

Aplicativo web (PWA) para catalogar relógios, dar uma **nota de raridade de 0 a 100** e compartilhar a ficha. Funciona no celular e no computador, e pode ser instalado na tela inicial.

## Como abrir

- **Online:** [bryanfracalossi-prog.github.io/horologia](https://bryanfracalossi-prog.github.io/horologia/)
- **Código-fonte:** [github.com/bryanfracalossi-prog/horologia](https://github.com/bryanfracalossi-prog/horologia)
- **No seu computador:** execute `serve.ps1` (PowerShell) e abra `http://localhost:8080`.
- **Sem internet:** depois de abrir uma vez, o app funciona offline pelo cache do navegador.

> Os dados ficam **somente no aparelho** (localStorage do navegador). Cada celular/PC tem seu próprio catálogo.

## Avaliação assistida (para quem não é especialista)

Na tela de cadastro, toque em **“Avaliação assistida”**. Há dois caminhos:

### 1. Sugestão por marca e referência (offline)
Digite a marca e o modelo ou a referência. O app procura o modelo numa base offline com dezenas de relógios comuns e mostra:

- uma estimativa das notas de **originalidade, condição, variações e procedência**;
- a nota final e a classificação;
- dados de referência (anos, movimento e produção estimada);
- o que conferir na peça antes de fechar negócio.

Funciona sem internet e sem chave. A condição começa como “média” e deve ser ajustada conforme a peça real. Se o modelo não estiver na base, use as perguntas simples ou avalie manualmente.

### 2. Perguntas simples (sempre funciona)
Seis perguntas em linguagem fácil, com 5 ou 6 opções cada, sobre mostrador, caixa, estado geral, funcionamento, variações e procedência. O app calcula uma sugestão de nota, mostra o que mais pesou e permite aplicar direto na ficha.

**Importante:** a sugestão é uma estimativa para o modelo, não um laudo da peça. Confirme referência, originalidade e procedência antes de negociar.

## Top 100

A segunda aba, **Top 100**, mostra uma lista editorial dos 100 relógios mais raros da curadoria do app. Cada posição tem nota de 0 a 100, marca, modelo, referência, ano e uma explicação curta. Toque em um item para abrir os detalhes e use **“Usar como base para avaliar uma peça”** para levar marca, modelo, referência e ano direto ao formulário.

A lista fica em `ranking.js`. Ela é uma curadoria para conversar e aprender, não um preço, laudo ou ranking oficial de mercado.

## Histórias

A terceira aba, **Histórias**, reúne 24 relógios icônicos com textos curtos, linha do tempo e arte própria. Exemplos: Cartier Santos-Dumont, Casio F-91W, Rolex Submariner, Omega Speedmaster e Seiko Pogue.

Em cada relógio do seu catálogo, você também pode registrar a **sua história pessoal**: como comprou, ganhou ou herdou a peça, quando, onde, com quem e outros detalhes. É possível anexar até 3 fotos. A história pessoal fica salva no aparelho e **não é incluída no link público** nem na ficha baixada.

## Horários

A quarta aba, **Horários**, mostra o horário de Brasília e mais 13 fusos (Buenos Aires, Nova York, Los Angeles, Cidade do México, Lisboa, Londres, Paris, Zurique, Dubai, Tóquio, Hong Kong, Sydney e Auckland). Toque em um cartão para ver o país no relógio grande.

O bloco **Ajuste do relógio** tem um modo de acerto com segundos e instruções para relógios analógicos e digitais. O horário vem do relógio do seu aparelho e das regras de fuso do navegador. Para maior precisão, mantenha o celular sincronizado com a rede; o app não é um sinal oficial de tempo.

## Check-up de autenticidade

O **Check-up de autenticidade** fica no menu **⋯**, no formulário e na ficha da peça. Ele oferece:

- pontos específicos do modelo quando ele está na base offline;
- um roteiro de 10 itens para conferir mostrador, ponteiros, caixa, coroa, bisel, bracelete, movimento, vidro, documentos e vendedor;
- sinais de alerta e uma lista do que fazer antes de comprar;
- um espaço para fotos de inspeção, que ficam só na sessão e não são enviadas nem salvas.

O check-up é um apoio à inspeção visual. Ele **não confirma autenticidade, não dá nota, não emite laudo e não substitui um relojoeiro ou especialista**.

## Como a nota é calculada

Cada critério recebe nota de 0 a 5 e tem um peso:

| Critério | Peso |
| --- | --- |
| Originalidade | 35% |
| Condição | 30% |
| Variações / dial errors | 20% |
| Procedência / histórico | 15% |

Classificação: 0–19 Comum · 20–39 Incomum · 40–59 Raro · 60–79 Muito raro · 80–100 Excepcional.

## Compartilhar

Na ficha, toque em **Compartilhar**:

- **Link público** — leva a ficha completa (foto, nota e critérios) para quem receber. Não inclui preço, cliente, dados de negociação nem a sua história pessoal. Links com foto podem ficar longos; se ficarem grandes demais, o app remove a foto do link.
- **Baixar ficha (.html)** — arquivo único que abre em qualquer celular, mesmo sem internet. Boa opção para enviar por WhatsApp.
- **Imprimir laudo** — gera PDF pela impressão do navegador.

Quem recebe o link pode tocar em **“Salvar na minha coleção”** para copiar a ficha.

## Backup

Menu **⋯** → **Exportar backup (.json)**. Guarde o arquivo; para restaurar, use **Importar backup**. O backup inclui fotos e dados de negociação.

## Arquivos

- `index.html` — telas, formulário e diálogos.
- `styles.css` — tema amarelo claro dourado, fundo decorativo com relógios, layout responsivo e impressão.
- `reference.js` — base offline de modelos e notas estimadas.
- `ranking.js` — os 100 relógios da aba Top 100.
- `history.js` — relógios históricos e histórias pessoais.
- `time.js` — fusos, relógio analógico e modo de acerto.
- `auth.js` — check-up de autenticidade, dicas do modelo e fotos de inspeção.
- `app.js` — catálogo, notas, compartilhamento, avaliação assistida e Top 100.
- `sw.js` / `manifest.webmanifest` — funcionamento offline e instalação como app.
- `serve.ps1` — servidor local simples (porta 8080).
- `tools/mobile-preview.html` — prévia em moldura de celular (uso interno).
- `tools/mobile-top100.html` — prévia do Top 100 em moldura de celular (uso interno).

## Próximo passo (catálogo público de verdade)

Hoje o compartilhamento é por link e cada aparelho tem seu catálogo. Para um catálogo público único — com peças de várias pessoas, busca, curtidas e moderação — é preciso **hospedagem fixa + banco de dados** (por exemplo, Cloudflare Pages + Supabase, no plano gratuito).
