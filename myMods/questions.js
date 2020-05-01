// first prompted question - username 
let usernameQ = {
    type: "input",
    name: "username",
    message: "What is your GitHub username? "
};

// first round of questions (following username)
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
    choices: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "Bulma", "Node.js", "AJAX", "Axios", "Jest"]
};

let extraSectionsQ = {
    type: 'checkbox',
    message: "What other sections would you like to include in your README? (Press ENTER if you don't want to include any)",
    name: 'extraSections',
    choices: ["Installation", "Contributing", "Tests", "License", "Credits"],
};

const firstQuestionsArr = [emailQ, projectTitleQ, descriptionQ, usageQ, imageQ, technologiesQ, extraSectionsQ];


// second round of questions - these questions are only asked based on user selection from extraSectionsQ
let licenseQ = {
    type: "list",
    name: "license",
    message: "What kind of license should your project have? ",
    choices: ["MIT", "GNU GPLv3", "ISC", "Apache License 2.0"]
};

let testQ = {
    type: "input",
    name: "test",
    message: "What command should be run to run tests? ",
    default: "npm test"
};

let contributingQ = {
    type: "input",
    name: "contributing",
    message: "What does the user need to know about contributing to the repo? "
};

let installQ = {
    type: "input",
    name: "install",
    message: "What command should be run to install dependencies? ",
    default: "npm install"
};

// List your collaborators, if any, with links to their GitHub profiles.

// If you used any third - party assets that require attribution, list the creators with links to their primary web presence in this section.

// If you followed tutorials, include links to those here as well.
let creditsQ = {
    type: "input",
    name: "credits",
    message: "Please list any collaborators, third - party assets that require attribution, or tutorials you would like to acknowlege here. "
};


module.exports = {usernameQ, firstQuestionsArr, licenseQ, testQ, contributingQ, installQ, creditsQ};