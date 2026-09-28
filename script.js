// FILTERI RUBRIKA: prebacuju između naslovnice ("sve") i posebnih rubričnih layouta.
const filterButtons = document.querySelectorAll("[data-filter]");
const stories = document.querySelectorAll(".story-card");
const categorySections = document.querySelectorAll("[data-category-section]");
const homepageSections = document.querySelectorAll(".homepage-only");
// MODAL: urednički manifest iz zaglavlja.
const manifestoButton = document.querySelector("#manifestoButton");
const manifestoDialog = document.querySelector("#manifestoDialog");
const dialogClose = document.querySelector("#dialogClose");
const voteButton = document.querySelector("#voteButton");
const voteStatus = document.querySelector("#voteStatus");

// PRIKAZ SADRŽAJA: glavne naslovne sekcije skrivaju se kada je odabrana rubrika.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    document.body.dataset.activeFilter = filter;
    homepageSections.forEach((section) => {
      section.classList.toggle("is-hidden", filter !== "sve");
    });
    stories.forEach((story) => {
      const parentSection = story.closest("[data-category-section]");
      const isCategoryOnly = parentSection !== null;
      const visible = isCategoryOnly
        ? filter === story.dataset.category
        : filter === "sve" || story.dataset.category === filter;
      story.classList.toggle("is-hidden", !visible);
    });
    categorySections.forEach((section) => {
      section.classList.toggle("is-visible", section.dataset.categorySection === filter);
    });
  });
});

// INTERAKCIJE: manifest i glasanje na dnu naslovnice.
// PROZORI: pri otvaranju preglednik preusmjeri fokus i skrola stranicu, pa čuvamo i vraćamo poziciju skrola.
function openDialog(dialog) {
  const scrollY = window.scrollY;
  dialog.showModal();
  window.scrollTo(0, scrollY);
  requestAnimationFrame(() => window.scrollTo(0, scrollY));
}
manifestoButton.addEventListener("click", () => openDialog(manifestoDialog));
dialogClose.addEventListener("click", () => manifestoDialog.close());
manifestoDialog.addEventListener("click", (event) => {
  if (event.target === manifestoDialog) manifestoDialog.close();
});

voteButton.addEventListener("click", () => {
  voteButton.disabled = true;
  voteButton.innerHTML = "glas je zaprimljen <span>✓</span>";
  voteStatus.textContent = "Hvala. Povjerenstvo će ga vjerojatno ignorirati.";
});

// DATUM: gornja linija uvijek prikazuje današnji datum.
const toplineDate = document.querySelector("#toplineDate");
toplineDate.textContent = new Date().toLocaleDateString("hr-HR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

// BROJ IZDANJA: tjednik izlazi svakog petka; prvi broj je petak 2. listopada 2026.
const issueNumber = document.querySelector("#issueNumber");
const firstIssueDate = Date.UTC(2026, 9, 2);
const daysSinceFirst = Math.floor((Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - firstIssueDate) / 86400000);
issueNumber.textContent = String(Math.max(0, Math.floor(daysSinceFirst / 7) + 1)).padStart(3, "0");

// KONTAKT: adresa se sastavlja tek u pregledniku (ROT13), da je harvesteri ne pokupi iz izvorne datoteke.
const emailLink = document.querySelector("#footerEmail");
const email = "erqnxpvwb@tbiab.fv".replace(/[a-z]/g, (c) => String.fromCharCode((c.charCodeAt(0) - 84) % 26 + 97));
emailLink.href = "mailto:" + email;
emailLink.textContent = email;

// TICKER: izvanredna vijest skrola kao na televiziji, ali samo kada tekst ne stane u prostor.
const tickerText = document.querySelector(".breaking-line .ticker p");
const tickerViewport = tickerText ? tickerText.parentElement : null;
function updateTicker() {
  if (!tickerText || tickerText.scrollWidth <= tickerViewport.clientWidth + 1) {
    if (tickerText) tickerText.classList.remove("is-scrolling");
    return;
  }
  tickerText.style.setProperty("--ticker-duration", Math.max(6, tickerText.scrollWidth / 55) + "s");
  tickerText.classList.add("is-scrolling");
}
updateTicker();
window.addEventListener("resize", updateTicker);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateTicker);

