const $ = id => document.getElementById(id);

let current = null;


// ======================================================
// URL / HASH HANDLING
// ======================================================

function getCriterionFromHash() {
    const hash = window.location.hash;

    const match = hash.match(/^#criterion-(\d+)$/);

    if (!match) {
        return null;
    }

    const criterion = match[1];

    if (!CRITERIA[criterion]) {
        return null;
    }

    const hasForms = FORMS.some(
        f =>
            f.c === criterion &&
            f.url &&
            f.url.trim() !== ""
    );

    if (!hasForms) {
        return null;
    }

    return criterion;
}


function updateCriterionURL(c) {
    const url =
        `${window.location.pathname}#criterion-${c}`;

    window.history.pushState(
        { criterion: c },
        "",
        url
    );
}


function clearCriterionURL() {
    window.history.pushState(
        {},
        "",
        window.location.pathname
    );
}


// ======================================================
// CRITERION PAGE
// ======================================================

function renderCriteria() {

    current = null;

    clearCriterionURL();

    $("heading").textContent =
        "Select a Criterion";


    const linkedForms = FORMS.filter(
        f =>
            f.url &&
            f.url.trim() !== ""
    );


    $("count").textContent =
        `${linkedForms.length} forms`;


    const g = document.createElement("div");

    g.className = "grid";


    Object.entries(CRITERIA).forEach(
        ([n, t]) => {

            const forms = FORMS.filter(
                f =>
                    f.c === n &&
                    f.url &&
                    f.url.trim() !== ""
            );


            // Hide criteria that don't have
            // any active forms
            if (forms.length === 0) {
                return;
            }


            /*
             * IMPORTANT:
             *
             * We use a real <a> element instead
             * of only using onclick.
             *
             * This allows:
             *
             * Right-click
             * → Copy link address
             *
             */


            const x = document.createElement("a");

            x.className = "criterion";

            x.href =
                `#criterion-${n}`;


            x.innerHTML = `
                <div class="num">
                    CRITERION ${n}
                </div>

                <h3>
                    ${t}
                </h3>

                <p>
                    Access the data collection forms
                    mapped to this NAAC criterion.
                </p>

                <div class="bottom">

                    <span>
                        ${forms.length} forms
                    </span>

                    <span class="arrow">
                        →
                    </span>

                </div>
            `;


            x.addEventListener(
                "click",
                event => {

                    /*
                     * Normal left click:
                     * open the criterion inside
                     * the same page.
                     */
                    event.preventDefault();

                    renderForms(n);

                }
            );


            g.appendChild(x);

        }
    );


    $("content").replaceChildren(g);
}


// ======================================================
// FORM LIST
// ======================================================

function renderForms(c) {

    current = c;


    updateCriterionURL(c);


    $("heading").textContent =
        `Criterion ${c} — ${CRITERIA[c]}`;


    const fs = FORMS.filter(
        f =>
            f.c === c &&
            f.url &&
            f.url.trim() !== ""
    );


    $("count").textContent =
        `${fs.length} forms`;


    const wrap =
        document.createElement("div");


    // --------------------------------------------------
    // BACK BUTTON
    // --------------------------------------------------

    const back =
        document.createElement("button");


    back.className = "back";

    back.textContent =
        "← Back to Criteria";


    back.onclick = () => {

        clearCriterionURL();

        renderCriteria();

    };


    wrap.appendChild(back);


    // --------------------------------------------------
    // FORM LIST
    // --------------------------------------------------

    const list =
        document.createElement("div");


    list.className = "forms";


    fs.forEach(f => {

        const row =
            document.createElement("div");


        row.className = "form";


        row.innerHTML = `
            <div>

                <div class="metric">
                    ${f.m}
                </div>

                <div class="title">
                    ${f.t}
                </div>

                <div class="desc">
                    ${f.d}
                </div>

            </div>

            <a
                class="open"
                href="${f.url}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Open Form ↗
            </a>
        `;


        list.appendChild(row);

    });


    wrap.appendChild(list);


    $("content").replaceChildren(wrap);
}


// ======================================================
// SEARCH
// ======================================================

function search() {

    const q =
        $("search").value
            .trim()
            .toLowerCase();


    if (!q) {

        /*
         * If the user clears search while
         * viewing a shared criterion URL,
         * return to that criterion.
         */

        const criterion =
            getCriterionFromHash();


        if (criterion) {

            renderForms(criterion);

        } else {

            renderCriteria();

        }

        return;

    }


    const fs = FORMS.filter(f => {

        if (
            !f.url ||
            !f.url.trim()
        ) {
            return false;
        }


        return [
            f.c,
            f.m,
            f.t,
            f.d,
            CRITERIA[f.c]
        ]
            .join(" ")
            .toLowerCase()
            .includes(q);

    });


    current = null;


    $("heading").textContent =
        "Search Results";


    $("count").textContent =
        `${fs.length} matching form${
            fs.length === 1 ? "" : "s"
        }`;


    const list =
        document.createElement("div");


    list.className = "forms";


    if (!fs.length) {

        list.innerHTML = `
            <div class="empty">

                No matching form found.
                Try a metric number or keyword.

            </div>
        `;

    } else {

        fs.forEach(f => {

            const row =
                document.createElement("div");


            row.className = "form";


            row.innerHTML = `
                <div>

                    <div class="metric">
                        CRITERION ${f.c} · ${f.m}
                    </div>

                    <div class="title">
                        ${f.t}
                    </div>

                    <div class="desc">
                        ${f.d}
                    </div>

                </div>

                <a
                    class="open"
                    href="${f.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open Form ↗
                </a>
            `;


            list.appendChild(row);

        });

    }


    $("content").replaceChildren(list);
}


// ======================================================
// KEYBOARD SHORTCUT
// ======================================================

$("search").addEventListener(
    "input",
    search
);


document.addEventListener(
    "keydown",
    e => {

        if (
            (e.ctrlKey || e.metaKey) &&
            e.key.toLowerCase() === "k"
        ) {

            e.preventDefault();

            $("search").focus();

        }

    }
);


// ======================================================
// BROWSER BACK / FORWARD
// ======================================================

window.addEventListener(
    "popstate",
    () => {

        const criterion =
            getCriterionFromHash();


        if (criterion) {

            renderForms(criterion);

        } else {

            renderCriteria();

        }

    }
);


// ======================================================
// INITIAL PAGE LOAD
// ======================================================

const initialCriterion =
    getCriterionFromHash();


if (initialCriterion) {

    renderForms(initialCriterion);

} else {

    renderCriteria();

}