import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [prevsChats, setPrevsChats] = useState([]);
  const [currTitle, setCurrTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type":  "application/json"
      }
    }
    try {
      const response = await fetch("http://localhost:3000/completions", options)
      const data = await response.json()
      console.log(data)
      setMessage(data.choices[0].message)
    } catch(error) {
      console.log("You have an error", error);

    }
  }

  useEffect(() => {
    console.log(currTitle, value, message)
    if (!currTitle && value && message) {
      setCurrTitle(value)
    }
    if (currTitle && value && message) {
      setPrevsChats(prevsChats => {
        setPrevsChats(prevsChats => {
          [...prevsChats,
            {
              title: currTitle,
              role: "user",
              content: value
            },
            {
              title: currTitle,
              role: message.role,
              content: message.content 
            }

        ]
        })
      })
    }

  }, [message, currTitle])

  console.log(prevsChats);

  const currentChat = prevsChats.filter(prevsChat => prevsChat.title == currTitle)

  const uniqueTitles = Array.from(new Set(prevsChats.map(prevsChat => prevsChat.title)))

  console.log(uniqueTitles)

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key = { index } onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Mallik</p>
        </nav>
      </section>

      <section className="main-app">
        {!currTitle && <h1>MallikGPT</h1> }
        <ul className="feed">
            {currentChat?.map((chatMessage, index) => <li key = {index} >
              <p className="role">{chatMessage.role}</p>
              <p className="message">{chatMessage.content}</p> 
            </li>)}
        </ul>

        <div className="bottom-section">
          <div className="input-container">
            
            <input type="text" value = {value} onChange = { (e) => setValue(e.target.value)} />
            <div id="submit" onClick = { getMessages }>➢</div>
          
          </div>

          <p className="info">
            Mallik GPT Apr 24 Ver. Free Research Preview.
            My Goal is to make AI Systems more accessible, more natural and safe to interact with.
            Your feedback would help us a lot.
          </p>
        </div>
      </section>
    </div>
  )
}

export default App
