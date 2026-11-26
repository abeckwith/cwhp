README.md



**To add a new bio:**
1. in the bios folder, find the appropriate letter for the last name of the person you are adding.

2. The simplest way to begin is to copy and paste one of the existing bios and just change the values for each field:
 
To copy an existing bio, **select and copy everything between (AND INCLUDING) the curly braces ({ and }) that surround the whole thing**. Be sure to 
include the and the comma after the } .

3. Paste the copied bio into the end of your letter file, after the last },

4. Now you can edit the bio to reflect the information about the new person. 

**Here are all the fields to consider:**

`carouselMember:` true or false (set to true if you want this bio to be included in the rotating "carousel" on the main page)

`addressFound:` true or false (set to true if the address has been found and has been added to the GoogleMap)

`poc:` true or false, no quotes (this is for "person of color", but isn't currently used for anything)

`organization:` true or false, no quotes (true for an organization, false for a person, but isn't currently used for anything)

`lastName:` not the maiden name, unless they didn't marry or change their name

`firstName:` for an organization, this will be blank

`middleName:` obvious; can be left blank

`familyName:` the maiden name; can be left blank

`title:` this is what will appear in bold and larger font under their name at the top of the bio

`birthDate` and `deathDate:` 
- must be blank or in the form mm.dd.yyyy, even if you only know the year, in which case you would enter 00.00.yyyy
- you can also use 00 for the day if you only know the month and year

`birthLocation` and `deathLocation`: don't use abbreviations for state names; can be left blank

`narrative: `
- notice that the text is all between \` and \`, not " and ".  This is the backtick, which is below the escape key on your keyboard
- putting text on a new line won't create a new line in the actual bio
- to go to the next line, include a `<br>`
- to insert a blank line between blocks of text, include `<br><br>`
- use `<b>` **to bold** `</b>` and `<i>` __to italicize__ `</i>`
- use `<blockquote>` to create a blockquote `</blockquote>`, but don't include any `<br>` before or after these, as `<blockquote>` will already create an extra space
- use `<a href="the URL">`to link to another page`</a>`

`otherNotes:` leave blank, not used at this time

`references: `
- end each reference with a period
- use `<br>` between each reference

- if there is a link for a reference, include it after the name of the reference and have the URL be the clickable link. Also, include `class='indent'`  (see below)

For example: 

`<i>`The Crisis`</i>`, August 1915:`<br>`

`<a class='indent' href="https://www.thecrisis…">`   
     https://www.thecrisis…
`</a>`
`<Br>`

`photos:` NOTE: in order for a photo to be accessible, store it in the `images_bios/` folder
- a list of names for each image file for this person, each starting with images_bios/, each in quotes, with commas between each; can be left blank
- if you want no photo at the top of the bio, but do have more photos for below, you can include empty quotes:

`photos: ["", "jones.jpg"]`

`photoTitles: `
- a list of titles that appear under each photo, in quotes, with commas between each
- can be left blank
- if no title for first photo, but titles for subsequent ones, you can include empty quotes:

`photoTitles: ["", "Jones at a protest, 1976"]`

`photoHeights: `
- a list of pixel heights for each photo
- usually left blank, unless there is a reason to shrink or expand the size of a photo
- the width will adjust automatically to maintain original aspect ratio
- normal range of values: 150-400

`photoPos:`
- a list of numbers, indicating how many lines to move each image down from its default spot
- usually used for photo at top, if it makes sense to push it down a bit 
- usually a number in the range 1-4
- may not be included for every bio, but you can add it to any


`dateCreated:` *see birthDate and deathDate above for the date formatting structure
- the date the bio went live

`dateUpdated:` *see birthDate and deathDate above for the date formatting structure
- the date the bio was added to or edited in some significant way*

`recentEditNotes:`
- a description of what the most recent update has been; this goes with the dateUpdated field
- example: "Added a new photo and corrected birthdate"

`funFact: `
- a description of a fun fact about the person, if there is one
- if it is multiple lines of text, should either be between \` and \` or use " " and +
- use `<b>` and `</b>` around text to be highlighted

EXAMPLE: 
`"Smith was a <b>juggler in a circus</b> for 20 years before becoming mayor." +`

  `"She also worked as a librarian."`

OR:
\`
`Smith was a <b>juggler in a circus</b> for 20 years before becoming mayor.`

  `She also worked as a librarian.`
\`

`funFactImage:`
- the name of the image that will be included - just take from one from the "photos:" field

`first:`
- if applicable, a short description (sentence fragment) of what the "first" is

EXAMPLE: "First woman principal in Massachusetts"

`firstYear:`
- the year that the "first" happened

`editors:`
- the name or names of people that edited the bio over time
- no list, just text inside a single pair of quotes

`authors:`
- the name or names of the people that worked on the original bio before posting
- just text inside a single pair of quotes

`categories:`
- a list of categories that fit this person (author, astronomer, etc.), in quotes with commas in between

=======
NOTE: 

If a bio has been previously posted and you later go back and **change any part of the first, last, middle, or family name, the link to the bio will change!** You'll need to check to see if there's a link to update for that person in the links in the GoogleMap

=======
Project Structure
In addition to the .html files for each menu item on the site, there are these folders:

**bios:** the 26 files that have all the data for the last names A-Z

**images_bios:** all images to be used in the bios

**mages_util:** images used in other pages, like about.html, index.html, resources.html

**scripts:** all JavaScript files. This is all the code that builds the pages, selects photos at random, builds the lists in the info page, etc:

- **python scripts: I use these when I am trying to automate some change to many places in the code. Not actually used by the website code
- **cards.js:** code that builds the Fun Facts "cards" and the Firsts page
- **index_page_functions.js:** startup functions for the whole site and creates the "carousel" of images on the main page
- **info_pages.js:** functions that find and organize the several lists in the info page
- **LOCAL_HOST.sh:** a shell script to allow to test things out on local host (the code that controls the browser forward and back buttons throws errors when run locally)
- p**hoto_names.js:** just a single list of links that will be used to randomly select bios for the carousel on the main page
- **scripts.js:** most of the functions for this project are here, especially to build the Name Index and Subject Index pages and to build each bio from the data
- **search.js:** functions that handle searching the database and returning results for the Search tab

**styles:** all the CSS files are in this folder. This is code that determines the font, font sizes, colors, backgrounds, borders, margins, etc., as well as adjustments for mobile and hover effects

**To change the period of time for recent additions or recent updates:**
Our Recents page shows recent bios that have been added to the site going back some set number of months and the same for recent edits to bios. You can change these values. As of this writing, the page shows the last 12 months of additions and the last 3 months of edits

1. open the scripts.js file (in the scripts folder)

2. near the top are the two variables to change the values of:

`let RECENT_MONTHS_LIMIT = 12; //for recent additions `

`let RECENT_MONTHS_LIMIT_EDITS = 3; //for recent edits `