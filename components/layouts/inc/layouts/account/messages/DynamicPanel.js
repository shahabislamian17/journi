'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { conversationsAPI } from '../../../../../../lib/api';
import { io } from 'socket.io-client';

export default function DynamicPanel({ initialConversations = [] }) {
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendError, setSendError] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const sendFormRef = useRef(null);
  const hostQueryHandledRef = useRef(false);
  const pollTimeoutRef = useRef(null);
  const pollInFlightRef = useRef(false);
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const getSocketUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Realtime updates via Socket.IO (REST remains fallback)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(getSocketUrl(), {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('conversation_message', (payload) => {
      const { conversationId, message } = payload || {};
      if (!conversationId || !message) return;

      // Update current thread if open
      setSelectedConversation((prev) => {
        if (prev?.id !== conversationId) return prev;
        setMessages((msgs) => [...msgs, { ...message, isOwn: false }]);
        return prev;
      });

      // Update sidebar preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id !== conversationId
            ? c
            : {
                ...c,
                lastMessage: {
                  ...(c.lastMessage || {}),
                  message: message.message,
                  createdAt: message.createdAt,
                  senderId: message.senderId,
                  senderName: message.senderName,
                  read: message.read,
                },
                lastMessageAt: message.createdAt,
              }
        )
      );
    });

    return () => {
      try {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('conversation_message');
        socket.disconnect();
      } catch (_) {
        // ignore
      }
      socketRef.current = null;
      setSocketConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for conversation list
  const formatConversationDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  // Truncate text for preview
  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '..';
  };

  // Load conversations
  const loadConversations = async () => {
    try {
      // Check if user is authenticated
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, skipping conversations load');
          setConversations([]);
          return;
        }
      }
      
      const data = await conversationsAPI.getAll();
      if (data?.conversations) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      // If it's an authentication error, clear conversations
      if (error.message && (error.message.includes('401') || error.message.includes('403') || error.message.includes('token'))) {
        console.log('Authentication error, clearing conversations');
        setConversations([]);
      }
    }
  };

  // Load a specific conversation with messages
  const loadConversation = async (conversationId) => {
    if (!conversationId) return;
    
    setLoading(true);
    try {
      const data = await conversationsAPI.getById(conversationId);
      if (data?.conversation) {
        setSelectedConversation(data.conversation);
        setMessages(data.conversation.messages || []);
        
        // Scroll to bottom
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (e) => {
    // Always guard events (prevents native submit/page reload if called without a React event)
    e?.preventDefault?.();
    e?.stopPropagation?.();

    alert('[Send] handler called');
    
    setSendError('');
    if (!selectedConversation) {
      alert('[Send] blocked: no selectedConversation');
      setSendError('Please select a conversation first.');
      return;
    }
    if (!messageText.trim()) {
      alert('[Send] blocked: empty message');
      setSendError('Please type a message.');
      return;
    }
    if (sending) return;
    
    setSending(true);
    try {
      const trimmed = messageText.trim();
      alert('[Send] calling API...');
      const data = await conversationsAPI.sendMessage(selectedConversation.id, trimmed);
      alert('[Send] API response received');
      if (data?.message) {
        alert('[Send] message appended');
        setMessages(prev => [...prev, data.message]);
        setMessageText('');
        
        // Update conversation list locally (avoid extra API call)
        setConversations(prev =>
          prev.map((conv) => {
            if (conv.id !== selectedConversation.id) return conv;
            return {
              ...conv,
              lastMessage: { ...(conv.lastMessage || {}), message: trimmed, createdAt: data.message.createdAt },
              lastMessageAt: data.message.createdAt,
            };
          })
        );
        
        // Scroll to bottom
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('[Send] API error: ' + (error?.message || 'unknown'));
      const msg = error?.data?.error || error?.data?.message || error?.message || 'Failed to send message. Please try again.';
      setSendError(msg);
    } finally {
      alert('[Send] done');
      setSending(false);
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    loadConversation(conversation.id);
    
    // Show conversation on mobile
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      const conversationBlock = document.querySelector('.messages .panel .container .content .sections .section.two .blocks .block[data-block="2"]');
      if (conversationBlock) {
        conversationBlock.classList.add('active');
      }
    }
  };

  // Handle back button (mobile)
  const handleBack = () => {
    setSelectedConversation(null);
    setMessages([]);
    
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      const conversationBlock = document.querySelector('.messages .panel .container .content .sections .section.two .blocks .block[data-block="2"]');
      if (conversationBlock) {
        conversationBlock.classList.remove('active');
      }
    }
  };

  // Poll for new messages
  useEffect(() => {
    // If socket is connected, polling is unnecessary.
    if (socketConnected) return;
    const conversationId = selectedConversation?.id;
    if (!conversationId) return;

    let cancelled = false;

    const pollOnce = async () => {
      if (cancelled) return;
      if (pollInFlightRef.current) return;
      pollInFlightRef.current = true;
      try {
        // Avoid aggressive polling when tab is hidden (prevents bursts on focus/HMR)
        if (typeof document !== 'undefined' && document.hidden) return;

        const data = await conversationsAPI.getById(conversationId);
        if (cancelled) return;

        if (data?.conversation) {
          const conv = data.conversation;
          const convMessages = conv.messages || [];
          setMessages(convMessages);

          // Update sidebar preview locally (avoid extra /api/conversations call every poll)
          const last = convMessages.length ? convMessages[convMessages.length - 1] : null;
          if (last) {
            setConversations(prev =>
              prev.map((c) =>
                c.id !== conv.id
                  ? c
                  : {
                      ...c,
                      lastMessage: {
                        id: last.id,
                        message: last.message,
                        senderId: last.senderId,
                        senderName: last.senderName,
                        createdAt: last.createdAt,
                        read: last.read,
                      },
                      lastMessageAt: last.createdAt,
                    }
              )
            );
          }
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      } finally {
        pollInFlightRef.current = false;
      }
    };

    const scheduleNext = () => {
      if (cancelled) return;
      const delay =
        typeof document !== 'undefined' && document.hidden
          ? 15000
          : 5000;
      pollTimeoutRef.current = setTimeout(async () => {
        await pollOnce();
        scheduleNext();
      }, delay);
    };

    // Kick off polling loop
    pollOnce();
    scheduleNext();

    return () => {
      cancelled = true;
      pollInFlightRef.current = false;
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [selectedConversation?.id]);

  // Handle host query parameter - create or find conversation
  useEffect(() => {
    const handleHostQuery = async () => {
      if (hostQueryHandledRef.current) return;
      if (router.isReady && router.query.host) {
        hostQueryHandledRef.current = true;
        const hostId = router.query.host;
        const experienceId = router.query.experience || null;
        
        console.log('[DynamicPanel] Creating conversation with:', { hostId, experienceId });
        
        try {
          // Check if user is authenticated
          if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
              console.error('[DynamicPanel] No token found - user not authenticated');
              alert('Please log in to message hosts.');
              router.push('/account/log-in');
              return;
            }
          }
          
          // Create or get conversation
          console.log('[DynamicPanel] Calling conversationsAPI.create...');
          const data = await conversationsAPI.create({
            participantId: hostId,
            experienceId: experienceId
          });
          
          console.log('[DynamicPanel] Conversation created:', data);
          
          if (data?.conversation) {
            // Load the conversation
            await loadConversation(data.conversation.id);
            // Reload conversations list once (not in a loop)
            await loadConversations();
            
            // Remove query params from URL
            router.replace('/account/messages', undefined, { shallow: true });
          }
        } catch (error) {
          console.error('[DynamicPanel] Error creating conversation:', error);
          console.error('[DynamicPanel] Error details:', {
            message: error.message,
            status: error.status,
            data: error.data,
            fullError: error
          });
          
          // Show detailed error to user for debugging
          const errorMsg = error.data?.error || error.data?.message || error.message || 'Unknown error';
          console.error('[DynamicPanel] Full error response:', JSON.stringify(error.data, null, 2));
          alert(`Failed to start conversation: ${errorMsg}\n\nCheck console for details.`);
        }
      }
    };
    
    handleHostQuery();
  }, [router.isReady, router.query.host, router.query.experience]); // don't depend on router object identity

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle overlay click (mobile)
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.className = "overlay";
      overlayRef.current.addEventListener('click', handleBack);
      return () => {
        if (overlayRef.current) {
          overlayRef.current.removeEventListener('click', handleBack);
        }
      };
    }
  }, []);

  return (
    <div className="container">
      <div className="content">
        <div className="sections">
          <div className="section two">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="conversations">
                  <div className="blocks" data-blocks="2">
                    <div className="block" data-block="1A">
                      <div className="title">
                        <h1 className="four">Messages</h1>
                      </div>
                    </div>
                    <div className="block" data-block="1B">
                      <div className="users">
                        <div className="blocks" data-blocks="3">
                          {conversations.length === 0 ? (
                            <div className="block" data-block="1BA">
                              <div className="user">
                                <div className="blocks" data-blocks="4">
                                  <div className="block" data-block="1BAB">
                                    <div className="text">
                                      <span className="one">No conversations yet</span>
                                      <span className="two">Start a conversation with a host</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            conversations.map((conv, idx) => (
                              <div
                                key={conv.id}
                                className={`block ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                                data-block="1BA"
                                onClick={() => handleSelectConversation(conv)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="user">
                                  <div className="blocks" data-blocks="4">
                                    <div className="block" data-block="1BAA">
                                      <div className="images">
                                        <div className="blocks" data-blocks="5">
                                          {conv.experience?.image && (
                                            <div className="block" data-block="1BAAA">
                                              <div
                                                className="image"
                                                style={{ backgroundImage: `url('${conv.experience.image}')` }}
                                              />
                                            </div>
                                          )}
                                          <div className="block" data-block="1BAAB">
                                            <div
                                              className="image"
                                              style={{ backgroundImage: `url('${conv.otherParticipant.avatar}')` }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="block" data-block="1BAB">
                                      <div className="text">
                                        <span className="one">{conv.otherParticipant.name}</span>
                                        <span className="two">
                                          {conv.lastMessage
                                            ? truncateText(conv.lastMessage.message)
                                            : conv.experience
                                            ? truncateText(conv.experience.title)
                                            : 'No messages yet'}
                                        </span>
                                        <span className="three">
                                          {conv.lastMessage
                                            ? formatConversationDate(conv.lastMessage.createdAt)
                                            : formatConversationDate(conv.lastMessageAt)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="block" data-block="2">
                <div className="conversation">
                  {selectedConversation ? (
                    <div className="blocks" data-blocks="6">
                      <div className="block" data-block="2A">
                        <div className="blocks" data-blocks="7">
                          <div className="block" data-block="2AA">
                            <div className="close">
                              <div className="button circle" data-button="2A" onClick={handleBack}>
                                <div className="action">
                                  <div className="icon">
                                    <i className="icons8 icons8-less-than"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="block" data-block="2AB">
                            <div
                              className="image"
                              style={{ backgroundImage: `url('${selectedConversation.otherParticipant.avatar}')` }}
                            />
                          </div>
                          <div className="block" data-block="2AC">
                            <div className="title">
                              <h2 className="five">{selectedConversation.otherParticipant.name}</h2>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="block" data-block="2B">
                        <div className="messages" ref={messagesContainerRef}>
                          <div className="blocks" data-blocks="8">
                            {loading ? (
                              <div className="block" data-block="2BA">
                                <div className="message">
                                  <div className="blocks" data-blocks="9">
                                    <div className="block" data-block="2BAB">
                                      <div className="text">
                                        <p className="small three">Loading messages...</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : messages.length === 0 ? (
                              <div className="block" data-block="2BA">
                                <div className="message">
                                  <div className="blocks" data-blocks="9">
                                    <div className="block" data-block="2BAB">
                                      <div className="text">
                                        <p className="small three">No messages yet. Start the conversation!</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              messages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className="block"
                                  data-block="2BA"
                                  data-user={msg.isOwn ? '2' : '1'}
                                >
                                  <div className="message">
                                    <div className="blocks" data-blocks="9">
                                      <div className="block" data-block="2BAA">
                                        <div className="text">
                                          <span>{msg.senderName}</span>
                                          <span>{formatDate(msg.createdAt)}</span>
                                          <span>{formatTime(msg.createdAt)}</span>
                                        </div>
                                      </div>
                                      <div className="block" data-block="2BAB">
                                        <div className="text">
                                          <p className="small three">{msg.message}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                            <div ref={messagesEndRef} />
                          </div>
                        </div>
                      </div>

                      <div className="block" data-block="2C">
                        <form
                          ref={sendFormRef}
                          className="form"
                          onClickCapture={(e) => {
                            // Debug: prove clicks are reaching the form area
                            alert('[SendForm] click captured on ' + (e.target?.tagName || 'unknown'));
                          }}
                          onSubmitCapture={(e) => {
                            // Absolute guard: never allow native submit navigation
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onSubmit={sendMessage}
                          noValidate
                        >
                          <div className="fields">
                            <div className="fieldset">
                              <div className="blocks" data-blocks="10">
                                {sendError && (
                                  <div className="block" data-block="2CERR">
                                    <div style={{
                                      color: 'red',
                                      marginBottom: '0.75rem',
                                      padding: '0.5rem 0.75rem',
                                      backgroundColor: '#ffebee',
                                      borderRadius: '4px',
                                      border: '1px solid #f44336'
                                    }}>
                                      {sendError}
                                    </div>
                                  </div>
                                )}
                                <div className="block" data-block="2CA">
                                  <div className="textarea">
                                    <textarea
                                      value={messageText}
                                      onChange={(e) => setMessageText(e.target.value)}
                                      placeholder="Type your message..."
                                      disabled={sending}
                                      rows={1}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          // Professional single-path submit: trigger form submit once
                                          sendFormRef.current?.requestSubmit?.();
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="block" data-block="2CB">
                                  <div className="button small" data-button="1A">
                                    <button
                                      type="button"
                                      className="action"
                                      disabled={sending}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        alert('[SendButton] onClick');
                                        sendMessage(e);
                                      }}
                                      style={{
                                        border: 'none',
                                        cursor: sending ? 'not-allowed' : 'pointer',
                                        width: '100%'
                                      }}
                                    >
                                      <div className="text">{sending ? 'Sending...' : 'Send'}</div>
                                      <div className="background"></div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="blocks" data-blocks="6">
                      <div className="block" data-block="2A">
                        <div className="blocks" data-blocks="7">
                          <div className="block" data-block="2AA">
                            <div className="close">
                              <div className="button circle" data-button="2A" style={{ opacity: 0, pointerEvents: 'none' }}>
                                <div className="action">
                                  <div className="icon">
                                    <i className="icons8 icons8-less-than"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="block" data-block="2B">
                        <div className="messages">
                          <div className="blocks" data-blocks="8">
                            <div className="block" data-block="2BA">
                              <div className="message">
                                <div className="blocks" data-blocks="9">
                                  <div className="block" data-block="2BAB">
                                    <div className="text">
                                      <p className="small three">Select a conversation to start messaging</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={overlayRef}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

