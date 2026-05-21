import Chatdata from './Chatdata'
import Textbox from './Textbox'

export default function Chatsection({ suggestedQuestions, messages,  sendMessage, messagesEndRef,
    deleteChatById, loading, setInput, handleKeyPress, inputRef, input, isOpen, setIsOpen}){
    return(
        <main className="mx-auto px-1.5 py-1.5 
        grid grid-rows-[1fr_auto] overflow-hidden
        w-full max-h-screen 

        bg-slate-100


        max-sm:p-0.5
        ">
          <Chatdata  messages={messages} messagesEndRef={messagesEndRef} deleteChatById={deleteChatById} loading={loading}
                suggestedQuestions={suggestedQuestions} isOpen={isOpen} setIsOpen={setIsOpen} setInput={setInput}
          />
          <Textbox  setInput={setInput}  handleKeyPress={handleKeyPress} sendMessage={sendMessage} 
          inputRef={inputRef} input={input} loading={loading} suggestedQuestions={suggestedQuestions}   />
        </main>
     )
}