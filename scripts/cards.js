cards = [];
firstsCards = [];
/**
 * populates cards array with json objects
 */
function getCards() {
    all_bios.forEach((bioLtr) => {
        bioLtr.forEach((bio) => {
            if (bio.funFact.trim() !== "" && bio.funFact !== undefined) {
                n = bio.firstName + " " + bio.lastName;
                l =
                    "bios.html?last=" +
                    bio.lastName +
                    "&middle=" +
                    bio.middleName +
                    "&first=" +
                    bio.firstName;

                if (bio.funFactImage == "") i = bio.photo[0];
                else i = bio.funFactImage;

                j = {
                    name: n,
                    link: l,
                    image: i,
                    description: bio.funFact,
                };
                cards.push(j);
            }
        });
    });
}
/**
 * Builds the table of Cambridge Women "Firsts"
 */
function getFirstsCards() {
    all_bios.forEach((bioLtr) => {
        bioLtr.forEach((bio) => {
            if (bio.first.trim() !== "" && bio.first !== undefined) {
                n = bio.firstName + " " + bio.lastName;
                l =
                    "bios.html?last=" +
                    bio.lastName +
                    "&middle=" +
                    bio.middleName +
                    "&first=" +
                    bio.firstName;

                j = {
                    name: n,
                    link: l,
                    description: bio.first,
                    year: bio.firstYear,
                };
                firstsCards.push(j);
            }
        });
    });
    //TODO sort by year:
     sortedFirsts = firstsCards.sort((a, b) => {
        if(a.year.indexOf("c.")!= -1)
            ay = a.year.substring(2);
        else ay = a.year;
        if(b.year.indexOf("c.")!= -1)
            by = b.year.substring(2);
        else by = b.year;
        if (ay > by) return 1;
        if (ay < by) return -1;
        return 0;
    });

    html = "<table id='firsts-table'>";
    sortedFirsts.forEach((fc) => {
        console.log(html);
        html +=
            "<tr><td style='color: rgb(76, 13, 92);font-weight:bold'>" +
            fc.year +
            "</td><td><a class='name-link' style='display:inline' href='" +
            fc.link +
            "'>" +
            fc.name +
            "</a></td><td>" +
            fc.description +
            "</td></Tr>";
    });
    html += "</table>";
    document.getElementById("fact-cards").innerHTML = html;
}

/**
 * displays fun facts/first on Fun Facts page
 */
function displayCards() {
    getCards();
    html = "";
    count = 0;

    // Loop from the back of the array down to the second element
    for (let i = cards.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements array[i] and array[j] using destructuring
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    //build each card:
    cards.forEach((element) => {
        if (element.name != "") {
            count++;
            //left/right alternating position:
            if (count % 2 == 0)
                mgn = "left-card"; //"margin-left:20vw";
            else mgn = "right-card"; //"margin-right:20vw";

            html +=
                '<div class="w3-container no-underline-area fade-element">' +
                '<a href="' +
                element.link +
                '"><div class="w3-card-4 ' +
                mgn +
                '">' +
                '<header class="w3-container w3-black"><h3 class="best-color">' +
                element.name +
                '</h3></header><div class="w3-container"><img src="' +
                element.image +
                '" alt="Avatar"' +
                'class="w3-left w3-circle w3-margin-right" style="width:60px"><p>' +
                element.description +
                "</p><br></div></div></div></a><br>";
        }
    });
    document.getElementById("cards").innerHTML = html;
}
/**
 * displays fun fact/first on index.html
 */
function displayRandomCard() {
    getCards();
    html = "";
    choice = Math.floor(Math.random() * cards.length);
    element = cards[choice];

    if (element.name != "") {
        html +=
            '<div class="w3-container no-underline-area">' +
            '<a href="' +
            element.link +
            '"><div class="w3-card-4" style="width:50%;">' +
            '<header class="w3-container w3-black"><i><h3 id="gray">Featured</i>: ' +
            element.name +
            '</h3></header><div class="w3-container"><img src="' +
            element.image +
            '" alt="Avatar"' +
            'class="w3-left w3-circle w3-margin-right" style="width:60px"><p><span id="description">' +
            element.description +
            "</span></p></div></div></div></a>";
    }
    document.getElementById("one-card").innerHTML = html;
}
