'use strict';

/* ============================================================
   Horologia — Top 100
   Lista editorial de relógios de coleção. As notas são uma
   curadoria de raridade para conversa e aprendizado, não um
   laudo, preço ou ranking oficial de mercado.
   ============================================================ */

const RANKING = [
  {
    marca: 'Patek Philippe',
    modelo: 'Henry Graves Supercomplication',
    ref: 'Graves',
    anos: '1933',
    nota: 100,
    produzidos: '1 unidade',
    motivo: 'Relógio de bolso com 24 complicações, feito para Henry Graves Jr. e único no mundo.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Calibre 89',
    ref: 'Calibre 89',
    anos: '1989',
    nota: 99,
    produzidos: '4 unidades',
    motivo: 'Criado para os 150 anos da Patek, com 33 complicações e apenas quatro exemplares.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Grandmaster Chime 6300A-010',
    ref: '6300A-010',
    anos: '2019',
    nota: 98,
    produzidos: '1 unidade',
    motivo: 'Versão única em aço do Grandmaster Chime, com 20 complicações, leiloada para caridade.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Ref. 1518 em aço',
    ref: '1518',
    anos: '1941–1954',
    nota: 97,
    produzidos: 'Poucos exemplares em aço',
    motivo: 'Calendário perpétuo com cronógrafo; a versão em aço é uma das peças mais cobiçadas da marca.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Ref. 2499',
    ref: '2499',
    anos: '1951–1985',
    nota: 96,
    produzidos: '349 unidades',
    motivo: 'Calendário perpétuo com cronógrafo em quatro séries, com mostradores e caixas diferentes.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Ref. 3448',
    ref: '3448',
    anos: '1962–1981',
    nota: 95,
    produzidos: '≈ 586 unidades',
    motivo: 'Primeiro calendário perpétuo automático da Patek, com mostrador limpo e caixa discreta.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Ref. 3974',
    ref: '3974',
    anos: '1989–2000',
    nota: 94,
    produzidos: '≈ 30 unidades',
    motivo: 'Calendário perpétuo com repetição de minutos; uma das complicações mais raras da casa.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Ref. 5016',
    ref: '5016',
    anos: '1993–2011',
    nota: 93,
    produzidos: '≈ 200 unidades',
    motivo: 'Tourbillon, calendário perpétuo e repetição de minutos em uma única caixa.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Ref. 5004',
    ref: '5004',
    anos: '1995–2011',
    nota: 92,
    produzidos: '≈ 300 unidades',
    motivo: 'Cronógrafo split-seconds com calendário perpétuo, muito procurado por colecionadores.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Ref. 5208',
    ref: '5208',
    anos: '2011–2019',
    nota: 91,
    produzidos: '≈ 100 unidades',
    motivo: 'Triplo complicação automático com tourbillon, calendário perpétuo e repetição.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Nautilus 3700/1A',
    ref: '3700/1A',
    anos: '1976–1981',
    nota: 90,
    produzidos: '≈ 3.000 unidades',
    motivo: 'Primeiro Nautilus, desenhado por Gérald Genta, em aço e com pulseira integrada.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Nautilus 5711/1A',
    ref: '5711/1A',
    anos: '2006–2021',
    nota: 82,
    produzidos: 'Não informada',
    motivo: 'Ícone moderno com produção encerrada; virou um dos relógios mais disputados da década.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Aquanaut 5065A',
    ref: '5065A',
    anos: '1997–2009',
    nota: 80,
    produzidos: 'Não informada',
    motivo: 'Primeiro Aquanaut em aço, com mostrador quadriculado e caixa de 38 mm.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'World Time 5110',
    ref: '5110',
    anos: '2000–2006',
    nota: 84,
    produzidos: 'Não informada',
    motivo: 'Relógio de fuso mundial com botão único e mostrador de cidades, em versões de ouro.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Perpetual Calendar 3940',
    ref: '3940',
    anos: '1985–2007',
    nota: 86,
    produzidos: 'Não informada',
    motivo: 'Calendário perpétuo automático fino e equilibrado, um clássico entre colecionadores.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Ref. 130',
    ref: '130',
    anos: '1934–1950s',
    nota: 90,
    produzidos: 'Não informada',
    motivo: 'Cronógrafo de pulso vintage; as versões em aço e com mostrador original são raríssimas.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Ref. 1463',
    ref: '1463',
    anos: '1940–1965',
    nota: 88,
    produzidos: 'Não informada',
    motivo: 'Cronógrafo resistente à água com escala taquimétrica, em produção limitada.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Ref. 570',
    ref: '570',
    anos: '1938–1970s',
    nota: 80,
    produzidos: 'Não informada',
    motivo: 'Calatrava de 35 mm; a versão em aço é muito mais rara que as versões em ouro.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Ref. 96',
    ref: '96',
    anos: '1932–1970s',
    nota: 72,
    produzidos: 'Não informada',
    motivo: 'Primeiro Calatrava da linha, com mostrador limpo e caixa redonda clássica.'
  },
  {
    marca: 'Patek Philippe',
    modelo: 'Golden Ellipse 3548',
    ref: '3548',
    anos: '1968–1970s',
    nota: 65,
    produzidos: 'Não informada',
    motivo: 'Design assimétrico dos anos 60, em ouro, com proporções baseadas na razão áurea.'
  },
  {
    marca: 'Rolex',
    modelo: 'Daytona “Paul Newman” 6239',
    ref: '6239',
    anos: '1963–1969',
    nota: 96,
    produzidos: 'Não informada',
    motivo: 'Mostrador exotic com subdials quadrados e escala em vermelho; ícone absoluto dos leilões.'
  },
  {
    marca: 'Rolex',
    modelo: 'Daytona “John Player Special” 6241',
    ref: '6241',
    anos: '1960s',
    nota: 95,
    produzidos: '≈ 100 unidades',
    motivo: 'Combinação de mostrador preto com detalhes dourados, inspirada nos carros de corrida.'
  },
  {
    marca: 'Rolex',
    modelo: 'Daytona 6263 / 6265 “Big Red”',
    ref: '6263/6265',
    anos: '1971–1988',
    nota: 88,
    produzidos: 'Não informada',
    motivo: 'Cronógrafo manual com pushdown ou pushers rosqueados e o famoso Daytona vermelho.'
  },
  {
    marca: 'Rolex',
    modelo: 'Daytona 16520 “Zenith”',
    ref: '16520',
    anos: '1988–2000',
    nota: 78,
    produzidos: 'Não informada',
    motivo: 'Primeiro Daytona automático, equipado com calibre Zenith El Primero modificado.'
  },
  {
    marca: 'Rolex',
    modelo: 'Daytona 116520',
    ref: '116520',
    anos: '2000–2016',
    nota: 68,
    produzidos: 'Não informada',
    motivo: 'Primeiro Daytona com calibre próprio da Rolex, já com bisel de cerâmica na fase final.'
  },
  {
    marca: 'Rolex',
    modelo: 'Submariner 6538 “James Bond”',
    ref: '6538',
    anos: '1954–1959',
    nota: 94,
    produzidos: 'Não informada',
    motivo: 'Coroa grande sem protetor, usado nos primeiros filmes de James Bond.'
  },
  {
    marca: 'Rolex',
    modelo: 'Submariner 5512',
    ref: '5512',
    anos: '1959–1980',
    nota: 80,
    produzidos: 'Não informada',
    motivo: 'Primeira referência com protetor de coroa; mostradores e inserts originais são raros.'
  },
  {
    marca: 'Rolex',
    modelo: 'Submariner 5513',
    ref: '5513',
    anos: '1962–1989',
    nota: 75,
    produzidos: 'Não informada',
    motivo: 'Produção longa, mas os mostradores e inserts corretos para cada fase são muito procurados.'
  },
  {
    marca: 'Rolex',
    modelo: 'Submariner 1680 “Red Sub”',
    ref: '1680',
    anos: '1969–1979',
    nota: 82,
    produzidos: 'Não informada',
    motivo: 'Primeiro Submariner com data e texto vermelho no mostrador.'
  },
  {
    marca: 'Rolex',
    modelo: 'Submariner 16610LV “Kermit”',
    ref: '16610LV',
    anos: '2003–2010',
    nota: 74,
    produzidos: 'Não informada',
    motivo: 'Primeiro Submariner com bisel verde, lançado no 50º aniversário do modelo.'
  },
  {
    marca: 'Rolex',
    modelo: 'Sea-Dweller 1665 “Double Red”',
    ref: '1665',
    anos: '1967–1977',
    nota: 86,
    produzidos: 'Não informada',
    motivo: 'Válvula de hélio e mostrador com duas linhas vermelhas, feito para mergulho saturation.'
  },
  {
    marca: 'Rolex',
    modelo: 'GMT-Master 6542',
    ref: '6542',
    anos: '1954–1959',
    nota: 92,
    produzidos: 'Não informada',
    motivo: 'Primeiro GMT-Master, com bisel de baquelite e pulseira de aço; poucos sobreviveram intactos.'
  },
  {
    marca: 'Rolex',
    modelo: 'GMT-Master 1675',
    ref: '1675',
    anos: '1959–1980',
    nota: 78,
    produzidos: 'Não informada',
    motivo: 'Longa produção com mostradores, inserts e pulseiras que mudaram ao longo dos anos.'
  },
  {
    marca: 'Rolex',
    modelo: 'GMT-Master II 16760 “Fat Lady”',
    ref: '16760',
    anos: '1983–1988',
    nota: 76,
    produzidos: 'Não informada',
    motivo: 'Primeiro GMT-Master II, com caixa mais espessa e movimento de dois fusos.'
  },
  {
    marca: 'Rolex',
    modelo: 'Explorer 1016',
    ref: '1016',
    anos: '1963–1989',
    nota: 78,
    produzidos: 'Não informada',
    motivo: 'Explorer clássico, com mostrador preto e números 3, 6 e 9; detalhes variam por fase.'
  },
  {
    marca: 'Rolex',
    modelo: 'Explorer II 1655 “Steve McQueen”',
    ref: '1655',
    anos: '1971–1985',
    nota: 86,
    produzidos: 'Não informada',
    motivo: 'Ponteiro 24h e mostrador laranja; apelido de cinema que ajudou a criar a lenda.'
  },
  {
    marca: 'Rolex',
    modelo: 'Milgauss 6541',
    ref: '6541',
    anos: '1956–1960',
    nota: 90,
    produzidos: 'Não informada',
    motivo: 'Primeira geração antimagnética, com ponteiro de segundos em forma de raio.'
  },
  {
    marca: 'Rolex',
    modelo: 'Bubbleback 3131',
    ref: '3131',
    anos: '1930s–1940s',
    nota: 80,
    produzidos: 'Não informada',
    motivo: 'Primeiro automático com rotor da Rolex, com caixa arredondada e coroa rosqueada.'
  },
  {
    marca: 'Rolex',
    modelo: 'Day-Date 1803',
    ref: '1803',
    anos: '1956–1977',
    nota: 68,
    produzidos: 'Não informada',
    motivo: 'Presidente em ouro com dia da semana e data; a variedade de mostradores é enorme.'
  },
  {
    marca: 'Rolex',
    modelo: 'Oyster Perpetual 6062 “Stelline”',
    ref: '6062',
    anos: '1950–1953',
    nota: 94,
    produzidos: 'Não informada',
    motivo: 'Calendário com lua e mostrador estrelado; uma das Rolex mais raras e desejadas.'
  },
  {
    marca: 'Omega',
    modelo: 'Speedmaster 2915-1',
    ref: '2915-1',
    anos: '1957',
    nota: 96,
    produzidos: '≈ 2.000 unidades',
    motivo: 'Primeiro Speedmaster, com ponteiros Broad Arrow, bisel de aço e escala taquimétrica.'
  },
  {
    marca: 'Omega',
    modelo: 'Speedmaster 2998',
    ref: '2998',
    anos: '1959–1962',
    nota: 88,
    produzidos: 'Não informada',
    motivo: 'Primeira geração com bisel de alumínio; os mostradores e ponteiros variam muito.'
  },
  {
    marca: 'Omega',
    modelo: 'Speedmaster 105.012',
    ref: '105.012',
    anos: '1964–1967',
    nota: 82,
    produzidos: 'Não informada',
    motivo: 'Referência usada na Apollo 11, com caixa assimétrica e protetor de coroa.'
  },
  {
    marca: 'Omega',
    modelo: 'Speedmaster Alaska III',
    ref: 'Alaska III',
    anos: '1978',
    nota: 90,
    produzidos: '≈ 56 unidades',
    motivo: 'Versão criada para a NASA, com mostrador branco e caixa pensada para o espaço.'
  },
  {
    marca: 'Omega',
    modelo: 'Speedmaster “Silver Snoopy” 3578.51',
    ref: '3578.51',
    anos: '2003',
    nota: 88,
    produzidos: '5.441 unidades',
    motivo: 'Edição limitada do Snoopy Award, com mostrador especial e caixa de apresentação.'
  },
  {
    marca: 'Omega',
    modelo: 'Seamaster 300 165.024',
    ref: '165.024',
    anos: '1964–1969',
    nota: 78,
    produzidos: 'Não informada',
    motivo: 'Diver profissional com mostrador de mergulho; versões militares são ainda mais raras.'
  },
  {
    marca: 'Omega',
    modelo: 'Railmaster 2914',
    ref: '2914',
    anos: '1957–1963',
    nota: 84,
    produzidos: 'Não informada',
    motivo: 'Antimagnético criado para ferrovias e laboratórios, com produção menor que o Speedmaster.'
  },
  {
    marca: 'Omega',
    modelo: 'Flightmaster 145.013',
    ref: '145.013',
    anos: '1969–1970s',
    nota: 78,
    produzidos: 'Não informada',
    motivo: 'Cronógrafo de piloto com múltiplos ponteiros e escala 24h, em caixa assimétrica.'
  },
  {
    marca: 'Omega',
    modelo: 'Constellation “Pie Pan” 168.005',
    ref: '168.005',
    anos: '1960s',
    nota: 68,
    produzidos: 'Não informada',
    motivo: 'Mostrador facetado em forma de torta e movimento de alta precisão da época.'
  },
  {
    marca: 'Audemars Piguet',
    modelo: 'Royal Oak 5402ST “Jumbo”',
    ref: '5402ST',
    anos: '1972–1977',
    nota: 88,
    produzidos: '≈ 2.000 unidades',
    motivo: 'Primeiro Royal Oak, em aço, com mostrador tapisserie e pulseira integrada.'
  },
  {
    marca: 'Audemars Piguet',
    modelo: 'Royal Oak Offshore “End of Days”',
    ref: 'End of Days',
    anos: '1999',
    nota: 82,
    produzidos: '500 unidades',
    motivo: 'Edição limitada com caixa escura e visual agressivo, feita para o fim do milênio.'
  },
  {
    marca: 'Audemars Piguet',
    modelo: 'Royal Oak Concept',
    ref: 'Concept',
    anos: '2002',
    nota: 90,
    produzidos: '≈ 150 unidades',
    motivo: 'Primeiro Concept, com materiais experimentais e design futurista.'
  },
  {
    marca: 'Vacheron Constantin',
    modelo: '222',
    ref: '222',
    anos: '1977–1980s',
    nota: 86,
    produzidos: 'Não informada',
    motivo: 'Ícone dos anos 70, com caixa integrada, pulseira de aço e desenho de Jörg Hysek.'
  },
  {
    marca: 'Vacheron Constantin',
    modelo: 'Overseas 42040',
    ref: '42040',
    anos: '1996–2000s',
    nota: 72,
    produzidos: 'Não informada',
    motivo: 'Primeira geração Overseas, com pulseira integrada e estilo esportivo elegante.'
  },
  {
    marca: 'Vacheron Constantin',
    modelo: 'Patrimony',
    ref: 'Patrimony',
    anos: '2000s em diante',
    nota: 62,
    produzidos: 'Não informada',
    motivo: 'Dress watch clássico com caixa fina, mostrador limpo e acabamento tradicional.'
  },
  {
    marca: 'A. Lange & Söhne',
    modelo: 'Lange 1',
    ref: 'Lange 1',
    anos: '1994 em diante',
    nota: 82,
    produzidos: 'Não informada',
    motivo: 'Mostrador assimétrico com data grande, símbolo do renascimento da marca após a reunificação.'
  },
  {
    marca: 'A. Lange & Söhne',
    modelo: 'Datograph',
    ref: 'Datograph',
    anos: '1999 em diante',
    nota: 88,
    produzidos: 'Não informada',
    motivo: 'Cronógrafo flyback com movimento de alto acabamento e um dos favoritos dos entusiastas.'
  },
  {
    marca: 'A. Lange & Söhne',
    modelo: 'Tourbillon Pour le Mérite',
    ref: 'Pour le Mérite',
    anos: '1994',
    nota: 94,
    produzidos: '150 unidades',
    motivo: 'Primeiro tourbillon da marca depois da queda do Muro, com corda por corrente.'
  },
  {
    marca: 'A. Lange & Söhne',
    modelo: 'Zeitwerk',
    ref: 'Zeitwerk',
    anos: '2009 em diante',
    nota: 80,
    produzidos: 'Não informada',
    motivo: 'Hora digital mecânica, com discos de números e leitura instantânea.'
  },
  {
    marca: 'A. Lange & Söhne',
    modelo: 'Odysseus',
    ref: 'Odysseus',
    anos: '2019 em diante',
    nota: 72,
    produzidos: 'Não informada',
    motivo: 'Primeiro relógio esportivo da Lange, em aço, com pulseira integrada.'
  },
  {
    marca: 'Jaeger-LeCoultre',
    modelo: 'Reverso 1931',
    ref: 'Reverso',
    anos: '1931 em diante',
    nota: 76,
    produzidos: 'Não informada',
    motivo: 'Caixa reversível criada para o polo, com design art déco e história longa.'
  },
  {
    marca: 'Jaeger-LeCoultre',
    modelo: 'Reverso Gyrotourbillon',
    ref: 'Gyrotourbillon',
    anos: '2008',
    nota: 92,
    produzidos: '≈ 75 unidades',
    motivo: 'Tourbillon esférico de dois eixos em uma caixa Reverso, com produção muito limitada.'
  },
  {
    marca: 'Jaeger-LeCoultre',
    modelo: 'Memovox Polaris',
    ref: 'Polaris',
    anos: '1968',
    nota: 88,
    produzidos: '≈ 1.700 unidades',
    motivo: 'Diver com alarme e bisel interno, um dos ícones dos anos 60.'
  },
  {
    marca: 'Jaeger-LeCoultre',
    modelo: 'Deep Sea Alarm',
    ref: 'Deep Sea Alarm',
    anos: '1959',
    nota: 88,
    produzidos: 'Não informada',
    motivo: 'Primeiro diver com alarme, com mostrador especial e coroa dupla.'
  },
  {
    marca: 'Jaeger-LeCoultre',
    modelo: 'Futurematic',
    ref: 'Futurematic',
    anos: '1953–1960s',
    nota: 70,
    produzidos: 'Não informada',
    motivo: 'Automático sem coroa, com reserva de marcha e design futurista.'
  },
  {
    marca: 'Cartier',
    modelo: 'Crash',
    ref: 'Crash',
    anos: '1967',
    nota: 96,
    produzidos: 'Não informada',
    motivo: 'Caixa derretida e assimétrica, lenda dos anos 60; pouquíssimos originais existem.'
  },
  {
    marca: 'Cartier',
    modelo: 'Tank Cintrée',
    ref: 'Cintrée',
    anos: '1921 em diante',
    nota: 82,
    produzidos: 'Não informada',
    motivo: 'Caixa alongada e curvas elegantes, um dos desenhos mais duradouros da Cartier.'
  },
  {
    marca: 'Cartier',
    modelo: 'Santos-Dumont',
    ref: 'Santos',
    anos: '1904 em diante',
    nota: 74,
    produzidos: 'Não informada',
    motivo: 'Um dos primeiros relógios de pulso masculinos modernos, criado para Alberto Santos-Dumont.'
  },
  {
    marca: 'Cartier',
    modelo: 'Tortue Monopoussoir',
    ref: 'Tortue',
    anos: '1928 em diante',
    nota: 88,
    produzidos: 'Não informada',
    motivo: 'Cronógrafo de botão único em caixa tortue, uma das complicações mais raras da Cartier.'
  },
  {
    marca: 'Cartier',
    modelo: 'Pasha',
    ref: 'Pasha',
    anos: '1985 em diante',
    nota: 64,
    produzidos: 'Não informada',
    motivo: 'Design de Gérald Genta com grade protetora e coroa em forma de pêra.'
  },
  {
    marca: 'Cartier',
    modelo: 'Roadster',
    ref: 'Roadster',
    anos: '2001–2012',
    nota: 60,
    produzidos: 'Não informada',
    motivo: 'Esportivo elegante com caixa em barril e linhas inspiradas em carros.'
  },
  {
    marca: 'Panerai',
    modelo: 'Radiomir 3646',
    ref: '3646',
    anos: '1930s–1940s',
    nota: 94,
    produzidos: '≈ 300 unidades',
    motivo: 'Primeiro Panerai militar, com mostrador Radiomir e caixa de mergulho.'
  },
  {
    marca: 'Panerai',
    modelo: 'Luminor 1950 6152/1',
    ref: '6152/1',
    anos: '1950s',
    nota: 92,
    produzidos: 'Não informada',
    motivo: 'Coroa protetora e mostrador luminoso, feito para mergulhadores militares.'
  },
  {
    marca: 'Panerai',
    modelo: 'Mare Nostrum',
    ref: 'Mare Nostrum',
    anos: '1943',
    nota: 96,
    produzidos: '≈ 3 unidades',
    motivo: 'Cronógrafo de marinha feito para oficiais italianos; quase impossível de encontrar.'
  },
  {
    marca: 'Panerai',
    modelo: 'Luminor Marina PAM 111',
    ref: 'PAM 111',
    anos: '2000s',
    nota: 62,
    produzidos: 'Não informada',
    motivo: 'Ícone moderno da Panerai, com mostrador sanduíche e coroa protetora.'
  },
  {
    marca: 'IWC',
    modelo: 'Big Pilot 5002',
    ref: '5002',
    anos: '2002–2006',
    nota: 76,
    produzidos: 'Não informada',
    motivo: 'Primeira reedição moderna do Big Pilot, com caixa de 46 mm e coroa grande.'
  },
  {
    marca: 'IWC',
    modelo: 'Mark XI',
    ref: 'Mark XI',
    anos: '1948–1984',
    nota: 80,
    produzidos: 'Não informada',
    motivo: 'Relógio militar da RAF, com mostrador limpo e movimento antimagnético.'
  },
  {
    marca: 'IWC',
    modelo: 'Portuguese 3714',
    ref: '3714',
    anos: '1998 em diante',
    nota: 68,
    produzidos: 'Não informada',
    motivo: 'Cronógrafo clássico com mostrador equilibrado e caixa de 41 mm.'
  },
  {
    marca: 'IWC',
    modelo: 'Da Vinci 3750',
    ref: '3750',
    anos: '1985–2000s',
    nota: 72,
    produzidos: 'Não informada',
    motivo: 'Calendário perpétuo de Gérald Genta, com caixa tonneau e mostrador complexo.'
  },
  {
    marca: 'IWC',
    modelo: 'Aquatimer 812AD',
    ref: '812AD',
    anos: '1967',
    nota: 82,
    produzidos: 'Não informada',
    motivo: 'Primeiro Aquatimer, com bisel interno e coroa dupla para mergulho.'
  },
  {
    marca: 'Breitling',
    modelo: 'Navitimer 806',
    ref: '806',
    anos: '1959–1970s',
    nota: 80,
    produzidos: 'Não informada',
    motivo: 'Regra de cálculo no mostrador e bisel de aviação, um ícone dos pilotos.'
  },
  {
    marca: 'Breitling',
    modelo: 'Chronomat 808',
    ref: '808',
    anos: '1950s–1960s',
    nota: 84,
    produzidos: 'Não informada',
    motivo: 'Cronógrafo vintage com bisel de régua e ponteiros elegantes.'
  },
  {
    marca: 'Breitling',
    modelo: 'Emergency',
    ref: 'Emergency',
    anos: '1995 em diante',
    nota: 66,
    produzidos: 'Não informada',
    motivo: 'Relógio com transmissor de emergência, feito para pilotos e resgate.'
  },
  {
    marca: 'Breitling',
    modelo: 'Superocean 1004',
    ref: '1004',
    anos: '1957–1960s',
    nota: 78,
    produzidos: 'Não informada',
    motivo: 'Diver vintage com bisel de mergulho e mostrador de leitura fácil.'
  },
  {
    marca: 'Heuer',
    modelo: 'Carrera 2447',
    ref: '2447',
    anos: '1963–1970s',
    nota: 82,
    produzidos: 'Não informada',
    motivo: 'Cronógrafo de corrida com mostrador limpo e caixa fina.'
  },
  {
    marca: 'Heuer',
    modelo: 'Monaco 1133',
    ref: '1133',
    anos: '1969–1970s',
    nota: 86,
    produzidos: 'Não informada',
    motivo: 'Primeiro cronógrafo automático com caixa quadrada, imortalizado por Steve McQueen.'
  },
  {
    marca: 'Heuer',
    modelo: 'Autavia 2446',
    ref: '2446',
    anos: '1960s',
    nota: 82,
    produzidos: 'Não informada',
    motivo: 'Cronógrafo de painel e pulso, com versões militares e mostradores raros.'
  },
  {
    marca: 'Heuer',
    modelo: 'Silverstone',
    ref: 'Silverstone',
    anos: '1974–1970s',
    nota: 76,
    produzidos: 'Não informada',
    motivo: 'Caixa cushion e mostrador marcante, com produção curta nos anos 70.'
  },
  {
    marca: 'TAG Heuer',
    modelo: 'Monaco Calibre 11',
    ref: 'Calibre 11',
    anos: '2010s em diante',
    nota: 64,
    produzidos: 'Não informada',
    motivo: 'Reedição fiel do Monaco original, com coroa à esquerda e calibre 11.'
  },
  {
    marca: 'Zenith',
    modelo: 'El Primero A386',
    ref: 'A386',
    anos: '1969',
    nota: 86,
    produzidos: 'Não informada',
    motivo: 'Primeiro cronógrafo automático de alta frequência, com mostrador tricolor.'
  },
  {
    marca: 'Zenith',
    modelo: 'Defy',
    ref: 'Defy',
    anos: '1969–1970s',
    nota: 72,
    produzidos: 'Não informada',
    motivo: 'Caixa octogonal e pulseira integrada, com visual esportivo dos anos 70.'
  },
  {
    marca: 'Zenith',
    modelo: 'Chronomaster',
    ref: 'Chronomaster',
    anos: '1990s em diante',
    nota: 62,
    produzidos: 'Não informada',
    motivo: 'Evolução moderna do El Primero, com mostrador aberto e cronógrafo.'
  },
  {
    marca: 'Grand Seiko',
    modelo: '44GS',
    ref: '44GS',
    anos: '1967',
    nota: 82,
    produzidos: 'Não informada',
    motivo: 'Define a gramática de design da Grand Seiko, com caixa facetada e mostrador limpo.'
  },
  {
    marca: 'Grand Seiko',
    modelo: 'Snowflake SBGA211',
    ref: 'SBGA211',
    anos: '2010s em diante',
    nota: 64,
    produzidos: 'Não informada',
    motivo: 'Mostrador texturizado que lembra neve, com movimento Spring Drive.'
  },
  {
    marca: 'Seiko',
    modelo: '6159-7001',
    ref: '6159-7001',
    anos: '1968',
    nota: 88,
    produzidos: 'Não informada',
    motivo: 'Primeiro diver profissional da Seiko, com 300 m e caixa monobloco.'
  },
  {
    marca: 'Seiko',
    modelo: '6217-8001',
    ref: '6217-8001',
    anos: '1965',
    nota: 84,
    produzidos: 'Não informada',
    motivo: 'Primeiro diver da Seiko com coroa às 4h, base do design dos mergulhadores japoneses.'
  },
  {
    marca: 'Seiko',
    modelo: '6139-6002 “Pogue”',
    ref: '6139-6002',
    anos: '1969–1970s',
    nota: 72,
    produzidos: 'Não informada',
    motivo: 'Primeiro cronógrafo automático com roda vertical, usado no Skylab.'
  },
  {
    marca: 'Seiko',
    modelo: '6105-8110 “Willard”',
    ref: '6105-8110',
    anos: '1970–1976',
    nota: 76,
    produzidos: 'Não informada',
    motivo: 'Diver militar com coroa às 4h, imortalizado no cinema.'
  },
  {
    marca: 'Casio',
    modelo: 'G-Shock DW-5000C',
    ref: 'DW-5000C',
    anos: '1983',
    nota: 72,
    produzidos: 'Não informada',
    motivo: 'Primeiro G-Shock, com caixa resistente a choques e design que virou ícone.'
  },
  {
    marca: 'Tudor',
    modelo: 'Submariner 7928',
    ref: '7928',
    anos: '1959–1960s',
    nota: 74,
    produzidos: 'Não informada',
    motivo: 'Submariner da Tudor com ponteiros e mostradores que variam bastante entre fases.'
  }
];
