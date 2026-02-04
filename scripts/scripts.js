/**
 * @author Anthony Beckwith
 */

const alphabet = "abcdefghijklmnopqrstuvwxyz";

let personCounts = [];
let totalEntries = 0;
let namesLists = [];
let strippedNamesList = [];

let currentLetter = 0;
let currentPersonIndex = 0;

let RECENT_MONTHS_LIMIT = 12; //for recent additions page
let RECENT_MONTHS_LIMIT2 = 3; //for recent edits part of recents page

/**
 * Makes sidebar and then loads bio
 * Called when page first loads with no params
 * Also called when page is loaded when person is selected
 **/
function startBio() {
    setMenu(1); //1 = set that one to gray

    //get params from URL:
    p = getParams();
    console.log(p)
    //when page first loads
    ltrIndex = 0;
    personIndex = 0;

    lastNameParam = "";
    middleNameParam = "";
    firstNameParam = "";
    if (typeof p[0] !== "undefined") lastNameParam = p[0][1]; //[0] is key, [1] is param
    if (typeof p[1] !== "undefined") middleNameParam = p[1][1];
    if (typeof p[2] !== "undefined") firstNameParam = p[2][1];

    //if there are any names in the URL, find location in list from names:
    if (lastNameParam + middleNameParam + firstNameParam !== "") {
        info = getLocation(lastNameParam, middleNameParam, firstNameParam);
        ltrIndex = info[0];
        personIndex = info[1];
        ltrIndex = "abcdefghijklmnopqrstuvwxyz".indexOf(
            lastNameParam.charAt(0).toLowerCase(),
        );
    }
    if (ltrIndex == -1) ltrIndex = 0;
    searching = true;
    //take first letter of last name and make sidebar for that letter:
    makeSidebar(ltrIndex, personIndex, false, false, false);
    //set up the page basics:
    init(false, false);
    setBoldInSideBar(bios, ltrIndex, personIndex);

    if (searching) makeBio(ltrIndex, personIndex, false, false, false);
}
/**
 * Displays the most recent bios created
 * @param {Integer} num number of recents to show
 */
