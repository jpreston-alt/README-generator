

// renders table of contents to include new sections
function renderTOC(arr) {
    let list;
    if (arr === []) {
        list = "";
    } else {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = `* [${arr[i]}](#${arr[i]})\n`
        };
        list = arr.join("");
    };
    return list;
};

// object constructor for sections
function Section(header, body) {
    this.header = header;
    this.body = body;
    this.validate = function (arr) {
        if (this.body == undefined ||
            this.body.includes("undefined")) {
        } else {
            arr.push(this);
        }
    }
};

// renders sections in readme
function renderSections(arr) {
    let list = "";
    if (arr === []) {
        list = "";
    } else {
        for (var i = 0; i < arr.length; i++) {
            list += `## ${arr[i].header}\n${arr[i].body}\n\n`;
        }
    }
    return list;
};

// ask follow up questions based on what sections user wants to include
function extraQarr(arr) {

    let questionsArr = [];

    let licenseQ = {
        type: "list",
        name: "license",
        message: "What kind of license should your project have? ",
        choices: ["MIT", "GNU GPLv3", "ISC", "Apache License 2.0"]
    };

    let testQ = {
        type: "input",
        name: "test",
        message: "What command should be run to run tests? ",
        default: "npm test"
    };

    let contributingQ = {
        type: "input",
        name: "contributing",
        message: "What does the user need to know about contributing to the repo? "
    };

    let installQ = {
            type: "input",
            name: "install",
            message: "What command should be run to install dependencies? ",
            default: "npm install"
    };

    if (arr.includes("License")) {
        questionsArr.push(licenseQ);
    } if (arr.includes("Installation")) {
        questionsArr.push(installQ);
    } if (arr.includes("Contributing")) {
        questionsArr.push(contributingQ);
    } if (arr.includes("Tests")) {
        questionsArr.push(testQ);
    };

    return questionsArr;
};

// renders technologies list
function renderTechs(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = `* ${arr[i]}\n`
    };
    let list = arr.join("");
    return list;
};

// replaces spaces with dashes from user input
function noSpaces(str) {
    console.log(str);
    const trimStr = str.trim();
    const newStr = trimStr.replace(" ", "-");

    return newStr;
};

module.exports = {renderTOC, renderSections, extraQarr, Section, noSpaces, renderTechs};