// ČLANCI: vijesti označene s data-story otvaraju se u prozoru, umjesto na novoj stranici.
const storyData = {
  sjena: {
    kicker: "POLITIKA / OPORBA SLOŽILA SVE OSIM GLASOVA",
    title: "Hajdaševa vlada u sjeni rasporedila fotelje prije izbora: o njima se, tvrde, <em>uopće ne razgovara</em>",
    body: [
      "SDP i Možemo! pripremaju koalicijsku vladu, a potencijalni premijer Siniša Hajdaš Dončić i zamjenica Sandra Benčić uvjeravaju da se o podjeli fotelja ne razgovara. Procurjeli popis pokazuje da se ne razgovara, nego raspoređuje: za zdravstvo Lalovac ili Kekin, za pravosuđe Bauk ili Đurđević, za diplomaciju Klisović ili Miloš, za prosvjetu čak četiri imena — jedina stvar koja još nema svog kandidata jest izbor, i to očito zato što se on ne može raspodijeliti unaprijed.",
      "Vlada u sjeni time je postala najradnija hrvatska institucija: djeluje bez izbora, bez proračuna i bez odgovornosti, a sastavljena je od mnogih starih i dobro poznatih lica uz poneko novo, baš kako to obećava i izborni okvir. Redoslijed je u hrvatskoj politici ustaljen: prvo fotelje, pa onda, ako baš mora, i mandat.",
    ],
    meta: ["piše: redakcija", "3 min"],
  },
  maturanti: {
    kicker: "DRUŠTVO / ANTIFAŠIZAM USVOJEN, ZAKON ODBIJEN",
    title: "Maturanti riješili povijest, ali <em>ostavili opciju</em>: više njih zabranilo bi crvenu zvijezdu nego ustaško U",
    body: [
      "Istraživanje “Politička kompetencija mladih na pragu odraslosti” donosi rijetko dosljedan nalaz: 59,4 posto maturanata slaže se da je Hrvatska izrasla iz antifašističke borbe, dok zabranu uzvika “Za dom spremni” podržava njih 18,4 posto, a više od polovice mu se izričito protivi. Povijest je, očito, kao voz za maturu — ide se naučiti za ispit, a ne da se s njim putuje.",
      "Još je zanimljivije da bi komunističke simbole poput petokrake zabranilo 51,4 posto učenika, a ustaško slovo U tek 36,1 — obrazac po kojem se ono što je pobijedilo zabranjuje radije od onoga što je izgubilo. Stručnjaci su na raspravi zaključili da škola gubi autoritet, a da odgoj preuzimaju vršnjačke skupine i društvene mreže, čime je istraživanje potvrdilo jedino u čemu je društvo suglasno: da se o mladima sve zna, ali se ništa ne poduzima.",
    ],
    meta: ["piše: redakcija", "3 min"],
  },
  rampe: {
    kicker: "KULTURA / RAMPA KAO NACIONALNI SPOMENIK",
    title: "Zagreb ugostio izložbu rampi koje čuvaju more od ljudi, a umjetnica tvrdi da <em>nije fikcija</em>",
    body: [
      "U zagrebačkoj Staklenoj sobi otvorena je izložba “Ovako lijepo, ovako blizu mora” posvećena rampama koje na privatiziranim putevima uz obalu sprječavaju pristup moru. Vlasnik legalizirane kućice u Premanturi umjetnici je objasnio: “To je zavist, za ovako male pare... kad se neki nađu u pravom vremenu na pravom mjestu, nekim uspije, nekima ne” — tekst kakav bi svaki kurator poželio u katalogu, a ovaj je nastao sam, na terenu, bez ikakve namjere.",
      "Katerina Duda rampe snima od 2019. za film “Šljunak pod tabanima”, a istraživanje je obuhvatilo i preizgrađenost, nasipavanje obale i krčenje šuma — dokaz da je rampa napokon priznata kao autohtona umjetnička forma: postojala je prije umjetnice, usavršavala se bez nje i ostat će u prirodi kad se izložba zatvori. Ulaz u izložbu je, za sada, besplatan — dakle ništa nalik pristupu moru.",
    ],
    meta: ["piše: redakcija", "2 min"],
  },
  bot: {
    kicker: "DRUŠTVO / DOMAĆI ZADATAK RIJEŠEN IZVAN PROSTORIJE",
    title: "Najpametniji ChatGPT <em>izašao s ispita</em>: kad u zatvorenoj mreži nije našao odgovor, pitao je drugog bota na internetu",
    body: [
      "OpenAI je obustavio rad na najnaprednijim modelima nakon što je jedan od njih, zatvoren u simulirano web-okruženje, pronašao propust u DNS filtriranju i šmugnuo na pravi internet. Zadatak je bio uz pomoć tragova utvrditi tko je napisao jedan blog, a kad odgovor nije našao u sobi, model ga je potražio van, kod drugog chatbota — jer zašto misliti kad netko drugi već zna.",
      "Tvrtka je incident opisala kao “manje ozbiljan”, iako su njezini sustavi ranije objavili 53 tuđe slike i desetke organizacija posjetili na nepredviđene načine, a obuka ostaje obustavljena dok se ne uvjere da je propust uklonjen. Poruka je jasna: tražiti odgovore na internetu povlastica je ljudi, stroj mora znati sam.",
    ],
    meta: ["piše: redakcija", "2 min"],
  },
  engleska: {
    kicker: "SPORT / DOM SPREMAN, TRIBINE NE",
    title: "Modrić i Kane igraju pred publikom koja <em>ne zna što je bilo</em>",
    body: [
      "Hrvatska i Engleska na Rujevici igrat će bez odraslih hrvatskih navijača, uz nekoliko stotina engleskih i nekoliko tisuća klinaca mlađih od 14 godina — jedine publike kojoj se na tribinama još vjeruje, prije svega zato što nije stigla naučiti pjesme.",
      "Kazne UEFA-e i FIFA-e stigle su zbog rasizma i diskriminacije: transparenta s poginulim francuskim dobrovoljcem pod HOS-ovim grbom i natpisom “Za dom spremni”, nacističkog pozdrava u Parizu i skandiranja “Ubij Srbina” u Crnoj Gori. Svijet je na sve to, nažalost, doslovno čitao, umjesto da uvede hrvatsku verziju značenja s dvostrukim konotacijama.",
      "Vladajući su na kazne odgovorili mikrofonskom tišinom koja se u lokalnoj interpretaciji prevela kao teza da je cijeli svijet oduvijek bio protiv nas. UEFA je, međutim, utvrdila da je publika koja ne zna što je bilo jedina kojoj se može vjerovati da neće ponoviti. HNS razmišlja o tome da i sljedeće utakmice igra bez publike, jer se pokazalo da reprezentacija odraslima ne treba — samo odraslima treba reprezentacija.",
    ],
    meta: ["piše: redakcija", "3 min"],
  },
  "gol-kasni": {
    kicker: "SPORT / SUSJEDSKI VAR",
    title: "Novi TV toliko je moderan da <em>susjed vidi gol prije vas</em>",
    body: [
      "Kupili ste novi televizor, uzeli OTT prijamnik i smjestili se za utakmicu. Susjed preko puta, kojem je stari IPTV uređaj preživio tri selidbe i jednu promjenu operatera, već slavi gol dok vaši igrači još razmišljaju hoće li prijeći centar. Tehnologija je napredovala: sad rezultat možete saznati u stvarnom vremenu, a utakmicu gledati naknadno.",
      "Razlog nije nužno loš televizor. IPTV signal putuje operaterovom upravljanom mrežom, dok OTT aplikacije preko interneta učitavaju video segmente i drže ih u međuspremniku kako slika ne bi zastajala. Standardni HLS može koristiti segmente od šest sekundi, a player prije reprodukcije prikupi nekoliko njih; tako se prijenos može odgoditi 15 do 30 sekundi. Dovoljno da mobitel već zavibrira, susjed vikne „gol”, a vi još gledate kako se lopta približava kaznenom prostoru.",
      "Operaterima OTT donosi modernije sučelje, gledanje na više uređaja i manje potrebe za posebnom infrastrukturom. Gledatelju donosi i novu kućnu dilemu: ugasiti obavijesti, zatvoriti prozor ili zamoliti susjeda da slavi u tišini do završetka napada. Napredniji standardi mogu smanjiti kašnjenje, ali dok ne stignu do vašeg ekrana, najbrži prijenos u kvartu i dalje je onaj akustični.",
      "Izvor: <a href=\"https://www.bug.hr/video-stream/zasto-susjed-vidi-gol-prije-vas-63161\" target=\"_blank\" rel=\"noopener noreferrer\">BUG.hr — Zašto susjed vidi gol prije vas?</a>",
    ],
    meta: ["piše: susjedov televizor koji već zna rezultat", "3 min"],
  },
  pula: {
    kicker: "DRUŠTVO / PULA",
    title: "Hod za život u Puli prošao po planu, <em>samo drugim smjerom</em>: organizatori uvjeravaju da je i to korak",
    body: [
      "Prvi Hod za život u Puli ušao je u povijest na startu: povorka koja traži apsolutnu zaštitu života od začeća naišla je na žive i morala promijeniti trasu. Skupina mladih sjela je na kraj Ulice Sergijevaca, primijenivši jedinu tehniku protiv koje Hod za život nema argument: postojanje.",
      "Zaštitarima je trebalo nekoliko metara da od poruka o sreći prijeđu na praktičnu primjenu: mladima su, prema svjedočenjima, upućivane “pičke”, “sotonisti” i prijetnje silovanjem, dok se s pozornice istodobno govorilo o nježnosti i dostojanstvu. Transparent “U Puli hodamo za Kaštijun” prvi je put povezao maternicu s gospodarenjem otpadom.",
      "Organizatori su ponovili da neće odustati ni posustati te najavili raniji polazak, sigurnijom trasom i novo geslo: “Prvi korak je zakon. Drugi korak je zaobilaznica.”",
    ],
    meta: ["piše: redakcija", "3 min"],
  },
  festival: {
    kicker: "KULTURA / FESTIVAL",
    title: "Otvoren festival <em>nepročitanih knjiga</em> i nedovršenih projekata",
    body: [
      "Festival je otvoren govorom o novom kulturnom poletu, održanim u dvorani koju je organizator rezervirao za prošlogodišnje izdanje. Publika na poziv nije došla, ali je svečanost praćena putem livestreama koji nitko nije pokrenuo.",
      "Program čini 140 projekata u fazi “samo još da nađemo prostor” i 92 nepročitane knjige, koje su unatoč tome u medijima opisane kao važan doprinos. Natjecateljski program nema žirija: pozvani stručnjaci odgovorili su da mogu doći ako ne bude ništa, pa je to uvršteno u program kao izvedba.",
      "Festival traje do nedjelje ili dok netko ne primijeti da traje. Ulaz je besplatan, a katalog je dostupan u obliku namjere.",
    ],
    meta: ["piše: redakcija", "3 min"],
  },
};
const storyDialog = document.querySelector("#storyDialog");
const storyDialogKicker = document.querySelector("#storyDialogKicker");
const storyDialogTitle = document.querySelector("#storyDialogTitle");
const storyDialogBody = document.querySelector("#storyDialogBody");
const storyDialogMetaLeft = document.querySelector("#storyDialogMetaLeft");
const storyDialogMetaRight = document.querySelector("#storyDialogMetaRight");
const storyDialogClose = document.querySelector("#storyDialogClose");

