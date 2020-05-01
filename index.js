// install dependencies
const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");
const dedent = require("dedent");

// require my modules
const render = require("./myMods/render");
const questions = require("./myMods/questions");

// create promises
const writeFileAsync = util.promisify(fs.writeFile);

// declare global variables
let username;
let imageURL, profileURL;
let projectTitle, description, usage, technologies, extraSections, email, projectIMG;

function init() {
    // prompt username question
    inquirer
        .prompt(questions.usernameQ)
        .then(function (ans) {

            // axios before other questions to check if username is valid
            return axios.get(`https://api.github.com/users/${ans.username}`)
        })   
        .then(function (response) {
            username = response.data.login;
            imageURL = `${response.data.avatar_url}&s=100`;
            profileURL = response.data.url;

            // if response is valid ask next set of questions
            return inquirer.prompt(questions.firstQuestionsArr)
        })
        .then(function (data) {
            projectTitle = render.noSpaces(data.projectTitle);
            description = data.description;
            usage = data.usage;
            technologies = data.technologies;
            extraSections = data.extraSections
            email = data.email;
            projectIMG = data.projectIMG;

            // next questions are generated based on users answer to extraSections (what other sections do you want to include?)
            const secondQuestionsArr = render.extraQarr(extraSections);

            // prompt user to answers to second set of questions
            return inquirer.prompt(secondQuestionsArr)
        })
        .then(function (data) {
            const { license, contributing, test, install } = data;

            // new section instances
            const licenseSection = new render.Section("License", `This project is licensed under the ${license} license.`);
            const contributionSection = new render.Section("Contributing", contributing);
            const testSection = new render.Section("Tests", dedent(`To run tests, run the following command: \n \`\`\` \n ${test} \n \`\`\` `));
            const installSection = new render.Section("Installation", dedent(`To install necessary dependencies, run the following command: \n \`\`\` \n ${install} \n \`\`\` \n ![Dependencies Shield](https://img.shields.io/david/${username}/${projectTitle})`));

            // push user picked sections into sections array - only push sections that aren't undefined (user didn't want them)
            let sectionsArr = [];
            installSection.validate(sectionsArr);
            licenseSection.validate(sectionsArr);
            contributionSection.validate(sectionsArr);
            testSection.validate(sectionsArr);

            // render new sections, additions to table of conetents, and technologies list
            let newSections = render.renderSections(sectionsArr);
            let toc = render.renderTOC(extraSections);
            let techsList = render.renderTechs(technologies);

            // construct markdown file
            const mdFile = dedent(`
            # ${projectTitle}
            [Link to Repo](https://github.com/${username}/${projectTitle}) \n
            ![GitHub last commit](https://img.shields.io/github/last-commit/${username}/${projectTitle})
            
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

        // write README file 
        return writeFileAsync("README.md", mdFile);
    })
    .catch(function (err) {
        // if error occured while prompting username
        if (username === undefined){
            if (err) {
                // prompt user for valid name and start over
                console.log("Please Enter a Valid Username")
                init();
            };
        } else {
            if (err) {
                throw (err);
            };
        };
    });
};

init();




