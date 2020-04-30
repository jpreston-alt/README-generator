// install dependencies
const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");
const dedent = require("dedent");
const followUpMod = require("./followUpMod");

// create promises
const writeFileAsync = util.promisify(fs.writeFile);

let usernameQ = {
    type: "input",
    name: "username",
    message: "What is your GitHub username? "
};

let emailQ = {
    type: "input",
    name: "email",
    message: "What is your email? "
};

let projectTitleQ = {
    type: "input",
    name: "projectTitle",
    message: "What is the name of your project repository? "
};

let descriptionQ = {
    type: "input",
    name: "description",
    message: "Please write a description of your project: "
};

let usageQ = {
    type: "input",
    name: "usage",
    message: "What does the user need to know about using the repo? "
};

let imageQ = {
    type: "input",
    name: "projectIMG",
    message: "Please include an image or a gif. Enter the filepath here: "
};

let technologiesQ = {
    type: 'checkbox',
    message: 'Which technologies did you use?',
    name: 'technologies',
    choices: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "Bulma", "Node.js", "AJAX"]
};

let extraSectionsQ = {
    type: 'checkbox',
    message: "What other sections would you like to include in your README? (Press ENTER if you don't want to include any)",
    name: 'extraSections',
    choices: ["Installation", "Contributing", "Tests", "License"],
};

const secondQ = [emailQ, projectTitleQ, descriptionQ, usageQ, imageQ, technologiesQ, extraSectionsQ];

// prompt first set of questions
function init() {
    inquirer.prompt(usernameQ).then(function (ans) {
        axios.get(`https://api.github.com/users/${ans.username}`).then(function (response) {
            const { username } = ans;
            const imageURL = `${response.data.avatar_url}&s=100`;
            const profileURL = response.data.url;

            inquirer.prompt(secondQ).then(function (data) {

                // desctrucure data object into variables
                const {projectTitle,
                    description,
                    usage,
                    technologies,
                    extraSections,
                    email,
                    projectIMG } = data;

                // questions array is generated based on users answer to extraSections
                const questionsArr = followUpMod.extraQarr(extraSections);

                        // prompt user for answers to questions array
                inquirer.prompt(questionsArr).then(function (data) {
                    const { license, contributing, test, install } = data;

                    // new section instances - sections are rendered based on user picks
                    const licenseSection = new followUpMod.Section("License", dedent(`This project is licensed under the ${license} license. \n\n ![GitHub license](https://img.shields.io/badge/license-${license}-blue.svg)`));
                    const contributionSection = new followUpMod.Section("Contribution", contributing);
                    const testSection = new followUpMod.Section("Tests", dedent(`To run tests, run the following command: \n \`\`\` \n ${test} \n \`\`\` `));
                    const installSection = new followUpMod.Section("Installation", dedent(`
                    To install necessary dependencies, run the following command:
                    \`\`\`
                    ${install}
                    \`\`\`
                    ![Dependencies Shield](https://img.shields.io/david/${username}/${projectTitle})`))

                    // push valid sections into new sections array
                    let sectionsArr = [];
                    installSection.validate(sectionsArr);
                    licenseSection.validate(sectionsArr);
                    contributionSection.validate(sectionsArr);
                    testSection.validate(sectionsArr);
                    // console.log(sectionsArr);

                    // render new sections, table of conetents, and technologies list
                    let newSections = followUpMod.renderSections(sectionsArr);
                    let toc = followUpMod.renderTOC(extraSections);
                    let techsList = renderTechs(technologies);

                    const mdFile = dedent(`
                    # ${projectTitle}
                    ![GitHub last commit](https://img.shields.io/github/last-commit/${username}/${projectTitle}) [![Link to Repo](https://img.shields.io/badge/Link%20to%20Repo-blue.svg)](https://github.com/${username}/${projectTitle})
                    
                    ## Description
                    ${description}
                    ## Table of Contents
                    * [Usage](#usage)
                    * [Technologies](#technologies)
                    * [Questions](#questions)
                    ${toc}
                    ## Usage
                    ${usage}\n
                    ![](${projectIMG})
                    ## Technologies
                    ${techsList} 
                    ![GitHub top language](https://img.shields.io/github/languages/top/${username}/${projectTitle})\n
                    ${newSections}
                    ## Questions
​
                    If you have any questions about the repo, open an issue or contact me:\n
                    On GitHub: [${username}](${profileURL}) | Via Email: ${email}\n
                    ![user image](${imageURL})
                    `);

                    // generate MD file with user input
                    return writeFileAsync("README.md", mdFile);
                })
            })
            .catch(function (err) {
                if (err) {
                    throw err;
                };
            })
        })
        .catch(function(err) {
            if (err) {
                console.log("please enter a valid username")
                init();
            }
        })
    })
};

init();

// renders technologies list
function renderTechs(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = `* ${arr[i]}\n`
    };
    let list = arr.join("");
    return list;
};



