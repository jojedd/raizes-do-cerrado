/* =========================================================
   SISTEMA DE TEMAS
========================================================= */

const TEMA_PADRAO =
  "ipe";

const TEMAS_VALIDOS = [
  "ipe",
  "caliandra",
  "azulzinha"
];


/*
   Cores usadas no degradê de fundo que acompanha
   a rolagem da página (ver atualizarFundo()).
   Cada tema tem sua própria paleta de início/fim,
   na mesma ordem das variáveis CSS:
   topo → meio → cor forte → clara (embaixo).
*/

const CORES_TEMA = {

  ipe: {
    topoInicio: [48,145,235],
    topoFim: [80,180,225],

    meioInicio: [125,205,240],
    meioFim: [230,220,125],

    cor3Inicio: [255,199,0],
    cor3Fim: [255,214,40],

    inferiorInicio: [255,224,90],
    inferiorFim: [255,232,120]
  },

  caliandra: {
    topoInicio: [150,15,42],
    topoFim: [190,25,58],

    meioInicio: [205,45,85],
    meioFim: [255,110,150],

    cor3Inicio: [230,35,110],
    cor3Fim: [250,80,150],

    inferiorInicio: [255,150,180],
    inferiorFim: [255,190,205]
  },

  azulzinha: {
    topoInicio: [8,16,40],
    topoFim: [14,26,58],

    meioInicio: [20,45,90],
    meioFim: [35,65,120],

    cor3Inicio: [30,80,150],
    cor3Fim: [45,100,175],

    inferiorInicio: [60,110,190],
    inferiorFim: [80,130,210]
  }

};



function temaAtual() {

  const tema =
    document.documentElement.getAttribute(
      "data-theme"
    );

  return TEMAS_VALIDOS.includes(tema)
    ? tema
    : TEMA_PADRAO;
}



function atualizarBotoesDeTema(temaAtivo) {

  document.querySelectorAll(
    ".theme-swatch"
  ).forEach(
    botao => {

      botao.classList.toggle(
        "active",
        botao.dataset.tema === temaAtivo
      );

    }
  );
}



function aplicarTema(tema) {

  if (!TEMAS_VALIDOS.includes(tema)) {

    tema =
      TEMA_PADRAO;
  }


  document.documentElement.setAttribute(
    "data-theme",
    tema
  );


  try {

    localStorage.setItem(
      "temaEscolhido",
      tema
    );

  } catch (erro) {

    console.error(
      "Não foi possível salvar o tema escolhido:",
      erro
    );
  }


  atualizarBotoesDeTema(
    tema
  );

  atualizarFundo();
}



function inicializarTema() {

  let salvo =
    TEMA_PADRAO;

  try {

    salvo =
      localStorage.getItem(
        "temaEscolhido"
      ) ||
      TEMA_PADRAO;

  } catch (erro) {

    console.error(
      "Não foi possível ler o tema salvo:",
      erro
    );
  }


  aplicarTema(
    salvo
  );
}



/* =========================================================
   CARROSSÉIS
========================================================= */

const carouselPositions = {
  team: 0,
  achievement: 0,
  especies: 0
};



const carouselTracks = {
  team:
    "teamTrack",

  achievement:
    "achievementTrack",

  especies:
    "especiesTrack"
};



/* =========================================================
   PEGAR TRACK
========================================================= */

function getTrack(type) {

  const id =
    carouselTracks[type];

  if (!id) {
    return null;
  }

  return document.getElementById(id);
}



/* =========================================================
   CONFIGURAR TRACK
========================================================= */

function setupCarousel(type) {

  const track =
    getTrack(type);

  if (!track) {
    return;
  }

  const total =
    track.children.length;

  if (total === 0) {
    return;
  }



  track.style.width =
    `${total * 100}%`;



  Array.from(
    track.children
  ).forEach(
    slide => {

      slide.style.flex =
        `0 0 ${100 / total}%`;

      slide.style.width =
        `${100 / total}%`;

      slide.style.minWidth =
        `${100 / total}%`;

      slide.style.maxWidth =
        `${100 / total}%`;

    }
  );



  updateCarousel(type);
}