function showRecents(num) {
    setMenu(5);
    var all_bios = getBios();
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    recentsObjects = [];
    recentCount = 0;
    //go through each A-Z bio list:
    all_bios.forEach((bioLetterList) => {
        //go through each name for this letter:
        bioLetterList.forEach((thename) => {
            hasFullDate = thename.dateCreated.substring(0, 2) != "00";
            if (
                thename.dateCreated != "prior to 2009" &&
                thename.dateCreated != "" &&
                hasFullDate
            ) {
                //GET YEAR:
                year = parseInt(thename.dateCreated.substring(6));
                dayNum = parseInt(thename.dateCreated.substring(3, 5));
                monthNum = parseInt(thename.dateCreated.substring(0, 2));

                currYear = new Date().getUTCFullYear();
                currMonth = new Date().getMonth();

                monthsDifference =
                    (currYear - year) * 12 + currMonth - monthNum;

                //only add to list if within number of months selected:
                if (monthsDifference < RECENT_MONTHS_LIMIT) {
                    recentCount++; 
                    
                    //some titles are two lines - get rid of second line:
                    brLoc = thename.title.toLowerCase().indexOf("<br>");
                    if(brLoc !=-1)
                        strippedTitle = thename.title.substring(0, brLoc);
                    else
                        strippedTitle = thename.title;

                    //if org, not first name, so don't show a , :
                    if(thename.firstName != "")
                        fnm = ", " + thename.firstName;
                    else
                        fnm = "";
                    // html +=

                    html_build =
                        "<br></i>" +
                        thename.dateCreated.replaceAll(".", "/") +
                        ":</b>&nbsp;&nbsp;<span class='recents-name'>" +
                        "<a href='" +
                        getHref(
                            thename.lastName,
                            thename.middleName,
                            thename.firstName,
                        ) +
                        "'>" +
                        thename.lastName.replaceAll("'", "") +
                        fnm + 
                        "</a></span>,&nbsp;<i> " +
                        strippedTitle +
                        "";
                    recentsObjects.push({ html_build, monthNum, year, dayNum });
                }
            }
        });
    });
    html =
        "<Center><span class='nice-header2'>THESE " +
        recentCount +
        " NEW BIOS HAVE BEEN ADDED IN THE LAST " +
        RECENT_MONTHS_LIMIT +
        " MONTHS:</span><br></center>";
    //SORT ALGORITHM: first by year, then month, then day:
    r = recentsObjects.sort((a, b) => {
        // Primary sort: by age (ascending)
        if (a.year > b.year) return -1;
        if (a.year < b.year) return 1;
        if (parseInt(a.monthNum) < parseInt(b.monthNum)) return 1;
        if (parseInt(a.monthNum) > parseInt(b.monthNum)) return -1;
        if (a.theDate != "none" && b.theDate != "none") {
            if (parseInt(a.dayNum) < parseInt(b.dayNum)) return 1;
            if (parseInt(a.dayNum) > parseInt(b.dayNum)) return -1;
        }

        return 0;
    });

    recentUpdatesObjects = [];
    recentUpdatesCount = 0;
    //go through each A-Z bio list:
    all_bios.forEach((bioLetterList) => {
        //go through each name for this letter:
        bioLetterList.forEach((thename) => {
            hasFullDate = thename.dateUpdated.substring(0, 2) != "00";
            if (
                thename.dateUpdated != "prior to 2009" &&
                thename.dateUpdated != "" &&
                hasFullDate
            ) {
                //GET YEAR:
                year = parseInt(thename.dateUpdated.substring(6));
                dayNum = parseInt(thename.dateUpdated.substring(3, 5));
                monthNum = parseInt(thename.dateUpdated.substring(0, 2));

                currYear = new Date().getUTCFullYear();
                currMonth = new Date().getMonth();

                monthsDifference =
                    (currYear - year) * 12 + currMonth - monthNum;

                //only add to list if within number of months selected:
                if (monthsDifference < RECENT_MONTHS_LIMIT2) {
                    recentUpdatesCount++;

                    //some titles are two lines - get rid of second line:
                    brLoc = thename.title.toLowerCase().indexOf("<br>");
                    if(brLoc !=-1)
                        strippedTitle = thename.title.substring(0, brLoc);
                    else
                        strippedTitle = thename.title;

                    //if org, not first name, so don't show a , :
                    if(thename.firstName != "")
                        fnm = ", " + thename.firstName;
                    else
                        fnm = "";
                    // html +=
                    html_build =
                        "<br></i>" +
                        thename.dateUpdated.replaceAll(".", "/") +
                        ":</b>&nbsp;&nbsp;<span class='recents-name'>" +
                        "<a href='" +
                        getHref(
                            thename.lastName,
                            thename.middleName,
                            thename.firstName,
                        ) +
                        "'>" +
                        thename.lastName +
                        fnm +
                        "</a></span>,<i> &nbsp;" +
                        strippedTitle +
                        "";
                    recentUpdatesObjects.push({
                        html_build,
                        monthNum,
                        year,
                        dayNum,
                    });
                }
            }
        });
    });
    html2 =
        "<br><br><Center><span>These " +
        recentUpdatesCount +
        " bios have had significant <b>edits or updates</b> made to them in the last " +
        RECENT_MONTHS_LIMIT2 +
        " months:</span><br></center>";
    //SORT ALGORITHM: first by year, then month, then day:
    r2 = recentUpdatesObjects.sort((a, b) => {
        // Primary sort: by age (ascending)
        if (a.year > b.year) return -1;
        if (a.year < b.year) return 1;
        if (parseInt(a.monthNum) < parseInt(b.monthNum)) return 1;
        if (parseInt(a.monthNum) > parseInt(b.monthNum)) return -1;
        if (a.theDate != "none" && b.theDate != "none") {
            if (parseInt(a.dayNum) < parseInt(b.dayNum)) return 1;
            if (parseInt(a.dayNum) > parseInt(b.dayNum)) return -1;
        }

        return 0;
    });

    //PUT TOGETHER DISPLAY:
    r.forEach((element) => {
        html += element.html_build;
    });
    r2.forEach((element) => {
        html2 += element.html_build;
        console.log(element.html_build);
    });
    if (html + html2 != "")
        document.getElementById("recents").innerHTML = html + html2;
    else
        document.getElementById("recents").innerHTML =
            "No new entries in the last " + RECENT_MONTHS_LIMIT + " months";
}

/**
 * Gets 3 parts of name from URL
 * @returns {Array} name parames array
 */
function getParams() {
    var url = window.location;
    let params = new URLSearchParams(url.search);

    p = [];
    for (const param of params) {
        p.push(param);
    }
    fName = p[0];
    mName = p[1];
    lName = p[2];
    return [fName, mName, lName];
}
/**
 * responsive to resize window
 */
function resizeMenu() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}
/**
 * get rid of space or ' inside of a last name, like Del Volpe or O'Reilly
 * so that it sees it as one name
 */
function stripName(nm) {
    pName = nm.replaceAll("'", "");
    pName = pName.replaceAll(" ", "");
    return pName;
}
/**
 * Changes dots to slashes in dates
 * Also eliminates leading zeroes
 * @param {*} dateWithDots
 */
