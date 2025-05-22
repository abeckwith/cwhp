

def slice_it(search_term):
    global source_code
    l = len(search_term)
    loc = source_code.find(search_term) + l
    source_code = source_code[loc:]
alpha = "abcdefghijklmnopqrstuvwxyz"
# alpha = "d"
for ltr in alpha:
    names = []
    dates = []
    titles = []
    descriptions = []
    references = []
    total = 0
    alpha_counts = []
    images_lists = []
    # loop through all letters:
    orig_file = open("bios/bios_" + ltr + ".html", 'r', encoding='utf-8')
    source_code = orig_file.read() 

    letter_total = int(source_code.count("a name=") / 2)
    alpha_counts.append(letter_total)
    total += letter_total


    # loop through all people for this letter:
    # was "id=" and no /2:
    for i in range(0, letter_total): 
        images = []

        reference = ""
        slice_it('<a name="' + str(i) + '"></a>') # my name = "num"
        slice_it('<a name=') # the name = "personcode"
        slice_it('heading">') # source_code now starts at the name

        name = source_code[:source_code.find('</strong>')] # find end of name
        name = ' '.join(name.split())
        
        names.append(name.strip()) # grab name
        slice_it('</strong>') # source_code now starts at birth/death info
        
        date = source_code[:source_code.find('<br>')] # get birth/death
        date = (' '.join(date.split()))[1:-1] # last part to get rid of ()
        dates.append(date)

        slice_it('<br>') 
        slice_it('<strong>') # source_code now starts at  title
    
        title = source_code[:source_code.find('</strong>')]
        titles.append(title.strip())
        
        slice_it('</strong>') # source_code now starts at description
        
     
        description = source_code[:source_code.find("<div")]
        # save images and get description without any image tags:
        img_loc = 0
        while img_loc!= -1:
            img_loc = description.find("<img src=", img_loc + 1)

            if img_loc !=-1: # found image
                loc2 = description.find('"', img_loc + 11) # " at end of path string
                image_path = description[img_loc + 10: loc2]
                images.append(image_path)
                end_img_tag = description.find(">", loc2) # find end of tag

                description = description[:img_loc] + description[end_img_tag + 1:] 
        if len(images) > 0:
            images_lists.append(images[0])
        else:
            images_lists.append("")
        # find references
        reference_loc = description.find("Reference")

        begin_ref = description.find("</strong>", reference_loc) + 9
        end_ref = description.find("</p>", begin_ref)

        end_descr = begin_ref

        reference = description[begin_ref:end_ref]
        description = description[:end_descr]#end_loc2]
  
        description = description.replace("<strong>Reference:</strong>", "")
        description = description.replace("<strong>References:</strong>", "")
        description = description.replace("<strong>Reference: </strong>", "")
        description = description.replace("<strong>References: </strong>", "")
        
      
        descriptions.append(description)
        references.append(reference)
        

# for i in range(len(names)):
#     print("-----------\n", i,"\nPERSON: ", names[i])
#     print("DATES: " + dates[i])
#     print("TITLE: " + titles[i])
#     print("DESCRIPTION: ", descriptions[i])
#     print("REFERENCES: ", references[i])
#     for img in images_lists[i]:
#         print("IMAGE: ", img)
#     # input()
# # totals for each letter historgram:
# if len(alpha_counts) > 1:
#     print(total, ":")
#     for i in range(26):
#         print(alpha[i].upper(), alpha_counts[i] * "=", alpha_counts[i])

    entries = ltr + "_bios = [\n"
    for i in range(len(names)):
        entry = '{\n'+\
            'lastName: "'+ names[i] + '",\n'+\
            'firstName: "",\n'+\
            'middleName: "",\n'+\
            'familyName: "MAIDEN NAME",\n'+\
            'fileLetter: "",\n'+\
            'title: `' + titles[i] + '`,\n'+\
            'birthDate: "' + dates[i] + '",\n'+\
            'birthLocation: "",\n'+\
            'deathDate: "`",\n'+\
            'deathLocation: "",\n'+\
            'narrative: `\n' + descriptions[i] + '`,\n'+\
            'otherNotes: "",\n'+\
            'references: `' + references[i] + '`,\n'+\
            'photos: ["' + images_lists[i] + '"],\n'+\
            'photoTitles:[],\n'+\
            'dateCreated:"",dateUpdated:
 "",
photoPos:[,],\n'+\
            'photoHeights: [],\n'+\
            'categories: [""],\n'+\
            'race: ""\n'+\
            '},\n'
        entries += entry
    entries += "]"
    file_name = "bios/test_js_bios/bios_" + ltr + ".js"
    f = open(file_name, "w")
    f.write(entries)
    f.close()