/* =========================================================
   POSIÇÃO
========================================================= */

function updateCarousel(type) {

  const track =
    getTrack(type);

  if (!track) {
    return;
  }

  const total =
    track.children.length;

  if (total === 0) {
    return;
  }



  const position =
    carouselPositions[type];



  const movement =
    (position / total) * 100;



  track.style.transform =
    `translateX(-${movement}%)`;
}



/* =========================================================
   MUDAR SLIDE
========================================================= */

function changeSlide(
  type,
  direction
) {

  const track =
    getTrack(type);

  if (!track) {
    return;
  }



  const total =
    track.children.length;

  if (total === 0) {
    return;
  }



  carouselPositions[type] +=
    direction;



  if (
    carouselPositions[type] < 0
  ) {

    carouselPositions[type] =
      total - 1;
  }



  if (
    carouselPositions[type] >= total
  ) {

    carouselPositions[type] =
      0;
  }



  updateCarousel(type);
}



/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initCarousels() {

  setupCarousel(
    "team"
  );

  setupCarousel(
    "achievement"
  );

  setupCarousel(
    "especies"
  );
}



window.addEventListener(
  "load",
  initCarousels
);



window.addEventListener(
  "resize",
  initCarousels
);



/* =========================================================
   CONQUISTAS
   Carregadas de um arquivo/backend (ver CONQUISTAS_URL).
========================================================= */

/*
   Troque essa URL por um endpoint de backend real
   assim que tiver um. Formato esperado, uma lista
   de objetos:

   {
     "icone": "🌱",
     "titulo": "Título da conquista",
     "tag": "Ação Realizada",
     "descricao": "Texto descrevendo a conquista."
   }
*/

const CONQUISTAS_URL =
  "conquistas.json";



async function carregarConquistas() {

  const track =
    document.getElementById(
      "achievementTrack"
    );

  if (!track) {
    return;
  }


  let lista = [];

  try {

    const resposta =
      await fetch(
        CONQUISTAS_URL
      );

    lista =
      await resposta.json();

  } catch (erro) {

    console.error(
      "Não foi possível carregar as conquistas:",
      erro
    );
  }


  if (lista.length === 0) {

    track.innerHTML =
      `<div class="slide">
        <p class="carousel-vazio">
          Nenhuma conquista cadastrada ainda.
        </p>
      </div>`;

  } else {

    track.innerHTML =
      lista.map(
        conquista =>
          `<div class="slide">

            <div class="slide-icon">
              ${conquista.icone}
            </div>

            <h3>
              ${conquista.titulo}
            </h3>

            <span class="tag">
              ${conquista.tag}
            </span>

            <p>
              ${conquista.descricao}
            </p>

          </div>`
      ).join("");
  }


  setupCarousel(
    "achievement"
  );
}



/* =========================================================
   ESPÉCIES
   Carregadas de um arquivo/backend (ver ESPECIES_URL),
   com busca por nome, nome científico ou tipo.
========================================================= */

/*
   Troque essa URL por um endpoint de backend real
   assim que tiver um. Formato esperado, uma lista
   de objetos:

   {
     "nome": "Pequi",
     "nomeCientifico": "Caryocar brasiliense",
     "link": "https://...",
     "tag": "Árvore frutífera",
     "descricao": "Texto descrevendo a espécie.",
     "imagem": "especies/pequi.jpg"
   }
*/

const ESPECIES_URL =
  "especies.json";


let todasEspecies = [];



async function carregarEspecies() {

  const track =
    document.getElementById(
      "especiesTrack"
    );

  if (!track) {
    return;
  }


  try {

    const resposta =
      await fetch(
        ESPECIES_URL
      );

    todasEspecies =
      await resposta.json();

  } catch (erro) {

    console.error(
      "Não foi possível carregar as espécies:",
      erro
    );

    todasEspecies =
      [];
  }


  renderizarEspecies(
    todasEspecies
  );
}