function formatDateSlash(dateWithDots) {
    if (
        dateWithDots.indexOf(".") != -1 &&
        dateWithDots.substring(0, 2) != "00"
    ) {
        sep = dateWithDots.split(".");
        //day: eliminate leading zero:
        if (sep[0].charAt(0) == "0") m = sep[0].charAt(1);
        else m = sep[0];
        //month:eliminate leading zero:
        if (sep[1].charAt(0) == "0") d = sep[1].charAt(1);
        else d = sep[1];
        return m + "/" + d + "/" + sep[2];
    }
    //just 4-digit year:
    if (dateWithDots.substring(0, 2) == "00") return dateWithDots.substring(6);
    //all others (incl. "before 2009")
    return dateWithDots;
}
var popup;
/**
 * generates printable version of bio
 */
function openWin() {
    if (popup && !popup.closed) {
        popup.focus();
    } else {
        var divText = document.getElementById("bio").outerHTML; //get the div
        console.log(divText);
        //lop off extra line breaks from web version:
        // divText = divText.substring(0, divText.length - 40);
        divText = divText.replaceAll("Printable Version", "");
        divText = divText.replaceAll("🖨 ", "");

        //<br><a onclick='openWin()'><u><b>Printable Version</b></u>
        divText =
            "Cambridge Women's Heritage Project (https://cwhp.cambridgema.gov/)<br><br>" +
            divText;
        popup = window.open("", "", "width=800,height=700");
        var doc = popup.document;

        doc.open();
        doc.write(divText);
        doc.close();
    }
}

/**
 * Puts together the bio of an individual from the JSON data
 * and places the bio in the bio box to the right of the list of women
 * @param {Integer} letter position in alphabet
 * @param {Integer} indexOfPerson
 */
