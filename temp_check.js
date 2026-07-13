
// â•â• SUPABASE â•â•
window._sbClient = null
const SUPABASE_URL = 'https://zjsadtpxdexlflfykqzy.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqc2FkdHB4ZGV4bGZsZnlrcXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NDM5NzYsImV4cCI6MjA5OTUxOTk3Nn0.IlssVUm27JoHsK1oPhO6e5yWL_nkPWgfI_4zBfeziic'
try {
  if (window.supabase && window.supabase.createClient) {
    window._sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON)
    console.log('[CSD] Supabase OK')
  } else {
    console.error('[CSD] Supabase SDK nÃ£o carregou')
  }
} catch(e) {
  console.error('[CSD] Erro ao init Supabase:', e)
}

// â•â• TESTES â•â•
const TESTS = [
  {id:'agachamento', eyebrow:'Teste 1 â€” Mobilidade', title:'Agachamento completo (cÃ³cora)',
    video:'agachamento completo â€” cÃ³cora',
    videoEmbed:'<div id="ifr_6a511290de3fa61569679f68_wrapper" style="margin: 0 auto; width: 100%;"><div style="position: relative; padding: 56.25% 0 0 0;" id="ifr_6a511290de3fa61569679f68_aspect"><iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_6a511290de3fa61569679f68" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin" onload="this.onload=null, this.src=\'https://scripts.converteai.net/5129f968-9c0f-495d-9f4c-842e6c88a022/players/6a511290de3fa61569679f68/v4/embed.html\'+(location.search||\'?\')+\'&vl=\'+encodeURIComponent(location.href)"></iframe></div></div>',
    videoScript:'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js',
    hint:'Marque tudo que aconteceu durante o movimento',
    options:[
      {id:'calc', label:'Calcanhares saÃ­ram do chÃ£o', sub:'NÃ£o consegui manter os pÃ©s planos', signals:['tornozelo']},
      {id:'fundo', label:'NÃ£o consegui descer completamente', sub:'GlÃºteos nÃ£o chegaram perto dos calcanhares', signals:['tornozelo','quadril_mob']},
      {id:'ok', label:'Consegui sem dificuldade', sub:'Desci completamente com calcanhares no chÃ£o', signals:[], ok:true}
    ]},
  {id:'pelvica', eyebrow:'Teste 2 â€” ForÃ§a de glÃºteo', title:'ElevaÃ§Ã£o pÃ©lvica',
    video:'elevaÃ§Ã£o pÃ©lvica â€” ponte',
    videoEmbed:'<div id="ifr_6a51134e5480813d4da2ecd2_wrapper" style="margin: 0 auto; width: 100%;"><div style="position: relative; padding: 56.25% 0 0 0;" id="ifr_6a51134e5480813d4da2ecd2_aspect"><iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_6a51134e5480813d4da2ecd2" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin" onload="this.onload=null, this.src=\'https://scripts.converteai.net/5129f968-9c0f-495d-9f4c-842e6c88a022/players/6a51134e5480813d4da2ecd2/v4/embed.html\'+(location.search||\'?\')+\'&vl=\'+encodeURIComponent(location.href)"></iframe></div></div>',
    videoScript:'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js',
    hint:'O que aconteceu durante o movimento?',
    options:[
      {id:'nao_mant', label:'NÃ£o consegui manter a posiÃ§Ã£o', sub:'Quadril caiu antes dos 30 segundos', signals:['gluteo']},
      {id:'caimbra', label:'Senti cÃ¢imbra nos isquiotibiais', sub:'Dor ou cÃ¢imbra na parte de trÃ¡s da coxa', signals:['gluteo']},
      {id:'ok', label:'Consegui manter sem dificuldade', sub:'Quadril estÃ¡vel durante todo o tempo', signals:[], ok:true}
    ]},
  {id:'equilibrio', eyebrow:'Teste 3 â€” PropriocepÃ§Ã£o', title:'EquilÃ­brio unilateral',
    video:'equilÃ­brio unilateral',
    videoEmbed:'<div id="ifr_6a511317922888ce1f5413af_wrapper" style="margin: 0 auto; width: 100%;"><div style="position: relative; padding: 56.25% 0 0 0;" id="ifr_6a511317922888ce1f5413af_aspect"><iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_6a511317922888ce1f5413af" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin" onload="this.onload=null, this.src=\'https://scripts.converteai.net/5129f968-9c0f-495d-9f4c-842e6c88a022/players/6a511317922888ce1f5413af/v4/embed.html\'+(location.search||\'?\')+\'&vl=\'+encodeURIComponent(location.href)"></iframe></div></div>',
    videoScript:'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js', hint:'Qual foi seu desempenho?',
    options:[
      {id:'aberto_fail', label:'NÃ£o consegui manter com olhos abertos', sub:'CaÃ­ ou precisei apoiar antes dos 30s', signals:['propriocepcao']},
      {id:'fechado_fail', label:'Consegui abertos, mas oscilei com olhos fechados', sub:'Instabilidade aumentou ao fechar os olhos', signals:['propriocepcao']},
      {id:'ok', label:'FÃ¡cil nos dois â€” abertos e fechados', sub:'EstÃ¡vel sem oscilaÃ§Ã£o relevante', signals:[], ok:true}
    ]},
  {id:'panturrilha', eyebrow:'Teste 4 â€” ForÃ§a + Mobilidade', title:'ElevaÃ§Ã£o de panturrilha unilateral',
    video:'elevaÃ§Ã£o de panturrilha unilateral',
    videoEmbed:'<div id="ifr_6a51124c922888ce1f541344_wrapper" style="margin: 0 auto; width: 100%;"><div style="position: relative; padding: 56.25% 0 0 0;" id="ifr_6a51124c922888ce1f541344_aspect"><iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_6a51124c922888ce1f541344" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin" onload="this.onload=null, this.src=\'https://scripts.converteai.net/5129f968-9c0f-495d-9f4c-842e6c88a022/players/6a51124c922888ce1f541344/v4/embed.html\'+(location.search||\'?\')+\'&vl=\'+encodeURIComponent(location.href)"></iframe></div></div>',
    videoScript:'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js', hint:'Marque tudo que aconteceu',
    options:[
      {id:'nao_rep', label:'Dificuldade em completar as 10 repetiÃ§Ãµes', sub:'Fraqueza ou fadiga na panturrilha', signals:['panturrilha']},
      {id:'dor_torn', label:'Senti dor ou limitaÃ§Ã£o no tornozelo', sub:'Dor local ou amplitude de movimento reduzida', signals:['tornozelo']},
      {id:'ok', label:'Completei as 10 reps sem dificuldade', sub:'Sem dor, forÃ§a e amplitude normais', signals:[], ok:true}
    ]},
  {id:'stepdown', eyebrow:'Teste 5 â€” Controle motor de quadril', title:'Step-down test',
    video:'step-down descida de degrau',
    videoEmbed:'<div id="ifr_6a511166de3fa61569679e08_wrapper" style="margin: 0 auto; width: 100%;"><div style="position: relative; padding: 56.25% 0 0 0;" id="ifr_6a511166de3fa61569679e08_aspect"><iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_6a511166de3fa61569679e08" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin" onload="this.onload=null, this.src=\'https://scripts.converteai.net/5129f968-9c0f-495d-9f4c-842e6c88a022/players/6a511166de3fa61569679e08/v4/embed.html\'+(location.search||\'?\')+\'&vl=\'+encodeURIComponent(location.href)"></iframe></div></div>',
    videoScript:'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js', hint:'O que aconteceu durante a descida?',
    options:[
      {id:'controle', label:'Dificuldade em controlar a descida', sub:'Falta de estabilidade ou dor no joelho', signals:['quadril_forca']},
      {id:'valgo', label:'Joelho caiu para dentro (valgo dinÃ¢mico)', sub:'O joelho virou em direÃ§Ã£o ao pÃ© oposto', signals:['quadril_forca']},
      {id:'ok', label:'Descida controlada, joelho alinhado', sub:'Sem dificuldade ou desvio', signals:[], ok:true}
    ]},
  {id:'noventa', eyebrow:'Teste 6 â€” Mobilidade de quadril', title:'RotaÃ§Ã£o de quadril 90/90',
    video:'rotaÃ§Ã£o de quadril 90/90',
    videoEmbed:'<div id="ifr_6a51122a5480813d4da2eb82_wrapper" style="margin: 0 auto; width: 100%;"><div style="position: relative; padding: 56.25% 0 0 0;" id="ifr_6a51122a5480813d4da2eb82_aspect"><iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_6a51122a5480813d4da2eb82" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin" onload="this.onload=null, this.src=\'https://scripts.converteai.net/5129f968-9c0f-495d-9f4c-842e6c88a022/players/6a51122a5480813d4da2eb82/v4/embed.html\'+(location.search||\'?\')+\'&vl=\'+encodeURIComponent(location.href)"></iframe></div></div>',
    videoScript:'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js', hint:'O que aconteceu no movimento?',
    options:[
      {id:'nao_enc', label:'Joelhos nÃ£o encostaram no chÃ£o', sub:'Dificuldade ou dor ao rotar o quadril', signals:['quadril_mob']},
      {id:'assim', label:'DiferenÃ§a clara entre os dois lados', sub:'Um lado com muito menos amplitude que o outro', signals:['quadril_mob']},
      {id:'ok', label:'Joelhos encostaram nos dois lados', sub:'Sem diferenÃ§a significativa', signals:[], ok:true}
    ]},
  {id:'thomas', eyebrow:'Teste 7 â€” Flexores de quadril', title:'Teste de Thomas',
    video:'teste de Thomas',
    videoEmbed:'<div id="ifr_6a5112d8e8dbbbb0f2571c90_wrapper" style="margin: 0 auto; width: 100%;"><div style="position: relative; padding: 56.25% 0 0 0;" id="ifr_6a5112d8e8dbbbb0f2571c90_aspect"><iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_6a5112d8e8dbbbb0f2571c90" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin" onload="this.onload=null, this.src=\'https://scripts.converteai.net/5129f968-9c0f-495d-9f4c-842e6c88a022/players/6a5112d8e8dbbbb0f2571c90/v4/embed.html\'+(location.search||\'?\')+\'&vl=\'+encodeURIComponent(location.href)"></iframe></div></div>',
    videoScript:'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js', hint:'O que aconteceu com a perna estendida?',
    options:[
      {id:'levanta', label:'A perna estendida levantou do chÃ£o', sub:'O joelho saiu da superfÃ­cie ao puxar o outro', signals:['flexores']},
      {id:'dor', label:'Senti dor ou desconforto', sub:'Dor na virilha, quadril ou coxa', signals:['flexores']},
      {id:'ok', label:'Perna ficou no chÃ£o, sem dor', sub:'Sem limitaÃ§Ã£o nos dois lados', signals:[], ok:true}
    ]}
]

// â•â• CATEGORIAS DO ÃNDICE CORPORAL â•â•
const CATEGORY_MAP = {
  agachamento: {
    calc:['mobilidade'],
    fundo:['mobilidade','estabilidade']},
  pelvica: {
    nao_mant:['estabilidade','controle_motor'],
    caimbra:['estabilidade','controle_motor']},
  equilibrio: {
    aberto_fail:['equilibrio'],
    fechado_fail:['equilibrio']},
  panturrilha: {
    nao_rep:['propulsao','controle_motor'],
    dor_torn:['mobilidade']},
  stepdown: {
    controle:['estabilidade','controle_motor'],
    valgo:['estabilidade','controle_motor']},
  noventa: {
    nao_enc:['mobilidade','propulsao'],
    assim:['mobilidade','propulsao']},
  thomas: {
    levanta:['mobilidade','propulsao'],
    dor:['mobilidade']}
}
const CATEGORY_INFO = {
  mobilidade:{label:'Mobilidade',color:'#38BDF8',max:7},
  estabilidade:{label:'Estabilidade',color:'#4ADE80',max:5},
  controle_motor:{label:'Controle Motor',color:'#A78BFA',max:5},
  propulsao:{label:'PropulsÃ£o',color:'#FB923C',max:4},
  equilibrio:{label:'EquilÃ­brio',color:'#F472B6',max:2}
}
const CATEGORY_ORDER = ['mobilidade','estabilidade','controle_motor','propulsao','equilibrio']