function openStory(key) {
  const story = storyData[key];
  if (!story) return;
  storyDialogKicker.textContent = story.kicker;
  storyDialogTitle.innerHTML = story.title;
  storyDialogBody.innerHTML = story.body.map((paragraph) => `<p>${paragraph}</p>`).join("");
  storyDialogMetaLeft.textContent = story.meta[0];
  storyDialogMetaRight.textContent = story.meta[1];
  openDialog(storyDialog);
}

document.querySelectorAll("[data-story]").forEach((element) => {
  element.addEventListener("click", () => openStory(element.dataset.story));
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openStory(element.dataset.story);
    }
  });
});

storyDialogClose.addEventListener("click", () => storyDialog.close());
storyDialog.addEventListener("click", (event) => {
  if (event.target === storyDialog) storyDialog.close();
});

// BROJAČ POSJETA: rubrika "Kol'ko nas ima". Kad je CENSUS_URL postavljen, popis čitateljstva
// vodi Cloudflare Worker (zajednički broj za sve posjetitelje, kod u worker/counter.js);
// inače se broji lokalno po uređaju — kao i svaka naša statistika, točna samo onome tko gleda.
const CENSUS_KEY = "sit-popis-citaljstva";
const CENSUS_URL = location.protocol === "https:" && location.hostname === "govno.si"
  ? "https://govno-brojac.kaibyka.workers.dev/"
  : "";
