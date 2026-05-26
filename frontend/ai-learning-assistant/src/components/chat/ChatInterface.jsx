import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import aiService from '../../services/aiService';
import { MessageSquare, Sparkle } from 'lucide-react';
import Spinner from '../common/Spinner';

const ChatInterface = () => {
    const {id: documentId} = useParams();
    const {user} = useAuth();
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(()=>{
        const fetchChatHistory = async () => {
            try {
                setInitialLoading(true);
                const response = await aiService.chatHistory(documentId);
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            } finally {
                setInitialLoading(false);
            }
        }
        fetchChatHistory();
    }, [documentId]);

    useEffect(()=>{
        scrollToBottom();
    }, [history])

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = { role: 'user', content: message, timestamp: new Date() };
        setHistory(prev => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        try {
            const response = await aiService.chat(documentId, userMessage.content);
            const assistantMessage = {
                role: 'assistant',
                content: response.data,
                timestamp: new Date(),
                relevantChunks: response.data.relevantChunks
            };
            setHistory(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error while processing your request.',
                timestamp: new Date()
            };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    }

    const renderMessage = (msg, index) => {
        return "renderMessage";
    }

    if (initialLoading) {
        return (
            <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl items-center justify-center shadow-xl shadow-slate-200/50">
                <div className="size-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <MessageSquare className='size-7 text-emerald-600' strokeWidth={2} />
                </div>
                <Spinner />
                <p className='text-sm text-slate-500 mt-3 font-medium'>Loading chat history...</p>
            </div>
        )
    }
    
  return (
    <div className=''>
        {/* Message Area */}
        <div className="">
            {history.length === 0 ? (
                <div className="">
                    <div className="">
                        <MessageSquare className='' strokeWidth={2} />
                    </div>
                    <h3 className=''>Start a Conversation</h3>
                    <p className="Ask me anything about the document!"></p>
                </div>
            ) : (
                history.map(renderMessage)
            )}
            <div ref={messageEndRef} />
            {loading && (
                <div className="">
                    <div className="">
                        <Sparkle className='' strokeWidth={2} />
                    </div>
                    <div className="">
                        <div className="">
                            <span className="" style={{ animationDelay: '0ms'}}></span>
                            <span className="" style={{ animationDelay: '150ms'}}></span>
                            <span className="" style={{ animationDelay: '300ms'}}></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default ChatInterface