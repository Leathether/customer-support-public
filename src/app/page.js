"use client";

import { Box, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "How can I help you with CMD kernals today?",
    },
  ])
  const [message, setMessage] = useState('')



  const sendMessage = async () => {
    setMessage('')  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ])
  
    // Send the message to the server
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader()  // Get a reader to read the response body
      const decoder = new TextDecoder()  // Create a decoder to decode the response text
  
      let result = ''
      // Function to process the text from the response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })  // Decode the text
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]  // Get the last message (assistant's placeholder)
          let otherMessages = messages.slice(0, messages.length - 1)  // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },  // Append the decoded text to the assistant's message
          ]
        })
        console.log(response.content)
        return reader.read().then(processText)  // Continue reading the next chunk of the response
      })})
    }
    
  
    
      
    

  //const handleSend = () => {
  //  const trimmedInput = input.trim();
  //  if (trimmedInput) {
  //    setMessages((prevMessages) => [
  //      ...prevMessages,
  //      { text: trimmedInput, sender: "user" },
  //      { text: "Let me look into that for you...", sender: "bot" },
  //    ]);
  //    setInput("");
  //  }
  //};


  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <nav style={styles.navbar}>
          <ul style={styles.navList}>
            {["Home", "CMD Line Tips", "About Us", "Privacy", "Terms"].map(
              (response) => (
                <li key={response} style={styles.navListItem}>
                  <a href="#" style={styles.navListLink}>
                    {response}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      </header>
      <Box style={styles.main}>
        <Stack style={styles.chatContainer}>
          <Stack style={styles.chatBox}>
            {messages.map((message, index) => (
              <Box
                key={index}
                id={index}
                style={
                {
                  ...styles.message,
                  ...(message.role === "user"
                    ? styles.userMessage
                    : styles.botMessage),
                  }}
              >
                <Box>
                {
                  message.content
                }</Box>
              </Box>
            ))}
          </Stack>
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.button}>
              Ask
            </button>
          </div>
        </Stack>
      </Box>
    </div>
  );
}

// Defining color constants for easier reuse
const primaryBlue = "#0000FF";
const darkBackground = "#121212";
const lightText = "#FFFFFF";
const defaultSpacing = "16px";

const styles = {
  container: {
    fontFamily: "Roboto, sans-serif",
    backgroundColor: "#f5f5f5",
    color: "#333",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: primaryBlue,
    padding: "20px",
  },
  navbar: {
    display: "flex",
    justifyContent: "center",
  },
  navList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navListItem: {
    margin: "0 15px",
  },
  navListLink: {
    color: lightText,
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: 500,
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: darkBackground,
  },
  chatContainer: {
    width: "80%",
    height: "600px",
    backgroundColor: "#262626",
    borderRadius: "10px",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  chatBox: {
    padding: "20px",
    overflowY: "auto",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  message: {
    maxWidth: "80%",
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "14px",
    lineHeight: "20px",
  },
  userMessage: {
    backgroundColor: primaryBlue,
    color: lightText,
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#e0e0e0",
    color: "#333",
    alignSelf: "flex-start",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderTop: "1px solid #e0e0e0",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #e0e0e0",
    borderRadius: "20px",
    fontSize: "14px",
  },
  button: {
    marginLeft: "10px",
    padding: "10px 20px",
    border: "none",
    backgroundColor: primaryBlue,
    color: lightText,
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
  },
};