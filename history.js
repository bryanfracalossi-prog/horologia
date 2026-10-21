'use strict';

/* ============================================================
   Horologia — Relógios históricos e histórias pessoais
   Conteúdo editorial offline + histórias salvas no aparelho.
   ============================================================ */

const HISTORY_ERA_OPTIONS = [
  { id: 'todas', label: 'Todas as épocas' },
  { id: 'pre-1950', label: 'Até 1949' },
  { id: '1950-1969', label: '1950–1969' },
  { id: '1970-1989', label: '1970–1989' },
  { id: '1990', label: '1990 em diante' }
];

const STORY_HOW_OPTIONS = [
  'Comprei',
  'Ganhei de presente',
  'Herança de família',
  'Troca',
  'Encontrei',
  'Outro'
];

const HISTORY_WATCHES = [
  {
    id: 'cartier-santos-dumont',
    marca: 'Cartier',
    modelo: 'Santos-Dumont',
    ano: 1904,
    pais: 'França',
    tipo: 'Pioneiro da aviação',
    art: 'square',
    refs: 'Santos-Dumont',
    tags: ['aviador', 'quadrado', 'alfaiataria', 'primeiro relógio de pulso'],
    titulo: 'O relógio que saiu do pulso de um aviador',
    resumo: 'Um pedido de Alberto Santos-Dumont a Louis Cartier deu forma a um dos primeiros relógios de pulso feitos para uso prático.',
    historia: [
      'No começo do século 20, o relógio de bolso ainda era o padrão. Alberto Santos-Dumont, pioneiro brasileiro da aviação, precisava consultar as horas sem tirar as mãos dos comandos do balão. Em 1904, ele pediu a Louis Cartier um relógio que pudesse usar no pulso.',
      'A resposta foi uma caixa quadrada, com parafusos aparentes nas laterais e uma pulseira de couro. O desenho era funcional, mas também elegante. A Cartier passou a vender o modelo alguns anos depois, e o Santos-Dumont se tornou uma das referências mais duradouras da relojoaria.'
    ],
    curiosidades: [
      'O nome homenageia Santos-Dumont, que era amigo de Louis Cartier.',
      'Os parafusos aparentes fazem parte do desenho original e continuam no modelo atual.',
      'É um dos primeiros relógios de pulso criados especificamente para um homem, e não apenas uma versão reduzida de um relógio de bolso.'
    ],
    legado: 'O Santos-Dumont ajudou a transformar o relógio de pulso em objeto de uso diário — e mostrou que precisão e elegância podiam ocupar o mesmo espaço.'
  },
  {
    id: 'cartier-tank',
    marca: 'Cartier',
    modelo: 'Tank',
    ano: 1917,
    pais: 'França',
    tipo: 'Ícone de desenho',
    art: 'tank',
    refs: 'Tank',
    tags: ['retangular', 'romanos', 'alfaiataria', 'clássico'],
    titulo: 'Linhas retas inspiradas em um tanque',
    resumo: 'O Cartier Tank nasceu em 1917 com uma caixa retangular e alças laterais que lembram as esteiras de um veículo blindado.',
    historia: [
      'Louis Cartier desenhou o Tank em 1917, inspirado na silhueta do Renault FT, um tanque usado na Primeira Guerra Mundial. A caixa retangular, as alças paralelas e os numerais romanos criaram uma assinatura visual imediatamente reconhecível.',
      'Ao longo de um século, o modelo passou por muitas versões, tamanhos e materiais. Ele nunca precisou de um mostrador complicado para ser lembrado: o desenho faz o trabalho.'
    ],
    curiosidades: [
      'O Tank foi usado por artistas, escritores e presidentes, o que ajudou a firmar sua imagem pública.',
      'A família Tank inclui versões como Tank Louis Cartier, Tank Française e Tank Américaine.',
      'A simetria da caixa é um dos pontos mais observados em peças vintage.'
    ],
    legado: 'O Tank provou que um relógio pode ser reconhecido apenas pelo contorno. É um dos desenhos mais copiados — e mais estudados — da relojoaria.'
  },
  {
    id: 'jaeger-lecoultre-reverso',
    marca: 'Jaeger-LeCoultre',
    modelo: 'Reverso',
    ano: 1931,
    pais: 'Suíça',
    tipo: 'Solução de jogo',
    art: 'reverso',
    refs: 'Reverso',
    tags: ['reversível', 'polo', 'art déco', 'caixa dupla'],
    titulo: 'Um relógio que gira para proteger o vidro',
    resumo: 'Criado para jogadores de polo, o Reverso tem uma caixa que desliza e vira, deixando o mostrador protegido durante a partida.',
    historia: [
      'Nos anos 1920, oficiais britânicos que jogavam polo na Índia procuravam um relógio capaz de resistir às pancadas do esporte. A Jaeger-LeCoultre desenvolveu uma caixa com trilhos que permitia girar o corpo do relógio e esconder o vidro.',
      'O Reverso estreou em 1931. Além de resolver um problema prático, o desenho ganhou linhas Art Déco e se tornou um clássico. O verso liso logo passou a receber gravações, esmaltes e trabalhos de gravura.'
    ],
    curiosidades: [
      'O movimento fica dentro da parte que gira; a caixa externa permanece presa à pulseira.',
      'Muitos Reverso têm o verso personalizado com iniciais, brasões ou cenas gravadas.',
      'É um dos poucos relógios em que a função nasce de um gesto: virar a caixa.'
    ],
    legado: 'O Reverso transformou uma necessidade esportiva em objeto de desejo. É um exemplo raro de engenharia e desenho que envelheceram juntos.'
  },
  {
    id: 'panerai-radiomir',
    marca: 'Panerai',
    modelo: 'Radiomir',
    ano: 1936,
    pais: 'Itália',
    tipo: 'Mergulho militar',
    art: 'cushion',
    refs: 'Radiomir',
    tags: ['italiano', 'marinha', 'mergulho', 'luminescente'],
    titulo: 'Um instrumento para mergulhadores da Marinha italiana',
    resumo: 'O Radiomir nasceu como equipamento militar: mostrador grande, ponteiros luminosos e uma caixa pensada para ser lida debaixo d’água.',
    historia: [
      'A Panerai, fornecedora da Marinha italiana, desenvolveu em 1936 um relógio para mergulhadores de combate. O mostrador amplo e os ponteiros cobertos por material luminescente facilitavam a leitura em condições difíceis.',
      'O nome Radiomir vem do composto à base de rádio usado na pintura luminosa da época. A caixa em forma de almofada e as alças de arame se tornaram a assinatura da marca.'
    ],
    curiosidades: [
      'O rádio usado nos primeiros mostradores foi posteriormente substituído por materiais mais seguros.',
      'O protetor de coroa, marca registrada da Panerai, veio depois, em modelos como o Luminor.',
      'Durante décadas, os Panerai militares foram pouco conhecidos fora do meio naval.'
    ],
    legado: 'O Radiomir levou a lógica do instrumento militar para a relojoaria de luxo. Hoje, poucas marcas têm uma ligação tão direta com o mergulho de combate.'
  },
  {
    id: 'iwc-big-pilot',
    marca: 'IWC',
    modelo: 'Big Pilot',
    ano: 1940,
    pais: 'Suíça',
    tipo: 'Aviador',
    art: 'pilot',
    refs: 'Big Pilot',
    tags: ['aviador', 'militar', 'mostrador grande', 'coroa grande'],
    titulo: 'Um painel de instrumentos para o pulso',
    resumo: 'O Big Pilot foi feito para pilotos militares: mostrador enorme, coroa fácil de usar com luvas e leitura instantânea.',
    historia: [
      'No início dos anos 1940, a IWC desenvolveu um relógio de observação para a força aérea alemã. O modelo tinha caixa grande, mostrador preto de altíssimo contraste e uma coroa generosa, pensada para ser operada com luvas.',
      'O Big Pilot original usava um movimento derivado de relógio de bolso e era preso ao pulso por uma pulseira longa. A simplicidade do mostrador escondia uma ferramenta de precisão.'
    ],
    curiosidades: [
      'O tamanho exagerado não era moda: era necessidade de leitura rápida no cockpit.',
      'O triângulo no topo do mostrador ajuda a orientar a leitura em posições incomuns.',
      'A IWC relançou o nome Big Pilot décadas depois, em versões civis.'
    ],
    legado: 'O Big Pilot é o arquétipo do relógio de aviação: grande, legível e sem enfeites desnecessários.'
  },
  {
    id: 'breitling-navitimer',
    marca: 'Breitling',
    modelo: 'Navitimer',
    ano: 1952,
    pais: 'Suíça',
    tipo: 'Aviador e cálculo',
    art: 'chrono',
    refs: 'Navitimer',
    tags: ['aviador', 'cronógrafo', 'régua de cálculo', 'bezel'],
    titulo: 'Uma régua de cálculo no pulso',
    resumo: 'O Navitimer colocou uma escala de cálculo ao redor do mostrador para ajudar pilotos a fazer contas de navegação em voo.',
    historia: [
      'A Breitling já fabricava cronógrafos para aviadores quando lançou o Navitimer em 1952. O diferencial era o bisel com régua de cálculo, capaz de ajudar em cálculos de velocidade, combustível e distância.',
      'O modelo foi associado à AOPA, associação de pilotos e proprietários de aeronaves. O mostrador cheio de números e escalas pode parecer complicado hoje, mas era uma ferramenta de trabalho.'
    ],
    curiosidades: [
      'O nome Navitimer vem de navigation timer.',
      'As escalas do bisel continuam funcionando como uma régua de cálculo analógica.',
      'É um dos cronógrafos de aviação mais reconhecíveis de todos os tempos.'
    ],
    legado: 'O Navitimer mostra como um relógio pode ser uma calculadora de pulso — e como a complexidade visual pode ser funcional.'
  },
  {
    id: 'blancpain-fifty-fathoms',
    marca: 'Blancpain',
    modelo: 'Fifty Fathoms',
    ano: 1953,
    pais: 'Suíça',
    tipo: 'Mergulho moderno',
    art: 'diver',
    refs: 'Fifty Fathoms',
    tags: ['mergulho', 'bezel', 'militar', 'francesa'],
    titulo: 'O mergulho ganha um relógio à altura',
    resumo: 'Desenvolvido com mergulhadores militares franceses, o Fifty Fathoms ajudou a definir o relógio de mergulho moderno.',
    historia: [
      'No início dos anos 1950, o mergulhador e oficial francês Robert Maloubier procurava um relógio capaz de resistir a missões subaquáticas. A Blancpain trabalhou com ele para criar um modelo com bisel giratório, mostrador legível e boa vedação.',
      'O Fifty Fathoms estreou em 1953. O nome se refere a uma medida de profundidade usada por mergulhadores. O bisel com marcações permitia controlar o tempo debaixo d’água, e o desenho serviu de base para muitos relógios de mergulho posteriores.'
    ],
    curiosidades: [
      'O bisel giratório é uma das invenções práticas mais importantes da relojoaria esportiva.',
      'O modelo foi usado por unidades de mergulho militares antes de chegar ao público civil.',
      'A Blancpain é uma das marcas mais antigas da relojoaria suíça.'
    ],
    legado: 'O Fifty Fathoms ajudou a estabelecer o que um relógio de mergulho precisa ter: legibilidade, vedação e controle de tempo.'
  },
  {
    id: 'rolex-submariner',
    marca: 'Rolex',
    modelo: 'Submariner',
    ano: 1953,
    pais: 'Suíça',
    tipo: 'Mergulho e aventura',
    art: 'diver',
    refs: 'Submariner',
    tags: ['mergulho', 'rolex', 'bezel', 'aço'],
    titulo: 'O mergulhador que virou símbolo',
    resumo: 'Lançado em 1953, o Submariner levou a vedação Oyster para o fundo do mar e se tornou um dos relógios mais reconhecíveis do mundo.',
    historia: [
      'A Rolex já tinha o sistema Oyster de caixa vedada quando apresentou o Submariner em 1953. O modelo foi um dos primeiros relógios de pulso projetados especificamente para mergulho, com bisel giratório e mostrador de alta legibilidade.',
      'Com o tempo, o Submariner passou de ferramenta profissional a objeto de desejo. As referências vintage, os detalhes de mostrador e o estado das peças originais fazem dele um dos modelos mais estudados por colecionadores.'
    ],
    curiosidades: [
      'O nome Submariner foi registrado pela Rolex em 1954.',
      'A coroa e o fundo rosqueados ajudam a manter a água fora da caixa.',
      'Ponteiros, insert do bisel e mostrador são alguns dos pontos mais observados em peças antigas.'
    ],
    legado: 'O Submariner ajudou a popularizar o relógio esportivo de aço. É ao mesmo tempo ferramenta, símbolo e objeto de coleção.'
  },
  {
    id: 'omega-speedmaster',
    marca: 'Omega',
    modelo: 'Speedmaster Professional',
    ano: 1957,
    pais: 'Suíça',
    tipo: 'Cronógrafo espacial',
    art: 'chrono',
    refs: 'Speedmaster',
    tags: ['cronógrafo', 'nasa', 'lua', 'manual'],
    titulo: 'O relógio que foi à Lua',
    resumo: 'Criado como cronógrafo esportivo em 1957, o Speedmaster passou por testes da NASA e ficou conhecido como Moonwatch.',
    historia: [
      'O Speedmaster nasceu em 1957 como um cronógrafo para pilotos e entusiastas de automobilismo. Tinha mostrador limpo, taquímetro no bisel e um movimento manual resistente.',
      'Em 1965, depois de uma série de testes, a NASA escolheu o Speedmaster para suas missões tripuladas. Em 1969, um exemplar acompanhou a Apollo 11. O apelido Moonwatch veio depois — e nunca mais saiu.'
    ],
    curiosidades: [
      'O cronógrafo manual foi preferido por não depender de um rotor automático.',
      'A NASA testou choque, vibração, vácuo e variações de temperatura.',
      'O desenho do mostrador mudou pouco em décadas, o que ajuda a reconhecer o modelo.'
    ],
    legado: 'O Speedmaster conecta a relojoaria à exploração espacial. É um dos poucos objetos civis que se tornaram parte da história da NASA.'
  },
  {
    id: 'rolex-daytona',
    marca: 'Rolex',
    modelo: 'Cosmograph Daytona',
    ano: 1963,
    pais: 'Suíça',
    tipo: 'Cronógrafo de corrida',
    art: 'chrono',
    refs: 'Daytona',
    tags: ['cronógrafo', 'corrida', 'paul newman', 'aço'],
    titulo: 'O cronógrafo das pistas',
    resumo: 'O Daytona nasceu para cronometrar corridas e virou um dos relógios mais desejados do mundo, dentro e fora das pistas.',
    historia: [
      'A Rolex lançou o Cosmograph Daytona em 1963, ligado ao circuito de Daytona Beach, nos Estados Unidos. O bisel taquimétrico e os contadores do cronógrafo ajudavam a medir velocidade e tempos de volta.',
      'O modelo demorou a conquistar o público que tem hoje. Foi a associação com o ator Paul Newman, que usava um Daytona, que ajudou a transformar o cronógrafo em ícone. Hoje, certos mostradores vintage são disputados por colecionadores.'
    ],
    curiosidades: [
      'O mostrador Paul Newman tem contadores com escalas e cores diferentes do padrão.',
      'O Daytona não tem data, uma escolha que mantém o mostrador limpo.',
      'A versão automática chegou em 1988, com o calibre 4030.'
    ],
    legado: 'O Daytona é a prova de que um relógio de ferramenta pode se tornar objeto de desejo sem perder a ligação com o esporte.'
  },
  {
    id: 'seiko-6139',
    marca: 'Seiko',
    modelo: 'Chronograph 6139',
    ano: 1969,
    pais: 'Japão',
    tipo: 'Cronógrafo automático',
    art: 'chrono',
    refs: '6139',
    tags: ['cronógrafo', 'automático', 'japonês', 'pogue'],
    titulo: 'A corrida japonesa dos cronógrafos automáticos',
    resumo: 'O Seiko 6139 foi um dos primeiros cronógrafos automáticos do mundo e ficou famoso com o mostrador amarelo apelidado de Pogue.',
    historia: [
      'No fim dos anos 1960, várias empresas corriam para lançar o primeiro cronógrafo automático. A Seiko apresentou o calibre 6139 em 1969, com roda vertical e uma solução de embreagem que simplificava o mecanismo.',
      'O modelo ficou associado ao astronauta William Pogue, que levou um Seiko 6139 para a estação Skylab. O mostrador amarelo de algumas versões ganhou o apelido de Pogue e se tornou um dos favoritos entre colecionadores.'
    ],
    curiosidades: [
      'O 6139 é um dos movimentos japoneses mais importantes da relojoaria moderna.',
      'O Pogue foi usado no espaço antes de o Speedmaster se tornar o relógio oficial de todas as missões.',
      'A combinação de dia e data é uma marca de muitos Seiko da época.'
    ],
    legado: 'O 6139 mostrou que o Japão podia competir no mais alto nível da relojoaria mecânica. Também abriu caminho para uma geração de cronógrafos acessíveis.'
  },
  {
    id: 'seiko-astron',
    marca: 'Seiko',
    modelo: 'Astron 35SQ',
    ano: 1969,
    pais: 'Japão',
    tipo: 'Revolução do quartzo',
    art: 'round',
    refs: 'Astron',
    tags: ['quartzo', 'japonês', 'precisão', '1969'],
    titulo: 'O primeiro relógio de pulso de quartzo',
    resumo: 'O Seiko Astron de 1969 inaugurou a era do quartzo e mudou para sempre a economia da relojoaria mundial.',
    historia: [
      'Em dezembro de 1969, a Seiko colocou à venda o Astron 35SQ, o primeiro relógio de pulso de quartzo do mundo. Em vez de uma mola e um balanço, ele usava a vibração de um cristal de quartzo para marcar o tempo.',
      'A precisão era muito maior do que a dos melhores relógios mecânicos. Nas décadas seguintes, o quartzo barateou e se espalhou, pressionando a indústria suíça e mudando o mercado para sempre.'
    ],
    curiosidades: [
      'O Astron original era caro, quase o preço de um carro pequeno no Japão.',
      'A tecnologia de quartzo já era usada em relógios de mesa e navios antes de chegar ao pulso.',
      'A Seiko continuou a usar o nome Astron em modelos GPS modernos.'
    ],
    legado: 'O Astron é o marco inicial da era do quartzo. Poucos relógios mudaram tanto a indústria sem serem um objeto de luxo.'
  },
  {
    id: 'zenith-el-primero',
    marca: 'Zenith',
    modelo: 'El Primero',
    ano: 1969,
    pais: 'Suíça',
    tipo: 'Alta frequência',
    art: 'chrono',
    refs: 'El Primero',
    tags: ['cronógrafo', 'automático', 'alta frequência', 'movimento'],
    titulo: 'Um cronógrafo que batia mais rápido',
    resumo: 'O El Primero foi um dos primeiros cronógrafos automáticos do mundo e ficou famoso pela alta frequência do seu movimento.',
    historia: [
      'A Zenith apresentou o El Primero em 1969, no mesmo ano em que outros fabricantes corriam para lançar cronógrafos automáticos. O movimento batia a 36.000 alternâncias por hora, uma frequência alta para a época.',
      'A alta frequência permitia medir intervalos menores e melhorava a estabilidade. Décadas depois, o El Primero voltaria a ganhar destaque ao equipar o Rolex Daytona automático.'
    ],
    curiosidades: [
      'O nome El Primero significa “o primeiro” em espanhol.',
      'O movimento original tinha 278 peças e era considerado uma obra de miniaturização.',
      'A Zenith retomou a produção do El Primero nos anos 1980, quando muitos movimentos tinham sido abandonados.'
    ],
    legado: 'O El Primero é um dos grandes movimentos cronográficos da história. Representa a obsessão suíça com precisão e acabamento.'
  },
  {
    id: 'bulova-accutron',
    marca: 'Bulova',
    modelo: 'Accutron',
    ano: 1960,
    pais: 'Estados Unidos',
    tipo: 'Diapasão eletrônico',
    art: 'round',
    refs: 'Accutron',
    tags: ['eletrônico', 'diapasão', 'americano', 'precisão'],
    titulo: 'O relógio que zumbia',
    resumo: 'O Accutron usava um diapasão vibrante em vez de um balanço mecânico, e seu zumbido ficou na memória de quem o usou.',
    historia: [
      'A Bulova lançou o Accutron em 1960. Em vez do tradicional balanço de um relógio mecânico, ele usava um diapasão eletrônico que vibrava centenas de vezes por segundo. O resultado era uma precisão impressionante para a época.',
      'O ponteiro dos segundos se movia em um fluxo contínuo, e o relógio emitia um zumbido característico. O Accutron foi usado em aviação e até em equipamentos espaciais antes de ser superado pelo quartzo.'
    ],
    curiosidades: [
      'O diapasão do Accutron vibrava a 360 vezes por segundo.',
      'O movimento era movido por uma bateria e um circuito transistorizado.',
      'A Bulova usou a tecnologia em temporizadores de precisão para a NASA.'
    ],
    legado: 'O Accutron foi uma ponte entre a relojoaria mecânica e a eletrônica. Mostrou que a precisão podia vir de algo que não fosse uma mola.'
  },
  {
    id: 'hamilton-ventura',
    marca: 'Hamilton',
    modelo: 'Ventura',
    ano: 1957,
    pais: 'Estados Unidos',
    tipo: 'Elétrico e futurista',
    art: 'shield',
    refs: 'Ventura',
    tags: ['elétrico', 'triangular', 'elvis', 'futurismo'],
    titulo: 'O relógio triangular que Elvis usou',
    resumo: 'O Ventura tinha uma caixa triangular ousada e um movimento elétrico, combinando ficção científica e cultura pop.',
    historia: [
      'A Hamilton apresentou o Ventura em 1957, impulsionada pela chegada dos movimentos elétricos. A caixa triangular, desenhada por Richard Arbib, parecia saída de um filme de ficção científica.',
      'O relógio ficou associado a Elvis Presley, que usou um Ventura em um filme. Isso ajudou a transformar o modelo em símbolo de modernidade e rebeldia elegante.'
    ],
    curiosidades: [
      'O movimento elétrico original usava uma bateria e contatos mecânicos.',
      'O desenho triangular é um dos mais arrojados da relojoaria do século 20.',
      'A Hamilton relançou o Ventura em versões modernas, mantendo a silhueta.'
    ],
    legado: 'O Ventura mostrou que um relógio podia ser uma declaração de estilo. É um dos grandes exemplos de desenho industrial aplicado à relojoaria.'
  },
  {
    id: 'casio-f91w',
    marca: 'Casio',
    modelo: 'F-91W',
    ano: 1989,
    pais: 'Japão',
    tipo: 'Digital acessível',
    art: 'digital',
    refs: 'F-91W',
    tags: ['digital', 'barato', 'resistente', 'cultura pop'],
    titulo: 'O digital que virou linguagem universal',
    resumo: 'Simples, barato e resistente, o Casio F-91W se tornou um dos relógios mais usados do planeta e um ícone da cultura digital.',
    historia: [
      'O Casio F-91W chegou ao mercado em 1989, com uma proposta direta: horas, data, cronômetro, alarme e luz, em uma caixa de resina leve e resistente. Era barato o suficiente para ser o primeiro relógio de muita gente.',
      'Com o tempo, o F-91W apareceu em filmes, videoclipes, escolas e cozinhas. Tornou-se uma referência de design funcional: pequeno, legível e sem nenhum enfeite desnecessário.'
    ],
    curiosidades: [
      'A bateria original tem autonomia estimada em cerca de sete anos.',
      'O modelo tem uma versão com pulseira de aço e outra com caixa dourada.',
      'A simplicidade do mostrador faz dele um objeto reconhecível em qualquer lugar.'
    ],
    legado: 'O F-91W é a prova de que um relógio não precisa ser caro para entrar na história. Ele democratizou o acesso à hora exata.'
  },
  {
    id: 'casio-gshock',
    marca: 'Casio',
    modelo: 'G-Shock DW-5000C',
    ano: 1983,
    pais: 'Japão',
    tipo: 'Resistência extrema',
    art: 'gshock',
    refs: 'DW-5000C',
    tags: ['g-shock', 'resistente', 'digital', 'esporte'],
    titulo: 'O relógio que nasceu para não quebrar',
    resumo: 'O G-Shock foi criado por um engenheiro da Casio que queria um relógio capaz de sobreviver a quedas, choques e pressão.',
    historia: [
      'Kikuo Ibe, engenheiro da Casio, perdeu um relógio de pulso que ganhara do pai e decidiu criar um modelo praticamente indestrutível. A equipe testou protótipos em quedas, vibrações e condições extremas.',
      'O G-Shock DW-5000C chegou ao mercado em 1983, com caixa oca, módulo flutuante e proteção contra choques. A ideia era simples: absorver o impacto antes que ele chegasse ao movimento.'
    ],
    curiosidades: [
      'O nome G-Shock vem de gravity shock, ou choque de gravidade.',
      'O primeiro modelo tinha resistência à água de 200 metros.',
      'O G-Shock se tornou popular em esportes, forças armadas e cultura urbana.'
    ],
    legado: 'O G-Shock criou uma categoria própria: o relógio digital resistente. Poucos modelos têm uma legião de fãs tão fiel.'
  },
  {
    id: 'timex-ironman',
    marca: 'Timex',
    modelo: 'Ironman Triathlon',
    ano: 1986,
    pais: 'Estados Unidos',
    tipo: 'Esporte digital',
    art: 'digital',
    refs: 'Ironman',
    tags: ['digital', 'esporte', 'corrida', 'acessível'],
    titulo: 'O digital dos corredores',
    resumo: 'O Timex Ironman levou cronômetro, alarme e resistência à água para o pulso de uma geração de esportistas amadores.',
    historia: [
      'Nos anos 1980, a popularização da corrida e do triatlo criou demanda por relógios esportivos com funções simples e confiáveis. O Timex Ironman, lançado em 1986, oferecia cronômetro, alarme e resistência à água em uma caixa leve.',
      'O modelo se tornou comum em provas de rua e academias. Décadas depois, continua sendo uma referência de custo-benefício e funcionalidade.'
    ],
    curiosidades: [
      'O nome é uma referência ao triatlo Ironman.',
      'A linha ganhou a iluminação Indiglo nos anos 1990.',
      'Muitas versões usam pulseira de resina e botões grandes para uso durante o exercício.'
    ],
    legado: 'O Ironman ajudou a transformar o relógio esportivo em equipamento de treino acessível. É um clássico funcional.'
  },
  {
    id: 'citizen-aqualand',
    marca: 'Citizen',
    modelo: 'Aqualand',
    ano: 1985,
    pais: 'Japão',
    tipo: 'Mergulho com sensor',
    art: 'diver',
    refs: 'Aqualand',
    tags: ['mergulho', 'sensor', 'digital', 'profundidade'],
    titulo: 'Um computador de mergulho no pulso',
    resumo: 'O Citizen Aqualand colocou um sensor de profundidade e funções de mergulho em um relógio de pulso.',
    historia: [
      'O Citizen Aqualand chegou em 1985 com uma proposta diferente dos relógios de mergulho tradicionais: além de marcar as horas, media a profundidade e o tempo de mergulho.',
      'O sensor e o mostrador digital ajudavam mergulhadores a acompanhar a descida e a duração. O modelo se tornou popular entre mergulhadores esportivos e profissionais.'
    ],
    curiosidades: [
      'O sensor de pressão é uma das partes mais delicadas do relógio.',
      'O Aqualand combina ponteiros analógicos com um mostrador digital.',
      'A linha continua sendo usada por mergulhadores e colecionadores.'
    ],
    legado: 'O Aqualand mostrou que o relógio de pulso podia ser um instrumento de medição, não apenas de horário.'
  },
  {
    id: 'swatch-original',
    marca: 'Swatch',
    modelo: 'Original',
    ano: 1983,
    pais: 'Suíça',
    tipo: 'Design e indústria',
    art: 'round',
    refs: 'Swatch',
    tags: ['plástico', 'colorido', 'quartzo', 'suíço'],
    titulo: 'A salvação colorida da relojoaria suíça',
    resumo: 'O Swatch uniu quartzo, plástico e design pop para criar um relógio barato, divertido e colecionável.',
    historia: [
      'No início dos anos 1980, a indústria relojoeira suíça enfrentava a concorrência do quartzo japonês. A Swatch respondeu com um relógio de plástico, barato, colorido e produzido em larga escala.',
      'O modelo original tinha poucas peças, montagem simplificada e um desenho que mudava a cada coleção. Virou objeto de moda, de coleção e de expressão pessoal.'
    ],
    curiosidades: [
      'O nome Swatch vem de Swiss watch.',
      'O relógio foi projetado para ser produzido em massa com menos componentes.',
      'As coleções coloridas criaram um mercado de edições e séries especiais.'
    ],
    legado: 'O Swatch ajudou a salvar a indústria suíça e mostrou que um relógio pode ser acessível, divertido e desejável ao mesmo tempo.'
  },
  {
    id: 'lange-1',
    marca: 'A. Lange & Söhne',
    modelo: 'Lange 1',
    ano: 1994,
    pais: 'Alemanha',
    tipo: 'Renascimento alemão',
    art: 'dress',
    refs: 'Lange 1',
    tags: ['alemão', 'assimétrico', 'data grande', 'alta relojoaria'],
    titulo: 'A relojoaria alemã volta ao mapa',
    resumo: 'O Lange 1 marcou o renascimento da A. Lange & Söhne depois da reunificação alemã, com um mostrador assimétrico inconfundível.',
    historia: [
      'A A. Lange & Söhne tinha sido nacionalizada e deixou de existir como marca independente após a Segunda Guerra. Com a reunificação alemã, a família Lange decidiu reviver a empresa em Glashütte.',
      'O Lange 1 foi um dos primeiros modelos do renascimento, apresentado em 1994. O mostrador assimétrico, com data grande e indicador de reserva de marcha, virou a nova assinatura da relojoaria alemã.'
    ],
    curiosidades: [
      'O mostrador não segue a simetria tradicional dos relógios suíços.',
      'O mecanismo é montado e acabado em Glashütte, na Alemanha.',
      'A data grande é uma referência à tradição dos relógios de observação alemães.'
    ],
    legado: 'O Lange 1 provou que a Alemanha podia competir no topo da alta relojoaria. É um símbolo de renascimento e identidade.'
  },
  {
    id: 'patek-nautilus',
    marca: 'Patek Philippe',
    modelo: 'Nautilus 3700',
    ano: 1976,
    pais: 'Suíça',
    tipo: 'Esportivo de luxo',
    art: 'cushion',
    refs: 'Nautilus',
    tags: ['aço', 'luxo', 'gerald genta', 'esportivo'],
    titulo: 'O luxo esportivo com forma de vigia',
    resumo: 'Desenhado por Gérald Genta, o Nautilus levou o aço para o universo da alta relojoaria com uma caixa em forma de vigia.',
    historia: [
      'No início dos anos 1970, o Royal Oak mostrou que um relógio de aço podia ser vendido como artigo de luxo. A Patek Philippe entrou nesse território em 1976 com o Nautilus, desenhado por Gérald Genta.',
      'A caixa tinha uma forma inspirada na escotilha de um navio, com orelhas laterais e bracelete integrado. O modelo era esportivo, mas caro e produzido em quantidade limitada.'
    ],
    curiosidades: [
      'O nome Nautilus vem do molusco de concha espiral e lembra o universo marítimo.',
      'O desenho da caixa é assimétrico, com as orelhas laterais em alturas diferentes.',
      'O Nautilus se tornou um dos relógios mais desejados e valorizados do mercado.'
    ],
    legado: 'O Nautilus ajudou a definir o esportivo de luxo. É um dos grandes desenhos de Gérald Genta e um símbolo da Patek moderna.'
  },
  {
    id: 'audemars-piguet-royal-oak',
    marca: 'Audemars Piguet',
    modelo: 'Royal Oak',
    ano: 1972,
    pais: 'Suíça',
    tipo: 'Esportivo de luxo',
    art: 'octagon',
    refs: 'Royal Oak',
    tags: ['aço', 'luxo', 'gerald genta', 'octogonal'],
    titulo: 'O relógio de aço que chocou a alta relojoaria',
    resumo: 'Em 1972, o Royal Oak levou aço, parafusos aparentes e um desenho octogonal para o território reservado ao ouro.',
    historia: [
      'A Audemars Piguet precisava de um modelo que falasse com uma nova geração. A resposta veio de Gérald Genta: um relógio esportivo de aço, com bisel octogonal, parafusos aparentes e bracelete integrado.',
      'O Royal Oak estreou em 1972 e causou estranheza. Como um relógio de aço podia custar tanto quanto um de ouro? O tempo respondeu: o modelo se tornou um dos pilares da alta relojoaria esportiva.'
    ],
    curiosidades: [
      'O nome vem dos carvalhos reais usados pela Marinha britânica em navios.',
      'O bisel tem oito parafusos sextavados, um detalhe que virou assinatura.',
      'O desenho foi uma ruptura com os códigos tradicionais da alta relojoaria.'
    ],
    legado: 'O Royal Oak abriu caminho para o luxo esportivo de aço. É um dos relógios mais importantes do século 20.'
  },
  {
    id: 'tag-heuer-carrera',
    marca: 'TAG Heuer',
    modelo: 'Carrera',
    ano: 1963,
    pais: 'Suíça',
    tipo: 'Cronógrafo de corrida',
    art: 'chrono',
    refs: 'Carrera',
    tags: ['cronógrafo', 'corrida', 'mostrador limpo', 'jack heuer'],
    titulo: 'Um cronógrafo para ler rápido',
    resumo: 'Jack Heuer desenhou o Carrera com um mostrador limpo e legível, pensado para pilotos e entusiastas do automobilismo.',
    historia: [
      'No início dos anos 1960, Jack Heuer percebeu que os cronógrafos de corrida estavam ficando visualmente carregados. Ele queria um mostrador fácil de ler, com contadores claros e sem excesso de informação.',
      'O Carrera estreou em 1963 e se tornou um dos cronógrafos mais elegantes da relojoaria esportiva. O nome homenageia a Carrera Panamericana, uma prova automobilística perigosa e famosa.'
    ],
    curiosidades: [
      'O nome Carrera foi escolhido em referência à corrida mexicana.',
      'A primeira geração usava movimentos Valjoux e tinha mostrador de três contadores.',
      'O desenho limpo ajudou a diferenciar o modelo dos cronógrafos mais carregados da época.'
    ],
    legado: 'O Carrera mostrou que um cronógrafo de corrida podia ser legível e elegante. É um dos grandes nomes do automobilismo no pulso.'
  }
];