function renderizarEspecies(lista) {

  const track =
    document.getElementById(
      "especiesTrack"
    );

  const vazio =
    document.getElementById(
      "especiesBuscaVazio"
    );

  if (!track) {
    return;
  }


  if (lista.length === 0) {

    track.innerHTML =
      "";

    if (vazio) {

      vazio.style.display =
        "block";
    }

  } else {

    if (vazio) {

      vazio.style.display =
        "none";
    }

    track.innerHTML =
      lista.map(
        especie =>
          `<div class="slide">

            <div class="slide-icon">
              <img
                src="${especie.imagem}"
                alt="${especie.nome}">
            </div>

            <h3>
              ${especie.nome}
            </h3>

            <a
              class="scientific-name"
              href="${especie.link}"
              target="_blank"
              rel="noopener noreferrer">
              <em>
                ${especie.nomeCientifico}
              </em>
            </a>

            <span class="tag">
              ${especie.tag}
            </span>

            <p>
              ${especie.descricao}
            </p>

          </div>`
      ).join("");
  }


  setupCarousel(
    "especies"
  );
}



function filtrarEspecies(termo) {

  const buscaNormalizada =
    termo
      .trim()
      .toLowerCase();


  const filtradas =
    buscaNormalizada === ""
      ? todasEspecies
      : todasEspecies.filter(
          especie =>

            especie.nome
              .toLowerCase()
              .includes(buscaNormalizada) ||

            especie.nomeCientifico
              .toLowerCase()
              .includes(buscaNormalizada) ||

            especie.tag
              .toLowerCase()
              .includes(buscaNormalizada)
        );


  renderizarEspecies(
    filtradas
  );
}



/* =========================================================
   PIX
========================================================= */

function showPix() {

  const pix =
    document.getElementById(
      "pix"
    );

  if (!pix) {
    return;
  }



  if (
    pix.style.display ===
    "block"
  ) {

    pix.style.display =
      "none";

  } else {

    pix.style.display =
      "block";

  }
}

/* =========================================================
   FUNÇÃO DE COR
========================================================= */

function interpolarCor(
  corInicial,
  corFinal,
  progresso
) {

  return corInicial.map(
    (
      valor,
      indice
    ) =>

      Math.round(
        valor +
        (
          corFinal[indice] -
          valor
        ) *
        progresso
      )

  );

}



/* =========================================================
   FUNDO DINÂMICO
========================================================= */

function atualizarFundo() {

  const scrollTop =
    window.scrollY;



  const alturaPagina =
    document.documentElement
      .scrollHeight -
    window.innerHeight;



  if (
    alturaPagina <= 0
  ) {
    return;
  }



  const progresso =
    Math.min(
      Math.max(
        scrollTop /
        alturaPagina,
        0
      ),
      1
    );



  const cores =
    CORES_TEMA[
      temaAtual()
    ];



  const topo =
    interpolarCor(
      cores.topoInicio,
      cores.topoFim,
      progresso
    );



  const meio =
    interpolarCor(
      cores.meioInicio,
      cores.meioFim,
      progresso
    );



  const amarelo =
    interpolarCor(
      cores.cor3Inicio,
      cores.cor3Fim,
      progresso
    );



  const inferior =
    interpolarCor(
      cores.inferiorInicio,
      cores.inferiorFim,
      progresso
    );



  document.documentElement
    .style
    .setProperty(
      "--blue-top",
      `rgb(${topo.join(",")})`
    );



  document.documentElement
    .style
    .setProperty(
      "--blue-light",
      `rgb(${meio.join(",")})`
    );



  document.documentElement
    .style
    .setProperty(
      "--ipe-yellow",
      `rgb(${amarelo.join(",")})`
    );



  document.documentElement
    .style
    .setProperty(
      "--ipe-light",
      `rgb(${inferior.join(",")})`
    );
}



