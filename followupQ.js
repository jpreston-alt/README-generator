function renderTOC(arr) {
    let list;
    if (arr.includes("None of These")) {
        list = "";
    } else {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = `* [${arr[i]}](#${arr[i]})\n`
        };
        list = arr.join("");
    };
    return list;
};

function renderSections(arr) {
    let list = ""
    if (arr.includes("None of These")) {
        list = "";
    } else {
        for (var i = 0; i < arr.length; i++) {
            list += `## ${arr[i]}\n\n`;
        };
    }
    return list;
};


// ask follow up questions based on what sections user wants to include
function extraQarr(arr) {

    let questionsArr = [];

    let licenseQ = {
        type: "input",
        name: "license",
        message: "What license would you like to include? "
    };

    let testQ = {
        type: "input",
        name: "test",
        message: "How do you test? "
    };

    let contributingQ = {
        type: "input",
        name: "contributing",
        message: "How do you contribute? "
    };

    let badgesQ = {
        type: "input",
        name: "badges",
        message: "What badges would you like to include? "
    };

    if (arr.includes("License")) {
        questionsArr.push(licenseQ);
    } if (arr.includes("Contributing")) {
        questionsArr.push(contributingQ);
    } if (arr.includes("Tests")) {
        questionsArr.push(testQ);
    } if (arr.includes("Badges")) {
        questionsArr.push(badgesQ);
    };

    return questionsArr;
};

module.exports = {renderTOC, renderSections, extraQarr};