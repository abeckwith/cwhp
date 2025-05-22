import re
from pprint import pprint
orig_file = open("topical.html", 'r', encoding='utf-8')
source_code = orig_file.read() 

source_code = ' '.join(source_code.split()) # get rid of newlines and tabs
loc = source_code.find("name=")

all_dict = {}
done = False
while not done:
    categories = []
    cat_start = source_code.find('<strong>', loc) + 8
    cat_end = source_code.find('</strong', cat_start+1)
    cat_name = source_code[cat_start:cat_end]
    print(cat_name)
    next_cat_loc = source_code.find("name", cat_end)

    start = cat_end
    for j in range(0, source_code[cat_start:next_cat_loc].count("href")):
        link_loc = source_code.find("href", start)
        name_start = source_code.find(">", link_loc) + 1
        name_end = source_code.find("<", name_start)
        name = source_code[name_start: name_end]
        # print(name)
        # new name:
        if name not in all_dict:
            all_dict[name] = []
        all_dict[name].append(cat_name)
            
        if name == "Yanow, Susan" and cat_name == "Writers/Authors/Poets/Journalists/Editors":
            done = True
        start = name_end
    loc = source_code.find("name=", cat_end)
    # input()
    # print("+===========+")

pprint(all_dict)
        
    # file_name = "bios/test_js_bios/bios_" + ltr + ".js"
    # f = open(file_name, "w")
    # f.write(entries)
    # f.close()