/* ---------------- normalização ---------------- */

function normalizeStory(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const photos = Array.isArray(raw.photos)
    ? raw.photos.filter((photo) => typeof photo === 'string' && photo.startsWith('data:image')).slice(0, 3)
    : [];
  const texto = String(raw.texto || '').slice(0, 3000);
  const titulo = String(raw.titulo || '').slice(0, 120);

  if (!texto.trim() && !photos.length && !titulo.trim()) return null;

  return {
    titulo,
    como: STORY_HOW_OPTIONS.includes(raw.como) ? raw.como : 'Comprei',
    quando: String(raw.quando || '').slice(0, 60),
    local: String(raw.local || '').slice(0, 120),
    texto,
    photos,
    mostrarNoMuseu: raw.mostrarNoMuseu !== false,
    criadoEm: Number(raw.criadoEm) || Date.now(),
    atualizadoEm: Number(raw.atualizadoEm) || Date.now()
  };
}

function storyFromWatch(watch) {
  return normalizeStory(watch?.historia);
}

function storyTitle(story, watch) {
  const title = String(story?.titulo || '').trim();
  if (title) return title;
  const name = [watch?.marca, watch?.modelo].filter(Boolean).join(' ');
  return name ? `A história do ${name}` : 'Minha história';
}

function storyExcerpt(text, max = 190) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

