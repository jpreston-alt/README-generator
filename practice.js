var inquirer = require('inquirer');
// var output = [];

var questions = [
    {
        type: 'input',
        name: 'yourUsername',
        message: "What is your GitHub username?"
    },
    {
        type: 'confirm',
        name: 'others',
        message: 'Did anybody else work on this project with you (just hit enter for YES)?',
        default: true
    },
    {
        type: 'input',
        name: 'othersUsername',
        message: 'What is the GitHub username of the other person who worked on this with you?',
        default: true
    },
];

function ask() {
    inquirer.prompt(questions).then(answers => {
        // output.push(answers.tvShow);
        if (answers.others) {
            inquirer.prompt(questions[1])
        } else {
            console.log('Your favorite TV Shows:', output.join(', '));
        }
    });
}

ask();