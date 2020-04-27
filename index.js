// initialize npm
// install dependencies: inquirer, fs, util, axios
// use util to create promises (writeFile)
// inquirer - prompt user: github name, badge, project title, description, table of contents, installation, usage, license, contributing, tests, questions, github profile picture, github email
// axios - get github picture and email with inputed github username
// generate md file with user input

const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");

const axiosAsync = util.promisify(axios.get);

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
        // still need: table of contents, badge?, license?, tests?, questions?, gitHub pic, gitHub email
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
        
        axios
            .get(queryUrl)
            .then(function(response) {
                const imageURL = response.data.avatar_url;
                const email = response.data.email;

                const mdFile = 
                    `# ${projectTitle}

                    ## Description
                    ${description}`

                fs.writeFile("genREADME.md", mdFile, function(err) {
                    if (err) {
                        throw err;
                    }
                });
            });

    })
    .catch(function(err) {
        if(err) {
            console.log(err);
        };
    });