function showBirthdays() {
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
    recentObjects = [];
    aliveObjects = [];
    birthSort = [];
    allNames = "";
    bio_count = 0;

    noimgct = 0;
    noqtct = 0;
    nbdct = 0;
    pocct = 0;
    pocList = "";
    currentDate = new Date();
    currentDate = currentDate.toLocaleDateString("en-US");

    nophotocount = 0;
    bDayCount = 0;

    //used in console:
    noQuote = "<br><b>Need QUOTE:</b><br>";
    noImage = "<br><B>Need IMAGE:</b><br>";
    nobirthDate = "<br><b>Need BIRTHDATE:</b><br>";

    womanCount = 0;
    orgcount = 0;
    all_bios.forEach((bioLetterList) => {
        //go through each name for this letter:
        bioLetterList.forEach((thename) => {
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
            if (thename.firstName == "") orgcount++;
            else womanCount++;

            if (thename.deathDate != "" && thename.birthDate != "")
                console.log(
                    parseInt(thename.deathDate.slice(-4)) -
                        parseInt(thename.birthDate.slice(-4))
                );

            if (thename.authors.indexOf("CWHP volunteers") != -1)
                console.log(thename.lastName + " " + thename.firstName);
        });
    });
    console.log(pocList);
    topDisplay = "TOTAL in database: " + (orgcount + womanCount) + "<br>";
    topDisplay += "# of Women: " + womanCount + "<br>";
    topDisplay += "# of Organizations: " + orgcount + "<br>";

    all_bios.forEach((bioLetterList) => {
        //go through each name for this letter:
        bioLetterList.forEach((thename) => {
            lName = stripName(thename.lastName);
            fName = stripName(thename.firstName);
            mName = stripName(thename.middleName);
            theLink =
                "<a href='" + 
                getHref(
                lName ,
                mName ,
                fName )+
                "'>" +
                thename.lastName +
                ", " +
                thename.firstName +
                "</a>";
            if (
                (thename.birthDate.slice(3, 5) == "00" ||
                    thename.birthDate == "") &&
                thename.firstName != "" &&
                thename.birthDate.slice(-4) < 1930
            ) {
                nobirthDate += theLink + "<br>";
                nbdct++;
            }
            if (thename.narrative.indexOf("blockquote") == -1) {
                noQuote += theLink + "<br>";
                noqtct++;
            }
            if (thename.photos[0] == "") {
                noImage += theLink + "<br>";
                noimgct++;
            }


            //for sorting by birthyear:
            nameForSort = thename.firstName + " " + thename.lastName;
            dateForSort = thename.birthDate.slice(-4);

            if (dateForSort.length == 4)
                birthSort.push({ theLink, dateForSort });

            bio_count++;
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

            if (thename.familyName != "")
                nameBuild += " (" + thename.familyName + ")";

            nameBuild += "<br>";

            //also gather all names for master list
            if (thename.firstName == "")
                //must be org
                allNames += "<b>" + nameBuild + "</b>";
            else allNames += nameBuild;
            
            hasFullDate =
                thename.birthDate.substring(0, 2) != "00" &&
                thename.birthDate.indexOf("ca") == -1;

            if (thename.birthDate != "" && hasFullDate) {
                bDayCount++;
                //GET YEAR:
                year = parseInt(thename.birthDate.substring(6));
                dayNum = parseInt(thename.birthDate.substring(3, 5));
                monthNum = parseInt(thename.birthDate.substring(0, 2));
                yrs = parseInt(currentDate.slice(-4)) - year;
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
    // console.log(nobirthDate);
    // console.log(noImage);
    // console.log(noQuote);
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
    // + "<br><span id='allnames'><br><br><br><br></span><b>All Names:</b><br>" + allNames;
    //SORT ALGORITHM: first name:
}
