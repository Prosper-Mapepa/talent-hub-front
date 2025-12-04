"use client"

import { useEffect, useState, useRef, Suspense } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchConversations, createConversation, fetchMessages, sendMessage } from '@/lib/slices/messagesSlice';
import ProtectedRoute from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, Search } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { fetchStudents, fetchStudentById } from '@/lib/slices/studentsSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function MessagesPageContent() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { conversations, messages, isLoading, error } = useAppSelector((state) => state.messages);
  const { students, isLoading: studentsLoading } = useAppSelector((state) => state.students);

  const [selectedConversation, setSelectedConversation] = useState<{ id: string; participants?: Array<{ id: string; firstName?: string; lastName?: string; email?: string; profileImage?: string }>; lastMessage?: { content: string; createdAt: string } } | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);

  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const isDirectChat = Boolean(studentId);
  const router = useRouter();

  // Find the student and their user.id for direct chat
  const student = students.find(s => s.id === studentId);
  const otherUserId = student?.user?.id;

  // Simple helper functions
  const getParticipantName = (conversation: { participants?: Array<{ id: string; firstName?: string; lastName?: string; role?: string }> }, currentUserId: string) => {
    if (!conversation?.participants || !Array.isArray(conversation.participants)) {
      return 'Unknown User';
    }
    
    const otherParticipant = conversation.participants.find((p: { id: string; role?: string }) => p?.id !== currentUserId);
    if (!otherParticipant || !otherParticipant.id) {
      return 'Unknown User';
    }
    
    if ((otherParticipant as { role?: string }).role === 'student') {
      const studentRecord = students?.find(s => s?.user?.id === otherParticipant.id);
      if (studentRecord) {
        return `${studentRecord.firstName} ${studentRecord.lastName}`;
      }
    } else if (otherParticipant.role === 'business') {
      return (otherParticipant as { email?: string }).email || 'Business User';
    }
    
    return (otherParticipant as { email?: string }).email || 'Unknown User';
  };

  const getParticipantInitials = (conversation: any, currentUserId: string) => {
    if (!conversation?.participants || !Array.isArray(conversation.participants)) {
      return 'U';
    }
    
    const otherParticipant = conversation.participants.find((p: any) => p?.id !== currentUserId);
    if (!otherParticipant || !otherParticipant.id) {
      return 'U';
    }
    
    if (otherParticipant.role === 'student') {
      const studentRecord = students?.find(s => s?.user?.id === otherParticipant.id);
      if (studentRecord) {
        return getUserInitials(studentRecord.firstName, studentRecord.lastName);
      }
    } else if (otherParticipant.role === 'business') {
      return otherParticipant.email ? otherParticipant.email[0].toUpperCase() : 'B';
    }
    
    return 'U';
  };

  // Single useEffect for data fetching
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations(user.id));
    }
    dispatch(fetchStudents());
    if (studentId) {
      dispatch(fetchStudentById(studentId));
    }
  }, [dispatch, studentId, user?.id]);

  // Handle conversation selection for direct chat
  useEffect(() => {
    if (studentId && user?.id && otherUserId && Array.isArray(conversations)) {
      const convo = conversations.find(conversation =>
        conversation.participants && Array.isArray(conversation.participants) && 
        conversation.participants.some((p: any) => p.id === otherUserId)
      );
      
      if (convo && !selectedConversation) {
        setSelectedConversation(convo);
        dispatch(fetchMessages(convo.id));
      } else if (!convo && !selectedConversation) {
        // Create conversation if it doesn't exist
        dispatch(createConversation([user.id, otherUserId]))
          .unwrap()
          .then((response) => {
            if (response && response.id) {
              setSelectedConversation(response);
              dispatch(fetchMessages(response.id));
            }
          })
          .catch(() => {
            // Error handling - could show toast here
          });
      }
    }
  }, [conversations, studentId, user?.id, otherUserId, selectedConversation, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    dispatch(fetchMessages(conversation.id));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      // Send to server using Redux thunk
      await dispatch(sendMessage({ 
        conversationId: selectedConversation.id, 
        content: messageContent 
      })).unwrap();

      // Fetch updated messages to ensure we have the latest
      dispatch(fetchMessages(selectedConversation.id));
      
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = (Array.isArray(conversations) ? conversations : []).filter((conversation: any) => {
    if (!conversation.participants || !Array.isArray(conversation.participants)) {
      return false;
    }
    const participantName = getParticipantName(conversation, user?.id || '');
    return participantName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Deduplicate conversations by participant
  const uniqueConversations = filteredConversations.reduce((acc: any[], conversation: any) => {
    const participantId = conversation.participants?.find((p: any) => p.id !== user?.id)?.id;
    
    // Check if we already have a conversation with this participant
    const existingIndex = acc.findIndex(c => 
      c.participants?.find((p: any) => p.id !== user?.id)?.id === participantId
    );
    
    if (existingIndex === -1) {
      // Add new conversation
      acc.push(conversation);
    } else {
      // Keep the most recent conversation
      const existing = acc[existingIndex];
      if (new Date(conversation.updatedAt) > new Date(existing.updatedAt)) {
        acc[existingIndex] = conversation;
      }
    }
    
    return acc;
  }, []);

  // Update the formatTime function to show actual time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    // Show actual date and time for older messages
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return 'U';
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  // Loading states
  if (isDirectChat && studentId && !otherUserId) {
    if (studentsLoading) {
      return (
        <ProtectedRoute>
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading student info...</span>
          </div>
        </ProtectedRoute>
      );
    }
    
    // If we have students but no user data for the student, show error
    if (student && !student.user) {
      return (
        <ProtectedRoute>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Student Data Error</h2>
              <p className="text-gray-600 mb-4">Unable to load student user information.</p>
              <Button 
                onClick={() => router.back()}
                className="bg-[#8F1A27] text-white hover:bg-[#6D0432]"
              >
                Go Back
              </Button>
            </div>
          </div>
        </ProtectedRoute>
      );
    }
  }

  if (isLoading && conversations.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading conversations...</span>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Toaster position="top-right" />
        <div className="w-full px-4 md:px-8 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-[#8F1A27] leading-tight">
                Messages
              </h1>
              <p className="text-base text-gray-600 font-medium">
                Connect with CMU Community
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                // Route based on user role
                if (user?.role === 'business') {
                  router.push('/business-dashboard');
                } else {
                  router.push('/dashboard');
                }
              }} 
              className="bg-white text-[#8F1A27] hover:bg-[#8F1A27] hover:text-white border-[#8F1A27] rounded-xl font-semibold px-6 py-2 transition-all duration-200 hover:shadow-lg"
            >
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
            {/* Conversations List */}
            {!isDirectChat && (
              <Card className="lg:col-span-1 border-0 shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-900">Conversations</CardTitle>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-2 text-sm rounded-lg border-gray-200 focus:border-[#8F1A27] focus:ring-[#8F1A27]"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#8F1A27]" />
                    </div>
                  ) : error ? (
                    <Alert variant="destructive" className="m-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="max-h-[500px] overflow-y-auto">
                      {uniqueConversations.length > 0 ? (
                        <div className="space-y-1 p-2">
                          {uniqueConversations.map((conversation) => {
                            const participantName = getParticipantName(conversation, user?.id || '');
                            const participantInitials = getParticipantInitials(conversation, user?.id || '');
                            
                            // Get student info for profile picture
                            const otherParticipant = conversation.participants?.find((p: any) => p?.id !== user?.id);
                            const studentRecord = otherParticipant?.id ? students.find(s => s.user?.id === otherParticipant.id) : null;
                            
                            // Debug logging
                            if (studentRecord?.profileImage) {
                              console.log('Student profile image:', studentRecord.profileImage);
                              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                              let imagePath = studentRecord.profileImage;
                              
                              // Clean the path - remove any leading slashes
                              if (imagePath.startsWith('/')) {
                                imagePath = imagePath.substring(1);
                              }
                              
                              // If the path already includes uploads/profiles/, use it as is
                              if (imagePath.startsWith('uploads/profiles/')) {
                                console.log('Full URL:', `${apiUrl}/${imagePath}`);
                              } else {
                                console.log('Full URL:', `${apiUrl}/uploads/profiles/${imagePath}`);
                              }
                            }
                            
                            return (
                              <div
                                key={conversation.id}
                                className={`p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-all duration-200 ${
                                  selectedConversation?.id === conversation.id ? 'bg-[#8F1A27]/10 border border-[#8F1A27]/20' : ''
                                }`}
                                onClick={() => handleSelectConversation(conversation)}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="relative h-10 w-10 rounded-full border border-gray-200 overflow-hidden bg-[#8F1A27] flex items-center justify-center">
                                    {studentRecord?.profileImage ? (
                                      <Image
                                        src={(() => {
                                          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                                          let imagePath = studentRecord.profileImage;
                                          
                                          // Clean the path - remove any leading slashes
                                          if (imagePath.startsWith('/')) {
                                            imagePath = imagePath.substring(1);
                                          }
                                          
                                          // If the path already includes uploads/profiles/, use it as is
                                          if (imagePath.startsWith('uploads/profiles/')) {
                                            return `${apiUrl}/${imagePath}`;
                                          }
                                          
                                          // If it's just a filename, add the profiles directory
                                          return `${apiUrl}/uploads/profiles/${imagePath}`;
                                        })()}
                                        alt={participantName}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                          console.log('Profile image failed to load:', studentRecord.profileImage);
                                        }}
                                        unoptimized
                                        crossOrigin="anonymous"
                                      />
                                    ) : (
                                      <span className="text-white font-semibold text-sm">{participantInitials}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-semibold text-gray-900 truncate">
                                        {participantName}
                                      </p>
                                      <span className="text-xs text-gray-500">
                                        {conversation.updatedAt ? formatTime(conversation.updatedAt) : ''}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 truncate mt-1">
                                      Click to view messages
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="space-y-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                              <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                            No conversations yet
                          </p>
                              <p className="text-xs text-gray-500 mt-1">
                            Start connecting with others to see messages here
                          </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Chat Area */}
            <Card className={`${isDirectChat ? 'lg:col-span-3 flex flex-col' : 'lg:col-span-3 flex flex-col'} border-0 shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm`}>
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b border-gray-200 py-4 bg-gray-50 pt-6">
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-10 w-10 rounded-full border border-gray-200 overflow-hidden bg-[#8F1A27] flex items-center justify-center">
                          {(() => {
                            const otherParticipant = selectedConversation.participants?.find((p: any) => p?.id !== user?.id);
                            const studentRecord = otherParticipant?.id ? students.find(s => s.user?.id === otherParticipant.id) : null;
                            return (
                              <>
                                {studentRecord?.profileImage ? (
                                  <Image
                                    src={(() => {
                                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                                      let imagePath = studentRecord.profileImage;
                                      
                                      // Clean the path - remove any leading slashes
                                      if (imagePath.startsWith('/')) {
                                        imagePath = imagePath.substring(1);
                                      }
                                      
                                      // If the path already includes uploads/profiles/, use it as is
                                      if (imagePath.startsWith('uploads/profiles/')) {
                                        return `${apiUrl}/${imagePath}`;
                                      }
                                      
                                      // If it's just a filename, add the profiles directory
                                      return `${apiUrl}/uploads/profiles/${imagePath}`;
                                    })()}
                                    alt={getParticipantName(selectedConversation, user?.id || '')}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                      console.log('Profile image failed to load:', studentRecord.profileImage);
                                    }}
                                    unoptimized
                                    crossOrigin="anonymous"
                                  />
                                ) : (
                                  <span className="text-white font-semibold text-sm">
                            {getParticipantInitials(selectedConversation, user?.id || '')}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900">
                            {getParticipantName(selectedConversation, user?.id || '')}
                          </CardTitle>
                          <CardDescription className="text-[#8F1A27] font-medium text-sm">Online</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-0 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[450px]">
                      {messages[selectedConversation.id] && messages[selectedConversation.id].length > 0 ? (
                        <>
                          {messages[selectedConversation.id].map((message: any) => {
                            const isOwnMessage = message.senderId === user?.id;
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-sm break-words ${
                                    isOwnMessage
                                      ? 'bg-[#8F1A27] text-white rounded-br-none'
                                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p className={`text-xs mt-1 text-right ${
                                    isOwnMessage ? 'text-red-100' : 'text-gray-500'
                                  }`}>
                                    {formatTime(message.createdAt)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </>
                      ) : (
                        <div className="text-center text-gray-500 py-6">
                          <div className="space-y-2">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                              <Send className="h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-xs">No messages yet.</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200 flex items-center gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={isSending}
                        className="flex-1 py-2 px-3 rounded-lg border-gray-200 focus:border-[#8F1A27] focus:ring-[#8F1A27] text-sm"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isSending || !newMessage.trim()}
                        className="bg-[#8F1A27] text-white hover:bg-[#6D0432] rounded-lg px-4 py-2 transition-all duration-200 hover:shadow-lg"
                      >
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="text-center space-y-2">
                      <h2 className="text-lg font-bold text-gray-900">Select a conversation</h2>
                      <p className="text-sm text-gray-600">Choose a conversation from the list to start messaging</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <MessagesPageContent />
    </Suspense>
  );
}