function storyPhotoList(story) {
  if (!story || !Array.isArray(story.photos)) return [];
  return story.photos.filter((photo) => typeof photo === 'string' && photo.startsWith('data:image')).slice(0, 3);
}

function historyEntries() {
  return HISTORY_WATCHES.slice().sort((a, b) => (a.ano || 0) - (b.ano || 0) || a.marca.localeCompare(b.marca, 'pt-BR'));
}

function findHistoryEntry(id) {
  return HISTORY_WATCHES.find((entry) => entry.id === id) || null;
}

function historyEraOf(year) {
  const value = Number(year) || 0;
  if (value < 1950) return 'pre-1950';
  if (value < 1970) return '1950-1969';
  if (value < 1990) return '1970-1989';
  return '1990';
}

function historyArtSvg(kind) {
  const strap = '<rect x="47" y="4" width="26" height="112" rx="10" fill="none" stroke="currentColor" stroke-width="2" opacity=".55"/>';
  const dial = '#fffdf8';
  let face = '';

  switch (kind) {
    case 'square':
      face = `<rect x="23" y="23" width="74" height="74" rx="9" fill="${dial}" stroke="currentColor" stroke-width="3"/>
        <rect x="30" y="30" width="60" height="60" rx="4" fill="none" stroke="currentColor" stroke-width="1" opacity=".45"/>
        <circle cx="32" cy="32" r="2.2" fill="currentColor"/><circle cx="88" cy="32" r="2.2" fill="currentColor"/>
        <circle cx="32" cy="88" r="2.2" fill="currentColor"/><circle cx="88" cy="88" r="2.2" fill="currentColor"/>
        <path d="M60 40v20l12 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="2" fill="currentColor"/>`;
      break;
    case 'tank':
      face = `<rect x="17" y="27" width="86" height="66" rx="6" fill="${dial}" stroke="currentColor" stroke-width="3"/>
        <path d="M15 38v44M105 38v44" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <rect x="28" y="37" width="64" height="46" rx="2" fill="none" stroke="currentColor" stroke-width="1" opacity=".45"/>
        <path d="M60 46v16l10 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="1.8" fill="currentColor"/>`;
      break;
    case 'reverso':
      face = `<rect x="27" y="19" width="66" height="82" rx="5" fill="${dial}" stroke="currentColor" stroke-width="3"/>
        <rect x="33" y="25" width="54" height="70" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity=".4"/>
        <path d="M27 31h66M27 89h66" stroke="currentColor" stroke-width="2" opacity=".65"/>
        <path d="M60 42v24l12 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="1.8" fill="currentColor"/>`;
      break;
    case 'cushion':
      face = `<rect x="22" y="22" width="76" height="76" rx="24" fill="${dial}" stroke="currentColor" stroke-width="3"/>
        <circle cx="60" cy="60" r="29" fill="none" stroke="currentColor" stroke-width="1" opacity=".45"/>
        <path d="M60 36v24l14 9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="1.8" fill="currentColor"/>`;
      break;
    case 'octagon':
      face = `<path d="M38 22h44l16 16v44L82 98H38L22 82V38Z" fill="${dial}" stroke="currentColor" stroke-width="3"/>
        <path d="M42 31h36l11 11v36L78 89H42L31 78V42Z" fill="none" stroke="currentColor" stroke-width="1" opacity=".45"/>
        <circle cx="31" cy="31" r="2" fill="currentColor"/><circle cx="89" cy="31" r="2" fill="currentColor"/>
        <circle cx="31" cy="89" r="2" fill="currentColor"/><circle cx="89" cy="89" r="2" fill="currentColor"/>
        <path d="M60 38v22l13 9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>`;
      break;
    case 'digital':
      face = `<rect x="27" y="31" width="66" height="58" rx="7" fill="${dial}" stroke="currentColor" stroke-width="3"/>
        <rect x="33" y="39" width="54" height="27" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"/>
        <text x="60" y="58" text-anchor="middle" font-family="Consolas, monospace" font-size="14" font-weight="700" fill="currentColor">12:00</text>
        <text x="49" y="79" text-anchor="middle" font-family="Consolas, monospace" font-size="6" fill="currentColor" opacity=".7">MODE</text>
        <text x="72" y="79" text-anchor="middle" font-family="Consolas, monospace" font-size="6" fill="currentColor" opacity=".7">LIGHT</text>`;
      break;
    case 'gshock':
      face = `<rect x="23" y="23" width="74" height="74" rx="15" fill="${dial}" stroke="currentColor" stroke-width="4"/>
        <rect x="31" y="33" width="58" height="54" rx="9" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".55"/>
        <circle cx="33" cy="33" r="2.2" fill="currentColor"/><circle cx="87" cy="33" r="2.2" fill="currentColor"/>
        <circle cx="33" cy="87" r="2.2" fill="currentColor"/><circle cx="87" cy="87" r="2.2" fill="currentColor"/>
        <text x="60" y="59" text-anchor="middle" font-family="Consolas, monospace" font-size="15" font-weight="700" fill="currentColor">10:08</text>
        <text x="60" y="73" text-anchor="middle" font-family="Consolas, monospace" font-size="6" fill="currentColor" opacity=".7">G-SHOCK</text>`;
      break;
    case 'chrono':
      face = `<circle cx="60" cy="60" r="37" fill="${dial}" stroke="currentColor" stroke-width="3"/>
        <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" stroke-width="1" opacity=".4"/>
        <circle cx="46" cy="49" r="8" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".7"/>
        <circle cx="74" cy="49" r="8" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".7"/>
        <circle cx="60" cy="74" r="8" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".7"/>
        <path d="M60 35v25l13 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>`;
      break;
    case 'diver':
      face = `<circle cx="60" cy="60" r="39" fill="${dial}" stroke="currentColor" stroke-width="3"/>
        <circle cx="60" cy="60" r="31" fill="none" stroke="currentColor" stroke-width="1" opacity=".4"/>
        <path d="M60 18v8M60 94v8M18 60h8M94 60h8M30 30l6 6M84 84l6 6M90 30l-6 6M36 84l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="60" cy="24" r="3" fill="currentColor"/>
        <path d="M60 38v22l12 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="1.8" fill="currentColor"/>`;
      break;
    case 'pilot':
      face = `<circle cx="60" cy="60" r="39" fill="${dial}" stroke="currentColor" stroke-width="3"/>
        <path d="M60 21l-7 11h14Z" fill="currentColor"/>
        <path d="M60 40v20l12 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="1.8" fill="currentColor"/>`;
      break;
    case 'shield':
      face = `<path d="M60 20 94 42 84 94H36L26 42Z" fill="${dial}" stroke="currentColor" stroke-width="3"/>
        <path d="M60 29v28l13 9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="1.8" fill="currentColor"/>`;
      break;
    case 'dress':
      face = `<circle cx="60" cy="60" r="34" fill="${dial}" stroke="currentColor" stroke-width="2.5"/>
        <circle cx="60" cy="60" r="27" fill="none" stroke="currentColor" stroke-width="1" opacity=".4"/>
        <path d="M60 38v22l11 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="1.6" fill="currentColor"/>`;
      break;
    default:
      face = `<circle cx="60" cy="60" r="37" fill="${dial}" stroke="currentColor" stroke-width="3"/>
        <circle cx="60" cy="60" r="29" fill="none" stroke="currentColor" stroke-width="1" opacity=".4"/>
        <path d="M60 36v24l13 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="1.8" fill="currentColor"/>`;
  }

  return `<svg class="history-art-svg" viewBox="0 0 120 120" aria-hidden="true">${strap}${face}</svg>`;
}

