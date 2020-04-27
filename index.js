// install dependencies
const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");
const dedent = require("dedent");

// create promises
const writeFileAsync = util.promisify(fs.writeFile);

// use inquirer to prompt for user input
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
            type: "input",
            name: "contributors",
            message: "Who contributed to this project? "
        },
        // still need: table of contents, badge?, license?, tests?, questions? gitHub email
    ])
    .then(function(data){

        // desctrucure data object into variables
        const { username,
        projectTitle,
        description,
        installInstruct,
        usage,
        contributors } = data;

        // const { username } = data;
        const queryUrl = `https://api.github.com/users/${username}`;
        
        // use axios to generate user photo and email from gitHub with username
        axios
            .get(queryUrl)
            .then(function(response) {
                const imageURL = `${response.data.avatar_url}&s=100`;
                const email = response.data.email;

                const mdFile = dedent(`# ${projectTitle}

                                ## Description
                                ${description}

                                ## Installation Instructions
                                ${installInstruct}

                                ## How to Use
                                ${usage}

                                ## Contributors
                                ![user image](${imageURL})
                                ${username} | ${email}`
                                );

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