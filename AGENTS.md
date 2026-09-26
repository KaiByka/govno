# AGENTS.md — ŠIT (govno)

Nezavisni satirični list. Statična stranica: `index.html` + `script.js` + `styles.css`.
Sve datoteke koriste CRLF završetke linija — čuvati ih pri svakom uređivanju.

## Objavljivanje satirične vijesti iz stvarne vijesti

Kad korisnik pošalje link (naredba tipa "objavi vijest: <link>"):

1. Pročitati članak alatom `open_url`. Predložiti satiričnu verziju u tonu stranice:
   kicker, naslov, dek (JEDNA rečenica) i puni tekst (MAKSIMALNO TRI PASUSA).
2. Ništa ne pisati u datoteke dok korisnik ne odobri tekst i ispravke.
3. Nakon odobrenja objaviti na dva mjesta:
   - "Šit dana" grid na naslovnici: nova kartica kao broj 01 (`data-story` ključ),
     postojeće kartice presložiti na 02+ i ažurirati brojač
     "odabrano s terena / NN" u zaglavlju sekcije.
   - Odgovarajuća rubrika (npr. društvo): kao `category-feature` na vrhu sekcije,
     po uzoru na strukturu politika sekcije (`category-feature-group`).
   - Puni tekst u `storyData` objekt u `script.js` — tekst postoji samo tu,
     obje kartice dijele isti `data-story` ključ.
4. Ne dirati ticker izvanredne vijesti osim ako korisnik ne zatraži.
5. Ne commitati ni pushati bez izričite potvrde korisnika.

## Stil

- Hrvatski jezik, suha apsurdna satira; stvarne citate i događaje samo pomaknuti jedan korak dalje.
- Kicker mora biti MAKSIMALNO satiričan — kratak, duhovit, bode oči (npr. "PUNOLJETNOST JE PRIVILEGIJ",
  "SVEMU DOĐE KRAJ"), nikad samo opisna oznaka rubrike.
- Kovrdžavi navodnici “ ” u tekstu vijesti.
- story-meta: rubrika + procjena vremena čitanja.
