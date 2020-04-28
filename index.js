// install dependencies
const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");
const dedent = require("dedent");
const followupQ = require("./followupQ");

// create promises
const writeFileAsync = util.promisify(fs.writeFile);

// prompt first set of questions
inquirer
    .prompt([
        {
            type: "input",
            name: "username",
            message: "Please enter your GitHub username: "
        },
        {
            type: "input",
            name: "projectTitle",
            message: "Please enter your project title: "
        },
        {
            type: "input",
            name: "description",
            message: "Please enter a description of your project: "
        },
        {
            type: "input",
            name: "installInstruct",
            message: "Please enter your installation instructions here: "
        },
        {
            type: "input",
            name: "usage",
            message: "How do you use this product? "
        },
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

        // questions array is generated based on users answer to extraSections
        const questionsArr = followupQ.extraQarr(extraSections);

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

                // new section instances
                const licenseSection = new Section("License", license);
                const contributionSection = new Section("Contribution", contributing);
                const testSection = new Section("Tests", test);
                const badgesSection = new Section("Badges", badges);
                let sectionsArr = [];

                // push instances to array
                sectionsArr.push(contributionSection, licenseSection, testSection, badgesSection);
                let filtSectArr = sectionsArr.filter(function(el) {
                    return el.body !== undefined;
                });

                // render array of new sections
                let newSections = followupQ.renderSections(filtSectArr);
                let toc = followupQ.renderTOC(extraSections);
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

                        ## Credits
                        ![user image](${imageURL}) <br>
                        [${username}](${profileURL}) | ${email}

                        ${newSections}
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



