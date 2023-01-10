import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const App = () => {
  const synthRef = React.useRef(window.speechSynthesis);

const [outP, setOutP]=useState('')
const [isListening, setIsListening] = useState(false)
const [note, setNote] = useState(null)

useEffect(() => {
  handleListen()
}, [isListening])

const handleListen = () => {
  if (isListening) {
    mic.start()
    mic.onend = () => {
      console.log('continue..')
      mic.start()
    }
  } else {
    mic.stop()
    mic.onend = () => {
      console.log('Stopped Mic on Click')
    }
  }
  mic.onstart = () => {
    console.log('Mics on')
  }

  mic.onresult = event => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
    console.log(transcript)
    setNote(transcript)
    mic.onerror = event => {
      console.log(event.error)
    }
  }
};

const handleSubmit = async() => {
  setIsListening(false)
  const question = {note}
  fetch('/ask', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(question)
  })
  .then(
    (res) => res.text()
  ).then(
    (data)=>setOutP(data)
  );
};
 const ask = () =>{
  synthRef.current.speak(new SpeechSynthesisUtterance(outP));
  setOutP("");
 }

  return (
    <div className="App">
      <h1>Voice Notes</h1>
      <div className="container">
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          {!isListening ? <button onClick={() => setIsListening(prevState => !prevState)}>
            Start
          </button> :
          <button disabled={!isListening} onClick={handleSubmit}>Stop</button>}
          <button onClick={ask} type='submit' disabled={outP.length == 0}>
            Get Answer
          </button>
        </div>
        <div className="box">
          <h2>Answer</h2>
          <p>{outP}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