// â•â• CAUSA E CONSEQUÃŠNCIA â•â•
const CONSEQUENCES = {
  tornozelo:{priority:'Restaurar mobilidade do tornozelo',
    cause:'Essa restriÃ§Ã£o impede que o tornozelo absorva impacto adequadamente durante a corrida.',
    effect:'A carga sobre para o joelho, que passa a compensar a cada passada.'},
  quadril_mob:{priority:'Liberar a rotaÃ§Ã£o do quadril',
    cause:'A falta de rotaÃ§Ã£o no quadril limita a extensÃ£o da passada.',
    effect:'A pelve gira para compensar, sobrecarregando a lombar e o joelho oposto.'},
  gluteo:{priority:'Ativar e fortalecer o glÃºteo',
    cause:'O glÃºteo nÃ£o ativa no momento certo do ciclo da corrida.',
    effect:'A carga Ã© transferida para os isquiotibiais e lombar, que nÃ£o foram feitos para isso.'},
  propriocepcao:{priority:'Melhorar a propriocepÃ§Ã£o',
    cause:'O sistema nervoso nÃ£o sente com precisÃ£o onde o pÃ© estÃ¡ no espaÃ§o.',
    effect:'Tornozelo e joelho chegam desalinhados no contato com o chÃ£o.'},
  panturrilha:{priority:'Fortalecer a panturrilha',
    cause:'A panturrilha nÃ£o tem resistÃªncia para sustentar a corrida.',
    effect:'O impacto Ã© transferido para o tendÃ£o de Aquiles e a fÃ¡scia plantar.'},
  quadril_forca:{priority:'Recuperar o controle motor do quadril',
    cause:'Os mÃºsculos ao redor do quadril nÃ£o controlam o joelho durante o movimento.',
    effect:'O joelho cai para dentro (valgo dinÃ¢mico), gerando torque excessivo.'},
  flexores:{priority:'Alongar os flexores do quadril',
    cause:'Os flexores encurtados limitam a extensÃ£o completa da passada.',
    effect:'A lombar compensa arqueando, gerando dor e perda de eficiÃªncia.'}
}

// â•â• EXERCÃCIOS â•â•
const VTURB_BASE = 'https://scripts.converteai.net/5129f968-9c0f-495d-9f4c-842e6c88a022/players/'
function vturbEmbed(vid) {
  const sb = '<' + '/script>'
  return `<script type="text/javascript">var s=document.createElement("script");s.src="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js",s.async=!0,document.head.appendChild(s);${sb}<div id="ifr_${vid}_wrapper" style="margin:0 auto;width:100%"><div style="position:relative;padding:56.25% 0 0 0" id="ifr_${vid}_aspect"><iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_${vid}" style="position:absolute;top:0;left:0;width:100%;height:100%" referrerpolicy="origin" onload="this.onload=null,this.src='${VTURB_BASE}${vid}/v4/embed.html'+(location.search||'?')+'&vl='+encodeURIComponent(location.href)"></iframe></div></div>`
}
const EX = {
  // BLOCO GERAL
  g_volta_mundo:{name:'Volta ao mundo',di:'2 sÃ©ries Â· 30s cada lado Â· 4 apoios',dm:'2 sÃ©ries Â· 30s cada lado Â· em pÃ©',da:'2 sÃ©ries Â· 30s cada lado Â· em pÃ©',tag:'mobilidade',tc:'qmob',why:'Abre o quadril em todas as direÃ§Ãµes antes de sair para correr.',vid:'6a54dec82c2f06556e0e0ef7'},
  g_cocoras:{name:'CÃ³coras',di:'2 sÃ©ries Â· 30 segundos',dm:'2 sÃ©ries Â· 45 segundos',da:'2 sÃ©ries Â· 60 segundos',tag:'mobilidade',tc:'qmob',why:'Mobiliza tornozelo e quadril simultaneamente.',vid:'6a54e6240a9f72b511fbefb4'},
  g_prancha:{name:'Prancha Frontal',di:'3 sÃ©ries Â· 20s',dm:'3 sÃ©ries Â· 30s',da:'3 sÃ©ries Â· 45s',tag:'core',tc:'flex',why:'Ativa o core â€” base de estabilidade para a corrida.',vid:'6a54de5f0a7249098836dd59'},
  g_panturrilha:{name:'ElevaÃ§Ã£o de Panturrilha Unilateral',di:'3 sÃ©ries Â· 8 reps Â· mÃ£os na parede',dm:'3 sÃ©ries Â· 10 reps',da:'3 sÃ©ries Â· 12 reps',tag:'forÃ§a',tc:'pant',why:'Prepara a panturrilha e o tornozelo para o impacto da corrida.',vid:'6a54deb92c2f06556e0e0e9c'},
  g_equilibrio:{name:'EquilÃ­brio Unilateral',di:'2 sÃ©ries Â· 30s Â· olhos abertos',dm:'2 sÃ©ries Â· 30s Â· olhos fechados',da:'2 sÃ©ries Â· 45s Â· olhos fechados',tag:'propriocepÃ§Ã£o',tc:'prop',why:'Treina a comunicaÃ§Ã£o entre sistema nervoso e mÃºsculos estabilizadores.',vid:'6a54e61e6bda3ac633cd7f78'},
  g_stepdown:{name:'Step-Down',di:'3 sÃ©ries Â· 6 reps cada lado',dm:'3 sÃ©ries Â· 8 reps cada lado',da:'3 sÃ©ries Â· 10 reps cada lado',tag:'controle',tc:'qfor',why:'Controle excÃªntrico â€” protege o joelho a cada passada.',vid:'6a54e6133c9d9bf04f45ed85'},
  g_terra:{name:'Levantamento Terra 1 perna',di:'3 sÃ©ries Â· 8 reps cada lado',dm:'3 sÃ©ries Â· 10 reps',da:'3 sÃ©ries Â· 12 reps',tag:'cadeia post.',tc:'glut',why:'Fortalece isquiotibiais, glÃºteo e lombar â€” a base que sustenta a corrida no cansaÃ§o.',vid:'6a54deb40a7249098836deca'},

  // TORNOZELO
  e_cocoras:{name:'CÃ³coras',di:'3 sÃ©ries Â· 45s',dm:'3 sÃ©ries Â· 60s',da:'3 sÃ©ries Â· 60s com carga leve',tag:'tornozelo',tc:'torn',why:'Mobiliza o tornozelo progressivamente em posiÃ§Ã£o de carga total.',vid:'6a54e6240a9f72b511fbefb4'},
  e_meio_ajoel:{name:'Meio Ajoelhado',di:'3 sÃ©ries Â· 12 reps cada lado',dm:'3 sÃ©ries Â· 15 reps',da:'3 sÃ©ries Â· 15 reps com elÃ¡stico',tag:'tornozelo',tc:'torn',why:'Aumenta a dorsiflexÃ£o â€” movimento essencial a cada passada na corrida.',vid:'6a54e6181e490ba6e5ff98c0'},
  e_pe_fechado:{name:'1 pÃ© c/ olhos fechados',di:'3 sÃ©ries Â· 30s cada lado',dm:'3 sÃ©ries Â· 45s',da:'3 sÃ©ries Â· 60s Â· superfÃ­cie instÃ¡vel',tag:'tornozelo',tc:'torn',why:'Ativa os estabilizadores do tornozelo sem compensaÃ§Ã£o visual.',vid:'6a54e61e6bda3ac633cd7f78'},
  e_agach_ponta:{name:'Agachamento ponta do pÃ©',di:'3 sÃ©ries Â· 8 reps',dm:'3 sÃ©ries Â· 10 reps',da:'3 sÃ©ries Â· 12 reps unilateral',tag:'tornozelo',tc:'torn',why:'Combina mobilidade de tornozelo com forÃ§a de panturrilha.'},
  e_saltos_quad:{name:'Saltos no quadrado',di:null,dm:null,da:'3 sÃ©ries Â· 20 saltos',tag:'tornozelo',tc:'torn',why:'Treina a absorÃ§Ã£o de impacto rÃ¡pido â€” exatamente o que acontece na corrida.',adv_only:true,vid:'6a54e62a3c9d9bf04f45edbf'},

  // QUADRIL MOBILIDADE
  e_volta_mundo:{name:'Volta ao mundo',di:'3 sÃ©ries Â· 30s Â· 4 apoios',dm:'3 sÃ©ries Â· 30s Â· em pÃ©',da:'3 sÃ©ries Â· 30s Â· em pÃ© com carga',tag:'quadril mob.',tc:'qmob',why:'Abre o quadril em todas as direÃ§Ãµes de rotaÃ§Ã£o.',vid:'6a54dede0a9f72b511fbdb30'},
  e_noventa:{name:'90/90',di:'3 sÃ©ries Â· 60s cada lado',dm:'3 sÃ©ries Â· 60s + rotaÃ§Ã£o ativa',da:'3 sÃ©ries Â· 90s + pressÃ£o ativa',tag:'quadril mob.',tc:'qmob',why:'Trabalha rotaÃ§Ã£o interna e externa do quadril simultaneamente.',vid:'6a54dec2453615a5c5ae7b22'},
  e_iliopsoas:{name:'Alongamento do Iliopsoas',di:'3 sÃ©ries Â· 45s cada lado',dm:'3 sÃ©ries Â· 60s',da:'3 sÃ©ries Â· 60s com elevaÃ§Ã£o de braÃ§o',tag:'flexores',tc:'flex',why:'Alonga o flexor de quadril que encurta com horas sentado e limita a passada.',vid:'6a54e6ce1e490ba6e5ff99d5'},

  // GLÃšTEO
  e_elev_pelv:{name:'ElevaÃ§Ã£o PÃ©lvica',di:'3 sÃ©ries Â· 12 reps',dm:'3 sÃ©ries Â· 15 reps',da:'3 sÃ©ries Â· 12 reps unilateral',tag:'glÃºteo',tc:'glut',why:'Ativa glÃºteo mÃ¡ximo e isquiotibiais â€” essenciais para a propulsÃ£o na corrida.',vid:'6a54dea33d8ea0afcdcb062e'},
  e_coice:{name:'Coice 4 Apoios',di:'3 sÃ©ries Â· 12 reps cada lado',dm:'3 sÃ©ries Â· 15 reps com elÃ¡stico',da:'3 sÃ©ries Â· 15 reps elÃ¡stico + pausa no topo',tag:'glÃºteo',tc:'glut',why:'Isola a ativaÃ§Ã£o do glÃºteo mÃ¡ximo â€” corrige a inativaÃ§Ã£o muscular.',vid:'6a54de9d0a9f72b511fbd9fc'},
  e_bulg:{name:'Afundo BÃºlgaro',di:'3 sÃ©ries Â· 8 reps cada lado',dm:'3 sÃ©ries Â· 10 reps',da:'3 sÃ©ries Â· 10 reps com carga',tag:'glÃºteo',tc:'glut',why:'Fortalece glÃºteo e quadrÃ­ceps em padrÃ£o unilateral â€” como a corrida exige.',vid:'6a54dea77e2e4092887dad2e'},

  // PROPRIOCEPÃ‡ÃƒO
  e_prop_fechado:{name:'1 pÃ© c/ olhos fechados',di:'3 sÃ©ries Â· 30s cada lado',dm:'3 sÃ©ries Â· 45s',da:'3 sÃ©ries Â· 60s Â· superfÃ­cie instÃ¡vel',tag:'propriocepÃ§Ã£o',tc:'prop',why:'Treina o sistema proprioceptivo sem compensaÃ§Ã£o visual.',vid:'6a54e61e6bda3ac633cd7f78'},
  e_prop_ponta:{name:'Agachamento ponta do pÃ©',di:'3 sÃ©ries Â· 8 reps',dm:'3 sÃ©ries Â· 10 reps',da:'3 sÃ©ries Â· 10 reps unilateral',tag:'propriocepÃ§Ã£o',tc:'prop',why:'Combina equilÃ­brio, propriocepÃ§Ã£o e forÃ§a de tornozelo em um Ãºnico movimento.'},
  e_prop_step:{name:'Step-Down',di:'3 sÃ©ries Â· 6 reps cada lado',dm:'3 sÃ©ries Â· 8 reps',da:'3 sÃ©ries Â· 10 reps com pausa',tag:'propriocepÃ§Ã£o',tc:'prop',why:'PropriocepÃ§Ã£o dinÃ¢mica â€” controle real em movimento de impacto.',vid:'6a54e6133c9d9bf04f45ed85'},

  // PANTURRILHA
  e_plant:{name:'PlantiflexÃ£o',di:'3 sÃ©ries Â· 12 reps Â· mÃ£os na parede',dm:'3 sÃ©ries Â· 15 reps Â· sem apoio',da:'3 sÃ©ries Â· 15 reps Â· superfÃ­cie inclinada',tag:'panturrilha',tc:'pant',why:'Fortalece a panturrilha de forma progressiva e segura.',vid:'6a54debe8c9a9181a2105568'},

  // CONTROLE MOTOR QUADRIL
  e_step_esp:{name:'Step-Down',di:'3 sÃ©ries Â· 8 reps cada lado',dm:'3 sÃ©ries Â· 10 reps',da:'3 sÃ©ries Â· 12 reps com pausa no fundo',tag:'controle',tc:'qfor',why:'O exercÃ­cio mais especÃ­fico para controle motor do quadril e glÃºteo mÃ©dio.',vid:'6a54e6133c9d9bf04f45ed85'},
  e_skatista:{name:'Agachamento Skatista',di:'3 sÃ©ries Â· 8 reps cada lado',dm:'3 sÃ©ries Â· 10 reps',da:'3 sÃ©ries Â· 12 reps + pausa',tag:'controle',tc:'qfor',why:'Treina controle unilateral do joelho e quadril em padrÃ£o de impacto.',vid:'6a54deac8c9a9181a210550b'},

  // FLEXORES
  e_iliopsoas_esp:{name:'Alongamento do Iliopsoas',di:'3 sÃ©ries Â· 45s cada lado',dm:'3 sÃ©ries Â· 60s',da:'3 sÃ©ries Â· 60s com elevaÃ§Ã£o de braÃ§o',tag:'flexores',tc:'flex',why:'Alonga iliopsoas encurtado que impede a extensÃ£o completa do quadril na corrida.',vid:'6a54e6ce1e490ba6e5ff99d5'},

  // EXERCÃCIOS ADICIONAIS
  e_agach_salto:{name:'Agachamento com Salto',di:'3 sÃ©ries Â· 8 reps',dm:'3 sÃ©ries Â· 10 reps',da:'3 sÃ©ries Â· 12 reps',tag:'quadrÃ­ceps',tc:'qfor',why:'Ativa o quadrÃ­ceps com explosividade â€” compensa fraqueza e inativaÃ§Ã£o muscular.',vid:'6a54e6133c9d9bf04f45ed85'},
  e_prancha_lat:{name:'Prancha Lateral DinÃ¢mica',di:'3 sÃ©ries Â· 8 reps cada lado',dm:'3 sÃ©ries Â· 10 reps',da:'3 sÃ©ries Â· 12 reps',tag:'core',tc:'flex',why:'Fortalece core lateral â€” estabilidade do tronco essencial para corrida sustentada.',vid:'6a54de507e2e4092887dabe9'},
  e_escalador:{name:'Escalador',di:'3 sÃ©ries Â· 8 reps cada lado',dm:'3 sÃ©ries Â· 10 reps',da:'3 sÃ©ries Â· 12 reps',tag:'core',tc:'flex',why:'Combina core, flexores e coordenaÃ§Ã£o â€” prepara o corpo para a dinÃ¢mica da corrida.',vid:'6a54de65bb80b1338edbb5f6'}
}

