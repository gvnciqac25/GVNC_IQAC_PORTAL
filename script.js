const $ = id => document.getElementById(id);

let current = null;


function renderCriteria() {

    current = null;

    $("heading").textContent = "Select a Criterion";

    // Only count forms that have links
    const linkedForms = FORMS.filter(
        f => f.url && f.url.trim() !== ""
    );

    $("count").textContent = `${linkedForms.length} forms`;

    const g = document.createElement("div");

    g.className = "grid";


    // Only display criteria that have linked forms
    Object.entries(CRITERIA).forEach(([n, t]) => {

        const forms = FORMS.filter(
            f =>
                f.c === n &&
                f.url &&
                f.url.trim() !== ""
        );


        // IMPORTANT:
        // Don't display empty criteria
        if (forms.length === 0) {
            return;
        }


        const x = document.createElement("article");

        x.className = "criterion";


        x.innerHTML = `
            <div class="num">
                CRITERION ${n}
            </div>

            <h3>
                ${t}
            </h3>

            <p>
                Access the data collection forms mapped to this NAAC criterion.
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


        x.onclick = () => renderForms(n);

        g.appendChild(x);
    });


    $("content").replaceChildren(g);
}



function renderForms(c) {

    current = c;

    $("heading").textContent =
        `Criterion ${c} — ${CRITERIA[c]}`;


    // Only show forms with links
    const fs = FORMS.filter(
        f =>
            f.c === c &&
            f.url &&
            f.url.trim() !== ""
    );


    $("count").textContent =
        `${fs.length} forms`;


    const wrap = document.createElement("div");


    const back = document.createElement("button");

    back.className = "back";

    back.textContent = "← Back to Criteria";

    back.onclick = renderCriteria;

    wrap.appendChild(back);


    const list = document.createElement("div");

    list.className = "forms";


    fs.forEach(f => {

        const row = document.createElement("div");

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



function search() {

    const q =
        $("search").value.trim().toLowerCase();


    if (!q) {

        renderCriteria();

        return;
    }


    // Search only linked forms
    const fs = FORMS.filter(f => {

        if (!f.url || !f.url.trim()) {
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
        `${fs.length} matching form${fs.length === 1 ? "" : "s"}`;


    const list = document.createElement("div");

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

            const row = document.createElement("div");

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



$("search").addEventListener(
    "input",
    search
);


document.addEventListener("keydown", e => {

    if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k"
    ) {

        e.preventDefault();

        $("search").focus();
    }
});


renderCriteria();