let person = "";
function makeBio(ltrIndex, indexOfPerson, initial, search, topical) {
    //get the last name fist letter:

    // ltrIndex = "abcdefghijklmnopqrstuvwxyz".indexOf(urllastName.charAt(0).toLowerCase());
    //get all JSON bios for this letter:
    bios = getBios();

    //GET PERSON JSON:
    person = bios[ltrIndex][indexOfPerson];
    currentLetter = ltrIndex;
    currentPersonIndex = indexOfPerson;
    let html = "<div id='bio-container' style='line-height:1.7'>";

    link = getHref(person.lastName, person.middleName, person.firstName);

    //name:
    html += "<div class='name-heading'><strong><span id='full-name'>";
    if (person.firstName !== "") html += person.firstName + " ";
    if (person.middleName !== "") html += person.middleName + " ";
    if (person.lastName !== " ") html += person.lastName + " ";
    if (person.familyName !== "")
        html +=
            "</span><br><span id='born'>(born " +
            person.firstName +
            " " +
            person.middleName +
            " " +
            person.familyName +
            ")</span> ";
    else html += "</span>";
    if (person.firstName != "")
        document.title =
            "CWHP: " + person.lastName + ", " + person.firstName + "";
    else document.title = "CWHP: " + person.lastName;

    html += "</strong></div>";

    //title and birth info:
    html +=
        "<strong><span class='person-title'>" +
        person.title +
        "</span></strong>";

    //birth/death info:
    if (person.birthDate != "" || person.birthLocation != "")
        html +=
            "<div>" +
            formatDate("b. ", person.birthDate) +
            formatLocation(person.birthLocation) +
            "</div>";

    if (person.deathDate != "" || person.deathLocation != "") {
        dth = formatDate("d. ", person.deathDate);
        if (dth == "d. ") dth = "";
        html += "<div>" + dth + formatLocation(person.deathLocation) + "</div>";
    }

    //has first image
    if (person.photos[0] != "") {
        if (person.photoHeights.length != 0 && person.photoHeights[0] != "")
            height = person.photoHeights[0];
        else height = 300;

        tbl = "<table align='right'><tr><td>";

        //has a title first first image:
        if (person.photoTitles.length > 0 && person.photoTitles[0] != "")
            title =
                '<tr><td align="center" style="width:100px"><i>' +
                person.photoTitles[0] +
                "</i></td></tr>";
        else title = "";
        pushPhoto = "";
        if (person.photoPos != undefined && person.photoPos.length != 0)
            if (person.photoPos[0] != "") {
                pushPhoto = "";
                for (i = 0; i < parseInt(person.photoPos[0]); i++)
                    pushPhoto += "<br>";
            }

        html +=
            tbl +
            pushPhoto +
            '<img src="' +
            person.photos[0] +
            '" alt="" style="text-align:right"height="' +
            height +
            'vh"' +
            ' border="1" style="margin:20px;"></td></tr>' +
            title +
            "</table>";
    }

    //narrative:
    narr = person.narrative;
    html += "<br>" + narr;

    //possible second image:
    if (person.photos.length > 1 && person.photos[1] != "") {
        //go through all photos:
        tbl = "<table width='2vh'>";
        for (let i = 1; i < person.photos.length; i++) {
            if (person.photoHeights.length > i && person.photoHeights[i] != "")
                height = person.photoHeights[i];
            else height = 300;

            tbl += "<tr><td>";
            //has a title for second image:
            if (person.photoTitles.length > i && person.photoTitles[i] != "")
                title =
                    '<tr><td align="center"><i>' +
                    person.photoTitles[i] +
                    "</i></td></tr>";
            else title = "";

            html +=
                tbl +
                '<img src="' +
                person.photos[i] +
                '" alt=""  height="' +
                height +
                'vh"' +
                ' border="1" style="margin:20px"></td></tr>' +
                title;
        }
        html += "</table>";
    }

    //references & date updated:
    if (person.references.trim() !== ""){
        refIndent = "";
        refs = person.references.split("<br>");
        console.log(refs)
        refs.forEach(element => {
            refIndent += "<span class='references'>" + element + "</span><Br>";
        });
        html += "<br><br><strong>References:</strong><br>" + refIndent;//person.references;
    }

    //link to open printable version:
    html +=
        "<br><br><span id='printy'><a onclick='openWin()'><u><b>&#x1F5A8; Printable Version</b></u></a></span>";

    //date created, last updated, author, editor:
    dt =
        "<div class='bottom-line'>Entry created: <B>" +
        formatDateSlash(person.dateCreated) +
        "</b>";
    lu = "";
    if (person.dateUpdated !== "")
        lu = "Last updated: <B>" + formatDateSlash(person.dateUpdated) + "</b>";
    atr = "";
    edtr = "";
    if (person.authors.trim() !== "")
        atr = "<div>Author(s):<B> " + person.authors + "</b></div>";
    if (person.editors.trim() !== "")
        edtr = "<div>Editor(s): <B>" + person.editors + "</b>";

    //put it all together:
    html +=
        "</div><br>" +
        dt +
        "<br>" +
        atr +
        "<br>" +
        lu +
        "<br>" +
        edtr +
        "<br><img src='images_util/logo_xsm.jpg' style='width:10vw'><br>" +
        "<br><br><br><br><br><br><br>";

    document.getElementById("bio").innerHTML = html;

    // if (!initial) {
    //     console.log("Pushing state")
    //     bioURL =
    //         "/" + getHref(person.lastName, person.middleName, person.firstName);
    //     window.history.pushState({}, "New Title", bioURL);
    //     console.log("makebio:",bioURL)
    // }

    //set style of selected on left side:
    if (!initial && !topical & !search)
        for (let index = 0; index < bios.length; index++) {
            element = document.getElementById(
                "name-" + ltrIndex + "-" + indexOfPerson,
            );
            if (index == indexOfPerson) {
                element.className = "selected-ltr";
            } else {
                element.style.backgroundColor =
                    "white"; /*"rgb(250, 235, 223)";*/
                element.classList.remove("selected-ltr");
                element.classList.add("name-link");
            }
        }
    //reset scroll to top of bio when going to new bio:
    bioWindow = document.getElementById("bio");
    bioWindow.scrollTop = 0;
    // setBoldInSideBar(bios, currentLetter, currentPersonIndex);
}
function onclickForMakeBio(ltrIndex, indexOfPerson, initial, search, topical) {
    makeBio(ltrIndex, indexOfPerson, initial, search, topical);
    bios = getBios();
    //GET PERSON JSON:
    person = bios[ltrIndex][indexOfPerson];
    bioURL =
        "/" + getHref(person.lastName, person.middleName, person.firstName);
    window.history.pushState({}, "New Title", bioURL);
    console.log("onclickmakebio:", bioURL);
    setBoldInSideBar(bios, ltrIndex, indexOfPerson);
}
function onclickLetter(letterIndex, personIndex, stepping, topical, search) {
    makeSidebar(letterIndex, personIndex, stepping, topical, search);
    bios = getBios();
    //GET PERSON JSON:
    person = bios[letterIndex][personIndex];
    bioURL =
        "/" + getHref(person.lastName, person.middleName, person.firstName);
    window.history.pushState({}, "New Title", bioURL);
    console.log("onclickLetter:", bioURL);
}
/**
 * Creates the left sidebar with the alphabetical list of women
 * @param {Integer} personIndex location of person within list of people,
 * where 0 = the template, so start at 1
 */

