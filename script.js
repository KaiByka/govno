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
manifestoButton.addEventListener("click", () => manifestoDialog.showModal());
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
issueNumber.textContent = String(Math.max(1, Math.floor(daysSinceFirst / 7) + 1)).padStart(3, "0");
