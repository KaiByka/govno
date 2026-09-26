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
