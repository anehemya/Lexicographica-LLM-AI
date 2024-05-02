import React, { useState } from 'react';
import './chatpage.css';


const ChatPage = () => {

    const [value, setValue] = useState("")
    const [error, setError] = useState("")
    const [chatHistory, setChatHistory] = useState([])

   

    const surpriseOption =[
      "What is the etymology of the word 'arrow'?",
      "What is the worlds oldest language?",
      "Who was the first person to study language?"
    ]

    const surprise =() => {
      const randomValue = surpriseOption[Math.floor(Math.random() * surpriseOption.length)]
      setValue(randomValue)
    }

   
    const getResponse = async ()=>{
        if(!value){
          setError("Error! Please ask a question!")
          return
        }
        try {
          const options = {
            method: 'POST',
            body: JSON.stringify({
              history: chatHistory,
              message: value + " Please make sure that you only answer this input as it relates to the study of language, if it does relate to language just answer the input normally, otherwise tell the user to enter a language related question (nicely)"
            }),
            headers:{
              'Content-Type': 'application/json'
            }
          }
          const response = await fetch('http://localhost:8000/gemini', options)
          const data = await response.text()
          console.log(data)
          setChatHistory(oldChatHistory => [...oldChatHistory, {
            role: "user",
            parts: [{ text: value }],
          },
            {
              role: "model",
              parts: [{ text: data }],
            }              
          ])
          setValue("")

        }catch(error){
          console.error(error)
          setError("Something went wrong! Please try again.")
        }

    }

    const clear =()=>{
      setValue("")
      setError("")
      setChatHistory([])
    }

    return ( 
     
       <div className='app'>
          <div className="input-container">
          <h1 className='Header'>Lexicographica</h1>
            <textarea className="input"
              value = {value}
              placeholder = "Enter your request for any language question here..."
              onChange = {(e) => setValue(e.target.value)} 
              />
      
                <div className='buttons-container'>
                {!error && <button className='ask-me' onClick={getResponse}>Ask me</button>}
                {error && <button className='clear' onClick={clear}>Clear</button>}
              <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise Me</button>
                </div>
            </div>
            {error && <p>{error}</p>}
            
            <div className= "search-result">
              {chatHistory.map((chatItem, _index) => <div key={_index}>
                  <p className="answer">{chatItem.role}: {chatItem.parts[0].text}</p>
                </div>)}
               
              </div>
       </div>
     
    )
}

export default ChatPage