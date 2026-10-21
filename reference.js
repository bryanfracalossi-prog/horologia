'use strict';

/* ============================================================
   Horologia — base offline de modelos
   Notas estimadas por modelo. Ordem:
   [produção, originalidade, condição (média), demanda, variações, procedência]
   A condição começa em 3 (média) e deve ser ajustada pelo dono da peça.
   ============================================================ */

const REFERENCE = [
  { marca: 'Rolex', modelo: 'Submariner 5512 / 5513', refs: ['5512', '5513'], anos: '1959–1989', movimento: 'Cal. 1520 / 1530 automático', producao: 'Produção alta para a época; muitos exemplares sobreviveram.', scores: [1, 3, 3, 4, 3, 2],
    dicas: ['Compare a referência gravada entre as alças com o modelo.', 'Mostrador, ponteiros e insert do bisel precisam ser coerentes com a época.', 'Polimento forte na caixa e peças de reposição derrubam a nota.'],
    aviso: 'É um dos modelos mais falsificados e remontados. Confirme com especialista antes de negociar.' },
  { marca: 'Rolex', modelo: 'Submariner 14060 / 14060M', refs: ['14060', '14060M'], anos: '1990–2012', movimento: 'Cal. 3000 / 3130 automático', producao: 'Produção alta; ainda há muitos exemplares no mercado.', scores: [1, 3, 3, 4, 1, 1],
    dicas: ['Confira se o mostrador e os ponteiros são da versão sem data.', 'Veja o estado do insert do bisel e da coroa.', 'Caixa muito polida perde valor.'] },
  { marca: 'Rolex', modelo: 'Submariner 16610', refs: ['16610'], anos: '1988–2010', movimento: 'Cal. 3135 automático', producao: 'Produção alta.', scores: [1, 3, 3, 4, 1, 1],
    dicas: ['Verifique a luneta e o insert originais.', 'O mostrador deve ter a marcação correta para a época.', 'Peças de reposição e polimento reduzem a nota.'] },
  { marca: 'Rolex', modelo: 'Submariner 116610 / 126610', refs: ['116610', '126610'], anos: '2010 em diante', movimento: 'Cal. 3135 / 3235 automático', producao: 'Produção atual em grande volume.', scores: [1, 3, 3, 4, 1, 1],
    dicas: ['Confira caixa, pulseira e fecho originais.', 'Modelos recentes costumam ter muitos exemplares disponíveis.', 'Nota fiscal e garantia ajudam na procedência.'] },
  { marca: 'Rolex', modelo: 'GMT-Master 1675', refs: ['1675'], anos: '1959–1980', movimento: 'Cal. 1565 / 1575 automático', producao: 'Produção alta, com muitas variantes de mostrador e bisel.', scores: [2, 3, 3, 4, 4, 2],
    dicas: ['Identifique a variante do mostrador e o tipo de bisel.', 'Ponteiros e insert devem combinar com o ano da peça.', 'Muitos exemplares têm peças trocadas ao longo da vida.'],
    aviso: 'As variações de mostrador mudam muito o valor. Pesquise a versão exata antes de comprar.' },
  { marca: 'Rolex', modelo: 'GMT-Master II 16710', refs: ['16710'], anos: '1989–2007', movimento: 'Cal. 3185 automático', producao: 'Produção alta; inserts e mostradores variam.', scores: [1, 3, 3, 4, 3, 1],
    dicas: ['Confira o insert (preto, vermelho e azul ou todo preto).', 'Veja se o mostrador e os ponteiros são originais.', 'Caixa e fecho muito polidos reduzem a nota.'] },
  { marca: 'Rolex', modelo: 'Daytona 6263 / 6265', refs: ['6263', '6265'], anos: '1971–1988', movimento: 'Cal. 727 manual', producao: 'Tiragem menor que os Daytona de série atuais.', scores: [3, 3, 3, 4, 4, 3],
    dicas: ['Mostrador, ponteiros e botões precisam ser da época.', 'Confira a gravação da referência e o número de série.', 'Restauros e peças novas são comuns e mudam o valor.'],
    aviso: 'Modelo de alto valor e muito visado por falsificações. Só avalie com especialista.' },
  { marca: 'Rolex', modelo: 'Daytona 116520', refs: ['116520'], anos: '2000–2016', movimento: 'Cal. 4130 automático', producao: 'Produção alta e muita procura.', scores: [1, 3, 3, 4, 1, 1],
    dicas: ['Confira mostrador, bezel e pulseira originais.', 'Veja o estado do fecho e dos botões.', 'Documentos e caixa aumentam a procedência.'] },
  { marca: 'Rolex', modelo: 'Datejust 1601 / 1603', refs: ['1601', '1603'], anos: '1959–1977', movimento: 'Cal. 1565 / 1575 automático', producao: 'Produção muito alta.', scores: [1, 2, 3, 3, 2, 1],
    dicas: ['Veja se o mostrador é original e combina com a época.', 'Confira o estado do bracelete e da coroa.', 'Datejust é comum; o valor está na originalidade.'] },
  { marca: 'Rolex', modelo: 'Datejust 16233 / 16234', refs: ['16233', '16234'], anos: '1988–2005', movimento: 'Cal. 3135 automático', producao: 'Produção muito alta.', scores: [1, 2, 3, 3, 1, 1],
    dicas: ['Confira mostrador, bezel e bracelete.', 'Modelos em aço e ouro têm versões e pulseiras diferentes.', 'Polimento e peças trocadas reduzem a nota.'] },
  { marca: 'Rolex', modelo: 'Explorer 1016', refs: ['1016'], anos: '1963–1989', movimento: 'Cal. 1570 automático', producao: 'Produção alta para um modelo de nicho.', scores: [2, 3, 3, 4, 3, 2],
    dicas: ['Mostrador e ponteiros são o ponto mais sensível.', 'Confira se a caixa mantém as proporções originais.', 'Peças de reposição e mostrador repintado derrubam a nota.'] },
  { marca: 'Rolex', modelo: 'Explorer 14270', refs: ['14270'], anos: '1989–2001', movimento: 'Cal. 3000 automático', producao: 'Produção alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros originais.', 'Veja o estado do bracelete e da caixa.', 'Documentos ajudam, mas não são comuns nesse modelo.'] },
  { marca: 'Rolex', modelo: 'Day-Date 1803 / 18038', refs: ['1803', '18038'], anos: '1959–1988', movimento: 'Cal. 1556 / 3055 automático', producao: 'Produção alta em ouro.', scores: [1, 2, 3, 3, 2, 1],
    dicas: ['Confira o estado do ouro e do bracelete.', 'Mostrador e dia da semana precisam estar coerentes.', 'Peças de ouro são muito visadas por reciclagem e troca de peças.'] },
  { marca: 'Rolex', modelo: 'Sea-Dweller 16600', refs: ['16600'], anos: '1988–2009', movimento: 'Cal. 3135 automático', producao: 'Produção menor que a do Submariner.', scores: [2, 3, 3, 4, 1, 1],
    dicas: ['Confira a válvula de hélio e o mostrador.', 'Veja se o insert e os ponteiros são originais.', 'Caixa polida em excesso reduz a nota.'] },

  { marca: 'Omega', modelo: 'Speedmaster 145.012', refs: ['145.012'], anos: '1967–1968', movimento: 'Cal. 321 manual', producao: 'Produção limitada ao período; menos exemplares que as versões modernas.', scores: [2, 3, 3, 4, 3, 2],
    dicas: ['Confira o movimento 321 e o mostrador step dial.', 'Ponteiros, bezel e caixa precisam ser da época.', 'Restauros e peças trocadas mudam muito o valor.'],
    aviso: 'Modelo muito visado por colecionadores. Confirme o movimento e a originalidade com especialista.' },
  { marca: 'Omega', modelo: 'Speedmaster Professional 3570.50', refs: ['3570.50', '357050'], anos: '1996–2014', movimento: 'Cal. 1861 manual', producao: 'Produção alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira mostrador, bezel e fundo do estojo.', 'Veja se a caixa e os papéis acompanham a peça.', 'É um modelo comum; o estado é o que mais pesa.'] },
  { marca: 'Omega', modelo: 'Seamaster 300 165.024', refs: ['165.024'], anos: '1964–1969', movimento: 'Cal. 552 automático', producao: 'Produção média para a época.', scores: [2, 3, 3, 4, 3, 2],
    dicas: ['Confira o mostrador e os ponteiros de mergulho.', 'Veja o insert do bisel e a coroa.', 'Muitos exemplares tiveram mostrador e ponteiros trocados.'] },
  { marca: 'Omega', modelo: 'Seamaster Professional 2531.80', refs: ['2531.80', '253180'], anos: '1993–2005', movimento: 'Cal. 1120 automático', producao: 'Produção muito alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o mostrador azul e o bisel.', 'Veja o estado do bracelete e do fecho.', 'Peças de reposição são comuns e aceitáveis, mas reduzem a nota.'] },
  { marca: 'Omega', modelo: 'Constellation 168.005', refs: ['168.005'], anos: '1960s', movimento: 'Cal. 561 automático', producao: 'Produção alta.', scores: [1, 2, 3, 3, 3, 1],
    dicas: ['Confira o mostrador pie-pan e as patas da caixa.', 'Veja se o bracelete é original e está completo.', 'A originalidade do mostrador é o ponto mais importante.'] },
  { marca: 'Omega', modelo: 'Planet Ocean 2200.50', refs: ['2200.50', '220050'], anos: '2005 em diante', movimento: 'Cal. 2500 automático', producao: 'Produção alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o bisel e o mostrador.', 'Veja o estado da caixa e do bracelete.', 'Documentos e caixa ajudam na revenda.'] },

  { marca: 'Tudor', modelo: 'Submariner 7928', refs: ['7928'], anos: '1959–1968', movimento: 'Cal. 390 automático', producao: 'Produção média; menos exemplares que o Rolex.', scores: [2, 3, 3, 3, 2, 1],
    dicas: ['Confira mostrador, ponteiros e coroa.', 'Veja se o insert do bisel é original.', 'Muitos exemplares têm peças de Rolex ou reposição.'] },
  { marca: 'Tudor', modelo: 'Black Bay 79220 / 79230', refs: ['79220', '79230'], anos: '2012 em diante', movimento: 'ETA 2824 / MT5602 automático', producao: 'Produção alta.', scores: [1, 3, 3, 3, 2, 1],
    dicas: ['Confira a versão do mostrador e o bisel.', 'Veja se a pulseira e o fecho são originais.', 'Modelos recentes têm muitos exemplares no mercado.'] },
  { marca: 'Tudor', modelo: 'Pelagos 25500', refs: ['25500'], anos: '2012 em diante', movimento: 'Cal. MT5612 automático', producao: 'Produção alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o estado da caixa de titânio.', 'Veja o fecho e a pulseira originais.', 'É um modelo de uso; marcas de uso são esperadas.'] },

  { marca: 'Patek Philippe', alias: ['Patek'], modelo: 'Nautilus 5711/1A', refs: ['5711'], anos: '2006–2021', movimento: 'Cal. 324 S C automático', producao: 'Produção controlada, mas não minúscula; procura excepcional.', scores: [1, 3, 3, 5, 1, 2],
    dicas: ['Confira mostrador, bracelete e fecho.', 'Veja se a caixa mantém as linhas originais.', 'Documentos e caixa têm peso grande na procedência.'] },
  { marca: 'Patek Philippe', alias: ['Patek'], modelo: 'Nautilus 3700/1', refs: ['3700'], anos: '1976–1981', movimento: 'Cal. 28-255 C automático', producao: 'Tiragem menor e muitos exemplares alterados.', scores: [3, 3, 3, 5, 3, 3],
    dicas: ['Confira mostrador, bracelete e coroa.', 'Veja se o número de série e a referência conferem.', 'Restauros e peças novas são comuns.'],
    aviso: 'Peça de altíssimo valor. A avaliação exige especialista e documentos.' },
  { marca: 'Patek Philippe', alias: ['Patek'], modelo: 'Calatrava 3919', refs: ['3919'], anos: '1985–2005', movimento: 'Cal. 215 manual', producao: 'Produção alta para a marca.', scores: [1, 2, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja o estado da caixa e da coroa.', 'Caixa e papéis ajudam na procedência.'] },

  { marca: 'Audemars Piguet', alias: ['AP', 'Audemars'], modelo: 'Royal Oak 15202', refs: ['15202'], anos: '1972 em diante', movimento: 'Cal. 2121 automático', producao: 'Produção controlada.', scores: [2, 3, 3, 4, 2, 2],
    dicas: ['Confira o mostrador e o bracelete integrado.', 'Veja se a caixa mantém as arestas originais.', 'Polimento forte descaracteriza o modelo.'] },
  { marca: 'Audemars Piguet', alias: ['AP', 'Audemars'], modelo: 'Royal Oak 15400', refs: ['15400'], anos: '2012–2018', movimento: 'Cal. 3120 automático', producao: 'Produção alta para a marca.', scores: [1, 3, 3, 4, 1, 1],
    dicas: ['Confira mostrador, bracelete e fecho.', 'Veja o estado da caixa e dos parafusos.', 'Documentos e caixa aumentam a nota.'] },
  { marca: 'Audemars Piguet', alias: ['AP', 'Audemars'], modelo: 'Royal Oak Offshore 25721', refs: ['25721'], anos: '1993 em diante', movimento: 'Cal. 2226 / 3126 automático', producao: 'Produção alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e os botões do cronógrafo.', 'Veja o estado da caixa e da pulseira de borracha.', 'Peças de reposição são comuns.'] },

  { marca: 'Vacheron Constantin', alias: ['Vacheron', 'VC'], modelo: 'Overseas 4500V', refs: ['4500V'], anos: '2016 em diante', movimento: 'Cal. 5100 automático', producao: 'Produção alta para a marca.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira mostrador e bracelete integrado.', 'Veja se as pulseiras extras acompanham a peça.', 'Documentos e caixa ajudam na revenda.'] },
  { marca: 'Vacheron Constantin', alias: ['Vacheron', 'VC'], modelo: 'Patrimony', refs: [], anos: '2004 em diante', movimento: 'Cal. 2450 manual', producao: 'Produção média.', scores: [1, 2, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja o estado da caixa e da coroa.', 'Modelos clássicos dependem da originalidade.'] },

  { marca: 'Cartier', modelo: 'Santos de Cartier', refs: [], anos: '2018 em diante', movimento: 'Cal. 1847 MC automático', producao: 'Produção alta.', scores: [1, 2, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e o bracelete.', 'Veja se o sistema de troca rápida está completo.', 'Documentos e caixa ajudam na procedência.'] },
  { marca: 'Cartier', modelo: 'Tank Must', refs: [], anos: '2021 em diante', movimento: 'Quartzo', producao: 'Produção alta.', scores: [1, 2, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e a caixa.', 'Veja o estado da pulseira e do fecho.', 'É um modelo comum; o estado é o que mais pesa.'] },
  { marca: 'Cartier', modelo: 'Tank Louis Cartier', refs: [], anos: '1922 em diante', movimento: 'Cal. 430 MC manual', producao: 'Produção menor que a do Tank Must.', scores: [2, 3, 3, 3, 2, 1],
    dicas: ['Confira as proporções da caixa e o mostrador.', 'Veja se os ponteiros e a coroa são originais.', 'Restauros e repintura derrubam a nota.'] },
  { marca: 'Cartier', modelo: 'Pasha de Cartier', refs: [], anos: '1985 em diante', movimento: 'Cal. 1847 MC automático', producao: 'Produção alta.', scores: [1, 2, 3, 3, 1, 1],
    dicas: ['Confira a coroa e a tampa protetora.', 'Veja o estado do bracelete.', 'Modelos de quartzo e automáticos têm valores diferentes.'] },

  { marca: 'Jaeger-LeCoultre', alias: ['JLC', 'Jaeger'], modelo: 'Reverso Classic', refs: [], anos: '1931 em diante', movimento: 'Cal. 822 manual', producao: 'Produção alta.', scores: [1, 2, 3, 3, 2, 1],
    dicas: ['Confira o mecanismo de reversão e a caixa.', 'Veja se o mostrador é original.', 'Gravações no fundo podem ser originais ou personalizadas.'] },
  { marca: 'Jaeger-LeCoultre', alias: ['JLC', 'Jaeger'], modelo: 'Memovox', refs: [], anos: '1950 em diante', movimento: 'Cal. 956 automático', producao: 'Produção média.', scores: [2, 2, 3, 3, 2, 2],
    dicas: ['Confira o funcionamento do alarme.', 'Veja o mostrador e os ponteiros.', 'Peças do alarme são sensíveis e caras de reparar.'] },

  { marca: 'Breitling', modelo: 'Navitimer 806', refs: ['806'], anos: '1959–1970s', movimento: 'Cal. 178 manual', producao: 'Produção média para a época.', scores: [2, 3, 3, 4, 3, 2],
    dicas: ['Confira o mostrador e a escala do bisel.', 'Veja se o movimento é o correto para a versão.', 'Mostradores repintados são comuns.'] },
  { marca: 'Breitling', modelo: 'Navitimer moderno', refs: [], anos: '1990s em diante', movimento: 'Cal. B01 / ETA automático', producao: 'Produção alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e o bisel.', 'Veja se a caixa e os papéis acompanham a peça.', 'Modelos recentes têm muitos exemplares.'] },
  { marca: 'Breitling', modelo: 'Chronomat', refs: [], anos: '1984 em diante', movimento: 'Cal. B01 / ETA automático', producao: 'Produção alta.', scores: [1, 2, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja o estado do bracelete.', 'Peças de reposição são comuns.'] },

  { marca: 'IWC', modelo: 'Portugieser 3714', refs: ['3714'], anos: '1998 em diante', movimento: 'Cal. 79350 automático', producao: 'Produção alta.', scores: [1, 3, 3, 3, 2, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja se a caixa e os papéis acompanham.', 'Modelos com mostrador azul ou prata têm procura diferente.'] },
  { marca: 'IWC', modelo: 'Big Pilot 5002 / 5004', refs: ['5002', '5004'], anos: '2002 em diante', movimento: 'Cal. 50110 / 51110 automático', producao: 'Produção média.', scores: [1, 3, 3, 4, 2, 1],
    dicas: ['Confira a coroa e o mostrador.', 'Veja o estado da caixa e da pulseira.', 'Modelos com papéis e caixa valem mais.'] },
  { marca: 'IWC', modelo: 'Mark XVIII', refs: ['IW3270'], anos: '2016 em diante', movimento: 'Cal. 35111 automático', producao: 'Produção alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja o estado da caixa e da pulseira.', 'Documentos ajudam na revenda.'] },

  { marca: 'Panerai', modelo: 'Luminor PAM 111', refs: ['PAM111', '111'], anos: '2002 em diante', movimento: 'Cal. OP XI manual', producao: 'Produção alta.', scores: [1, 3, 3, 4, 2, 1],
    dicas: ['Confira o mostrador e a proteção da coroa.', 'Veja se a caixa e os papéis acompanham.', 'Modelos base têm muitos exemplares.'] },
  { marca: 'Panerai', modelo: 'Radiomir PAM 210', refs: ['PAM210', '210'], anos: '2005 em diante', movimento: 'Cal. OP X manual', producao: 'Produção média.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja o estado da caixa e da coroa.', 'Pulseiras originais ajudam na nota.'] },

  { marca: 'TAG Heuer', alias: ['Tag Heuer', 'Heuer'], modelo: 'Carrera 2447', refs: ['2447'], anos: '1963–1970s', movimento: 'Cal. Valjoux 72 manual', producao: 'Produção média; muitos exemplares restaurados.', scores: [2, 3, 3, 4, 3, 2],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja se o movimento é o correto para a versão.', 'Restauros e mostradores repintados são comuns.'] },
  { marca: 'TAG Heuer', alias: ['Tag Heuer', 'Heuer'], modelo: 'Monaco 1133', refs: ['1133'], anos: '1969–1970s', movimento: 'Cal. 11 automático', producao: 'Produção média.', scores: [3, 3, 3, 4, 4, 2],
    dicas: ['Confira a caixa quadrada e o mostrador.', 'Veja se o movimento automático está funcionando.', 'Peças de reposição são difíceis de encontrar.'] },
  { marca: 'TAG Heuer', alias: ['Tag Heuer', 'Heuer'], modelo: 'Carrera / Aquaracer moderno', refs: [], anos: '2000s em diante', movimento: 'Cal. 5 / 16 automático', producao: 'Produção muito alta.', scores: [1, 3, 3, 2, 1, 1],
    dicas: ['Confira o mostrador e o bisel.', 'Veja o estado da caixa e do bracelete.', 'É um modelo de uso; não espere raridade.'] },

  { marca: 'Longines', modelo: 'Legend Diver', refs: [], anos: '2007 em diante', movimento: 'Cal. L888 automático', producao: 'Produção alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira a coroa e o bisel interno.', 'Veja o estado da caixa e da pulseira.', 'Modelos recentes têm muitos exemplares.'] },
  { marca: 'Longines', modelo: 'Admiral', refs: [], anos: '1960s em diante', movimento: 'Cal. L888 / quartzo', producao: 'Produção alta.', scores: [1, 2, 3, 2, 1, 1],
    dicas: ['Confira o mostrador e a caixa.', 'Veja se o bracelete é original.', 'Modelos de quartzo e automáticos têm valores diferentes.'] },

  { marca: 'Seiko', modelo: 'SKX007 / SKX009', refs: ['SKX007', 'SKX009'], anos: '1996–2019', movimento: 'Cal. 7S26 automático', producao: 'Produção muito alta.', scores: [1, 2, 3, 4, 1, 1],
    dicas: ['Confira se as peças são originais; modificações são comuns.', 'Veja o estado do bisel e da caixa.', 'É um modelo comum, mas muito procurado.'] },
  { marca: 'Seiko', modelo: '6139 Pogue', refs: ['6139'], anos: '1969–1970s', movimento: 'Cal. 6139 automático', producao: 'Produção média.', scores: [2, 3, 3, 4, 4, 2],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja se o cronógrafo funciona.', 'Muitos exemplares foram restaurados com peças novas.'] },
  { marca: 'Seiko', modelo: '6105-8110 Willard', refs: ['6105'], anos: '1970–1976', movimento: 'Cal. 6105B automático', producao: 'Produção média.', scores: [2, 3, 3, 4, 3, 2],
    dicas: ['Confira a coroa e o mostrador.', 'Veja se a caixa mantém as proporções.', 'Peças de reposição e mostrador trocado reduzem a nota.'] },
  { marca: 'Seiko', modelo: 'Grand Seiko SBGA / SBGW', refs: ['SBGA', 'SBGW'], anos: '2010s em diante', movimento: 'Cal. 9R / 9S', producao: 'Produção controlada.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja o estado da caixa e do bracelete.', 'Documentos e caixa ajudam na revenda.'] },
  { marca: 'Seiko', modelo: 'Seiko 5 SNK809', refs: ['SNK809'], anos: '2000s em diante', movimento: 'Cal. 7S26 automático', producao: 'Produção muito alta.', scores: [1, 2, 3, 2, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja o estado da caixa e da pulseira.', 'É um relógio de entrada; a nota tende a ser baixa.'] },

  { marca: 'Citizen', modelo: 'Eco-Drive Promaster', refs: [], anos: '2000s em diante', movimento: 'Eco-Drive (quartzo solar)', producao: 'Produção muito alta.', scores: [1, 3, 3, 2, 1, 1],
    dicas: ['Confira o funcionamento e a carga solar.', 'Veja o estado do bisel e da caixa.', 'É um modelo de uso; a nota tende a ser baixa.'] },
  { marca: 'Citizen', modelo: '8110 Bullhead', refs: ['8110'], anos: '1969–1970s', movimento: 'Cal. 8110 automático', producao: 'Produção média.', scores: [2, 3, 3, 3, 2, 1],
    dicas: ['Confira o mostrador e os botões.', 'Veja se o cronógrafo funciona.', 'Peças de reposição são difíceis.'] },
  { marca: 'Citizen', modelo: 'C080 Ana-Digi', refs: ['C080', 'CO80'], anos: '1980s–1990s', movimento: 'Quartzo ana-digi com alarme', producao: 'Produção média para a época.', scores: [2, 3, 3, 3, 3, 1],
    dicas: ['Confira o mostrador analógico e os displays digitais.', 'Veja se o bisel de cálculo e os botões estão completos.', 'Muitos exemplares têm mostrador e módulo com desgaste.'] },

  { marca: 'Orient', modelo: 'Bambino', refs: [], anos: '2009 em diante', movimento: 'Cal. F6724 automático', producao: 'Produção muito alta.', scores: [1, 2, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja o estado da caixa e da pulseira.', 'É um modelo de entrada, comum no mercado.'] },
  { marca: 'Orient', modelo: 'Mako / Ray', refs: [], anos: '2004 em diante', movimento: 'Cal. 46943 automático', producao: 'Produção muito alta.', scores: [1, 2, 3, 3, 1, 1],
    dicas: ['Confira o bisel e o mostrador.', 'Veja o estado da coroa e da caixa.', 'Modificações são comuns e reduzem a originalidade.'] },

  { marca: 'Casio', modelo: 'G-Shock DW-5600', refs: ['DW-5600'], anos: '1983 em diante', movimento: 'Quartzo', producao: 'Produção muito alta.', scores: [1, 3, 3, 3, 2, 1],
    dicas: ['Confira o módulo e o mostrador.', 'Veja se a caixa e a pulseira são originais.', 'Colaborações e edições limitadas mudam a nota.'] },
  { marca: 'Casio', modelo: 'G-Shock GA-2100', refs: ['GA-2100'], anos: '2019 em diante', movimento: 'Quartzo', producao: 'Produção muito alta, com muitas colaborações.', scores: [1, 3, 3, 4, 2, 1],
    dicas: ['Confira a versão e a cor.', 'Veja se o módulo e a caixa são originais.', 'Edições limitadas têm procura maior.'] },
  { marca: 'Casio', modelo: 'F-91W', refs: ['F-91W'], anos: '1989 em diante', movimento: 'Quartzo', producao: 'Produção muito alta.', scores: [1, 2, 3, 2, 1, 1],
    dicas: ['Confira o módulo e a pulseira.', 'Veja se a caixa está inteira.', 'É um clássico acessível, mas muito comum.'] },
  { marca: 'Casio', modelo: 'G-Shock MR-G', refs: ['MR-G', 'MRG'], anos: '1996 em diante', movimento: 'Quartzo', producao: 'Produção controlada.', scores: [2, 3, 3, 2, 1, 1],
    dicas: ['Confira o estado do titânio e do vidro.', 'Veja se o módulo funciona.', 'Modelos de titânio têm acabamento sensível.'] },

  { marca: 'Hamilton', modelo: 'Khaki Field', refs: [], anos: '2000s em diante', movimento: 'Cal. H-10 automático', producao: 'Produção alta.', scores: [1, 2, 3, 2, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja o estado da caixa e da pulseira.', 'É um modelo de uso, comum no mercado.'] },
  { marca: 'Hamilton', modelo: 'Intra-Matic 68', refs: [], anos: '2017 em diante', movimento: 'Cal. H-31 automático', producao: 'Produção média.', scores: [2, 3, 3, 3, 2, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja se a caixa e os papéis acompanham.', 'Edições limitadas têm procura maior.'] },

  { marca: 'Tissot', modelo: 'PRX', refs: [], anos: '2021 em diante', movimento: 'Powermatic 80 / quartzo', producao: 'Produção muito alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e o bracelete.', 'Veja se o fecho e os elos estão completos.', 'É um modelo comum e recente.'] },
  { marca: 'Tissot', modelo: 'Visodate', refs: [], anos: '2000s em diante', movimento: 'ETA 2836 automático', producao: 'Produção alta.', scores: [1, 2, 3, 2, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja o estado da caixa e da pulseira.', 'Modelos de entrada têm nota baixa.'] },

  { marca: 'Zenith', modelo: 'El Primero A386', refs: ['A386'], anos: '1969–1970s', movimento: 'Cal. 3019 PHC automático', producao: 'Produção média.', scores: [3, 3, 3, 4, 4, 2],
    dicas: ['Confira o mostrador e os três registros.', 'Veja se o movimento é o El Primero original.', 'Restauros e peças trocadas mudam muito o valor.'] },
  { marca: 'Zenith', modelo: 'Chronomaster', refs: [], anos: '1990s em diante', movimento: 'Cal. El Primero 400 automático', producao: 'Produção alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e os registros.', 'Veja o estado da caixa e do bracelete.', 'Modelos recentes têm muitos exemplares.'] },

  { marca: 'Bulova', modelo: 'Accutron Spaceview', refs: ['Spaceview'], anos: '1960–1970s', movimento: 'Cal. 214 diapasão', producao: 'Produção alta.', scores: [2, 2, 3, 3, 2, 1],
    dicas: ['Confira o movimento de diapasão e a bateria.', 'Veja se o mostrador exposto está completo.', 'Peças do movimento são difíceis de encontrar.'] },
  { marca: 'Bulova', modelo: 'Lunar Pilot', refs: [], anos: '2015 em diante', movimento: 'Quartzo de alta frequência', producao: 'Produção alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e os botões.', 'Veja o estado da caixa e da pulseira.', 'É um modelo recente e comum.'] },

  { marca: 'Universal Genève', alias: ['Universal Geneve'], modelo: 'Polerouter', refs: [], anos: '1954–1960s', movimento: 'Cal. 215 / 218 automático', producao: 'Produção média.', scores: [2, 3, 3, 3, 2, 1],
    dicas: ['Confira o mostrador e a caixa.', 'Veja se o movimento está funcionando.', 'Mostradores repintados são comuns.'] },
  { marca: 'Universal Genève', alias: ['Universal Geneve'], modelo: 'Tri-Compax', refs: [], anos: '1940s–1960s', movimento: 'Cal. 481 manual', producao: 'Produção média.', scores: [2, 3, 3, 3, 2, 2],
    dicas: ['Confira os três registros e o calendário.', 'Veja se o movimento é original.', 'Restauros e peças trocadas reduzem a nota.'] },

  { marca: 'Eterna', modelo: 'Kontiki', refs: [], anos: '1958 em diante', movimento: 'Cal. 1424 automático', producao: 'Produção média.', scores: [2, 2, 3, 3, 1, 1],
    dicas: ['Confira a caixa com sistema de vedação.', 'Veja o mostrador e os ponteiros.', 'Peças de reposição são difíceis.'] },

  { marca: 'Doxa', modelo: 'Sub 300', refs: ['Sub 300'], anos: '1967 em diante', movimento: 'Cal. 285 automático', producao: 'Produção média.', scores: [2, 3, 3, 3, 2, 1],
    dicas: ['Confira o mostrador laranja e o bisel.', 'Veja se a caixa mantém as proporções.', 'Muitos exemplares têm peças de reposição.'] },

  { marca: 'Sinn', modelo: 'U1', refs: ['U1'], anos: '2005 em diante', movimento: 'Cal. SW200 automático', producao: 'Produção média.', scores: [1, 2, 3, 2, 1, 1],
    dicas: ['Confira o estado da caixa de aço escovado.', 'Veja o bisel e a coroa.', 'É um modelo de uso, comum entre entusiastas.'] },

  { marca: 'Nomos', modelo: 'Tangente', refs: ['Tangente'], anos: '1992 em diante', movimento: 'Cal. Alpha manual', producao: 'Produção média.', scores: [1, 3, 3, 2, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja o estado da caixa e da coroa.', 'Modelos de entrada da marca têm produção estável.'] },

  { marca: 'Blancpain', modelo: 'Fifty Fathoms', refs: [], anos: '1953 em diante', movimento: 'Cal. 1315 automático', producao: 'Produção controlada.', scores: [2, 3, 3, 4, 2, 2],
    dicas: ['Confira o bisel e o mostrador.', 'Veja se a caixa e os papéis acompanham.', 'Modelos vintage e modernos têm valores muito diferentes.'] },

  { marca: 'Hublot', modelo: 'Big Bang', refs: [], anos: '2005 em diante', movimento: 'Cal. HUB4100 automático', producao: 'Produção alta.', scores: [1, 3, 3, 3, 1, 1],
    dicas: ['Confira o mostrador e a caixa.', 'Veja o estado da pulseira de borracha.', 'Modelos recentes têm muitos exemplares.'] },

  { marca: 'Richard Mille', alias: ['RM'], modelo: 'RM 011', refs: ['RM011', 'RM 011'], anos: '2007 em diante', movimento: 'Cal. RM 011 automático', producao: 'Produção muito limitada.', scores: [3, 4, 3, 5, 3, 3],
    dicas: ['Confira o mostrador e a caixa de titânio.', 'Veja se os documentos e o certificado acompanham.', 'Peças de altíssimo valor exigem laudo especializado.'],
    aviso: 'Avaliação de mercado muito específica. Não negocie sem laudo e especialista.' },

  { marca: 'A. Lange & Söhne', alias: ['A. Lange', 'Lange'], modelo: 'Lange 1', refs: ['Lange 1'], anos: '1994 em diante', movimento: 'Cal. L901.0 manual', producao: 'Produção controlada.', scores: [2, 4, 3, 4, 2, 2],
    dicas: ['Confira o mostrador e o mecanismo de data.', 'Veja o estado da caixa e dos ponteiros.', 'Documentos e caixa são importantes na revenda.'] },

  { marca: 'Glashütte Original', alias: ['Glashutte Original', 'Glashutte'], modelo: 'PanoMaticLunar', refs: [], anos: '2000s em diante', movimento: 'Cal. 90-02 automático', producao: 'Produção média.', scores: [1, 3, 3, 2, 1, 1],
    dicas: ['Confira o mostrador e a fase da lua.', 'Veja o estado da caixa e da pulseira.', 'Modelos de nicho têm procura menor.'] },

  { marca: 'Technos', modelo: 'Skydiver', refs: ['Skydiver'], anos: '1960s–1970s', movimento: 'Automático', producao: 'Produção média no Brasil.', scores: [2, 2, 3, 3, 2, 1],
    dicas: ['Confira o mostrador e o bisel.', 'Veja se a coroa e a caixa estão originais.', 'Muitos exemplares tiveram peças trocadas.'] },
  { marca: 'Technos', modelo: 'Vintage automático', refs: [], anos: '1960s–1980s', movimento: 'Automático', producao: 'Produção alta no Brasil.', scores: [1, 2, 3, 2, 1, 1],
    dicas: ['Confira o mostrador e os ponteiros.', 'Veja se o movimento está funcionando.', 'A marca tem valor afetivo, mas produção alta.'] },

  { marca: 'Invicta', modelo: 'Pro Diver', refs: [], anos: '1990s em diante', movimento: 'Cal. NH35 / quartzo', producao: 'Produção muito alta.', scores: [1, 1, 3, 1, 1, 0],
    dicas: ['Confira o mostrador e o bisel.', 'Veja o estado da caixa e do bracelete.', 'É um modelo de entrada, com muitos exemplares.'] }
];