/* ---------------- listas e cartões ---------------- */

function historyFilteredEntries() {
  const q = normText(state.historyQuery || '');
  const era = state.historyEra || 'todas';

  return historyEntries().filter((entry) => {
    if (era !== 'todas' && historyEraOf(entry.ano) !== era) return false;
    if (!q) return true;
    return normText([
      entry.marca, entry.modelo, entry.ano, entry.pais, entry.tipo,
      entry.titulo, entry.resumo, entry.legado, (entry.tags || []).join(' ')
    ].join(' ')).includes(q);
  });
}

function historyCardHtml(entry) {
  return `<article class="history-card">
    <div class="history-art history-art-${esc(entry.art)}">${historyArtSvg(entry.art)}</div>
    <div class="history-card-body">
      <span class="history-era">${esc(entry.ano)} · ${esc(entry.pais)} · ${esc(entry.tipo)}</span>
      <h3>${esc(entry.marca)} ${esc(entry.modelo)}</h3>
      <p class="history-card-title">${esc(entry.titulo)}</p>
      <p class="history-card-summary">${esc(entry.resumo)}</p>
      <div class="history-card-actions">
        <button class="btn btn-ghost btn-sm" type="button" data-history-open="${esc(entry.id)}">Ler a história</button>
        <button class="btn btn-ghost btn-sm" type="button" data-history-use="${esc(entry.id)}">Usar como base</button>
      </div>
    </div>
  </article>`;
}