// â•â• MAPA SINAL â†’ SESSÃ•ES â•â•
const SIGNAL_MAP = {
  tornozelo:{label:'RestriÃ§Ã£o de tornozelo',color:'var(--torn)',
    a:['e_cocoras','e_meio_ajoel'],b:['e_pe_fechado','e_agach_ponta'],c:['e_cocoras','e_meio_ajoel','e_agach_ponta','e_saltos_quad']},
  quadril_mob:{label:'RestriÃ§Ã£o de mobilidade de quadril',color:'var(--qmob)',
    a:['e_volta_mundo','e_noventa'],b:['e_iliopsoas'],c:['e_volta_mundo','e_noventa']},
  gluteo:{label:'Fraqueza de glÃºteo',color:'var(--glut)',
    a:['e_elev_pelv'],b:['e_coice','e_bulg'],c:['e_elev_pelv','e_coice']},
  propriocepcao:{label:'DÃ©ficit de propriocepÃ§Ã£o',color:'var(--prop)',
    a:['e_prop_fechado'],b:['e_prop_ponta','e_prop_step'],c:['e_prop_fechado','e_prop_ponta']},
  panturrilha:{label:'Fraqueza de panturrilha',color:'var(--pant)',
    a:['e_plant'],b:['e_plant'],c:['e_plant']},
  quadril_forca:{label:'DÃ©ficit de controle motor de quadril',color:'var(--qfor)',
    a:['e_step_esp'],b:['e_skatista','e_step_esp','e_agach_salto'],c:['e_skatista','e_agach_salto']},
  flexores:{label:'Encurtamento de flexores de quadril',color:'var(--flex)',
    a:['e_iliopsoas_esp'],b:['e_iliopsoas_esp','e_prancha_lat','e_escalador'],c:['e_iliopsoas_esp','e_escalador']}
}

const SIGNAL_ORDER = ['tornozelo','quadril_mob','gluteo','propriocepcao','panturrilha','quadril_forca','flexores']

const GERAL_ORDEM = [
  {bloco:'ðŸ”µ Mobilidade geral â€” antes de correr', ids:['g_volta_mundo','g_cocoras']},
  {bloco:'ðŸŸ  AtivaÃ§Ã£o muscular â€” antes de correr', ids:['g_prancha','g_panturrilha','g_terra']},
  {bloco:'ðŸŸ¢ Controle neuromuscular â€” antes de correr', ids:['g_equilibrio','g_stepdown']}
]

const SESSION_INFO = [
  {day:'Segunda-feira', focus:'Foco: mobilidade Â· tornozelo Â· quadril', color:'var(--torn)'},
  {day:'Quarta-feira',  focus:'Foco: forÃ§a Â· glÃºteo Â· controle motor', color:'var(--glut)'},
  {day:'Sexta-feira',   focus:'Foco: propriocepÃ§Ã£o Â· revisÃ£o crÃ­tica', color:'var(--prop)'}
]

const BONUSES = [
  {id:'ritual', icon:'ðŸ”¥', css:'b1', title:'Ritual de Corrida',
    desc:'AtivaÃ§Ã£o prÃ©-treino para ligar os mÃºsculos certos antes de cada corrida.',
    items:['AtivaÃ§Ã£o de glÃºteo â€” 10 pontes unilaterais cada lado','MobilizaÃ§Ã£o de tornozelo â€” 10 meio-ajoelhados cada lado','AtivaÃ§Ã£o de core â€” 30s prancha frontal','PropriocepÃ§Ã£o de pÃ© â€” 30s equilÃ­brio unilateral cada lado','3 sÃ©ries de 10s skipping baixo no local']},
  {id:'recuperacao', icon:'ðŸ§Š', css:'b2', title:'RecuperaÃ§Ã£o Funcional',
    desc:'Protocolo pÃ³s-treino para liberar tensÃ£o e acelerar a recuperaÃ§Ã£o.',
    items:['Rolo de panturrilha â€” 60s cada perna','Rolo de quadrÃ­ceps â€” 60s cada perna','Alongamento de iliopsoas â€” 45s cada lado','LiberaÃ§Ã£o de glÃºteo com bola â€” 60s cada lado','ElevaÃ§Ã£o de perna na parede â€” 5min','RespiraÃ§Ã£o diafragmÃ¡tica â€” 10 ciclos profundos']},
  {id:'evolucao', icon:'ðŸ“ˆ', css:'b3', title:'EvoluÃ§Ã£o Segura',
    desc:'Como aumentar volume de corrida sem reincidÃªncia de dor.',
    items:['Regra dos 10% â€” nunca aumentar volume semanal > 10%','Semana de descompressÃ£o a cada 4 semanas (reduz 40% do volume)','Sinal verde: sÃ³ aumentar se o protocolo A/B/C foi completo por 2 semanas','Sinal amarelo: dor leve durante corrida = volta 1 semana no volume','Sinal vermelho: dor moderada/forte = para 3 dias, volta com protocolo A','Auto-check-up a cada 30 dias para monitorar evoluÃ§Ã£o']}
]

// â•â• ONBOARDING â•â•
const ONBOARDING = [
  {id:'painToday',q:'Hoje vocÃª sente alguma <span class="highlight">dor</span> durante a corrida?',type:'single',opts:['Sim','NÃ£o']},
  {id:'painLocation',q:'Onde vocÃª sente essa dor?',type:'multi',opts:['Joelho','Quadril','Panturrilha','Tornozelo','PÃ©','Canela','Lombar'],show:d=>d.painToday==='Sim'},
  {id:'painIntensity',q:'Qual a <span class="highlight">intensidade</span> da dor? (0 = nenhuma, 10 = insuportÃ¡vel)',type:'slider',min:0,max:10},
  {id:'painMoment',q:'Quando ela <span class="highlight">aparece</span>?',type:'single',opts:['Logo no inÃ­cio','Durante a corrida','No final','ApÃ³s correr','No dia seguinte'],show:d=>d.painToday==='Sim'},
  {id:'painDuration',q:'HÃ¡ <span class="highlight">quanto tempo</span> vocÃª convive com isso?',type:'single',opts:['Menos de 1 semana','1â€“4 semanas','1â€“3 meses','Mais de 3 meses']},
  {id:'weeklyRuns',q:'Quantas vezes vocÃª <span class="highlight">corre por semana</span>?',type:'single',opts:['1','2','3','4','5+']},
  {id:'goal',q:'Qual seu <span class="highlight">principal objetivo</span> agora?',type:'single',opts:['Correr sem dor','Melhorar performance','Voltar a correr','Primeira prova','Meia Maratona','Maratona']}
]

// â•â• ESTADO â•â•
let currentTest = 0
let answers = {}
let nivel = 'mid'
let criticalSignal = null
let signalCounts = {}
let onboardingData = {}
let onboardingStep = 0
let onboardingLocked = false

// â•â• ÃNDICE CORPORAL â•â•
function calculateIndex() {
  const cats = {mobilidade:0,estabilidade:0,controle_motor:0,propulsao:0,equilibrio:0}
  Object.keys(answers).forEach(testId => {
    const test = TESTS.find(t => t.id === testId)
    if (!test) return
    ;(answers[testId]||[]).forEach(optId => {
      const opt = test.options.find(o => o.id === optId)
      if (!opt || opt.ok) return
      const mapped = CATEGORY_MAP[testId]
      if (!mapped || !mapped[optId]) return
      mapped[optId].forEach(c => { cats[c]++ })
    })
  })
  const scores = {}
  CATEGORY_ORDER.forEach(c => {
    const info = CATEGORY_INFO[c]
    scores[c] = Math.max(0, Math.round((1 - cats[c] / info.max) * 100))
  })
  const overall = Math.round(CATEGORY_ORDER.reduce((s,c)=>s+scores[c],0)/CATEGORY_ORDER.length)
  return { overall, scores, raw: cats }
}

// â•â• DASHBOARD â•â•
function getTargetScore(overall) {
  if (overall < 50) return 65
  if (overall < 70) return 80
  return 90
}

function getPersonalizedMsg() {
  if (!criticalSignal) return ''
  const c = CONSEQUENCES[criticalSignal]
  return c ? c.priority : ''
}

function getNextSession() {
  const d = new Date().getDay()
  if (d === 1) return { idx: 0, label: 'Hoje', day: 'Segunda-feira' }
  if (d === 3) return { idx: 1, label: 'Hoje', day: 'Quarta-feira' }
  if (d === 5) return { idx: 2, label: 'Hoje', day: 'Sexta-feira' }
  if (d < 1 || d > 5) return { idx: 0, label: 'PrÃ³xima', day: 'Segunda-feira' }
  if (d < 3) return { idx: 1, label: 'PrÃ³xima', day: 'Quarta-feira' }
  return { idx: 2, label: 'PrÃ³xima', day: 'Sexta-feira' }
}

function togglePlanMonth(idx) {
  const el = document.querySelectorAll('.db-plan-month')[idx]
  if (el) el.classList.toggle('active')
}

