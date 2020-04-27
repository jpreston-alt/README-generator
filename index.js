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
        {
            type: "input",
            name: "installInstruct",
            message: "Please enter your installation instructions here: "
        },
        // still need: table of contents, badge?, license?, tests?, questions?, gitHub pic, gitHub email
    ])
    .then(function(data){
        console.log(data);

    })
    .catch(function(err) {
        if(err) {
            console.log(err);
        };
    });