function storyCardHtml(watch, story) {
  const photos = storyPhotoList(story);
  const image = photos[0] || watch.photo;
  const title = storyTitle(story, watch);
  const meta = [story.como, story.quando, story.local].filter(Boolean).join(' · ');
  const href = `#/peca/${encodeURIComponent(watch.id)}`;

  return `<article class="story-card">
    <a class="story-card-photo" href="${href}" aria-label="Abrir ficha de ${esc(watch.marca)} ${esc(watch.modelo)}">
      ${image ? `<img src="${esc(image)}" alt="Foto da história de ${esc(watch.marca)} ${esc(watch.modelo)}" loading="lazy">` : `<div class="story-placeholder">${historyArtSvg('round')}</div>`}
    </a>
    <div class="story-card-body">
      <span class="story-kicker">Minha história</span>
      <h4>${esc(title)}</h4>
      <p class="story-watch">${esc(watch.marca)} ${esc(watch.modelo)}${watch.referencia ? ` · Ref. ${esc(watch.referencia)}` : ''}</p>
      ${meta ? `<p class="story-meta">${esc(meta)}</p>` : ''}
      <p class="story-excerpt">${esc(storyExcerpt(story.texto))}</p>
      <div class="story-card-actions">
        <a class="btn btn-ghost btn-sm" href="${href}">Abrir ficha</a>
        <button class="btn btn-ghost btn-sm" type="button" data-story-edit="${esc(watch.id)}">Editar história</button>
      </div>
    </div>
  </article>`;
}