function renderDashboard() {
  const done = localStorage.getItem('csd_checkup') === '1'
  const content = document.getElementById('db-content')
  const phaseEl = document.getElementById('db-phase')

  if (done) {
    const savedAnswers = localStorage.getItem('csd_answers')
    if (savedAnswers) { try { answers = JSON.parse(savedAnswers) } catch(e){} }
    const savedNivel = localStorage.getItem('csd_nivel')
    if (savedNivel) nivel = savedNivel
    getActiveSignals()
  }

  if (!done) {
    phaseEl.textContent = ''
    content.innerHTML = `<div class="db-empty fade-in">
      <div class="db-empty-icon">ðŸƒ</div>
      <div class="db-empty-title">Nenhuma avaliaÃ§Ã£o ainda</div>
      <div class="db-empty-sub">Complete o check-up de 7 testes para descubrir onde seu corpo estÃ¡ falhando na corrida.</div>
      <button class="btn-primary" onclick="showScreen('s-welcome')">Iniciar check-up â†’</button>
    </div>`
    return
  }

  const { overall, scores } = calculateIndex()
  const target = getTargetScore(overall)
  const sigs = Object.keys(signalCounts)
  const next = getNextSession()
  const msg = getPersonalizedMsg()

  const m = PLAN_MONTHS[currentPlanMonth]
  phaseEl.innerHTML = `Seu plano estÃ¡ ativo<br><strong>MÃªs ${currentPlanMonth+1}</strong> â€” ${m.title}`

  const progressPct = getCompletionPct()

  const circ = 2 * Math.PI * 40
  const offset = circ - (overall / 100) * circ
  const catColors = {mobilidade:'#38BDF8',estabilidade:'#4ADE80',controle_motor:'#A78BFA',propulsao:'#FB923C',equilibrio:'#F472B6'}
  let subHtml = CATEGORY_ORDER.map(c => {
    const pct = scores[c]; const col = catColors[c]
    return `<div class="subscore-item"><div class="subscore-header"><span class="subscore-name">${CATEGORY_INFO[c].label}</span><span class="subscore-val" data-count="${pct}">0</span></div><div class="subscore-track"><div class="subscore-fill" style="width:0;background:${col}" data-target="${pct}"></div></div></div>`
  }).join('')

  const sorted = sigs.slice().sort((a,b) => (signalCounts[b]||0) - (signalCounts[a]||0))
  let whyItems = sorted.map(sig => {
    const c = CONSEQUENCES[sig]; const info = SIGNAL_MAP[sig]
    return c ? `<li>${c.priority}</li>` : info ? `<li>${info.label}</li>` : ''
  }).join('')
  let whyText = ''
  if (criticalSignal) { const cc = CONSEQUENCES[criticalSignal]; if (cc) whyText = cc.effect }

  const lastCheckup = localStorage.getItem('csd_lastCheckup')
  let reavDays = 30
  if (lastCheckup) reavDays = Math.max(0, 30 - Math.floor((Date.now() - parseInt(lastCheckup)) / 86400000))
  const reavReady = reavDays <= 0
  const lastEval = lastCheckup ? new Date(parseInt(lastCheckup)).toLocaleDateString() : 'â€”'

  content.innerHTML = `
    <div class="db-next sr" onclick="goToSession(${next.idx})" data-delay="0">
      <div style="font-size:11px;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;font-weight:600">Seu prÃ³ximo treino</div>
      <div class="db-next-title">Treino ${['A','B','C'][next.idx]}</div>
      <div class="db-next-focus">${SESSION_INFO[next.idx].focus}</div>
      <button class="btn-primary" style="width:100%">â–¶ ComeÃ§ar</button>
    </div>

    <div class="db-progress sr" data-delay="0">
      <div class="db-progress-header"><span class="db-progress-title">Plano de RecuperaÃ§Ã£o</span><span class="db-progress-pct" data-count="${progressPct}">0%</span></div>
      <div class="db-progress-track"><div class="db-progress-fill" style="width:0" data-target="${progressPct}"></div></div>
      <div class="db-progress-sub">Semana ${getCurrentWeek()}</div>
    </div>

    <div class="score-ring-wrap sr" data-delay="100">
      <div class="score-ring">
        <svg viewBox="0 0 96 96"><circle class="score-ring-bg" cx="48" cy="48" r="40"/><circle class="score-ring-fill" cx="48" cy="48" r="40" stroke-dasharray="${circ}" stroke-dashoffset="${circ}" data-target="${offset}"/></svg>
        <div class="score-value" data-count="${overall}">0</div>
      </div>
      <div class="score-label">Ãndice Corporal â€” de 0 a 100</div>
      ${msg ? `<div style="margin-top:8px;line-height:1.4"><div style="font-size:11px;color:var(--muted)">Seu maior ganho virÃ¡ de</div><div style="font-size:16px;font-weight:700;color:var(--orange)">${msg.toLowerCase()}</div></div>` : ''}
      <div class="subscores" style="margin-top:14px">${subHtml}</div>
    </div>

    <div class="db-meta sr" data-delay="200">
      <div class="db-meta-side"><div class="db-meta-label">Ãndice Atual</div><div class="db-meta-val">${overall}</div></div>
      <div class="db-meta-arrow">â†“</div>
      <div class="db-meta-side"><div class="db-meta-label">Meta do MÃªs</div><div class="db-meta-val" style="color:var(--glut)">${target}</div></div>
    </div>

    <div class="db-countdown sr" data-delay="250">
      ${reavReady
        ? `<span style="font-size:16px">ðŸ“Š</span> Seu corpo mudou â€” <strong style="cursor:pointer;color:#38BDF8" onclick="showReavaliacao()">refaÃ§a o check-up</strong> para ver sua evoluÃ§Ã£o`
        : `<span>â³</span> PrÃ³xima reavaliaÃ§Ã£o em <strong>${reavDays} dias</strong>`}
    </div>

    <div class="body-map-wrap sr" data-delay="300">${renderBodyMap(signalCounts)}</div>

    <div class="sr" data-delay="350">
      <div class="section-label" style="margin-bottom:8px">Seu Plano de RecuperaÃ§Ã£o</div>
    </div>
    <div class="db-plan-months sr" data-delay="400">
      <div class="db-plan-month active" style="border-color:rgba(232,80,10,.3)">
        <div class="db-plan-header" onclick="togglePlanMonth(0)">
          <div class="db-plan-header-left"><span class="db-plan-month-num">MÃªs 01</span><div><div class="db-plan-month-title">${m.title}</div><div class="db-plan-month-sub">${m.goal}</div></div></div>
          <span style="font-size:12px;color:var(--orange)">â–¾</span>
        </div>
        <div class="db-plan-expand">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Foco deste mÃªs:</div>
          <ul class="db-plan-list">${whyItems}</ul>
          ${whyText ? `<div class="db-plan-why">${whyText}</div>` : ''}
          <div class="db-plan-btn"><button class="btn-primary" style="width:100%" onclick="showPlan()">â–¶ Continuar Treinos</button></div>
        </div>
      </div>
      <div class="db-plan-month${currentPlanMonth < 1 ? '' : ' unlocked'}">
        <div class="db-plan-header">
          <div class="db-plan-header-left"><span class="db-plan-month-num">MÃªs 02</span><div><div class="db-plan-month-title">${PLAN_MONTHS[1].title}</div><div class="db-plan-month-sub">${PLAN_MONTHS[1].goal}</div></div></div>
          ${currentPlanMonth < 1 ? '<span class="db-plan-lock">ðŸ”’</span>' : '<span class="db-plan-lock" style="color:var(--green)">âœ“</span>'}
        </div>
      </div>
      <div class="db-plan-month${currentPlanMonth < 2 ? '' : ' unlocked'}">
        <div class="db-plan-header">
          <div class="db-plan-header-left"><span class="db-plan-month-num">MÃªs 03</span><div><div class="db-plan-month-title">${PLAN_MONTHS[2].title}</div><div class="db-plan-month-sub">${PLAN_MONTHS[2].goal}</div></div></div>
          ${currentPlanMonth < 2 ? '<span class="db-plan-lock">ðŸ”’</span>' : '<span class="db-plan-lock" style="color:var(--green)">âœ“</span>'}
        </div>
      </div>
    </div>

    <div class="db-last-eval sr" data-delay="450">Ãšltima avaliaÃ§Ã£o: ${lastEval}</div>

    <div class="sr" data-delay="500" style="display:flex;flex-direction:column;gap:8px">
      <button class="btn-outline" onclick="showBonuses()">Ver bÃ´nus â†’</button>
    </div>`

  setTimeout(animateDashboard, 150)
}

function getBodyStatus(sigCounts) {
  const hasSig = (s) => (sigCounts[s]||0) > 0
  const severity = (s) => {
    const q = sigCounts[s]||0
    const isC = s === criticalSignal
    return isC ? 'critical' : q >= 2 ? 'warning' : q === 1 ? 'leve' : 'ok'
  }
  return {
    tornozelo: hasSig('tornozelo') ? severity('tornozelo') : 'ok',
    panturrilha: hasSig('panturrilha') ? severity('panturrilha') : 'ok',
    quadril: (hasSig('quadril_mob')||hasSig('gluteo')||hasSig('quadril_forca')||hasSig('flexores')) ? 'moderado' : 'ok',
    propriocepcao: hasSig('propriocepcao') ? severity('propriocepcao') : 'ok'
  }
}

function renderBodyMap(sigCounts) {
  const status = getBodyStatus(sigCounts)
  const colorMap = {ok:'#4ADE80',levi:'#FBBF24',moderado:'#FB923C',warning:'#FB923C',critical:'#EF4444',leve:'#FBBF24'}
  const dot = (name, top, left, sev) =>
    `<div class="body-dot" style="top:${top}px;left:${left}px;background:${colorMap[sev]||'#4ADE80'}20;border-color:${colorMap[sev]||'#4ADE80'};color:${colorMap[sev]||'#4ADE80'}">${sev==='critical'?'!':sev==='ok'?'âœ“':sev==='leve'?'â€¢':'!!'}</div>`
  return `<div class="body-map-title">Mapa Corporal</div>
    <div class="body-map-svg-wrap">
      <svg viewBox="0 0 120 200" fill="none">
        <circle cx="60" cy="18" r="10" stroke="var(--border2)" stroke-width="1.5"/>
        <path d="M60 28v20M45 48l-8 40M75 48l8 40M52 68l-12 60M68 68l12 60M40 108l-5 60M80 108l5 60" stroke="var(--border2)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M60 48l-20 60M60 48l20 60" stroke="var(--border2)" stroke-width="1" stroke-linecap="round"/>
      </svg>
      ${dot('propriocepcao', 34, 60, status.propriocepcao)}
      ${dot('quadril', 72, 60, status.quadril)}
      ${dot('panturrilha', 108, 42, status.panturrilha)}
      ${dot('tornozelo', 140, 60, status.tornozelo)}
    </div>
    <div style="display:flex;justify-content:center;gap:12px;margin-top:12px;font-size:10px;color:var(--muted)">
      <span>â— Sem alteraÃ§Ã£o</span>
      <span style="color:#FB923C">â— AtenÃ§Ã£o</span>
      <span style="color:#EF4444">â— CrÃ­tico</span>
    </div>`
}

// â•â• HELPERS â•â•
function showBonuses() { renderBonuses(); showScreen('s-bonus') }
function goToDashboard() { renderDashboard(); showScreen('s-dashboard') }
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  document.getElementById(id).classList.add('active')
  window.scrollTo(0,0)
  if (id === 's-dashboard') setTimeout(animateDashboard, 200)
}

function animateDashboard() {
  const content = document.getElementById('db-content')
  if (!content) return

  const srEls = content.querySelectorAll('.sr')
  srEls.forEach(el => {
    const rect = el.getBoundingClientRect()
    const delay = parseInt(el.dataset.delay || '0')
    if (rect.top < window.innerHeight) {
      setTimeout(() => el.classList.add('visible'), delay)
    } else {
      srObserver.observe(el)
    }
  })

  document.querySelectorAll('#db-content [data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target)
    const isPct = el.classList.contains('db-progress-fill') || el.classList.contains('subscore-fill')
    const isRing = el.tagName === 'circle'

    if (isRing) {
      el.style.transition = 'stroke-dashoffset 1.2s ease'
      el.style.strokeDashoffset = target
    } else if (isPct) {
      setTimeout(() => { el.style.width = target + '%' }, 300)
    }
  })

  document.querySelectorAll('#db-content [data-count]').forEach(el => {
    const target = parseInt(el.dataset.count)
    const isPct = el.classList.contains('db-progress-pct')
    const isScore = el.classList.contains('score-value')
    animateCount(el, 0, target, isScore ? 2400 : 1800, isPct ? '%' : '')
  })
}

