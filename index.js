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