function renderStoryList() {
  const list = $('#story-list');
  if (!list) return;

  const stories = state.watches
    .filter((watch) => watch.historia && watch.historia.mostrarNoMuseu !== false)
    .sort((a, b) => (b.historia.atualizadoEm || 0) - (a.historia.atualizadoEm || 0));

  const count = $('#story-count');
  if (count) count.textContent = stories.length
    ? `${stories.length} história${stories.length === 1 ? '' : 's'} sua${stories.length === 1 ? '' : 's'}`
    : 'Nenhuma história sua ainda';

  list.innerHTML = stories.length
    ? stories.map((watch) => storyCardHtml(watch, watch.historia)).join('')
    : `<div class="story-empty">
        <div class="story-empty-mark">${historyArtSvg('round')}</div>
        <div>
          <h4>A sua peça também tem história</h4>
          <p>Conte como você comprou, ganhou ou herdou. Pode incluir fotos, o ano e quem estava com você.</p>
          <button class="btn btn-gold btn-sm" type="button" id="btn-story-empty">Contar a primeira história</button>
        </div>
      </div>`;
}

function renderHistoryView() {
  const search = $('#history-search');
  if (search && search.value !== state.historyQuery) search.value = state.historyQuery;

  const era = $('#history-era');
  if (era && era.value !== state.historyEra) era.value = state.historyEra;

  const items = historyFilteredEntries();
  const list = $('#history-list');
  if (list) {
    list.innerHTML = items.length
      ? items.map(historyCardHtml).join('')
      : `<div class="history-empty">
          <h4>Nenhum relógio encontrado</h4>
          <p>Tente outra marca, outro modelo ou remova o filtro de época.</p>
        </div>`;
  }

  const count = $('#history-count');
  if (count) {
    count.textContent = (state.historyQuery || state.historyEra !== 'todas')
      ? `${items.length} de ${HISTORY_WATCHES.length} relógios`
      : `${HISTORY_WATCHES.length} relógios na linha do tempo`;
  }

  renderStoryList();
}

/* ---------------- história editorial ---------------- */

