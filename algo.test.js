var algo = require('./algo.js');

var agent1 = new algo.Agent();
var customer1 = new algo.Customer();

var agent2 = new algo.Agent();
var customer2 = new algo.Customer();
var customer3 = new algo.Customer();
var customer4 = new algo.Customer();
agent2.assign("A", ['skill3', 'skill2']);
customer2.assign("vin", 'skill3');
customer3.assign("vow", 'skill4');
customer4.assign("wow", 'skill5');



//Test for Agent account creation with worng naming format.
test('Agent() test 1: name empty string test',()=>{
    expect(agent1.assign("",["skill1"])).toBe('please enter the correct company name!');
});

test('Agent() test 2: name non string test',()=>{
    expect(agent1.assign(123,["skill1"])).toBe('please enter the correct company name!');
});

test('Agent() test 3: name contains space test',()=>{
    expect(agent1.assign("BSOS",["skill1"])).toBe('Agent created with name as BSOS');
});


//Test for Agent account creation with worng skillset format.
test('Agent() test 4: skills empty string test',()=>{
    expect(agent1.assign("Vin",["skill1",""])).toBe('please select valid skills');
});

test('Agent() test 5: skills are not string test',()=>{
    expect(agent1.assign("Vin",[123,231])).toBe('please select valid skills');
});

test('Agent() test 6: skills are not string#2 test',()=>{
    expect(agent1.assign("Vin",[true, false])).toBe('please select valid skills');
});

test('Agent() test 7: skills not listed test',()=>{
    expect(agent1.assign("Vin",["skill7","skill1"])).toBe('please select valid skills');
});

test('Agent() test 8: skills not listed test',()=>{
    expect(agent1.assign("Vin",["sdfsdf","skill5"])).toBe('please select valid skills');
});

test('Agent() test 9: correct skill with correct name',()=>{
    expect(agent1.assign("Vin",["skill1","skill2"])).toBe('Agent created with name as Vin');
});


//Test for Customer account creation with worng naming format.
test('Customer() test 10: correct skill format with wrong naming format',()=>{
    expect(customer1.assign(123123,"skill1")).toBe('please enter your name with letters only');
});

test('Customer() test 11: correct skill with wrong naming format',()=>{
    expect(customer1.assign("","skill1")).toBe('please enter your name with letters only');
});


test('Customer() test 12: correct skill with wrong naming format',()=>{
    expect(customer1.assign("@#$@#$","skill1")).toBe('please enter your name with letters only');
});

test('Customer() test 13: correct skill with correct naming format',()=>{
    expect(customer1.assign("Vin","skill1")).toBe('Hello Vin');
});

//Test for Customer account creation with wrong skill format.
test('Customer() test 14: correct name format with wrong skill format',()=>{
    expect(customer1.assign("Vin","skill100")).toBe('please select valid skills');
});

test('Customer() test 15: correct name format with wrong skill format',()=>{
    expect(customer1.assign("Vin","adfasdfa")).toBe('please select valid skills');
});

//Test for matchAgent().
test('matchAgent() test 16: correct skill with correct user',()=>{
    expect(algo.matchAgent(customer2.requirement,customer2)).toBe('Connected!');
});

test('matchAgent() test 17: absent skill with correct user',()=>{
    expect(algo.matchAgent(customer3.requirement,customer3)).toBe('No available agent, placed in queue!');
});


test('matchAgent() test 18: non existing skill with correct user',()=>{
    expect(algo.matchAgent(customer4.requirement,customer4)).toBe('skill not found, no such service is available');
});
