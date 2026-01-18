/**
 * Builds the search page
 */
function search() {
    keyword = document.getElementById("myInput").value;
    if (keyword.trim().length <= 2)
        result =
            "<div style='color: red; font-weight:bold'>Search term too short.  Must be 3 characters or more...</div>";
    else {
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
        result = "";
        total = 0;
        totalPeople = 0;
        //go through eaach letter:
        for (let index = 0; index < all_bios.length; index++) {
            const letterBios = all_bios[index];

            //go through all people with that last name starting letter:
            for (let index2 = 0; index2 < letterBios.length; index2++) {
                const person = letterBios[index2];
                //look for search term (last element will override previous ones in search)
                toSearch = [
                    person.birthDate,
                    person.birthLocation,
                    person.deathLocation,
                    person.authors,
                    person.lastName,
                    person.firstName,
                    person.title,
                    person.references,
                    person.narrative,
                ];
                found = false;
                //go through each keyword to find first that has search term
                toSearch.forEach((element) => {
                    if (element.toLowerCase().includes(keyword.toLowerCase())) {
                        found = true;
                        hasKeyword = element;
                    }
                });
                if (found && total < 2000) {
                    //narrative without line breaks:
                    text = hasKeyword.replace(/\s+/g, " ");

                    text = text.replaceAll("<strong>", "");
                    text = text.replaceAll("<em>", "");
                    text = text.replaceAll("<i>", "");
                    text = text.replaceAll("<\\i>", "");
                    text = text.replaceAll("<b>", "");
                    text = text.replaceAll("<\\\b>", "");
                    text = text.replaceAll("<blockquote>", "");
                    text = text.replaceAll("<\\blockquote>", "");
                    // text = text.replaceAll("<br>", "");
                    // text = text.replaceAll("<Br>", "");
                    // text = text.replaceAll("<BR>", "");

                    //get rid of any images:
                    text = removeElements(text, "img");
                    text = removeElements(text, "br");
                    //    text = removeElements(text, 'h2');

                    totalPeople++;
                    fName = stripName(person.firstName);
                    mName = stripName(person.middleName);
                    lName = stripName(person.lastName);

                    //show name as link:
                    result +=
                        "" +
                        totalPeople +
                        ". <span class='recents-name'><a href='bios.html?ln=" +
                        lName +
                        "&mN=" +
                        mName +
                        "&fN=" +
                        fName +
                        "' target='_blank'>" +
                        person.firstName +
                        " " +
                        person.lastName +
                        "</a></span><Br>";
                    //number of times keywords occurs in this narrative:
                    count = (
                        text
                            .toLowerCase()
                            .match(new RegExp(keyword.toLowerCase(), "g")) || []
                    ).length;
                    total += count;
                    loc = 0;
                    //text before and after keyword:
                    for (let index = 0; index < count; index++) {
                        loc = text
                            .toLowerCase()
                            .indexOf(keyword.toLowerCase(), loc);
                        result += "..." + text.substring(loc - 100, loc);
                        result +=
                            "<b>" +
                            text.substring(loc, loc + keyword.length) +
                            "</b>";
                        result +=
                            text.substring(
                                loc + keyword.length,
                                loc + keyword.length + 100
                            ) + "...<br><Br><br>";
                        loc++;
                    }
                    result += "</center>";
                }
            }
        }
        if (total >= 2000)
            msg =
                "==> SEARCH RESULTS TRUNCATED: TOO MANY RESULTS. PLEASE REFINE YOUR SEARCH <==<Br><BR>";
        else msg = "";

        if (totalPeople > 1) word = "results";
        else word = "result";

        result =
            "<Br>" +
            totalPeople +
            " " +
            word +
            "...<Br><Br>(NOTE: links will open a new tab)<Br><br>" +
            "<span style='color:red'><B>" +
            msg +
            "</b></span>" +
            result;

        if (total == 0) result = "No results found for <B>" + keyword + "</b>";
    }
    document.getElementById("results").innerHTML = result;
}