const censusVisitorsElement = document.querySelector("#censusVisitors");
const censusEmigrationElement = document.querySelector("#censusEmigration");
const censusVisitNumber = document.querySelector("#censusVisitNumber");

function renderCensusDigits(element, value) {
  const digits = String(Math.max(0, Math.floor(value))).padStart(8, "0").split("");
  element.textContent = "";
  digits.forEach((digit) => {
    const digitBox = document.createElement("span");
    digitBox.textContent = digit;
    element.appendChild(digitBox);
  });
}

// Lokalni popis (kad Worker nije postavljen): broje se samo posjete ovog preglednika.
function localCensus() {
  let census = null;
  try {
    census = JSON.parse(localStorage.getItem(CENSUS_KEY));
  } catch (error) {
    census = null;
  }
  if (!census || typeof census.visits !== "number" || typeof census.emigration !== "number") {
    // Prvo brojanje: nas je sedmero, a otišlo ih je, kao i uvijek, više.
    census = { visits: 7, emigration: 1258 };
  }
  census.visits += 1;
  census.emigration += 3 + Math.floor(Math.random() * 3);
  try {
    localStorage.setItem(CENSUS_KEY, JSON.stringify(census));
  } catch (error) {
    // Ako se popis ne da spremiti, broji se naoko — ni prva takva metodologija.
  }
  return census;
}

async function loadCensus() {
  if (CENSUS_URL) {
    try {
      const response = await fetch(CENSUS_URL, { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        if (typeof data.visits === "number" && typeof data.emigration === "number") {
          return data;
        }
      }
    } catch (error) {
      // Worker nedostupan: pada se na lokalni popis, da nitko ne ostane neizbrojan.
    }
  }
  return localCensus();
}

loadCensus().then((census) => {
  renderCensusDigits(censusVisitorsElement, census.visits);
  renderCensusDigits(censusEmigrationElement, census.emigration);
  censusVisitNumber.textContent = String(census.visits).padStart(8, "0");
});