function historyDetailHtml(entry) {
  const facts = [
    ['Época', entry.ano], ['Origem', entry.pais], ['Tipo', entry.tipo], ['Referência', entry.refs || '—']
  ];

  return `<div class="history-detail-hero">
    <div class="history-art history-art-${esc(entry.art)}">${historyArtSvg(entry.art)}</div>
    <div>
      <span class="history-era">${esc(entry.ano)} · ${esc(entry.pais)}</span>
      <h4>${esc(entry.marca)} ${esc(entry.modelo)}</h4>
      <p class="history-detail-title">${esc(entry.titulo)}</p>
      <p class="history-detail-summary">${esc(entry.resumo)}</p>
    </div>
  </div>

  <div class="history-facts">
    ${facts.map(([label, value]) => `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('')}
  </div>

  <div class="history-story-text">
    ${(entry.historia || []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}
  </div>

  <details class="history-curiosities" open>
    <summary>Curiosidades</summary>
    <ul>${(entry.curiosidades || []).map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
  </details>

  <div class="history-legacy">
    <span>Por que importa</span>
    <p>${esc(entry.legado)}</p>
  </div>

  <div class="form-actions">
    <button class="btn btn-gold" type="button" data-history-use="${esc(entry.id)}">Usar como base para avaliar</button>
    <button class="btn btn-ghost" type="button" data-close-dialog>Fechar</button>
  </div>

  <p class="hint history-disclaimer">Resumo editorial para conhecer a história. Datas, versões e detalhes podem variar conforme a fonte; confirme antes de usar como referência de compra.</p>`;
}

function openHistoryStory(id) {
  const entry = findHistoryEntry(id);
  if (!entry) return;

  $('#history-dialog-title').textContent = `${entry.marca} ${entry.modelo}`;
  $('#history-dialog-kicker').textContent = `Relógio histórico · ${entry.ano}`;
  $('#history-dialog-body').innerHTML = historyDetailHtml(entry);
  openDialog($('#history-dialog'));
}

function startFromHistory(entryOrId) {
  const entry = typeof entryOrId === 'string' ? findHistoryEntry(entryOrId) : entryOrId;
  if (!entry) return;

  state.prefill = {
    marca: entry.marca,
    modelo: entry.modelo,
    referencia: entry.refs || '',
    ano: entry.ano,
    returnTo: '#/historias'
  };
  closeDialogs();

  if (location.hash === '#/nova') route();
  else location.hash = '#/nova';
}

/* ---------------- painel de história na ficha ---------------- */

function storyPanelHtml(watch, isPublic) {
  const story = storyFromWatch(watch);
  const photos = storyPhotoList(story);

  if (!story) {
    if (isPublic) return '';
    return `<div class="panel story-panel story-panel-empty no-print">
      <span class="story-kicker">História da peça</span>
      <h3 class="story-panel-title">Esta peça tem uma história?</h3>
      <p class="story-meta">Conte como você comprou, ganhou ou herdou. Pode incluir o ano, quem estava com você e fotos. Fica salvo só neste aparelho.</p>
      <button class="btn btn-ghost btn-sm" type="button" id="btn-story-add">Contar a história</button>
    </div>`;
  }

  const meta = [story.como, story.quando, story.local].filter(Boolean).join(' · ');

  return `<div class="panel story-panel${isPublic ? '' : ' no-print'}">
    <div class="story-panel-head">
      <div>
        <span class="story-kicker">História da peça</span>
        <h3 class="story-panel-title">${esc(storyTitle(story, watch))}</h3>
        ${meta ? `<p class="story-meta">${esc(meta)}</p>` : ''}
      </div>
      ${isPublic ? '' : '<button class="btn btn-ghost btn-sm" type="button" id="btn-story-edit">Editar história</button>'}
    </div>
    <p class="story-text">${esc(story.texto)}</p>
    ${photos.length ? `<div class="story-photo-strip">
      ${photos.map((photo, index) => `<button class="story-photo-thumb" type="button" data-story-photo-index="${index}" aria-label="Abrir foto ${index + 1} da história">
        <img src="${esc(photo)}" alt="Foto ${index + 1} da história" loading="lazy">
      </button>`).join('')}
    </div>` : ''}
    <p class="story-saved">Salva em ${fmtDate(story.atualizadoEm)} neste aparelho.</p>
  </div>`;
}

/* ---------------- editor de história ---------------- */

function storyDraftFor(watch) {
  const story = storyFromWatch(watch);
  return {
    watchId: watch?.id || '',
    titulo: story?.titulo || '',
    como: story?.como || 'Comprei',
    quando: story?.quando || '',
    local: story?.local || '',
    texto: story?.texto || '',
    photos: story ? story.photos.slice(0, 3) : [],
    mostrarNoMuseu: story ? story.mostrarNoMuseu !== false : true,
    criadoEm: story?.criadoEm || Date.now(),
    atualizadoEm: story?.atualizadoEm || Date.now()
  };
}

function openStoryEditor(opts = {}) {
  if (!state.watches.length) {
    toast('Cadastre uma peça primeiro para contar a história dela.');
    closeDialogs();
    if (location.hash === '#/nova') route();
    else location.hash = '#/nova';
    return;
  }

  const watch = opts.watch
    || state.watches.find((item) => item.id === opts.watchId)
    || state.watches[0];
  const story = storyFromWatch(watch);

  state.storyDraft = storyDraftFor(watch);
  state.storyLockWatch = !!opts.lockWatch || !!opts.watch;
  state.storyBusy = false;

  $('#story-dialog-title').textContent = story ? 'Editar história' : 'Contar a história';
  $('#story-dialog-kicker').textContent = `${watch.marca} ${watch.modelo}`.trim();
  renderStoryForm();
  openDialog($('#story-dialog'));
}

function renderStoryForm() {
  const body = $('#story-form-body');
  if (!body) return;

  if (!state.storyDraft) return;

  if (!state.watches.length) {
    body.innerHTML = `<div class="story-empty">
      <h4>Cadastre uma peça primeiro</h4>
      <p>Depois de salvar um relógio, você pode contar como ele chegou até você.</p>
      <button class="btn btn-gold" type="button" data-story-new-watch>Cadastrar relógio</button>
    </div>`;
    return;
  }

  const draft = state.storyDraft;
  const selected = state.watches.find((watch) => watch.id === draft.watchId) || state.watches[0];
  const hasStory = !!storyFromWatch(selected);
  const watchOptions = state.watches.map((watch) => {
    const label = `${watch.marca} ${watch.modelo}${watch.referencia ? ` · ${watch.referencia}` : ''}`;
    return `<option value="${esc(watch.id)}" ${watch.id === draft.watchId ? 'selected' : ''}>${esc(label)}</option>`;
  }).join('');

  body.innerHTML = `
    ${state.storyLockWatch ? `<div class="story-watch-locked">
      <span>Peça</span>
      <strong>${esc(selected.marca)} ${esc(selected.modelo)}</strong>
      <small>${selected.referencia ? `Ref. ${esc(selected.referencia)}` : 'Sem referência'}${selected.ano ? ` · ${esc(selected.ano)}` : ''}</small>
    </div>` : `<label class="field"><span>Peça do catálogo</span>
      <select id="story-watch-select">${watchOptions}</select>
    </label>`}

    <div class="story-form-grid">
      <label class="field story-title-field"><span>Título da história (opcional)</span>
        <input id="story-title" maxlength="120" value="${esc(draft.titulo)}" placeholder="Ex.: O relógio do meu avô">
      </label>

      <div class="grid-2">
        <label class="field"><span>Como você conseguiu?</span>
          <select id="story-how">
            ${STORY_HOW_OPTIONS.map((option) => `<option value="${esc(option)}" ${option === draft.como ? 'selected' : ''}>${esc(option)}</option>`).join('')}
          </select>
        </label>
        <label class="field"><span>Quando?</span>
          <input id="story-when" maxlength="60" value="${esc(draft.quando)}" placeholder="2019, verão de 2015…">
        </label>
      </div>

      <label class="field"><span>Onde / com quem?</span>
        <input id="story-where" maxlength="120" value="${esc(draft.local)}" placeholder="Ex.: na loja do meu bairro, com meu pai">
      </label>

      <label class="field"><span>Sua história</span>
        <textarea id="story-text" rows="6" maxlength="3000" placeholder="Conte como a peça chegou até você, o que ela significa, se foi presente, herança, compra…">${esc(draft.texto)}</textarea>
      </label>

      <div class="story-photos-block">
        <span class="field-label">Fotos da história (até 3)</span>
        <div id="story-photos"></div>
      </div>

      <label class="switch">
        <input type="checkbox" id="story-show" ${draft.mostrarNoMuseu ? 'checked' : ''}>
        <span>Mostrar na aba Histórias</span>
      </label>
    </div>

    <div class="form-actions">
      <button class="btn btn-gold" type="button" data-story-save>Salvar história</button>
      <button class="btn btn-ghost" type="button" data-story-cancel>Cancelar</button>
      ${hasStory ? '<button class="btn btn-danger" type="button" data-story-delete>Excluir história</button>' : ''}
    </div>
    <p class="hint">As fotos e o texto ficam salvos apenas neste aparelho. Faça backup no menu para não perder.</p>
  `;

  renderStoryPhotos();
}

function renderStoryPhotos() {
  const box = $('#story-photos');
  if (!box || !state.storyDraft) return;

  const photos = state.storyDraft.photos || [];
  const tokens = photos.map((photo, index) => `<div class="story-photo-item">
    <button class="story-photo-open" type="button" data-story-photo-open="${index}" aria-label="Ver foto ${index + 1}">
      <img src="${esc(photo)}" alt="Foto ${index + 1} da história">
    </button>
    <button class="story-photo-remove" type="button" data-story-photo-remove="${index}" aria-label="Remover foto ${index + 1}">Remover</button>
  </div>`).join('');

  const add = state.storyBusy
    ? `<div class="story-photo-add is-busy"><span class="spinner"></span><span>Preparando…</span></div>`
    : photos.length < 3
      ? `<label class="story-photo-add">
          <span class="story-photo-plus">+</span>
          <span>Adicionar foto</span>
          <input type="file" accept="image/*" capture="environment" data-story-photo hidden>
        </label>`
      : '';

  box.innerHTML = `<div class="story-photo-grid">${tokens}${add}</div>
    <p class="hint">${photos.length}/3 fotos · use luz natural e mostre a peça com clareza.</p>`;
}

async function handleStoryPhoto(file) {
  if (!file || !state.storyDraft) return;
  if (!file.type.startsWith('image/')) {
    toast('Escolha um arquivo de imagem.');
    return;
  }
  if (state.storyDraft.photos.length >= 3) {
    toast('Você pode adicionar até 3 fotos por história.');
    return;
  }

  state.storyBusy = true;
  renderStoryPhotos();

  try {
    const data = await compressFile(file, 1000, 0.7, '#faf6ee');
    if (!data) throw new Error('compressão');
    state.storyDraft.photos.push(data);
    toast('Foto adicionada à história.');
  } catch (err) {
    toast('Não foi possível preparar essa foto.');
  }

  state.storyBusy = false;
  renderStoryPhotos();
}

function collectStoryForm() {
  if (!state.storyDraft) return;
  const draft = state.storyDraft;

  draft.titulo = $('#story-title')?.value.trim().slice(0, 120) || '';
  draft.como = $('#story-how')?.value || 'Comprei';
  draft.quando = $('#story-when')?.value.trim().slice(0, 60) || '';
  draft.local = $('#story-where')?.value.trim().slice(0, 120) || '';
  draft.texto = $('#story-text')?.value.trim().slice(0, 3000) || '';
  draft.mostrarNoMuseu = $('#story-show') ? $('#story-show').checked : true;
}

function saveStory() {
  if (!state.storyDraft) return;
  collectStoryForm();

  const draft = state.storyDraft;
  const watch = state.watches.find((item) => item.id === draft.watchId);
  if (!watch) {
    toast('Escolha uma peça do catálogo.');
    return;
  }
  if (draft.texto.trim().length < 10) {
    toast('Escreva pelo menos algumas palavras para contar a história.');
    $('#story-text')?.focus();
    return;
  }

  const story = normalizeStory({
    ...draft,
    criadoEm: draft.criadoEm || Date.now(),
    atualizadoEm: Date.now()
  });
  if (!story) return;

  const previous = watch.historia;
  const previousUpdated = watch.atualizadoEm;
  watch.historia = story;
  watch.atualizadoEm = Date.now();

  if (!persist()) {
    watch.historia = previous;
    watch.atualizadoEm = previousUpdated;
    return;
  }

  const watchId = watch.id;
  state.storyDraft = null;
  closeDialogs();
  toast('História salva.');

  if (location.hash === `#/peca/${encodeURIComponent(watchId)}`) renderDetail(watchId);
  else renderHistoryView();
}

function deleteStory() {
  if (!state.storyDraft) return;
  const watch = state.watches.find((item) => item.id === state.storyDraft.watchId);
  if (!watch || !watch.historia) return;

  if (!window.confirm(`Excluir a história de “${watch.marca} ${watch.modelo}”?`)) return;

  const previous = watch.historia;
  const previousUpdated = watch.atualizadoEm;
  watch.historia = null;
  watch.atualizadoEm = Date.now();

  if (!persist()) {
    watch.historia = previous;
    watch.atualizadoEm = previousUpdated;
    return;
  }

  const watchId = watch.id;
  state.storyDraft = null;
  closeDialogs();
  toast('História excluída.');

  if (location.hash === `#/peca/${encodeURIComponent(watchId)}`) renderDetail(watchId);
  else renderHistoryView();
}

function loadStoryForWatch(watchId) {
  const watch = state.watches.find((item) => item.id === watchId);
  if (!watch || !state.storyDraft) return;

  state.storyDraft = storyDraftFor(watch);
  state.storyLockWatch = false;
  $('#story-dialog-kicker').textContent = `${watch.marca} ${watch.modelo}`.trim();
  renderStoryForm();
}

/* ---------------- visualizador de foto ---------------- */

function openPhotoDialog(src, alt) {
  if (!src) return;
  $('#photo-full').src = src;
  $('#photo-full').alt = alt || 'Foto ampliada';
  $('#photo-caption').textContent = alt || '';
  openDialog($('#photo-dialog'));
}

/* ---------------- eventos ---------------- */

function bindHistoryEvents() {
  $('#history-search')?.addEventListener('input', (event) => {
    state.historyQuery = event.target.value;
    renderHistoryView();
  });

  $('#history-era')?.addEventListener('change', (event) => {
    state.historyEra = event.target.value;
    renderHistoryView();
  });

  $('#history-list')?.addEventListener('click', (event) => {
    const use = event.target.closest('[data-history-use]');
    if (use) {
      startFromHistory(use.dataset.historyUse);
      return;
    }
    const open = event.target.closest('[data-history-open]');
    if (open) openHistoryStory(open.dataset.historyOpen);
  });

  $('#history-dialog')?.addEventListener('click', (event) => {
    const use = event.target.closest('[data-history-use]');
    if (use) startFromHistory(use.dataset.historyUse);
  });

  $('#story-list')?.addEventListener('click', (event) => {
    if (event.target.closest('#btn-story-empty')) {
      openStoryEditor({ standalone: true });
      return;
    }
    const edit = event.target.closest('[data-story-edit]');
    if (edit) openStoryEditor({ watchId: edit.dataset.storyEdit, lockWatch: true });
  });

  $('#btn-story-new')?.addEventListener('click', () => openStoryEditor({ standalone: true }));

  $('#btn-story-menu')?.addEventListener('click', () => {
    closeDialogs();
    if (location.hash === '#/historias') route();
    else location.hash = '#/historias';
  });

  $('#story-dialog')?.addEventListener('click', (event) => {
    if (event.target.closest('[data-story-save]')) saveStory();
    else if (event.target.closest('[data-story-delete]')) deleteStory();
    else if (event.target.closest('[data-story-cancel]')) closeDialogs();
    else if (event.target.closest('[data-story-new-watch]')) {
      closeDialogs();
      location.hash = '#/nova';
    } else {
      const remove = event.target.closest('[data-story-photo-remove]');
      if (remove) {
        const index = Number(remove.dataset.storyPhotoRemove);
        state.storyDraft.photos.splice(index, 1);
        renderStoryPhotos();
        return;
      }
      const open = event.target.closest('[data-story-photo-open]');
      if (open) {
        const index = Number(open.dataset.storyPhotoOpen);
        openPhotoDialog(state.storyDraft.photos[index], `Foto ${index + 1} da história`);
      }
    }
  });

  $('#story-dialog')?.addEventListener('change', (event) => {
    if (event.target.matches('#story-watch-select')) {
      loadStoryForWatch(event.target.value);
      return;
    }
    if (event.target.matches('[data-story-photo]')) {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (file) handleStoryPhoto(file);
    }
  });

  $('#story-dialog')?.addEventListener('input', (event) => {
    if (!state.storyDraft) return;
    const map = {
      'story-title': 'titulo',
      'story-how': 'como',
      'story-when': 'quando',
      'story-where': 'local',
      'story-text': 'texto'
    };
    const field = map[event.target.id];
    if (field) state.storyDraft[field] = event.target.value;
    if (event.target.id === 'story-show') state.storyDraft.mostrarNoMuseu = event.target.checked;
  });
}
