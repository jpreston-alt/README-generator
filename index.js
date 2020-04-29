// install dependencies
const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");
const dedent = require("dedent");
const followUpMod = require("./followUpMod");

// create promises
const writeFileAsync = util.promisify(fs.writeFile);

// prompt first set of questions
inquirer
    .prompt([
        {
            type: "input",
            name: "username",
            message: "What is your GitHub username? "
        },
        {
            type: "input",
            name: "email",
            message: "What is your email? "
        },
        {
            type: "input",
            name: "projectTitle",
            message: "What is the name of your project? "
        },
        {
            type: "input",
            name: "description",
            message: "Please write a description of your project: "
        },
        {
            type: "input",
            name: "install",
            message: "What command should be run to install dependencies? ",
            default: "npm install"
        },
        {
            type: "input",
            name: "usage",
            message: "What does the user need to know about using the repo? "
        },
        {
            type: "input",
            name: "projectIMG",
            message: "Please include an image or a giph. Enter the filepath here: "
        },
        {
            type: 'checkbox',
            message: 'Which technologies did you use?',
            name: 'technologies',
            choices: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "Bulma", "Node.js", "AJAX"]
        },
        {
            type: 'checkbox',
            message: "What other sections would you like to include in your README? (Press ENTER if you don't want to include any)",
            name: 'extraSections',
            choices: ["Contributing", "Badges", "Tests", "License"],
        }
    ])
    .then(function(data){

        // desctrucure data object into variables
        const { username,
        projectTitle,
        description,
        install,
        usage,
        technologies,
        extraSections,
        email,
        projectIMG} = data;

        // questions array is generated based on users answer to extraSections
        const questionsArr = followUpMod.extraQarr(extraSections);

        // prompt user for answers to questions array
        inquirer
            .prompt(questionsArr)
            .then(function (data) {
                const { license, contributing, test, badges } = data;

                // new section object constructor
                function Section(header, body) {
                    this.header = header;
                    this.body = body;
                };

                // new section instances - sections are rendered based on user picks
                const licenseSection = new Section("License", `This project is licensed under the ${license} license.`);
                const contributionSection = new Section("Contribution", contributing);
                const testSection = new Section("Tests", dedent(`To run tests, run the following command: \n \`\`\` \n ${test} \n \`\`\` `));
                const badgesSection = new Section("Badges", badges);

                let sectionsArr = [contributionSection, licenseSection, testSection, badgesSection];

                // render new sections, table of conetents, and technologies list
                let filterSectArr = followUpMod.renderSectArr(sectionsArr);
                let newSections = followUpMod.renderSections(filterSectArr);
                let toc = followUpMod.renderTOC(extraSections);

                let techsList = renderTechs(technologies);

                // use axios to generate user photo and link from gitHub with username
                axios
                    .get(`https://api.github.com/users/${username}`)
                    .then(function (response) {
                        const imageURL = `${response.data.avatar_url}&s=100`;
                        const profileURL = response.data.url;

                        const mdFile = dedent(`
                        # ${projectTitle}
                        ### [Project Link](https://github.com/${username}/${projectTitle})
                        ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

                        ## Description
                        ${description}

                        ## Table of Contents
                        * [Technologies](#technologies)
                        * [Installation](#installation)
                        * [Usage](#usage)
                        * [Questions](#questions)
                        ${toc}

                        ## Installation
                        To install necessary dependencies, run the following command:

                        \`\`\`
                        ${install}
                        \`\`\`

                        ## Usage
                        ${usage}\n
                        ![](${projectIMG})

                        ## Technologies
                        ${techsList}  

                        ${newSections}

                        ## Questions
​
                        If you have any questions about the repo, open an issue or contact me:\n
                        On GitHub: [${username}](${profileURL}) | Via Email: ${email}\n
                        ![user image](${imageURL})
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