function animateCount(el, from, to, duration, suffix) {
  const start = performance.now()
  function tick(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.round(from + (to - from) * eased)
    el.textContent = current + (suffix || '')
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const srObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible')
      srObserver.unobserve(e.target)
    }
  })
}, { threshold: 0.15 })
function goToSession(idx) {
  if (!document.getElementById('session-plan')) showPlan()
  showScreen('s-protocol')
  setTimeout(() => showSessionFromPlan(idx), 100)
}

function getDetail(ex) {
  if (nivel === 'init') return ex.di || ex.dm
  if (nivel === 'adv')  return ex.da || ex.dm
  return ex.dm
}

const TAG_COLORS = {
  torn:'color:var(--torn);border-color:var(--torn)',
  qmob:'color:var(--qmob);border-color:var(--qmob)',
  glut:'color:var(--glut);border-color:var(--glut)',
  prop:'color:var(--prop);border-color:var(--prop)',
  pant:'color:var(--pant);border-color:var(--pant)',
  qfor:'color:var(--qfor);border-color:var(--qfor)',
  flex:'color:var(--flex);border-color:var(--flex)'
}

function renderExCard(exId, num, isEspecifico, isCritico) {
  const ex = EX[exId]
  if (!ex) return ''
  if (ex.adv_only && nivel !== 'adv') return ''
  const detail = getDetail(ex)
  const tagStyle = TAG_COLORS[ex.tc] || ''
  const cardClass = isCritico ? 'ex-card critico' : isEspecifico ? 'ex-card especifico' : 'ex-card geral'
  const tagCrit = isCritico ? '<span class="ex-tag critico">â˜… CrÃ­tico</span>' : ''
  return `<div class="${cardClass} fade-in" data-exid="${exId}">
    <div class="ex-check" onclick="event.stopPropagation();toggleExCheck('${exId}',this.parentElement)"></div>
    <div class="ex-body">
      <div class="ex-name">${ex.name}</div>
      <div class="ex-detail">${detail}</div>
      <div class="ex-tags"><span class="ex-tag" style="${tagStyle}">${ex.tag}</span>${tagCrit}</div>
      <div class="ex-why">${ex.why}</div>
    </div>
  </div>`
}

function renderBonuses() {
  const g = document.getElementById('bonus-grid')
  g.innerHTML = BONUSES.map((b,i) => `<div class="bonus-card fade-in${i>0?' fade-in-d'+i:''}" onclick="showBonusDetail(${i})">
    <div class="bonus-icon ${b.css}">${b.icon}</div>
    <div class="bonus-info"><h3>${b.title}</h3><p>${b.desc}</p></div>
    <div class="bonus-arrow">â†’</div>
  </div>`).join('')
}

function showBonusDetail(idx) {
  const b = BONUSES[idx]
  document.getElementById('bonus-detail-label').textContent = b.title
  document.getElementById('bonus-detail-content').innerHTML = `
    <div class="bonus-hero-icon">${b.icon}</div>
    <h2>${b.title}</h2>
    <p>${b.desc}</p>
    <ul class="bonus-items">${b.items.map(i => '<li>'+i+'</li>').join('')}</ul>`
  showScreen('s-bonus-detail')
}

// â•â• LOGIN â•â•
let currentUser = null

async function doLogin() {
  const e = document.getElementById('login-email').value.trim()
  const s = document.getElementById('login-senha').value
  if (!e || !s) { alert('Preencha email e senha.'); return }

  const btn = document.querySelector('#s-login .btn-primary')
  btn.textContent = 'Entrando...'
  btn.disabled = true

  if (!window._sbClient) { alert('Sistema indisponÃ­vel. Recarregue a pÃ¡gina.'); return }
  console.log('[CSD] Tentando login:', e)
  const { data, error } = await window._sbClient.auth.signInWithPassword({ email: e, password: s })
  console.log('[CSD] Resultado:', { data, error })

  btn.textContent = 'Entrar'
  btn.disabled = false

  if (error) {
    console.error('[CSD] Erro login:', error.message)
    alert('Erro: ' + error.message)
    return
  }

  currentUser = data.user
  // Limpar dados antigos do CSD (manter sessÃ£o Supabase)
  const sbKeys = Object.keys(localStorage).filter(k => k.startsWith('sb-') || k.startsWith('supabase'))
  const sbData = {}
  sbKeys.forEach(k => sbData[k] = localStorage.getItem(k))
  localStorage.clear()
  Object.entries(sbData).forEach(([k,v]) => localStorage.setItem(k, v))
  localStorage.setItem('csd_logged', '1')
  localStorage.setItem('csd_user_id', currentUser.id)
  console.log('[CSD] Login OK, user:', currentUser.id)

  // Carregar dados do Supabase
  await loadUserData()

  // Se nÃ£o tem checkup, Ã© primeiro acesso â†’ welcome
  if (!localStorage.getItem('csd_checkup')) {
    showScreen('s-welcome')
  } else {
    renderDashboard()
    showScreen('s-dashboard')
  }
}

async function loadUserData() {
  if (!currentUser) return

  // Carregar Ãºltimo checkup
  const { data: checkups } = await window._sbClient.from('checkups')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (checkups && checkups.length > 0) {
    const c = checkups[0]
    localStorage.setItem('csd_checkup', '1')
    localStorage.setItem('csd_answers', JSON.stringify(c.answers))
    localStorage.setItem('csd_nivel', c.nivel)
    localStorage.setItem('csd_lastCheckup', new Date(c.created_at).getTime().toString())
    if (c.scores) localStorage.setItem('csd_lastScores', JSON.stringify(c.scores))
    if (c.onboarding) localStorage.setItem('csd_onboarding', JSON.stringify(c.onboarding))
    if (c.first_checkup_at) localStorage.setItem('csd_firstCheckup', new Date(c.first_checkup_at).getTime().toString())
  }

  // Carregar sessÃµes
  const { data: sessions } = await window._sbClient.from('sessions')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (sessions && sessions.length > 0) {
    const s = sessions[0]
    localStorage.setItem('csd_sessoes', JSON.stringify(s.exercicios))
    localStorage.setItem('csd_sessionChecks', JSON.stringify(s.checks || {}))
    localStorage.setItem('csd_planMonth', s.plan_month.toString())
    if (s.session_exercises) localStorage.setItem('csd_sessionExercises', JSON.stringify(s.session_exercises))
  }
}

async function doLogout() {
  await window._sbClient.auth.signOut()
  currentUser = null
  localStorage.clear()
  showScreen('s-login')
}

async function doSignup() {
  const e = document.getElementById('login-email').value.trim()
  const s = document.getElementById('login-senha').value
  if (!e || !s) { alert('Preencha email e senha para criar conta.'); return }
  if (s.length < 6) { alert('A senha deve ter no mÃ­nimo 6 caracteres.'); return }

  const btn = document.querySelector('#s-login .btn-primary')
  btn.textContent = 'Criando conta...'
  btn.disabled = true

  const { data, error } = await window._sbClient.auth.signUp({ email: e, password: s })

  btn.textContent = 'Entrar'
  btn.disabled = false

  if (error) {
    alert('Erro ao criar conta: ' + error.message)
    return
  }

  // Criar profile
  if (data.user) {
    await window._sbClient.from('profiles').upsert({ id: data.user.id, email: e })
  }

  alert('Conta criada! Verifique seu email para confirmar o cadastro.')
}

// â•â• SALVAR DADOS NO SUPABASE â•â•
async function saveCheckupToSupabase(overall) {
  if (!window._sbClient || !currentUser) { console.log('[CSD] Skip save checkup:', {sb: !!window._sbClient, user: !!currentUser}); return }
  const onboarding = JSON.parse(localStorage.getItem('csd_onboarding') || '{}')
  const scores = calculateIndex()
  const firstCheckup = localStorage.getItem('csd_firstCheckup') || Date.now().toString()
  const payload = {
    user_id: currentUser.id,
    answers: answers,
    nivel: nivel,
    scores: { overall: overall, scores: scores.scores },
    onboarding: onboarding,
    first_checkup_at: new Date(parseInt(firstCheckup)).toISOString()
  }
  console.log('[CSD] Salvando checkup:', payload)
  const { data, error } = await window._sbClient.from('checkups').insert(payload)
  if (error) console.error('[CSD] Erro save checkup:', error.message, error)
  else console.log('[CSD] Checkup salvo OK:', data)
}

async function saveSessionsToSupabase() {
  if (!window._sbClient || !currentUser) return
  const sessoes = JSON.parse(localStorage.getItem('csd_sessoes') || '{}')
  const checks = JSON.parse(localStorage.getItem('csd_sessionChecks') || '{}')
  const sessionExercises = JSON.parse(localStorage.getItem('csd_sessionExercises') || '{}')
  const planMonth = parseInt(localStorage.getItem('csd_planMonth') || '0')
  // Upsert: uma sessÃ£o por user_id
  const { data: existing } = await window._sbClient.from('sessions')
    .select('id').eq('user_id', currentUser.id).limit(1)
  if (existing && existing.length > 0) {
    await window._sbClient.from('sessions').update({
      exercicios: sessoes, checks: checks, plan_month: planMonth, session_exercises: sessionExercises
    }).eq('id', existing[0].id)
  } else {
    await window._sbClient.from('sessions').insert({
      user_id: currentUser.id, exercicios: sessoes, checks: checks, plan_month: planMonth, session_exercises: sessionExercises
    })
  }
  }
  console.log('[CSD] SessÃµes salvas no Supabase')
}

document.getElementById('login-senha')?.addEventListener('keydown', ev => { if (ev.key === 'Enter') doLogin() })

// â•â• CHECK-UP â•â•
function startCheckup() {
  currentTest = 0; answers = {}; nivel = 'mid'; criticalSignal = null; signalCounts = {}
  // Check if reavaliaÃ§Ã£o
  const reav = checkReavaliacao()
  if (reav && !localStorage.getItem('csd_reav_confirm')) {
    // Save old scores
    if (Object.keys(signalCounts).length > 0) {
      const idx = calculateIndex()
      localStorage.setItem('csd_lastScores',JSON.stringify({overall:idx.overall,scores:idx.scores,date:Date.now()}))
    }
    localStorage.setItem('csd_reav_confirm','1')
  }
  loadTest(0)
  showScreen('s-test')
}

function goBack() {
  if (currentTest > 0) { currentTest--; loadTest(currentTest) }
  else showScreen('s-welcome')
}

function loadTest(idx) {
  const t = TESTS[idx]
  document.getElementById('test-top-label').textContent = `Teste ${idx+1} de ${TESTS.length}`
  // Show onboarding context for first test
  const ctx = document.getElementById('test-context')
  if (idx === 0) {
    const od = localStorage.getItem('csd_onboarding')
    if (od) {
      try {
        const d = JSON.parse(od)
        if (d.painToday === 'Sim' && d.painLocation && d.painLocation.length > 0) {
          ctx.textContent = `Sua principal queixa Ã© ${d.painLocation.length > 1 ? 'dor em ' : 'dor no '}${d.painLocation.join(' e ')}. Agora vamos verificar se essa realmente Ã© a origem do problema.`
          ctx.style.display = 'block'
        } else { ctx.style.display = 'none' }
      } catch(e) { ctx.style.display = 'none' }
    } else { ctx.style.display = 'none' }
  } else { ctx.style.display = 'none' }
  document.getElementById('test-eyebrow').textContent = t.eyebrow
  document.getElementById('test-title').textContent = t.title

  const vp = document.querySelector('.video-placeholder')
  if (t.videoUrl) {
    vp.innerHTML = `<iframe width="100%" height="100%" src="${t.videoUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="border-radius:12px"></iframe>`
  } else if (t.videoEmbed) {
    vp.innerHTML = t.videoEmbed
    if (t.videoScript) {
      const s = document.createElement('script')
      s.src = t.videoScript; s.async = true
      document.head.appendChild(s)
    }
  } else {
    vp.innerHTML = `<div class="play-btn">â–¶</div><div class="video-label">${t.video}</div>`
  }
  document.getElementById('cb-hint').textContent = t.hint
  document.getElementById('progress-fill').style.width = ((idx+1)/TESTS.length*100)+'%'

  const dots = document.getElementById('progress-dots')
  dots.innerHTML = ''
  TESTS.forEach((_,i) => { const d = document.createElement('div'); d.className = 'pdot'+(i<=idx?' done':''); dots.appendChild(d) })

  const btn = document.getElementById('btn-next')
  btn.disabled = true
  btn.textContent = idx < TESTS.length-1 ? 'PrÃ³ximo teste' : 'Ver resultado'

  const list = document.getElementById('checkbox-list')
  list.innerHTML = ''
  const saved = answers[t.id] || []

  t.options.forEach(opt => {
    const row = document.createElement('div')
    row.className = 'cb-row'+(opt.ok?' ok-option':'')+(saved.includes(opt.id)?' checked':'')
    row.innerHTML = `<div class="cb-box">${saved.includes(opt.id)?'âœ“':''}</div>
      <div><div class="cb-label">${opt.label}</div><div class="cb-sub">${opt.sub}</div></div>`
    row.addEventListener('click', () => toggleOpt(t.id, opt, row, t.options))
    list.appendChild(row)
  })
}