function makeSidebar(letterIndex, personIndex, stepping, topical, search) {
    //table heading:
    currLtr = "abcdefghijklmnopqrstuvwxyz".charAt(letterIndex);
    let html = "<table><tr><td></td></tr>";

    var all_bios = getBios();

    //fill array of names for left side:
    namesLists = [];
    strippedNamesList = [];
    all_bios.forEach((bioLetterList) => {
        names = [];
        strippedNames = [];
        bioLetterList.forEach((thename) => {
            // if(thename.middleName === "" && thename.firstName=== "")
            //     lName = thename.lastName;
            // else
            lName = stripName(thename.lastName);
            fName = stripName(thename.firstName);
            mName = stripName(thename.middleName);
            strippedNames.push([lName, mName, fName]);

            if (thename.firstName !== "") {
                if (
                    thename.middleName != "" &&
                    thename.middleName.charAt(0) != '"'
                )
                    mid = thename.middleName.charAt(0) + ".";
                else mid = "";
                names.push(
                    thename.lastName + ", " + thename.firstName + " " + mid,
                );
            } else names.push(thename.lastName); //.substring(0, 20) + "..."); //too long
        });
        namesLists.push(names);
        strippedNamesList.push(strippedNames);
    });
    //build each entry, clickable:
    if (!topical && !search) {
        for (i = 0; i < namesLists[letterIndex].length; i++) {
            firstCommaLast = namesLists[letterIndex][i].replaceAll("'", " ");

            toAdd =
                "<tr><td class='name-link' id='name-" +
                letterIndex +
                "-" +
                i +
                "'>" +
                "<a title='" +
                firstCommaLast +
                "'onclick='onclickForMakeBio(" +
                letterIndex +
                ", " +
                i +
                ", false, true, true)'>" +
                firstCommaLast +
                "</a>" +
                "</td></tr>";
                html += toAdd;
        }
    }
    html += "</table>";

    //put the table in the left side:
    alpha = "abcdefghijklmnopqrstuvwxyz";
    ltr = alpha[letterIndex];

    if (!topical && !search)
        if (namesLists[letterIndex].length != 0) {
            document.getElementById("side-table").innerHTML = html;

            if (!stepping) makeBio(letterIndex, 0, true, false, false);
        } else {
            document.getElementById("side-table").innerHTML =
                "No entries for " + ltr.toUpperCase() + " yet";
            document.getElementById("bio").innerHTML =
                "<h1>No entries for " + ltr.toUpperCase() + " yet</h1>";
        }
    //set URL to first woman in the alpha list:
    // threeNames = strippedNamesList[letterIndex][0];
    // bioURL = "/" + getHref(threeNames[0], threeNames[1], threeNames[2]);
    // window.history.pushState({}, "", bioURL);
    // console.log("sidebar:", bioURL )

    if (!topical) setBoldInSideBar(all_bios, letterIndex, personIndex);
}
function getHref(l, m, f) {
    l = l.replaceAll(",", "");
    return "bios.html?last=" + l.replaceAll(" ", "") + "&middle=" + m  + "&first=" + f ;
}
/**
 *
 * @param  jsonArray array of JSON values
 * @param {String} prop1 sort by this property first
 * @param {String} prop2  sort by this property second
 * @param {String} prop3  sort by this property third
 * @returns
 */
function sortJsonByProperties(jsonArray, prop1, prop2, prop3) {
    jsonArray = jsonArray.sort((a, b) => {
        if (a[prop1] < b[prop1]) return -1;
        if (a[prop1] > b[prop1]) return 1;
        if (a[prop2] < b[prop2]) return -1;
        if (a[prop2] > b[prop2]) return 1;
        if (a[prop3] < b[prop3]) return -1;
        if (a[prop3] > b[prop3]) return 1;
        return 0;
    });
    return jsonArray;
}
/**
 * create categories list with corresponding people names
 */
let catArray = [];
function getBios() {
    all_bios = [
        a_bios,
        b_bios,
        c_bios,
        d_bios,
        e_bios,
        f_bios,
        g_bios,
        h_bios,
        i_bios,
        j_bios,
        k_bios,
        l_bios,
        m_bios,
        n_bios,
        o_bios,
        p_bios,
        q_bios,
        r_bios,
        s_bios,
        t_bios,
        u_bios,
        v_bios,
        w_bios,
        x_bios,
        y_bios,
        z_bios,
    ];
    //sort each bio list by LN, MN, FN
    all_bios2 = [];
    all_bios.forEach((letter) => {
        all_bios2.push(
            sortJsonByProperties(letter, "lastName", "middleName", "firstName"),
        );
    });
    all_bios = all_bios2;
    return all_bios;
}
/**
 * Sets up page that sorts by category/topic
 */
