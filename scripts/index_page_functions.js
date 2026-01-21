function bday() {
    currentDate = new Date();
    // Short format (e.g., "12/16/2025")
    currentDate = currentDate.toLocaleDateString("en-US");
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
    //go through each bio and check for match with today's date:
    endings = {
        0: "th",
        1: "st",
        2: "nd",
        3: "rd",
        4: "th",
        5: "th",
        6: "th",
        7: "th",
        8: "th",
        9: "th",
    };
    nums = currentDate.split("/");
    crMonth = nums[0];
    crDay = nums[1];
    crYear = nums[2];
    all_bios.forEach((bioLtr) => {
        bioLtr.forEach((bio) => {
            //does bio birth match today's date?
            if (
                parseInt(bio.birthDate.substring(0, 2)) == crMonth &&
                parseInt(bio.birthDate.substring(3, 5)) == crDay
            ) {
                //make link to bio:
                link =
                    "<a id='dailybday' href='" + 
                    getHref(
                    bio.lastName,
                    bio.middleName,
                    bio.firstName) +
                    // add +
                    "'>";
                //get how old the person is:
                yrs = crYear - parseInt(bio.birthDate.substring(6, 10));
                //determine "th", "st" "rd":
                suffix = "" + endings[yrs % 10];
                //things like 112 don't end in "nd":
                if (yrs % 100 < 14 && yrs % 100 > 10) suffix = "th";
                //display birthday announcement:
                document.getElementById("bdaydisplay").innerHTML =
                    "<Center>&#x1F389; Today would be " +
                    link +
                    bio.firstName +
                    " " +
                    bio.lastName +
                    "</a>'s <b>" +
                    yrs +
                    suffix +
                    "</b> birthday! &#x1F381;";
            }
        });
    });
    setMenu(0);

    /*
     *   CHOOSE RANDOM PHOTOS FOR INDEX PAGE:
     */
    displayPhotos = [];

    //chooses random number using seed - so: same numbers for each day
    function random() {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    //get the date and make it into one numerical value:
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    var seed = parseInt(day + "" + month + "" + year);

    //get 5 random bio numbers:
    shuffledNumbers = [];
    shuffledNumbers.push(Math.floor(random() * photoList.length));

    for (let index = 0; index < 25; index++) {
        chosen = true;
        while (chosen) {
            num = Math.floor(random() * photoList.length);
            chosen = false;
            //check if alread chosen:
            shuffledNumbers.forEach((element) => {
                if (element == num) chosen = true;
            });
        }
        shuffledNumbers.push(num);
    }

    function buildBio(currentPerson) {
        //make name for title:
        stripped = currentPerson.substring(currentPerson.indexOf("?") + 1);
        lastNamePhoto = stripped.substring(
            stripped.indexOf("=") + 1,
            stripped.indexOf("&")
        );
        stripped = stripped.substring(stripped.indexOf("&") + 1);
        middleNamePhoto = stripped.substring(
            stripped.indexOf("=") + 1,
            stripped.indexOf("&")
        );
        stripped = stripped.substring(stripped.indexOf("&") + 1);
        firstNamePhoto = stripped.substring(stripped.indexOf("=") + 1);

        namePhoto =
            firstNamePhoto + " " + middleNamePhoto + " " + lastNamePhoto;

        //find bio:
        info = getLocation(lastNamePhoto, middleNamePhoto, firstNamePhoto);
        ltrIndex2 = info[0];
        personIndex2 = info[1];

        ltrIndex2 = "abcdefghijklmnopqrstuvwxyz".indexOf(
            lastNamePhoto.charAt(0).toLowerCase()
        );
        bios = getBios();
        //found bio:
        person2 = bios[ltrIndex2][personIndex2];
        return person2;
    }
    function buildLinks(shift) {
        html = '<div class="scroll-container"><div class="carousel-primary">';
        //BUILD HTML TO DISPLAY PHOTOS:
        links = [];
        for (i = shift; i < 5 + shift; i++) {
            element = shuffledNumbers[i];

            currentPerson = photoList[element];
            person2 = buildBio(currentPerson);

            links.push(
                "<a href='" +
                    currentPerson +
                    "' target='_self'><img class='opening-images' src='" +
                    person2.photos[0] +
                    "' alt='" +
                    namePhoto +
                    "'' title='" +
                    namePhoto +
                    "'></a>"
            );
        }
        html += "</div></div>";

        for (i = 0; i < 5; i++) {
            html += links[i];
        }
        return html;
    }
    let shift = 0;
    html = buildLinks(shift);

    document.getElementById("random-intro-photos").innerHTML = html;

    /* rotate 5 photos at a time */
    function rotatePhotos() {
        shift += 5;
        if (shift == 25) shift = 0;
        html = buildLinks(shift);
        document.getElementById("random-intro-photos").innerHTML = html;
    }

    function repeatedTask() {
        rotatePhotos();
    }
    // iniital rotate
    const initialTimerId = setTimeout(() => {
        rotatePhotos();

        // after initial rotate:
        setInterval(repeatedTask, 7000);
    }, 4000);
}
