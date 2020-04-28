// install dependencies
const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");
const dedent = require("dedent");

// create promises
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

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
        // {
        //     type: "input",
        //     name: "technologies",
        //     message: "Which technologies did you use? (item1, item2, ... etc.) "
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
        },
        
        // still need: badge?, license?, tests?, questions? gitHub email
    ])
    .then(function(data){

        // desctrucure data object into variables
        const { username,
        projectTitle,
        description,
        installInstruct,
        usage,
        contributors,
        technologies,
        extraSections } = data;

        let headers = renderHeaders(extraSections);
        let toc = renderTOC(extraSections);

        // const { username } = data;
        const queryUrl = `https://api.github.com/users/${username}`;
        
        // use axios to generate user photo and email from gitHub with username
        axios
            .get(queryUrl)
            .then(function(response) {
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
                        ${renderTechs(technologies)}  

                        ## Authors
                        ![user image](${imageURL}) <br>
                        [${username}](${profileURL}) | ${email}

                        ${headers}


                        `);

                // generate MD file with user input
                return writeFileAsync("generatedRM.md", mdFile);
            });
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

function renderHeaders(arr) {
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