function setupCategories() {
    document.getElementById("side-table").innerHTML = "NAMES:";
    document.getElementById("bio").innerHTML = "BIO:";

    var all_bios = getBios();

    allCats = {};
    for (let ltr = 0; ltr < all_bios.length; ltr++) {
        //get list of people for this letter:
        bio_for_ltr = all_bios[ltr];
        //go ghrough each person:
        for (
            let personIndex = 0;
            personIndex < bio_for_ltr.length;
            personIndex++
        ) {
            person = bio_for_ltr[personIndex];

            //get categories for this person:
            currentCat = person.categories;
            currentCat.forEach((cat) => {
                mid = "";
                if (person.middleName != "") mid = person.middleName.charAt(0);
                nm = person.lastName + ", " + person.firstName + " " + mid;

                //if new category, add array with new name, and indices for ltr and namne:
                if (!allCats.hasOwnProperty(cat))
                    allCats[cat] = [[nm, ltr, personIndex]];
                else allCats[cat].push([nm, ltr, personIndex]); //just add name to exising array
            });
        }
    }
    //put lists of names into array instead of dictionary
    var options = Object.keys(allCats).sort();
    catArray = [];
    for (let index = 0; index < options.length; index++) {
        const element = options[index];
        catArray.push([options[index], allCats[options[index]]]);
    }
    //set topic selector:
    let html = "<table><tr><td>TOPIC:</td></tr>";
    //build each entry, clickable:
    for (i = 0; i < catArray.length; i++) {
        var opt = catArray[i];
        html +=
            "<tr><td class='name-link'><a onclick='showNamesForTopical(" +
            i +
            ")'>" +
            catArray[i][0] +
            "</a></td></tr>";
    }
    html += "</table>";

    //put the table in the left side:
    document.getElementById("side-table-cats").innerHTML = html;
}
/**
 *
 * @param {String} html html code to remove elements from
 * @param {String} el element to be removed
 * @returns original html with all parts of elements removed
 */
function removeElements(html, el) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.querySelectorAll(el).forEach((img) => img.remove());

    return doc.body.innerHTML;
}

/**
 *
 * @param {String} fn
 * @param {String} mn
 * @param {String} ln
 * @return array with letter index and location index of person specified
 */
function getLocation(ln, mn, fn) {
    indexofLetter = 0;
    indexOfPerson = 0;
    all_bios = getBios(); //all JSON bios
    //go through each letter:
    for (let i = 0; i < all_bios.length; i++) {
        bios = all_bios[i];

        //FIND INDEX OF PERSON:
        for (let personIndex = 0; personIndex < bios.length; personIndex++) {
            //stripped-down version to compare to URL version:
            fName = stripName(bios[personIndex].firstName);
            mName = stripName(bios[personIndex].middleName);
            lName = stripName(bios[personIndex].lastName);
            if (fn === fName && mn === mName && ln === lName) {
                indexofLetter = i;
                indexOfPerson = personIndex;
            }
        }
    }
    return [indexofLetter, indexOfPerson];
}
/**
 * Builds list of names for selected category (used for topical.html)
 * @param {Array} option {name, letter index, name index within letter}
 */
var choice = "";
function showNamesForTopical(option) {
    choice = catArray[option];

    let html = "<table><tr><td></td></tr>";
    //build each entry, clickable:
    for (i = 0; i < choice.length; i++) {
        for (j = 0; j < choice[i].length; j++)
            if (choice[i][j][0].length > 1)
                html +=
                    "<tr><td class='name-link' id='name-" +
                    choice[i][j][1] + //letter
                    "-" +
                    choice[i][j][2] + //place in letter list
                    "'>" +
                    "<a onclick='makeBio(" +
                    // "<a href='" + getHref(choice[i][j][0], choice[i][j][1], choice[i][j][2] ) +
                    choice[i][j][1] +
                    ", " +
                    choice[i][j][2] +
                    ", false, true, true)'>" +
                    choice[i][j][0] +
                    "</a>" +
                    "</td></tr>";
    }
    html += "</table>";

    //put the table in the left side:

    document.getElementById("side-table").innerHTML = html;
    makeBio(choice[1][0][1], choice[1][0][2], true, true, true);
}
/**
 *
 * Formats the date for display
 * @param {*} date the date in the form MM.DD.YYYY
 * @returns formatted date (currently Month day, YEAR)
 */
function formatDate(prefix, date) {
    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    if (
        date.substring(0, 2) == "ca" ||
        date.substring(0, 2) == "c." ||
        date.substring(0, 5) == "circa"
    ) {
        //circa
        d = date.substring(date.length - 4).trim();

        return prefix + "circa " + d;
    } else {
        //just the 4-digit year:
        if (date.length == 4) return prefix + " " + date;

        //no date:
        if (date == "" || date == "00.00.00") return prefix;

        //HAS SOME INFO ABOUT DATE:
        //separate the parts of the date:
        let [monthNum, dayNum, year] = date.split(".");

        //if only year:
        if (monthNum == "00" && dayNum == "00") return prefix + year;

        //has month, so get name of month:
        var monthName = months[parseInt(monthNum - 1)];

        //has only month, not day:
        if (dayNum == "00") return prefix + monthName + " " + year;
        //has all three:
        dayNum = dayNum.charAt(0) == "0" ? dayNum.charAt(1) : dayNum; //get rid of leading 0

        return prefix + monthName + " " + dayNum + ", " + year;
    }
}

