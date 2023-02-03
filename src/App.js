import React, { useState, useRef } from 'react';
import './App.css';
import { Container, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import { Tab, Tabs } from 'react-bootstrap';
import { FaComment, FaBullseye, FaChartArea, FaPeopleArrows, FaUser, FaGraduationCap, FaPaperPlane, FaCheck ,  FaEdit } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import { initializeApp } from 'firebase/app';
import { NorthWest } from '@mui/icons-material';


const prompts = require('./prompts.json');


function App() {
  const [tab, setTab] = useState(0);
  const [lastMessageIndex, setLastMessageIndex] = useState(-1);

  const [loggedIn, setLoggedIn] = useState(false);
// add state for input and chat log
  const [input, setInput] = useState('');
  const [goalList, setGoalInfo] = useState({
    "goals": []
});
  const [chatLog, setChatLog] = useState([{user: "goalBot", message: "Hi there.  Welcome to goalsy, an AI powered service that helps you choose and then achieve your goals. Do you have any goals you have been thinking about?"}]);
  //const server_route = "http://localhost:3080/";
  const server_route = "http://192.168.4.53:3080/";
  //const server_route = "https://server-exlupocliq-wl.a.run.app/";
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  
  const [placeholder, setPlaceholder] = useState("What are your goals?");
  const element = useRef(null);
  const goallist = useRef(null);

  useEffect(() => {
    var height = window.innerHeight;
    element.current.style.height = (height - 170) + "px";
    goallist.current.style.height = (height - 80) + "px";
    scrollToBottom();
  }, []);

  const handleFocus = () => {
    setPlaceholder("");
  };
  
  const scrollToBottom = () => {
    const chatLog = document.querySelector('.chat-log');
    chatLog.scrollTop = chatLog.scrollHeight;
};

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);
  
  const handleTabChange = (event, newValue) => {
    setTab(event);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };
  
  async function clearChat(){
    await setChatLog([]);  
    await setGoalInfo({goals:[]});
    callAPI("",[],0,"");
 }
 
 async function handleSubmit(e){
    e.preventDefault(); // prevent page refresh
    let chatLogNew = [...chatLog, {user: "USER", message: `${input}`}]
    setInput("" );
    //await setGoalInfo([{goals:[{"name": "", "": "Month"},{"name": "", "timeFrame": ""}]}]);
    setChatLog(chatLogNew);
    scrollToBottom();
    const messages = chatLogNew.map((message) =>message.message).join("\n");
    const convo = chatLogNew.map((message) =>message.user +":"+message.message).join("\n");
    await callAPI(messages,chatLogNew,0,"goalBot");
    setIsLoading(false);
    await checkforGoal(convo+"\n");
    // Scroll the chat-log div to the bottom after the goalbot message is added
    
 }

 const handleVoice = async () => {
  let messages = chatLog.map((message) => message.message).join("\n");
  let studentBotResponse = await callAPI(messages, chatLog, 5, "studentBot");
  messages = `${messages}\n${studentBotResponse.message}`;
  let newChatLog = [...chatLog, {user: "studentBot", message: studentBotResponse.message}];
  setIsLoading(false);
  await callAPI(messages, chatLog, 0, "goalBot");
  const convo = chatLog.map((message) => message.user + ":" + message.message).join("\n");
  setIsLoading(false);
  await checkforGoal(convo+"\n");
 }

 async function callAPI(messages,chatLogNew,promptNumber,chatuser) {
       // fetch response to the api combining the chatlog array of messages and sending it to localhost:3000 as a post request
      setIsLoading(true); 
      const lastMessageIndex = chatLogNew.length;
      chatLogNew.push({ user: chatuser, message: "Loading..." });
      setChatLog(chatLogNew);
       const response = await fetch(server_route, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           prompt:promptNumber,
           message:messages+"\n"
         })
       });
       const data = await response.json();
       setIsLoading(false); 
       // ensure that message includes breaks by converting newlines to <br>
       data.message = data.message.replace(/\n/g, "\n");
       chatLogNew[chatLogNew.length - 1].message = data.message;
       setChatLog(chatLogNew);
       scrollToBottom();
       console.log(data.message);
       return data;
 }

 async function checkforGoal(convo){
  let date = new Date();
  let options = { month: 'short', year: 'numeric' };
  let formattedDate = date.toLocaleString('default', options);
  
  const goalprompt =  "Assume that today is: "+ formattedDate+" "+ prompts[2].prompt + convo + "\n\nJSON OBJECT:\n\n"
   const response = await fetch(server_route, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           prompt:2,
           convo:convo,
           customPrompt: goalprompt
         })
       });
       const data = await response.json();
       let newtext = (data.message.replace(/\\/g, ""));
       newtext = newtext.replace(/'/g, "");
       let jsonObject=JSON.parse(newtext);       
       console.log("GoalAssess",newtext);
       setGoalInfo(jsonObject);
     }
     useEffect(() => {
      //clearChat(); 
    }, []);
  return (
    
    <div>
      <div className='header-fixed'>
      <Navbar bg="white" expand="lg">
        <Navbar.Brand href="#home" className ="mx-3"><b>goalsy</b></Navbar.Brand>
      </Navbar>
      
      <Tabs
        activeKey={tab}
        onSelect={handleTabChange}
        id="controlled-tab-example"
        className="d-flex mx-2"
      >
       <Tab eventKey={0} title={<FaComment size="30"/>} >
          <div>
            <Container>
            <div className="chat-message-center" ref={element}>
                <div className="chat-log" id="chat-log" >
                  {chatLog.map((message, index) => (
                  <ChatMessage key={index} message={message} isLoading={isLoading} /> ))}
                </div>
            </div>
            <div className="chat-input-holder">
                <form onSubmit={handleSubmit}>
                  <input rows="1" 
                    className='chat-input-textarea' 
                    placeholder={placeholder}
                    value={input}
                    onChange={(e)=> setInput(e.target.value)}
                    onFocus={handleFocus}
                    >
                   
                  </input>
                  <div className="SubmitButton" onClick={handleSubmit}><FaPaperPlane size="20" /></div>
                </form>
              </div>
              <div className="aiVoice" onClick={handleVoice}><FaGraduationCap size="25" /></div>
            </Container>
          </div>
        </Tab>
      
        <Tab eventKey={1} title={<span><FaBullseye size="30"/>{goalList.goals.length > 0 && goalList.goals[0].name !== "empty" ? <span ><Badge className="bg-danger">{goalList.goals.length}</Badge></span> : null}</span>}>
            <Container>
              <div className="goal-list-holder" ref={goallist}>                   
                  <GoalList goalList={goalList} /> 
              </div>
            </Container>
        </Tab>
      </Tabs>
    </div>
    </div>
  );
}

