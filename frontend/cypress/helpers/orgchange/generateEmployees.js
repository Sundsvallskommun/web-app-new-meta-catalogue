// A function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// A function to generate a random string of length n, using only digits
function getRandomString(n) {
  let chars = '0123456789';
  let result = '';
  for (let i = 0; i < n; i++) {
    result += chars[getRandomInt(0, chars.length - 1)];
  }
  return result;
}

// A function to generate a GUID / UUID
function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// A function to generate a random name from a list of names
function getRandomName(names) {
  return names[getRandomInt(0, names.length - 1)];
}

// A function to generate a random boolean value
function getRandomBoolean() {
  return Math.random() < 0.5;
}

// A list of sample given names
let givenNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Harry', 'Ivy', 'Jack'];

// A list of sample last names
let lastNames = ['Smith', 'Jones', 'Brown', 'Johnson', 'Miller', 'Davis', 'Wilson', 'Taylor', 'Clark', 'Lee'];

// A list of sample titles
let titles = ['Manager', 'Engineer', 'Analyst', 'Developer', 'Designer', 'Consultant', 'Accountant', 'Salesperson'];

// A list of sample operation codes and names
let operations = [
  { code: 'OP1', name: 'Operation One' },
  { code: 'OP2', name: 'Operation Two' },
  { code: 'OP3', name: 'Operation Three' },
  { code: 'OP4', name: 'Operation Four' },
];

// A list of sample PA team codes and names
let paTeams = [
  { code: 'PA1', name: 'PA Team One' },
  { code: 'PA2', name: 'PA Team Two' },
  { code: 'PA3', name: 'PA Team Three' },
  { code: 'PA4', name: 'PA Team Four' },
];

// A constant orgId for all persons
let orgId = 123;

// A function to generate a person object based on the interface
function generatePerson() {
  // Create a person object with some random values
  let person = {
    orgId: orgId,
    personId: generateGUID(), // This is the changed line
    personNumber: getRandomString(6),
    givenname: getRandomName(givenNames),
    lastname: getRandomName(lastNames),
    loginname: getRandomString(10),
    title: getRandomName(titles),
    managerId: null,
    managerName: null,
    paTeam: null,
    paTeamName: null,
    newPATeam: null,
    newPATeamName: null,
    operationCode: null,
    operationName: null,
    newOperationCode: null,
    newOperationName: null,
    newOrgId: null,
    movedToNewOrg: false,
    employmentChangeIntentStarted: false,
    employmentChangeIntentId: null,
  };

  // Assign a random managerName
  if (getRandomBoolean()) {
    let managerName = getRandomName(givenNames);
    person.managerName = managerName;
    person.managerId = generateGUID();
  }

  // Assign a random operation to the person
  let operation = getRandomName(operations);
  person.operationCode = operation.code;
  person.operationName = operation.name;

  // Assign a random PA team to the person
  let paTeam = getRandomName(paTeams);
  person.paTeam = paTeam.code;
  person.paTeamName = paTeam.name;

  // Simulate a chance of changing the PA team or the operation
  if (getRandomBoolean()) {
    // Change the PA team
    let newPATeam = getRandomName(paTeams);
    while (newPATeam.code === person.paTeam) {
      // Make sure the new PA team is different from the old one
      newPATeam = getRandomName(paTeams);
    }
    person.newPATeam = newPATeam.code;
    person.newPATeamName = newPATeam.name;
    // Set the employment change intent started flag to true
    person.employmentChangeIntentStarted = true;
    // Generate a random employment change intent id
    person.employmentChangeIntentId = generateGUID();
  } else if (getRandomBoolean()) {
    // Change the operation
    let newOperation = getRandomName(operations);
    while (newOperation.code === person.operationCode) {
      // Make sure the new operation is different from the old one
      newOperation = getRandomName(operations);
    }
    person.newOperationCode = newOperation.code;
    person.newOperationName = newOperation.name;
    // Set the employment change intent started flag to true
    person.employmentChangeIntentStarted = true;
    // Generate a random employment change intent id
    person.employmentChangeIntentId = generateGUID();
  }

  // Simulate a chance of moving to a new org
  if (person.employmentChangeIntentStarted && getRandomBoolean()) {
    // Generate a random new org id
    person.newOrgId = getRandomInt(100, 200);
    // Set the moved to new org flag to true
    person.movedToNewOrg = true;
  }

  // Return the person object
  return person;
}

// A function to generate a list of n person objects
function generatePersonList(n) {
  // Create an empty list
  let list = [];
  // Loop n times
  for (let i = 0; i < n; i++) {
    // Generate a person object and push it to the list
    let person = generatePerson();
    list.push(person);
  }
  // Return the list
  return list;
}

// Generate a list of 16 person objects and print it to the console
let personList = generatePersonList(16);
console.log(personList);