/**
 *
 * @param {String} loc
 * @returns empty string or location with "in" before it
 */
function formatLocation(loc) {
    if (loc == "") return "";
    else return " in " + loc;
}
/**
 * Creates the menu bar at the top of each page
 * @param {Integer} whichOneGray the index of the menu item that will be set to grey
 */
//testing
function setMenu(whichOneGray) {
    menu =
        '<a id="0" class="top-links" href="index.html">Home</a>' +
        '<a id="1" class="search-buttons" href="bios.html">Name Index</a>' +
        '<a id="2" class="search-buttons" href="topical.html">Subject Index</a>' +
        '<a id="3" class="top-links" href="search.html">Site Search &#x1F50E;</a>' +
        '<a id="4" class="top-links" href="funfacts.html">Fun Facts</a>' +
        '<a id="5" class="top-links" href="recents.html">Recently Added</a>' +
        '<a id="6" class="top-links" href="resources.html">Resources</a>' +
        '<a id="7" class="top-links" href="nominations.html">Nominations</a>' +
        '<a id="8" class="top-links" href="map.html">Map &#x1F4CD;</a>' +
        '<a id="9" class="top-links" href="about.html">About</a>' +
        '<a id="10" class="top-links" href="info.html">&#x24D8;</a>' +
        '<a href="javascript:void(0);" class="icon" onclick="resizeMenu()">' +
        '<i class="fa fa-bars"> <span id="menu-text">MENU</span></i>' +
        "</a>";
    document.getElementById("myTopnav").innerHTML = menu;
    document.getElementById("" + whichOneGray).style.backgroundColor =
        "rgb(115, 114, 114)";
}
/**
 * Make all bios arrays available and do counts
 */
