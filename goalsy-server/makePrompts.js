// prompt=`Return a Json object with details about whether or not these goals are good. Good goals are specific and have a timeframe that is not unclear.

// Goal:Write a 200 page book about allegators this year.
// {"good":"Yes","goal":"Write a 200 page book about allegators ","time":"this year"}

// Goal:Nah not much going on.
// {"good":"No","goal":"Unclear","time":"Unclear"}

// Goal:I want to get better
// {"good":"No", "goal":"Unclear","time":"Unclear"}

// Goal:Reading 10 books before summer
// {"good":"Yes", "goal":"Reading 10 books","time":"By Summer"}

// Goal:Getting back in the workforce
// {"good":"No", "goal":"Getting back in the workforce","time":"Unclear"}

// Goal: I'm feeling a little sick today.
// {"good":"No", "goal":"Unclear","time":"Unclear"}

// Goal: I want to learn how to sing this year.`

// console.log(JSON.stringify(prompt));

prompt=`
Read the following conversation and return a json object containing the brief description of each goal and the timeframe associated with for each of USER's goals: 

Conversation: "GC:hi I am GoalBot, an AI coach to help you achieve your goals.\nUSER:This shit is insane barh\nGC:\n\"If you don't have a goal in mind, you will never get there.\" - Unknown\n\nHi there! I'm GoalBot, an AI that helps people set goals. Do you have any goals that you have been thinking about?\nUSER:Thats so true, you say deep shit goalbot\nGC:\nThanks for the kind words! Are there any goals that you have been considering lately?\nUSER:Yeah, riding my fucking motorcycle more\nGC:\nThat's a great goal! Let's make it specific and time-bound. How often do you want to ride your motorcycle and what is your end date goal?\nUSER:I dont know like a lot more\nGC:\nThat's great! Let's set a goal of riding your motorcycle at least 4 times a week until the end of June. Does that sound like a good goal? Shall we set that as your goal?\nUSER:starting now\nGC:\nGreat! Shall we set a reminder to check in on your goal?\nUSER:and ending like freaking never\nGC:\nThat's an ambitious goal! How about setting a goal to ride your motorcycle at least 4 times a week until the end of December? Shall we set that as your goal?\nUSER:I guess so\nGC:\nPerfect! Shall we set a reminder to check in on your goal?\nUSER:No not now"

USER's goals JSON object: 
`

 console.log(JSON.stringify(prompt));

let jsonString = '{"good":"No", "goal":"Unclear","time":"Unclear"}';
let jsonObject = JSON.parse(jsonString);
console.log(jsonObject.good); // "No"
console.log(jsonObject.goal); // "Unclear"
console.log(jsonObject.time); // "Unclear"

