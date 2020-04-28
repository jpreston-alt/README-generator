// install dependencies
const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");
const dedent = require("dedent");

// create promises
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

let questionsArr = [];


// use inquirer to prompt for user input
inquirer
    .prompt([
        {
            type: "input",
            name: "username",
            message: "Please enter your GitHub username: "
        },
        // {
        //     type: "input",
        //     name: "projectTitle",
        //     message: "Please enter your project title: "
        // },
        // {
        //     type: "input",
        //     name: "description",
        //     message: "Please enter a description of your project: "
        // },
        // {
        //     type: "input",
        //     name: "installInstruct",
        //     message: "Please enter your installation instructions here: "
        // },
        // {
        //     type: "input",
        //     name: "usage",
        //     message: "How do you use this product? "
        // },
        {
            type: 'checkbox',
            message: 'Which technologies did you use?',
            name: 'technologies',
            choices: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "Bulma", "Node.js", "AJAX"]
        },
        {
            type: 'checkbox',
            message: 'What other sections would you like to include in your README?',
            name: 'extraSections',
            choices: ["Contributing", "Badges", "Tests", "License", "None of These"]
        }
    ])
    .then(function(data){

        // desctrucure data object into variables
        const { username,
        projectTitle,
        description,
        installInstruct,
        usage,
        technologies,
        extraSections } = data;

        extraQarr(extraSections);

        inquirer
            .prompt(questionsArr)
            .then(function (data) {
                const { license, contributing, test, badges } = data;

                let headers = renderSections(extraSections);
                let toc = renderTOC(extraSections);
                let techsList = renderTechs(technologies);

                // use axios to generate user photo and email from gitHub with username
                axios
                    .get(`https://api.github.com/users/${username}`)
                    .then(function (response) {
                        const imageURL = `${response.data.avatar_url}&s=100`;
                        const email = response.data.email;
                        const profileURL = response.data.url;

                        const mdFile = dedent(`
                        # ${projectTitle}

                        ## Description
                        ${description}

                        ## Table of Contents
                        * [Technologies](#technologies)
                        * [Installation](#installation)
                        * [Usage](#usage)
                        * [Credits](#credits)
                        ${toc}

                        ## Installation
                        ${installInstruct}

                        ## Usage
                        ${usage}

                        ## Technologies
                        ${techsList}  

                        ## Authors
                        ![user image](${imageURL}) <br>
                        [${username}](${profileURL}) | ${email}

                        ${headers}
                        `);

                        // generate MD file with user input
                        return writeFileAsync("generatedRM.md", mdFile);
                    });
            })

    })
    // catch all errors
    .catch(function(err) {
        if(err) {
            console.log(err);
        };
    });



// renders technologies list
function renderTechs(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = `* ${arr[i]}\n`
    };
    let list = arr.join("");
    return list;
};

// renders table of contents
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

// render extra headers
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
};

