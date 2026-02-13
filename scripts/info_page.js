function loadInfoPage() {
    setMenu(10);

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

    recentObjects = []; //array of recent entries
    aliveObjects = []; //array of people likely still alive

    birthSort = [];

    allNames = "";
    bio_count = 0; //total number of bios
    noimgct = 0; //total with no image
    noqtct = 0; //total with no quote
    nbdct = 0; //total with no birthday

    pocct = 0; //total number of people of color
    pocList = "";

    currentDate = new Date();
    currentDate = currentDate.toLocaleDateString("en-US");

    nophotocount = 0;
    bDayCount = 0;

    //used in console..og
    noQuote = "<br><b>Need QUOTE:</b><br>";
    noImage = "<br><B>Need IMAGE:</b><br>";
    nobirthDate = "<br><b>Need BIRTHDATE:</b><br>";

    womanCount = 0; //total number that are people
    orgcount = 0; //total number that are organizations

    //GET AND DISPLAY ALL INFO:
    all_bios.forEach((bioLetterList) => {
        //go through each name for this letter:
        bioLetterList.forEach((thename) => {
            //people of color count:
            if (thename.poc) {
                pocct++;
                pocList +=
                    pocct +
                    ". " +
                    thename.lastName +
                    ", " +
                    thename.firstName +
                    "\n";
            }
            //count organizations vs. people:
            if (thename.firstName == "") orgcount++;
            else womanCount++;

            if (thename.deathDate != "" && thename.birthDate != "")
                console.log(
                    parseInt(thename.deathDate.slice(-4)) -
                        parseInt(thename.birthDate.slice(-4)),
                );

            if (thename.authors.indexOf("CWHP volunteers") != -1)
                console.log(thename.lastName + " " + thename.firstName);
        });
    });
    console.log(pocList);

    //SET UP DISPLAY:
    topDisplay = "TOTAL in database: " + (orgcount + womanCount) + "<br>";
    topDisplay += "# of Women: " + womanCount + "<br>";
    topDisplay += "# of Organizations: " + orgcount + "<br>";

    all_bios.forEach((bioLetterList) => {
        //go through each name for this letter:
        bioLetterList.forEach((thename) => {
            //GET NAME AND MAKE LINK FOR THIS PERSON:
            lName = stripName(thename.lastName);
            fName = stripName(thename.firstName);
            mName = stripName(thename.middleName);
            theLink =
                "<a href='" +
                getHref(lName, mName, fName) +
                "'>" +
                thename.lastName +
                ", " +
                thename.firstName +
                "</a>";

            //check if no birthdate given:
            if (
                (thename.birthDate.slice(3, 5) == "00" ||
                    thename.birthDate == "") &&
                thename.firstName != "" &&
                thename.birthDate.slice(-4) < 1930
            ) {
                nobirthDate += theLink + "<br>";
                nbdct++;
            }

            //check if not quote yet:
            if (thename.narrative.indexOf("blockquote") == -1) {
                noQuote += theLink + "<br>";
                noqtct++;
            }
            //two photos and I'm not using the first one:
            if (thename.photos.length == 1 && thename.photos[0] == "") {
                noImage += theLink + "<br>";
                noimgct++;
            }

            //for sorting by birthyear:
            nameForSort = thename.firstName + " " + thename.lastName;
            dateForSort = thename.birthDate.slice(-4);

            //if year has 4 digits, valid year:
            if (dateForSort.length == 4)
                birthSort.push({ theLink, dateForSort });

            bio_count++;

            //set up display for this person:
            nameBuild =
                bio_count +
                ". " +
                thename.lastName +
                ", " +
                thename.firstName +
                " " +
                thename.middleName;

            ///get rid extra comma that orgs will have:
            if (nameBuild.slice(-3) === ",  ")
                nameBuild = nameBuild.substring(0, nameBuild.length - 3);

            //add family name:
            if (thename.familyName != "")
                nameBuild += " (" + thename.familyName + ")";

            nameBuild += "<br>";

            //also gather all names for master list:
            if (thename.firstName == "")
                //must be an organization, so bold it:
                allNames += "<b>" + nameBuild + "</b>";
            else allNames += nameBuild;

            //check if has full date (as opposed to ca.2016)
            hasFullDate =
                thename.birthDate.substring(0, 2) != "00" &&
                thename.birthDate.indexOf("ca") == -1;

            //has a full birthdate:
            if (thename.birthDate != "" && hasFullDate) {
                bDayCount++;

                year = parseInt(thename.birthDate.substring(6));
                dayNum = parseInt(thename.birthDate.substring(3, 5));
                monthNum = parseInt(thename.birthDate.substring(0, 2));

                yrs = parseInt(currentDate.slice(-4)) - year; //age of person

                lName = stripName(thename.lastName);
                fName = stripName(thename.firstName);
                mName = stripName(thename.middleName);

                //build BIRTHDAY table entry:
                html_build =
                    "<tr><td>" +
                    thename.birthDate.replaceAll(".", "/") +
                    "</b></td><td style='padding-left:10px;'><a href='" +
                    getHref(lName, mName, fName) +
                    "'>" +
                    thename.lastName +
                    ", " +
                    thename.firstName +
                    "</a></td><td style='text-align:right'>" +
                    yrs +
                    "</td><td style='text-align:right'>" +
                    // if (thename.birthLocation != "")
                    thename.birthLocation +
                    "</td>";
                html_build += "</tr>";

                recentObjects.push({ html_build, monthNum, year, dayNum });
            }

            //look for women that my still be alive:
            yr = parseInt(thename.birthDate.slice(-4));

            currentYear = new Date().getFullYear();

            if (currentYear - yr < 100 && thename.deathDate == "") {
                aliveObjects.push(thename);
            }
        });
    });
    //women that don't yet have birthdate and are no longer alive:
    disp =
        nobirthDate +
        "(" +
        nbdct +
        ")<br>" +
        noImage +
        "(" +
        noimgct +
        ")<br>" +
        noQuote +
        "(" +
        noqtct +
        ")<br>";
    document.getElementById("other-display").innerHTML = disp;

    //SORT ALGORITHM: first by year, then month, then day:
    recentsSorted = recentObjects.sort((a, b) => {
        if (parseInt(a.monthNum) > parseInt(b.monthNum)) return 1;
        if (parseInt(a.monthNum) < parseInt(b.monthNum)) return -1;

        if (a.theDate != "none" && b.theDate != "none") {
            if (parseInt(a.dayNum) > parseInt(b.dayNum)) return 1;
            if (parseInt(a.dayNum) < parseInt(b.dayNum)) return -1;
        }

        return 0;
    });
    //SORT ALGORITHM: first name:
    aliveList = aliveObjects.sort((a, b) => {
        if (a.lastName > b.lastName) return 1;
        if (a.lastName < b.lastName) return -1;
        return 0;
    });

    bDisplay =
        "<table><tr><th>Birthdate:</th><th>Name:</th><th>Age:</th><th>Born in:</th></tr>";

    previous_month = "00";
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

    //sort by month:
    recentsSorted.forEach((bio) => {
        if (bio.monthNum > previous_month)
            bDisplay +=
                "<tr><td><b>" + months[bio.monthNum - 1] + "</b></td></tr>";
        bDisplay += bio.html_build;
        previous_month = bio.monthNum;
    });

    bDisplay += "</table>";

    //BUILD TABLE OF LIKELY ALIVE:
    aliveDisplay = "<table><Tr><th>Name</th><th>BrthYr</th><th>Age</th></tr>";

    currentYear = new Date().getFullYear();

    aliveList.forEach((bio) => {
        lName = stripName(bio.lastName);
        fName = stripName(bio.firstName);
        mName = stripName(bio.middleName);
        aliveDisplay +=
            "<tr><td><a href='" +
            getHref(lName, mName, fName) +
            "'>" +
            bio.lastName +
            ", " +
            bio.firstName +
            "</a></td><td>&nbsp;&nbsp;" +
            bio.birthDate.slice(-4) +
            "</td><td style='text-align:right'>" +
            (currentYear - bio.birthDate.slice(-4)) +
            "&nbsp;&nbsp;</td></tr>";
    });
    aliveDisplay += "</table>";

    birthList = birthSort.sort((a, b) => {
        if (a.dateForSort > b.dateForSort) return 1;
        if (a.dateForSort < b.dateForSort) return -1;
        return 0;
    });
    //BUILD TABLE SORTED BY BIRTH YEAR
    birthDisplay = "<table><Tr><th>YEAR</th><th>Name</th></tr>";

    birthList.forEach((bio) => {
        birthDisplay +=
            "<tr><td class='birthT'>&nbsp;&nbsp;" +
            bio.dateForSort +
            "&nbsp;&nbsp;</td><td>" +
            bio.theLink +
            "</td></tr>";
    });

    document.getElementById("summary-numbers").innerHTML = topDisplay;

    document.getElementById("birthday-display").innerHTML =
        bDisplay + "<br>TOTAL:" + bDayCount;

    document.getElementById("alive-display").innerHTML = aliveDisplay + "<br>";

    document.getElementById("all-display").innerHTML = allNames;
    
    document.getElementById("birth-display").innerHTML = birthDisplay;
}