function setTotals(about) {
    setMenu(9);
    alph = "abcdefghijklmnopqrstuvwxyz";
    var all_bios = getBios();

    all_bios.forEach((peopleArray) => {
        personCounts.push(peopleArray.length);
        totalEntries += peopleArray.length;
    });

    if (about) {
        //used in About page
        document.getElementById("total-women").innerHTML = totalEntries;
        document.getElementById("total2").innerHTML = totalEntries;
        console.log("TOTAL: " + totalEntries);
        console.log("Each letter count:");
    }

    // document.getElementById("total-women3").innerHTML = totalEntries;

    // for (let i = 0; i < personCounts.length; i++) {
    //     console.log(alph.charAt(i) + ": " + personCounts[i]);
    // }
    // Collapsible function for main headers
    var collapsibles = document.getElementsByClassName("collapsible");
    for (var i = 0; i < collapsibles.length; i++) {
        collapsibles[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}
function generateAndShuffleRange(start, end) {
    // 1. Create the initial ordered array (e.g., [1, 2, ..., 10])
    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // 2. Apply the Fisher-Yates Shuffle algorithm
    let m = range.length,
        t,
        i;
    while (m) {
        // Pick a remaining element
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element
        t = range[m];
        range[m] = range[i];
        range[i] = t;
    }
    return range;
}
var numInRandomList = 0;
var all_people = [];

function startTopical() {
    setMenu(2);
    setupCategories(); //hello?
    makeSidebar(0, 0, false, true, false);
    init(true, false);
}
/**
 * chooses a random person
 */
function ranPerson() {
    setTotals(false);
    ltrCount = 0;
    //count how many total people to choose from:
    if (all_people.length == 0)
        all_bios.forEach((bioLetterList) => {
            let personCount = 0;

            //go through each name for this letter:
            bioLetterList.forEach((thename) => {
                all_people.push([ltrCount, personCount]);
                personCount++;
            });
            ltrCount++;
        });

    chosen = Math.floor(Math.random() * all_people.length);
    //get letter and person within letter:
    currentLetter2 = all_people[chosen][0];
    currentPersonIndex2 = all_people[chosen][1];

    makeSidebar(currentLetter2, currentPersonIndex2, false, false, false);

    setBoldInSideBar(all_bios, currentLetter2, currentPersonIndex2);

    makeBio(currentLetter2, currentPersonIndex2, false, false, false);
    //display:

    site = getHref(
        strippedNamesList[currentLetter2][currentPersonIndex2][0],
        strippedNamesList[currentLetter2][currentPersonIndex2][1],
        strippedNamesList[currentLetter2][currentPersonIndex2][2],
    );

    //ensures sidebar and URL match person selected:
    // window.open(site, "_self");
    // makeBio(letter, person, false, false, false);
    bioURL =
        "/" + getHref(person.lastName, person.middleName, person.firstName);
    window.history.pushState({}, "New Title", bioURL);
    console.log("random:", bioURL);
}
function setBoldInSideBar(bios, letter, loc) {
    for (let person = 0; person < bios[letter].length; person++) {
        document.getElementById(
            "name-" + letter + "-" + person,
        ).style.fontWeight = "normal";
    }
    document.getElementById("name-" + letter + "-" + loc).style.fontWeight =
        "bold";
}
// Handle forward/back buttons
window.addEventListener("popstate", (event) => {
    // If a state has been provided, we have a "simulated" page
    // update the current page.

    console.log("popstate", window.location.href);
    //get URL params and reload page
    startBio();
});
/**
 * Go to previous person (wraps to next letter when needed)
 */
function previous() {
    currentPersonIndex--;

    if (currentPersonIndex <= -1) {
        //go to previous letter and change sidebar
        currentLetter--;
        if (currentLetter == -1) currentLetter = 25;
        if (all_bios[currentLetter].length == 0) currentLetter--;

        currentPersonIndex = all_bios[currentLetter].length - 1;
        makeSidebar(currentLetter, currentPersonIndex, true, false, false);
    }
    site = getHref(
        strippedNamesList[currentLetter][currentPersonIndex][0],
        strippedNamesList[currentLetter][currentPersonIndex][1],
        strippedNamesList[currentLetter][currentPersonIndex][2],
    );
    // window.open(site, "_self");
    makeBio(currentLetter, currentPersonIndex, true, false, false);
    document.getElementById(
        "name-" + currentLetter + "-" + currentPersonIndex,
    ).style.fontWeight = "bold";

    bioURL =
        "/" + getHref(person.lastName, person.middleName, person.firstName);
    window.history.pushState({}, "New Title", bioURL);
    console.log("prev:", bioURL);

    setBoldInSideBar(all_bios, currentLetter, currentPersonIndex);
}
/**
 * Go to nextperson (wraps to next letter when needed)
 */
function next() {
    currentPersonIndex++;

    if (currentPersonIndex >= all_bios[currentLetter].length) {
        //go to next letter and change sidebar
        currentLetter++;
        if (currentLetter == 26) currentLetter = 0;
        if (all_bios[currentLetter].length == 0) currentLetter++;
        if (currentLetter == 26) currentLetter = 0;

        currentPersonIndex = 0;
        makeSidebar(currentLetter, currentPersonIndex, true, false, false);
        document.getElementById(
            "name-" + currentLetter + "-" + currentPersonIndex,
        ).style.fontWeight = "bold";
    }
    site = getHref(
        strippedNamesList[currentLetter][currentPersonIndex][0],
        strippedNamesList[currentLetter][currentPersonIndex][1],
        strippedNamesList[currentLetter][currentPersonIndex][2],
    );
    // window.open(site, "_self");
    makeBio(currentLetter, currentPersonIndex, false, false, false);
    bioURL =
        "/" + getHref(person.lastName, person.middleName, person.firstName);
    window.history.pushState({}, "New Title", bioURL);
    console.log("next:", bioURL);

    setBoldInSideBar(bios, currentLetter, currentPersonIndex);
}
/**
 * Build clickable alphabet list
 * @param {Boolean} topical true if called from topical.html
 * @param {Boolean} search true if called from search.html
 */
function init(topical, search) {
    //get rid of ltr after done with topics
    let alphaList = "SELECT: ";

    //build all links:
    for (let index = 0; index < 26; index++) {
        const element = alphabet[index];

        alphaList +=
            '<a onclick="onclickLetter(' +
            index +
            ", 0, false, " +
            topical +
            ", false" +
            ')" class="letter-link letter-links">' +
            element.toUpperCase() +
            "</a>";
    }

    html =
        '<div style="margin: 0vh 5vw 0vh 5vw;">' +
        "<Center>" +
        "<h1 style='margin: 1vh 5vw 0vh 5vw;'>" +
        '    <div id="opening-pictures">Cambridge Women\'s Heritage Project</div>';
    html +=
        '</Center><p style="font-size:2.5vh; margin-top:0.5vh; margin-bottom:0.5vh" align="center">';

    //ALPHABET LIST:
    if (!topical && !search) html += alphaList;

    //prev, random, next buttons:
    if (!topical && !search)
        html +=
            "<center>" +
            "<button onclick='previous()' class='random-button-sm'>PREV</button>" +
            '<button class="random-button-sm" role="button" onclick="ranPerson(1)">' +
            "RANDOM ENTRY</button>" +
            "<button onclick='next()' class='random-button-sm'>NEXT</button>";

    if (!topical && !search) html += "<br></center>" + "</div>";
    else html += "</center></div>";

    document.getElementById("intro-HTML").innerHTML = html;

    //bottom of page:
    if (!topical && !search)
        html =
            // "<center>" +
            // alphaList +
            // "</center>" +
            '<div style="margin-bottom:50px"> </div>';
    else html = "";

    document.getElementById("end-HTML").innerHTML = html;
}