function GoalList({ goalList }) {
  const [editable, setEditable] = useState(false);
  const [currentGoal, setCurrentGoal] = useState({});

  const handleClick = (goal) => {
    setEditable(!editable);
    setCurrentGoal(goal);
  };

  const handleChange = (event) => {
    setCurrentGoal({
      ...currentGoal,
      [event.target.name]: event.target.value
    });
  };

  if (goalList) {
    try {
      return (
        <div className="goalAssess d-flex flex-column">
          {goalList.goals.map((goal, index) => (
            <div className="goal-cards " key={index} >
              {/* <div className="goal-cards " key={index} onClick={() => handleClick(goal)}> */}
              <div className="goal-card d-flex flex-column justify-content-between">
               {/* <div className=""> */}
                  <div className="goalName d-flex flex-row h-30">
                    {editable && currentGoal === goal ? (
                      <input
                        type="text"
                        name="name"
                        value={currentGoal.name}
                        onChange={handleChange}
                      />
                    ) : (
                      goal.name || 'N/A'
                    )}
                  </div>
                  <div className="goalTimeframe d-none">
                    {editable && currentGoal === goal ? (
                      <input
                        type="text"
                        name="timeframe"
                        value={currentGoal.timeframe}
                        onChange={handleChange}
                      />
                    ) : (
                      goal.timeframe || 'N/A'
                    )}
                  </div>
                  <div className="d-none goalButtons d-flex" key={index}>
                    <FaEdit />
                    <FaCheck />
                  </div>
                {/* </div> */}
                <div className='d-flex flex-row justify-content-between '>
                  <div className='goal-quote'>{(goal.quotespiration)}</div>
                </div>
                <div className='d-flex flex-row justify-content-between '>
                  <div className='goal-date'>{(goal.startdate)}</div>
                  <div className='goal-date'>{(goal.enddate)}</div>
                </div>
                <div className='d-flex flex-row justify-content-between '>
                  <div className='goal-subgoal'>The Plan</div>
                </div>
                <div className='goal-plan'>
                {goal.plan.map((plan, index) => (
                  <div className="goal-plan-item-container" key={index}>
                  <div className="goal-plan-index">{index+1}. </div>
                  <div className="goal-plan-item">{plan}</div>
                  </div>
                 ))}
                </div>
                <div className='d-flex flex-row justify-content-between '>
                  <div className='goal-subgoal'>Recommended Reading</div>
                </div>
                <div className='goal-plan'>
                {goal.books.map((book, index) => (
                  <div className="goal-plan-item-container" key={index}>
                  <div className="goal-plan-index">{index+1}. </div>
                  <div className="goal-plan-item">  <a href={`http://www.amazon.com/s?k=${book}`} target="_blank">{book}</a></div>
                  </div>
                 ))}
                </div>
                <div className='d-flex flex-row justify-content-between '>
                  <div className='goal-subgoal'>Recommended Listening</div>
                </div>
                <div className='goal-plan'>
                {goal.podcasts.map((abook, index) => (
                  <div className="goal-plan-item-container" key={index}>
                  <div className="goal-plan-index">{index+1}. </div>
                  <div className="goal-plan-item">  <a href={`https://open.spotify.com/search/${abook}`} target="_blank">{abook}</a></div>
                  </div>
                 ))}  
                </div>
                {/* <div className='goal-chart d-flex flex-row h-10 w-80 '>  
                </div> */}
                
              </div>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      console.log(error);
      return <div>Error Occured</div>;
    }
  }
}



const ChatMessage =({message}) => {

  return (
    <div className="row">
      <div className={`chat-row ${message.user}>`}>
        <div className={`chat-message-sender ${message.user}`}>

        {message.user === "studentBot" ? <FaGraduationCap /> : "" }
        </div>
        <div className="">
          <div className={`chat-message ${message.user}`}>
            <div className={`chat-card ${message.user}`}>
              <div className="chat-message-username">{message.user === "goalBot" ? "majorDomo" : "You" }</div>
                        <div className={`chat-message-text ${message.user}`}>{message.message}</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default App;