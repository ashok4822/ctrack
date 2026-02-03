import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! I\'m your CTrack support assistant. How can I help you today? I can assist with:\n\n• Container tracking\n• Request status\n• Billing inquiries\n• Stuffing/Destuffing\n• Gate operations',
    role: 'assistant',
    timestamp: new Date(),
  },
];

// Simple AI responses based on keywords
const getAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('track') || lowerMessage.includes('container')) {
    return 'To track your container, please go to "My Containers" section where you can see all containers linked to your account. You can also use "Transit Tracking" to view real-time checkpoint updates. Would you like me to guide you there?';
  }
  
  if (lowerMessage.includes('request') || lowerMessage.includes('status')) {
    return 'You can view all your requests and their status in the "Requests Listing" section. Each request shows the current status (Pending, Approved, Rejected, In-Progress, Completed). Do you need help with a specific request?';
  }
  
  if (lowerMessage.includes('bill') || lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
    return 'For billing inquiries, please visit the "Bills" section. You can view all pending and paid bills, and make payments using PDA (Pre-Deposit Account) or Online Payment methods. Is there a specific bill you need help with?';
  }
  
  if (lowerMessage.includes('stuff') || lowerMessage.includes('destuff') || lowerMessage.includes('cargo')) {
    return 'For stuffing/destuffing operations:\n\n1. Go to "Request Container"\n2. Choose "Empty for Stuffing" or "Loaded for Destuffing"\n3. Fill in the cargo details and submit\n\nYour request will be processed by the terminal operator. Need more details?';
  }
  
  if (lowerMessage.includes('gate') || lowerMessage.includes('movement')) {
    return 'To request a gate-out movement, go to the "Movements" section and click "Request Movement". Fill in the vehicle details, destination, and preferred date. The terminal will process your request.';
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return 'I\'m here to help! You can ask me about:\n\n• Container tracking & status\n• Stuffing/Destuffing requests\n• Gate-out movements\n• Bills & payments\n• Request status updates\n\nWhat would you like to know?';
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! How can I assist you today? Feel free to ask about your containers, requests, billing, or any other terminal services.';
  }
  
  if (lowerMessage.includes('thank')) {
    return 'You\'re welcome! Is there anything else I can help you with?';
  }
  
  return 'I understand you need assistance. Could you please provide more details about your query? I can help with container tracking, requests, billing, stuffing/destuffing operations, and gate movements.';
};

export function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="pb-3 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Support Assistant</CardTitle>
                  <p className="text-xs text-primary-foreground/70">Online • Ready to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 border-t">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSend} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
