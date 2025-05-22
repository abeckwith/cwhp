alpha = "abcdefghijklmnopqrstuvwxyz"
alpha = "t"
for ltr in alpha:
    f = open("bios_" + ltr + ".js", "r")
    stuff = f.read()
    f.close()

    # stuff = stuff.replace("lastName:", "organization: false,\n    lastName:")
    # f = open("bios_" + ltr + ".js", "w")
    # f.write(stuff)
    # f.close()
    total = stuff.count("lastName")
    start = 0
    for i in range(total):
        start_o = stuff.find("organization:", start)
        start_comma = stuff.find(",", start_o)
        org = stuff[start_comma - 2]
        org =  True if org == "u" else False
        if not org:
            start = stuff.find("lastName", start + 1)
            end = stuff.find(",", start) - 1
            lastNameField = stuff[start + 11:end]
            if lastNameField.count(" ") == 1:
                