function toggleOpt(testId, opt, row, allOptions) {
  const rows = document.querySelectorAll('#checkbox-list .cb-row')
  if (opt.ok) {
    rows.forEach(r => { r.classList.remove('checked'); r.querySelector('.cb-box').textContent='' })
    row.classList.add('checked'); row.querySelector('.cb-box').textContent='âœ“'
    answers[testId] = ['ok']
  } else {
    rows.forEach((r,i) => {
      if (allOptions[i].ok && r.classList.contains('checked')) {
        r.classList.remove('checked'); r.querySelector('.cb-box').textContent=''
      }
    })
    if (row.classList.contains('checked')) {
      row.classList.remove('checked'); row.querySelector('.cb-box').textContent=''
    } else {
      row.classList.add('checked'); row.querySelector('.cb-box').textContent='âœ“'
    }
    const checked = []
    rows.forEach((r,i) => { if (r.classList.contains('checked')) checked.push(allOptions[i].id) })
    answers[testId] = checked
  }
  document.getElementById('btn-next').disabled =
    document.querySelectorAll('#checkbox-list .cb-row.checked').length === 0
}

function nextTest() {
  // T3 define o nÃ­vel
  if (currentTest === 2) {
    const a = answers['equilibrio'] || []
    if (a.includes('aberto_fail')) nivel = 'init'
    else if (a.includes('fechado_fail')) nivel = 'mid'
    else nivel = 'adv'
  }
  if (currentTest < TESTS.length-1) { currentTest++; loadTest(currentTest); window.scrollTo(0,0) }
  else showReport()
}

// â•â• RESULTADO (com severidade + fontes + crÃ­tico) â•â•
function getActiveSignals() {
  const sigCounts = {}
  const sigSources = {}
  TESTS.forEach(t => {
    const ans = answers[t.id] || []
    ans.forEach(optId => {
      const opt = t.options.find(o => o.id === optId)
      if (opt) opt.signals.forEach(s => {
        sigCounts[s] = (sigCounts[s] || 0) + 1
        if (!sigSources[s]) sigSources[s] = []
        sigSources[s].push({test:t.title, opt:opt.label})
      })
    })
  })
  signalCounts = sigCounts

  // DÃ©ficit crÃ­tico: sinal com maior contagem
  let max = 0; criticalSignal = null
  SIGNAL_ORDER.forEach(s => {
    if ((sigCounts[s]||0) > max) { max = sigCounts[s]; criticalSignal = s }
  })
  return { sigCounts, sigSources }
}