/* =========================================================
   POP-UP
========================================================= */

function fecharPopup() {

  const popup =
    document.getElementById(
      "popupDoacao"
    );

  if (popup) {

    popup.style.display =
      "none";

  }
}



function irParaDoacao() {

  const doacao =
    document.querySelector(
      ".donation"
    );

  if (doacao) {

    doacao.scrollIntoView({

      behavior:
        "smooth",

      block:
        "center"

    });

  }



  fecharPopup();
}



/* =========================================================
   EVENTOS
========================================================= */

window.addEventListener(
  "scroll",
  atualizarFundo,
  {
    passive:
      true
  }
);



/* =========================================================
   INICIALIZAÇÃO
========================================================= */

inicializarTema();

initCarousels();

atualizarFundo();

carregarConquistas();

carregarEspecies();

/* =========================================================
   NOTÍCIAS
   Carregadas de um arquivo/backend (ver NOTICIAS_URL),
   com marcação de recentes e arquivo de antigas.
========================================================= */

/*
   Troque essa URL por um endpoint de backend real
   (ex: "https://seusite.com/api/noticias") assim que
   tiver um. O formato esperado é uma lista de objetos:

   {
     "tag": "🌱 Meio ambiente",
     "titulo": "Título da notícia",
     "resumo": "Texto curto da notícia.",
     "link": "https://...",
     "data": "2026-09-01"
   }
*/

const NOTICIAS_URL =
  "noticias.json";


/* Quantas notícias ficam nas abas antes de "acumular" */

const MAX_NOTICIAS_EM_ABAS = 5;


/* Quantos dias uma notícia é considerada "recente" */

const DIAS_PARA_SER_RECENTE = 7;


let currentNews = 0;

let noticiasRecentes = [];

let noticiasAntigas = [];



function ehRecente(dataISO) {

  const umDiaEmMs =
    24 * 60 * 60 * 1000;

  const diferenca =
    Date.now() -
    new Date(dataISO).getTime();

  return (
    diferenca <=
    DIAS_PARA_SER_RECENTE *
    umDiaEmMs
  );
}



function formatarData(dataISO) {

  return new Date(dataISO)
    .toLocaleDateString(
      "pt-BR"
    );
}



async function carregarNoticias() {

  const tabs =
    document.getElementById(
      "newsTabs"
    );

  const conteudo =
    document.getElementById(
      "newsContent"
    );

  const arquivo =
    document.getElementById(
      "newsArchive"
    );

  const contador =
    document.querySelector(
      ".news-count"
    );

  if (!tabs || !conteudo) {
    return;
  }


  let lista = [];

  try {

    const resposta =
      await fetch(
        NOTICIAS_URL
      );

    lista =
      await resposta.json();

  } catch (erro) {

    console.error(
      "Não foi possível carregar as notícias:",
      erro
    );
  }


  lista =
    [...lista].sort(
      (a, b) =>
        new Date(b.data) -
        new Date(a.data)
    );


  noticiasRecentes =
    lista.slice(
      0,
      MAX_NOTICIAS_EM_ABAS
    );

  noticiasAntigas =
    lista.slice(
      MAX_NOTICIAS_EM_ABAS
    );


  if (contador) {

    contador.textContent =
      `${lista.length} notícia${
        lista.length === 1 ? "" : "s"
      }`;
  }


  if (noticiasRecentes.length === 0) {

    tabs.innerHTML =
      "";

    conteudo.innerHTML =
      `<p class="news-vazio">
        Nenhuma notícia publicada ainda.
      </p>`;

  } else {

    tabs.innerHTML =
      noticiasRecentes.map(
        (noticia, indice) =>
          `<button
            class="news-tab${
              ehRecente(noticia.data)
                ? " recent"
                : ""
            }"
            onclick="openNews(${indice})">
            ${noticia.titulo}
          </button>`
      ).join("");


    conteudo.innerHTML =
      noticiasRecentes.map(
        (noticia, indice) =>
          `<article class="news-item">

            <span class="news-tag">
              ${noticia.tag}
            </span>

            ${
              ehRecente(noticia.data)
                ? `<span class="news-badge">🆕 Recente</span>`
                : ""
            }

            <h3>
              ${noticia.titulo}
            </h3>

            <p>
              ${noticia.resumo}
            </p>

            <span class="news-data">
              ${formatarData(noticia.data)}
            </span>

            <a
              href="${noticia.link}"
              target="_blank"
              rel="noopener noreferrer"
              class="news-link">
              Ler notícia →
            </a>

          </article>`
      ).join("");
  }


  if (arquivo) {

    if (noticiasAntigas.length === 0) {

      arquivo.innerHTML =
        "";

    } else {

      arquivo.innerHTML =
        `<button
          type="button"
          class="news-archive-toggle"
          onclick="toggleArquivo()">
          Ver notícias antigas (${noticiasAntigas.length})
        </button>

        <ul
          class="news-archive-lista"
          id="newsArchiveLista">
          ${noticiasAntigas.map(
            noticia =>
              `<li>
                <a
                  href="${noticia.link}"
                  target="_blank"
                  rel="noopener noreferrer">
                  ${noticia.titulo}
                </a>
                <span>${formatarData(noticia.data)}</span>
              </li>`
          ).join("")}
        </ul>`;
    }
  }
}