function showReport() {
  const { sigCounts, sigSources } = getActiveSignals()
  const sigs = Object.keys(sigCounts)
  const count = sigs.length
  const { overall } = calculateIndex()
  const od = localStorage.getItem('csd_onboarding')
  let odData = {}
  if (od) { try { odData = JSON.parse(od) } catch(e){} }

  // Queixa principal
  const painText = odData.painToday === 'Sim'
    ? (odData.painLocation||[]).join(', ') || 'Dor durante a corrida'
    : 'Sem dor no momento'
  const goalText = odData.goal || 'NÃ£o informado'

  // HipÃ³tese inicial
  let hipotese = ''
  if (odData.painToday === 'Sim' && odData.painLocation) {
    hipotese = `VocÃª relatou ${odData.painLocation.length > 1 ? 'dores em ' : 'dor no '}${odData.painLocation.join(' e ')} durante a corrida. Agora vamos comparar essa informaÃ§Ã£o com os resultados dos testes funcionais.`
  } else {
    hipotese = 'VocÃª estÃ¡ realizando o check-up preventivo. Os testes vÃ£o identificar se existem compensaÃ§Ãµes que precisam ser trabalhadas antes que virem dor.'
  }

  // ConclusÃ£o
  let conclusao = ''
  const principal = criticalSignal ? SIGNAL_MAP[criticalSignal] : null
  if (count === 0) {
    conclusao = 'Nenhuma compensaÃ§Ã£o significativa detectada. Seu plano serÃ¡ focado em manutenÃ§Ã£o e otimizaÃ§Ã£o da sua funÃ§Ã£o como corredor.'
  } else if (principal) {
    const c = CONSEQUENCES[criticalSignal]
    conclusao = `Os testes indicam que sua dor <strong>provavelmente nÃ£o se origina</strong> no local da queixa. Seu corpo apresenta uma limitaÃ§Ã£o importante de <strong>${principal.label.toLowerCase()}</strong>.${c ? ' ' + c.cause + ' ' + c.effect : ''} Seu plano serÃ¡ priorizado para corrigir primeiro essa compensaÃ§Ã£o.`
  }

  const sigHtml = sigs.length > 0 ? `<div class="report-block fade-in fade-in-d2">
    <div class="report-block-title">resultado do check-up</div>
    <div style="display:flex;flex-direction:column;gap:10px">${sigs.map(sig => {
      const info = SIGNAL_MAP[sig]; if (!info) return ''
      const qtd = sigCounts[sig]
      const isC = sig === criticalSignal
      return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
        <div style="width:8px;height:8px;border-radius:50%;background:${info.color};flex-shrink:0"></div>
        <div style="flex:1"><span style="font-size:13px;font-weight:600;color:var(--text)">${info.label}</span>
        ${qtd >= 2 ? `<span style="font-size:10px;margin-left:6px;padding:1px 6px;border-radius:10px;background:rgba(251,146,60,.12);color:#FB923C">${isC ? 'â˜… crÃ­tico' : qtd === 1 ? 'leve' : 'moderado'}</span>` : ''}</div>
        ${isC ? '<span style="font-size:16px">!</span>' : ''}</div>`
    }).join('')}</div></div>` : ''

  const odReport = odData.painToday === 'Sim' ? `
    <div class="report-block fade-in"><div class="report-block-title">queixa principal</div>
      <div class="report-row"><span class="report-row-label">Local</span><span class="report-row-val">${painText}</span></div>
      ${odData.painIntensity !== undefined ? `<div class="report-row"><span class="report-row-label">Intensidade</span><span class="report-row-val">${odData.painIntensity}/10</span></div>` : ''}
      ${odData.painMoment ? `<div class="report-row"><span class="report-row-label">Quando aparece</span><span class="report-row-val">${odData.painMoment}</span></div>` : ''}
      ${odData.painDuration ? `<div class="report-row"><span class="report-row-label">HÃ¡ quanto tempo</span><span class="report-row-val">${odData.painDuration}</span></div>` : ''}
    </div>` : ''
  const goalReport = odData.goal ? `<div class="report-block fade-in fade-in-d1">
    <div class="report-block-title">objetivo</div>
    <div style="font-size:14px;font-weight:600;color:var(--orange)">${goalText}</div>
  </div>` : ''

  document.getElementById('report-content').innerHTML = `
    ${odReport}
    ${goalReport}
    <div class="report-block fade-in fade-in-d1">
      <div class="report-block-title">hipÃ³tese inicial</div>
      <p style="font-size:13px;color:var(--muted);line-height:1.7">${hipotese}</p>
    </div>
    ${sigHtml}
    <div class="report-conclusion fade-in${sigs.length?' fade-in-d3':''}">
      <div class="report-conclusion-title">ðŸ“‹ conclusÃ£o</div>
      <p>${conclusao}</p>
    </div>`

  localStorage.setItem('csd_checkup','1')
  localStorage.setItem('csd_lastCheckup',Date.now().toString())
  if (!localStorage.getItem('csd_firstCheckup')) localStorage.setItem('csd_firstCheckup', Date.now().toString())
  localStorage.setItem('csd_answers',JSON.stringify(answers))
  localStorage.setItem('csd_nivel',nivel)
  // Advance plan month after reavaliaÃ§Ã£o
  if (localStorage.getItem('csd_reav_confirm')) {
    currentPlanMonth = Math.min(2, currentPlanMonth + 1)
    localStorage.setItem('csd_planMonth', currentPlanMonth.toString())
  }
  localStorage.removeItem('csd_reav_confirm')

  // Salvar no Supabase
  saveCheckupToSupabase(overall)

  // Show reavaliaÃ§Ã£o comparison if applicable
  const lastScores = localStorage.getItem('csd_lastScores')
  if (lastScores) {
    try {
      const old = JSON.parse(lastScores)
      const delta = overall - old.overall
      let diffHtml = ''
      if (delta > 0) diffHtml = `<div class="reav-diff up" style="margin-top:12px">â†‘ +${delta} pontos â€” evoluÃ§Ã£o detectada</div>`
      else if (delta === 0) diffHtml = `<div class="reav-diff same" style="margin-top:12px">â†’ Ãndice mantido</div>`
      else diffHtml = `<div class="reav-diff down" style="margin-top:12px">â†“ ${delta} pontos</div>`
      document.getElementById('report-content').insertAdjacentHTML('afterbegin',
        `<div class="report-block fade-in" style="border-color:rgba(56,189,248,.3)">
          <div class="report-block-title">evoluÃ§Ã£o</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div style="text-align:center"><div style="font-size:10px;color:var(--muted)">Antes</div><div style="font-size:24px;font-weight:800;color:var(--muted)">${old.overall}</div></div>
            <div style="text-align:center"><div style="font-size:10px;color:var(--muted)">Depois</div><div style="font-size:24px;font-weight:800;color:var(--orange)">${overall}</div></div>
          </div>${diffHtml}</div>`)
      localStorage.removeItem('csd_lastScores')
    } catch(e) {}
  }

  showScreen('s-result')
}

// â•â• POR QUE SEU PLANO Ã‰ DIFERENTE â•â•
function showWhyPlan() {
  const od = localStorage.getItem('csd_onboarding')
  let odData = {}
  if (od) { try { odData = JSON.parse(od) } catch(e){} }
  const { sigCounts, sigSources } = getActiveSignals()
  const sigs = Object.keys(sigCounts)

  const items = []
  if (odData.painToday === 'Sim' && odData.painLocation) {
    odData.painLocation.forEach(l => items.push(`VocÃª sente ${l.includes('dor')?'':'dor no '}${l.toLowerCase()}`))
  }
  if (odData.painMoment) items.push(`Sua dor aparece ${odData.painMoment.toLowerCase()}`)
  if (odData.weeklyRuns) items.push(`VocÃª corre ${odData.weeklyRuns}${parseInt(odData.weeklyRuns)<=1?' vez':' vezes'} por semana`)
  if (odData.goal) items.push(`Seu objetivo Ã© ${odData.goal.toLowerCase()}`)
  sigs.forEach(sig => {
    const info = SIGNAL_MAP[sig]
    if (info) items.push(`O check-up identificou <strong>${info.label.toLowerCase()}</strong>`)
  })

  let conclusao = ''
  const p = criticalSignal ? CONSEQUENCES[criticalSignal] : null
  if (p) {
    const info = SIGNAL_MAP[criticalSignal]
    conclusao = `Por isso seu tratamento <strong>comeÃ§a restaurando a ${info ? info.label.toLowerCase() : 'funÃ§Ã£o da regiÃ£o afetada'}</strong> antes de avanÃ§ar para as prÃ³ximas etapas.`
  } else {
    conclusao = 'Seu plano foi ajustado para manutenÃ§Ã£o e prevenÃ§Ã£o, sem compensaÃ§Ãµes crÃ­ticas no momento.'
  }

  document.getElementById('why-list').innerHTML = items.map(t =>
    `<div class="why-item fade-in"><div class="why-check">âœ“</div><div class="why-text">${t}</div></div>`
  ).join('')
  document.getElementById('why-conclusion').innerHTML = conclusao
  showScreen('s-why-plan')
}

// â•â• PLANO DE RECUPERAÃ‡ÃƒO â•â•
const PLAN_MONTHS = [
  {id:0,label:'MÃŠS 1',title:'Eliminar as compensaÃ§Ãµes principais',
   desc:'Nas prÃ³ximas quatro semanas seu corpo irÃ¡ recuperar mobilidade, estabilidade e controle nas regiÃµes identificadas durante o check-up.',
   goal:'Recuperar a funÃ§Ã£o da principal compensaÃ§Ã£o'},
  {id:1,label:'MÃŠS 2',title:'Transformar movimento em forÃ§a',locked:true,
   desc:'Quando sua principal compensaÃ§Ã£o estiver controlada, o foco passarÃ¡ para fortalecimento especÃ­fico da corrida.',
   goal:'Fortalecimento especÃ­fico'},
  {id:2,label:'MÃŠS 3',title:'Consolidar o novo padrÃ£o',locked:true,
   desc:'Seu corpo serÃ¡ preparado para suportar maiores volumes de corrida sem voltar ao padrÃ£o anterior de compensaÃ§Ã£o.',
   goal:'Consolidar novo padrÃ£o'}
]

let currentPlanMonth = parseInt(localStorage.getItem('csd_planMonth') || '0')
let currentPlanWeek = 0

function showPlan() {
  currentPlanWeek = 0
  renderPlanMonths()
  renderPlanView()
  showScreen('s-protocol')
}

function renderPlanMonths() {
  const c = document.getElementById('plan-months')
  c.innerHTML = PLAN_MONTHS.map((m,i) => {
    const locked = i > currentPlanMonth
    return `<div class="plan-month-btn${locked?' locked':''}${i===currentPlanMonth?' active':''}" onclick="switchPlanMonth(${i})">${m.label}</div>`
  }).join('')
}

function switchPlanMonth(idx) {
  if (idx > currentPlanMonth) return
  currentPlanMonth = idx; currentPlanWeek = 0
  const m = PLAN_MONTHS[currentPlanMonth]
  document.getElementById('plan-badge').textContent = m.label.toLowerCase()
  document.querySelectorAll('.plan-month-btn').forEach((b,i) => b.classList.toggle('active',i===idx))
  renderPlanView()
}

function renderPlanView() {
  const m = PLAN_MONTHS[currentPlanMonth]
  const view = document.getElementById('plan-view')
  // Build protocol data for week 1 (same protocol repeated for all 4 weeks)
  const sigs = Object.keys(signalCounts)
  const sessKeys = ['a','b','c']
  const sessoes = sessKeys.map(k => {
    const ids = []
    const seen = new Set()
    sigs.forEach(sig => {
      const info = SIGNAL_MAP[sig]; if (!info) return
      ;(info[k]||[]).forEach(id => { if (!seen.has(id)) { seen.add(id); ids.push(id) } })
    })
    if (criticalSignal) {
      const critInfo = SIGNAL_MAP[criticalSignal]
      if (critInfo && critInfo[k]) critInfo[k].forEach(id => { if (!seen.has(id)) { seen.add(id); ids.push(id) } })
    }
    if (ids.length===0) ids.push('e_prop_fechado','e_agach_ponta')
    return ids
  })
  localStorage.setItem('csd_sessoes',JSON.stringify(sessoes))
  saveSessionsToSupabase()

  const weeks = ['Semana 1','Semana 2','Semana 3','Semana 4']
  view.innerHTML = `
    <div class="plan-month-desc fade-in">
      <div class="plan-goal">ðŸŽ¯ ${m.goal}</div>
      <div style="margin-top:6px">${m.desc}</div>
    </div>
    <div class="plan-weeks fade-in fade-in-d1">${weeks.map((w,i) => renderPlanWeek(i,w)).join('')}</div>`
}

function renderPlanWeek(idx, label) {
  const isOpen = idx === currentPlanWeek
  return `<div class="plan-week-card">
    <div class="plan-week-header" onclick="togglePlanWeek(${idx})">
      <div class="plan-week-name">${label}</div>
      <div class="plan-week-toggle" style="transform:rotate(${isOpen?180:0}deg)">â–¾</div>
    </div>
    <div class="plan-week-body${isOpen?' open':''}">
      <button class="plan-session-btn" onclick="showSessionFromPlan(0)"><span class="sess-day">Treino A</span> â€” Segunda-feira Â· ${SESSION_INFO[0].focus}</button>
      <button class="plan-session-btn" onclick="showSessionFromPlan(1)"><span class="sess-day">Treino B</span> â€” Quarta-feira Â· ${SESSION_INFO[1].focus}</button>
      <button class="plan-session-btn" onclick="showSessionFromPlan(2)"><span class="sess-day">Treino C</span> â€” Sexta-feira Â· ${SESSION_INFO[2].focus}</button>
    </div>
  </div>`
}

function togglePlanWeek(idx) {
  if (currentPlanWeek === idx) { currentPlanWeek = -1 } else { currentPlanWeek = idx }
  renderPlanWeeks()
}

function renderPlanWeeks() {
  const weeks = document.querySelectorAll('.plan-week-card')
  weeks.forEach((w,i) => {
    const body = w.querySelector('.plan-week-body')
    const toggle = w.querySelector('.plan-week-toggle')
    const isOpen = i === currentPlanWeek
    body.classList.toggle('open',isOpen)
    if (toggle) toggle.style.transform = `rotate(${isOpen?180:0}deg)`
  })
}

let currentSessionIdx = 0

function getSessionChecks() {
  try { return JSON.parse(localStorage.getItem('csd_sessionChecks') || '{}') } catch(e) { return {} }
}

function toggleExCheck(exId, el) {
  const key = `sess_${currentSessionIdx}`
  const checks = getSessionChecks()
  if (!checks[key]) checks[key] = {}
  checks[key][exId] = !checks[key][exId]
  localStorage.setItem('csd_sessionChecks', JSON.stringify(checks))
  saveSessionsToSupabase()

  const check = el.querySelector('.ex-check')
  const done = checks[key][exId]
  check.classList.toggle('done', done)
  check.textContent = done ? 'âœ“' : ''
  el.classList.toggle('checked', done)

  if (done) {
    const allCards = document.querySelectorAll('#sessao-exercises .ex-card')
    const allChecks = getSessionChecks()[`sess_${currentSessionIdx}`] || {}
    const allDone = Array.from(allCards).every(c => allChecks[c.dataset.exid])
    if (allDone) setTimeout(showDoneAnimation, 400)
  }

  const pct = getCompletionPct()
  const fill = document.querySelector('.db-progress-fill')
  const pctEl = document.querySelector('.db-progress-pct')
  if (fill) fill.style.width = pct + '%'
  if (pctEl) pctEl.textContent = pct + '%'
}

function showDoneAnimation() {
  const colors = ['#4ADE80','#38BDF8','#FB923C','#F472B6','#A78BFA','#FBBF24']
  for (let i = 0; i < 30; i++) {
    const c = document.createElement('div')
    c.className = 'confetti'
    c.style.left = Math.random()*100+'vw'
    c.style.top = '-10px'
    c.style.background = colors[Math.floor(Math.random()*colors.length)]
    c.style.animationDelay = Math.random()*0.5+'s'
    c.style.animationDuration = (1+Math.random())+'s'
    document.body.appendChild(c)
    setTimeout(() => c.remove(), 2000)
  }
  const ov = document.createElement('div')
  ov.className = 'ex-done-overlay'
  ov.innerHTML = `<div class="ex-done-icon">ðŸŽ‰</div><div class="ex-done-title">ParabÃ©ns!</div><div class="ex-done-sub">Treino completo. Continue firme na jornada.</div>`
  ov.onclick = () => ov.remove()
  document.body.appendChild(ov)
  setTimeout(() => ov.remove(), 3000)
}

function showSessionFromPlan(sessIdx) {
  const saved = localStorage.getItem('csd_sessoes')
  if (!saved) return
  currentSessionIdx = sessIdx
  const sessoes = JSON.parse(saved)
  const si = sessIdx
  const sessionKey = ['a','b','c'][si]
  const info = SESSION_INFO[si]
  document.getElementById('sess-label').textContent = `Treino ${['A','B','C'][si]}`
  const badge = document.getElementById('sess-badge')
  badge.textContent = info.focus; badge.style.background = info.color

  // 1. Specific exercises from decision engine
  let specific = [...new Set(sessoes[si] || [])]

  // 2. Prioritize: critical signal exercises first, then rest
  let critIds = []
  if (criticalSignal) {
    const ci = SIGNAL_MAP[criticalSignal]
    if (ci && ci[sessionKey]) critIds = ci[sessionKey]
  }
  let finalIds = []
  critIds.forEach(id => { if (!finalIds.includes(id)) finalIds.push(id) })
  specific.forEach(id => { if (!finalIds.includes(id)) finalIds.push(id) })

  // 3. Cap at MAX (5), but keep critical ones
  const MAX = 5, MIN = 4
  const specificSet = new Set(specific)
  if (finalIds.length > MAX) finalIds = finalIds.slice(0, MAX)

  // 4. Fill with general exercises if under MIN
  if (finalIds.length < MIN) {
    const conflictNames = new Set(specific.map(id => EX[id]?.name).filter(Boolean))
    const pool = GERAL_ORDEM.flatMap(b => b.ids).filter(id => {
      if (finalIds.includes(id)) return false
      const ex = EX[id]
      return ex && !conflictNames.has(ex.name)
    })
    finalIds = finalIds.concat(pool.slice(0, MIN - finalIds.length))
  }

  // 5. Render as flat list
  const seen = new Set()
  let html = `<div style="display:flex;gap:8px;margin-bottom:12px">`
  html += ['Treino A','Treino B','Treino C'].map((d,i) =>
    `<button class="${i===sessIdx?'btn-primary':'btn-outline'}" style="flex:1;font-size:12px;padding:10px 0" onclick="showSessionFromPlan(${i})">${d}</button>`
  ).join('')
  html += `</div>`
  let n = 1
  finalIds.forEach(id => {
    if (seen.has(id)) return
    seen.add(id)
    const isCrit = criticalSignal && (SIGNAL_MAP[criticalSignal]?.[sessionKey]||[]).includes(id)
    const isEsp = specificSet.has(id)
    const rendered = renderExCard(id, n, isEsp, isCrit)
    if (rendered) { html += rendered; n++ }
  })
  const wrap = document.getElementById('sessao-exercises')
  wrap.innerHTML = html

  const sessionExerciseIds = Array.from(wrap.querySelectorAll('.ex-card')).map(c => c.dataset.exid)
  const allSessionExercises = JSON.parse(localStorage.getItem('csd_sessionExercises') || '{}')
  allSessionExercises[`sess_${sessIdx}`] = sessionExerciseIds
  localStorage.setItem('csd_sessionExercises', JSON.stringify(allSessionExercises))

  const checks = getSessionChecks()[`sess_${sessIdx}`] || {}
  wrap.querySelectorAll('.ex-card').forEach(card => {
    const id = card.dataset.exid
    if (checks[id]) {
      card.classList.add('checked')
      const ch = card.querySelector('.ex-check')
      ch.classList.add('done')
      ch.textContent = 'âœ“'
    }
  })

  wrap.onclick = e => {
    const card = e.target.closest('[data-exid]')
    if (card && !e.target.closest('.ex-check')) showExerciseDetail(card.dataset.exid)
  }
  showScreen('s-session-detail')
}

function showExerciseDetail(id) {
  const ex = EX[id]
  if (!ex) return
  document.getElementById('ex-detail-label').textContent = ex.name
  const badge = document.getElementById('ex-detail-badge')
  badge.textContent = ex.tag||''
  const colorKey = ex.tc || 'torn'
  badge.style.background = `var(--${colorKey})`
  document.getElementById('ex-video-label').textContent = 'VÃ­deo: ' + ex.name

  const videoWrap = document.querySelector('.ex-detail-video')
  if (ex.vid) {
    videoWrap.innerHTML = vturbEmbed(ex.vid)
    videoWrap.classList.add('has-video')
  } else {
    videoWrap.innerHTML = '<div class="play-btn">â–¶</div><div class="video-label">VÃ­deo em breve</div>'
    videoWrap.classList.remove('has-video')
  }

  let detailHtml = `<div class="ex-detail-name">${ex.name}</div>`
  const detailText = getDetail(ex)
  if (detailText) detailHtml += `<div class="ex-detail-detail">${detailText}</div>`
  if (ex.why) detailHtml += `<div class="ex-detail-why">${ex.why}</div>`
  if (ex.adv_only) detailHtml += `<div style="margin-top:8px;font-size:11px;color:var(--orange);font-weight:600">ðŸ”’ AvanÃ§ado â€” apenas apÃ³s dominar nÃ­vel intermediÃ¡rio</div>`
  document.getElementById('ex-detail-body').innerHTML = detailHtml
  document.getElementById('ex-detail').classList.add('open')
}
function closeExDetail() {
  document.getElementById('ex-detail').classList.remove('open')
  const videoWrap = document.querySelector('.ex-detail-video')
  videoWrap.innerHTML = '<div class="play-btn">â–¶</div><div class="video-label" id="ex-video-label">VÃ­deo em breve</div>'
  videoWrap.classList.remove('has-video')
}

// â•â• ONBOARDING â•â•
function startOnboarding() {
  onboardingData = {}; onboardingStep = 0; onboardingLocked = false
  document.getElementById('chat-area').innerHTML = ''
  showScreen('s-onboarding')
  renderOnboardingStep()
}

function goBackOnboarding() {
  if (onboardingLocked) return
  showScreen('s-welcome')
}

function scrollChat() {
  const a = document.getElementById('chat-area')
  a.scrollTop = a.scrollHeight
}

function renderOnboardingStep() {
  const area = document.getElementById('chat-area')
  area.innerHTML = ''

  if (onboardingStep >= ONBOARDING.length) {
    document.getElementById('onb-progress').textContent = 'âœ“'
    const msg = document.createElement('div'); msg.className = 'chat-msg system'
    msg.style.animation = 'none'
    msg.style.transform = 'translateY(20px)'; msg.style.opacity = '0'
    area.appendChild(msg)
    ;(void msg.offsetHeight)
    msg.style.transition = 'transform .3s ease-out, opacity .3s ease-out'
    msg.style.transform = ''; msg.style.opacity = ''
    const ty = document.createElement('div'); ty.className='chat-typing'
    ty.innerHTML = '<span></span><span></span><span></span>'
    area.appendChild(ty)
    typeText(msg, 'Perfeito. JÃ¡ tenho uma hipÃ³tese inicial. Agora preciso confirmar como seu corpo estÃ¡ funcionando. Em muitos corredores, a dor aparece em um local, mas a verdadeira causa estÃ¡ em outro. Vamos descobrir isso atravÃ©s do Check-up Corporal.', 12, () => {
      ty.remove()
      const btn = document.createElement('button'); btn.className = 'btn-primary'
      btn.textContent = 'Iniciar Check-up â†’'; btn.onclick = finishOnboarding
      area.appendChild(btn)
    })
    return
  }
  const q = ONBOARDING[onboardingStep]
  if (q.show && !q.show(onboardingData)) { onboardingStep++; renderOnboardingStep(); return }
  document.getElementById('onb-progress').textContent = `${onboardingStep+1}/${ONBOARDING.length}`
  const msg = document.createElement('div'); msg.className = 'chat-msg system'
  msg.style.animation = 'none'
  msg.style.transform = 'translateY(20px)'; msg.style.opacity = '0'
  area.appendChild(msg)
  ;(void msg.offsetHeight)
  msg.style.transition = 'transform .3s ease-out, opacity .3s ease-out'
  msg.style.transform = ''; msg.style.opacity = ''
  const ty = document.createElement('div'); ty.className='chat-typing'
  ty.innerHTML = '<span></span><span></span><span></span>'
  area.appendChild(ty)

  typeText(msg, q.q, 14, () => {
    ty.remove()
    renderOptions(q)
  })
}

function appendChatHtml(html) {
  const a = document.getElementById('chat-area')
  const d = document.createElement('div'); d.innerHTML = html
  while (d.firstChild) a.appendChild(d.firstChild)
  scrollChat()
}

function renderOptions(q) {
  if (q.type === 'slider') {
    const v = onboardingData[q.id] !== undefined ? onboardingData[q.id] : Math.floor((q.min+q.max)/2)
    const html = `<div class="chat-slider-wrap"><div class="chat-slider-val" id="slider-val">${v}</div>
      <input type="range" min="${q.min}" max="${q.max}" value="${v}" id="slider-input" oninput="document.getElementById('slider-val').textContent=this.value">
      <button class="btn-primary" style="margin-top:16px" onclick="selectOnbOpt('${q.id}',parseInt(document.getElementById('slider-input').value))">Confirmar â†’</button></div>`
    appendChatHtml(html)
  } else if (q.type === 'single') {
    const html = `<div class="chat-opts">${q.opts.map(o => `<div class="chat-opt" onclick="selectOnbOpt('${q.id}','${o}')">${o}</div>`).join('')}</div>`
    appendChatHtml(html)
  } else if (q.type === 'multi') {
    const saved = onboardingData[q.id] || []
    const html = `<div class="chat-opts">${q.opts.map(o => `<div class="chat-opt${saved.includes(o)?' selected':''}" data-val="${o}" onclick="toggleMultiOpt('${q.id}','${o}',this)">${o}</div>`).join('')}</div>
      <button class="btn-primary" style="margin-top:16px" onclick="confirmMultiOpt('${q.id}')">Confirmar â†’</button>`
    appendChatHtml(html)
  }
}

function toggleMultiOpt(id, val, el) {
  if (!onboardingData[id]) onboardingData[id] = []
  const arr = onboardingData[id]
  const i = arr.indexOf(val)
  if (i > -1) arr.splice(i,1); else arr.push(val)
  const opts = el.closest('.chat-opts')
  opts.querySelectorAll('.chat-opt').forEach(o => {
    o.classList.toggle('selected',arr.includes(o.dataset.val))
  })
}

function confirmMultiOpt(id) {
  selectOnbOpt(id, onboardingData[id] || [])
}

function selectOnbOpt(id, val) {
  if (onboardingLocked) return
  onboardingData[id] = val
  onboardingLocked = true
  const area = document.getElementById('chat-area')
  Array.from(area.children).forEach(el => {
    el.style.transition = 'transform .2s ease-out, opacity .2s ease-out'
    el.style.transform = 'translateY(-40px)'
    el.style.opacity = '0'
  })
  setTimeout(() => {
    onboardingStep++
    onboardingLocked = false
    renderOnboardingStep()
  }, 200)
}

function addChatMsg(type, text) {
  const a = document.getElementById('chat-area')
  const d = document.createElement('div'); d.className = `chat-msg ${type}`
  d.textContent = text; a.appendChild(d)
  scrollChat()
}

function typeText(el, html, speed = 14, cb) {
  const plain = html.replace(/<[^>]*>/g,'')
  let i = 0; el.innerHTML = ''
  const t = setInterval(() => {
    i++
    el.textContent = plain.substring(0,i)
    if (i >= plain.length) { clearInterval(t); el.innerHTML = html; if (cb) cb() }
  }, speed)
}

function finishOnboarding() {
  localStorage.setItem('csd_onboarding',JSON.stringify(onboardingData))
  startCheckup()
}

// â•â• PROGRESSO â•â•
function getCompletionPct() {
  const checks = JSON.parse(localStorage.getItem('csd_sessionChecks') || '{}')
  const allEx = JSON.parse(localStorage.getItem('csd_sessionExercises') || '{}')
  let completedSessions = 0
  for (let i = 0; i < 3; i++) {
    const sChecks = checks[`sess_${i}`] || {}
    const exIds = allEx[`sess_${i}`]
    if (!exIds || exIds.length === 0) continue
    const allDone = exIds.every(id => sChecks[id])
    if (allDone) completedSessions++
  }
  return Math.round((completedSessions / 3) * 100)
}

function getCurrentWeek() {
  const first = localStorage.getItem('csd_firstCheckup')
  if (!first) return 1
  const days = Math.floor((Date.now() - parseInt(first)) / 86400000)
  return Math.min(4, Math.floor(days / 7) + 1)
}

// â•â• REAVALIAÃ‡ÃƒO â•â•
function checkReavaliacao() {
  const last = localStorage.getItem('csd_lastCheckup')
  if (!last) return false
  const days = Math.floor((Date.now() - parseInt(last)) / 86400000)
  return days >= 30
}

function showReavaliacao() {
  const last = localStorage.getItem('csd_lastCheckup')
  const savedScores = localStorage.getItem('csd_lastScores')
  const comp = document.getElementById('reav-compare')
  let html = '<div class="reav-box"><div class="reav-box-label">Ãndice anterior</div><div class="reav-box-score antes">?/100</div></div>'
  html += '<div class="reav-box"><div class="reav-box-label">Novo Ã­ndice</div><div class="reav-box-score depois">?</div></div>'
  if (savedScores) {
    try {
      const old = JSON.parse(savedScores)
      html = `<div class="reav-box"><div class="reav-box-label">${new Date(parseInt(last)).toLocaleDateString()}</div><div class="reav-box-score antes">${old.overall}/100</div></div>
      <div class="reav-box"><div class="reav-box-label">Hoje</div><div class="reav-box-score depois">?</div></div>`
    } catch(e) {}
  }
  comp.innerHTML = html
  showScreen('s-reavaliacao')
}

function startReavaliacao() {
  // Save current scores for comparison
  if (Object.keys(signalCounts).length > 0) {
    const { overall } = calculateIndex()
    localStorage.setItem('csd_lastScores',JSON.stringify({overall,scores:calculateIndex().scores,date:Date.now()}))
  }
  showScreen('s-welcome')
}

function showReavResult() {
  // After re-checkup, show comparison
  const { overall, scores } = calculateIndex()
  const lastScores = localStorage.getItem('csd_lastScores')
  const comp = document.getElementById('reav-compare')
  let oldOverall = '?', diff = ''
  if (lastScores) {
    try {
      const old = JSON.parse(lastScores)
      oldOverall = old.overall
      const delta = overall - old.overall
      if (delta > 0) diff = `<div class="reav-diff up">â†‘ +${delta} pontos â€” evoluÃ§Ã£o detectada</div>`
      else if (delta === 0) diff = `<div class="reav-diff same">â†’ Ãndice mantido</div>`
      else diff = `<div class="reav-diff down">â†“ ${delta} pontos â€” reduÃ§Ã£o detectada</div>`
    } catch(e) {}
  }
  comp.innerHTML = `
    <div class="reav-box"><div class="reav-box-label">Antes</div><div class="reav-box-score antes">${oldOverall}/100</div></div>
    <div class="reav-box"><div class="reav-box-label">Depois</div><div class="reav-box-score depois">${overall}/100</div></div>
    ${diff}`
  showReport()
}

// â•â• CADASTRO PÃ“S-COMPRA (Hotmart) â•â•
function checkHotmartRedirect() {
  const params = new URLSearchParams(window.location.search)
  const email = params.get('email')
  console.log('[CSD] checkHotmartRedirect, email:', email)
  if (email) {
    document.getElementById('signup-email').value = email
    showScreen('s-signup')
    window.history.replaceState({}, '', window.location.pathname)
  }
}

async function doSignupConfirm() {
  const email = document.getElementById('signup-email').value.trim()
  const senha = document.getElementById('signup-senha').value
  const senha2 = document.getElementById('signup-senha2').value

  if (!email || !senha) { alert('Preencha email e senha.'); return }
  if (senha.length < 6) { alert('A senha deve ter no mÃ­nimo 6 caracteres.'); return }
  if (senha !== senha2) { alert('As senhas nÃ£o coincidem.'); return }

  const btn = document.querySelector('#s-signup .btn-primary')
  btn.textContent = 'Criando conta...'
  btn.disabled = true

  const { data, error } = await window._sbClient.auth.signUp({ email: email, password: senha })

  btn.textContent = 'Criar conta e comeÃ§ar'
  btn.disabled = false

  if (error) {
    if (error.message?.includes('already')) {
      alert('Este email jÃ¡ tem conta. FaÃ§a login.')
      showScreen('s-login')
      document.getElementById('login-email').value = email
    } else {
      alert('Erro: ' + error.message)
    }
    return
  }

  // Criar profile
  if (data.user) {
    await window._sbClient.from('profiles').upsert({ id: data.user.id, email: email })
  }

  // Login automÃ¡tico
  currentUser = data.user
  localStorage.setItem('csd_logged', '1')
  localStorage.setItem('csd_user_id', currentUser.id)

  // Primeiro acesso â†’ welcome
  showScreen('s-welcome')
}

// Detectar redirect da Hotmart ao carregar
checkHotmartRedirect()