function toggleArquivo() {

  const lista =
    document.getElementById(
      "newsArchiveLista"
    );

  const botao =
    document.querySelector(
      ".news-archive-toggle"
    );

  if (!lista || !botao) {
    return;
  }


  const aberta =
    lista.classList.toggle(
      "aberta"
    );


  botao.textContent =
    aberta
      ? "Ocultar notícias antigas"
      : `Ver notícias antigas (${noticiasAntigas.length})`;
}



function openNews(index) {

  const tabs =
    document.querySelectorAll(
      ".news-tab"
    );

  const items =
    document.querySelectorAll(
      ".news-item"
    );


  if (
    !tabs[index] ||
    !items[index]
  ) {
    return;
  }


  tabs.forEach(
    tab => {

      tab.classList.remove(
        "active"
      );

    }
  );


  items.forEach(
    item => {

      item.classList.remove(
        "active"
      );

    }
  );


  tabs[index].classList.add(
    "active"
  );

  items[index].classList.add(
    "active"
  );


  currentNews =
    index;


  /* Ao escolher uma notícia, o painel abre sozinho */

  const painel =
    document.getElementById(
      "newsPanel"
    );

  const botaoToggle =
    document.querySelector(
      ".news-toggle"
    );

  if (painel) {

    painel.classList.remove(
      "collapsed"
    );
  }

  if (botaoToggle) {

    botaoToggle.textContent =
      "−";

    botaoToggle.setAttribute(
      "aria-label",
      "Recolher notícias"
    );
  }
}



function toggleNews() {

  const panel =
    document.getElementById(
      "newsPanel"
    );

  const button =
    document.querySelector(
      ".news-toggle"
    );

  if (!panel || !button) {
    return;
  }


  panel.classList.toggle(
    "collapsed"
  );


  if (
    panel.classList.contains(
      "collapsed"
    )
  ) {

    button.textContent =
      "+";

    button.setAttribute(
      "aria-label",
      "Expandir notícias"
    );

  } else {

    button.textContent =
      "−";

    button.setAttribute(
      "aria-label",
      "Recolher notícias"
    );


    /* Ao expandir, abre a notícia mais recente
       se nenhuma estiver selecionada ainda */

    const jaTemNoticiaAberta =
      document.querySelector(
        ".news-item.active"
      );

    if (!jaTemNoticiaAberta) {

      openNews(0);
    }

  }

}



/* =========================================================
   INICIALIZAÇÃO (NOTÍCIAS)
========================================================= */

carregarNoticias();