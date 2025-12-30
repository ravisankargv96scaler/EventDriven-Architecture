import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Server, 
  Mail, 
  ArrowRight, 
  Database, 
  Users, 
  ShoppingCart, 
  Truck, 
  Bell, 
  BarChart3, 
  CheckCircle, 
  Play, 
  RotateCcw,
  Zap,
  Cpu,
  Loader2,
  Box,
  Radio
} from 'lucide-react';

// --- Shared Components ---

const Card = ({ children, className = "", title = null }) => (
  <div className={`bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 shadow-xl ${className}`}>
    {title && <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">{title}</h3>}
    {children}
  </div>
);

const Button = ({ onClick, disabled = false, children, variant = "primary", className = "" }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- Tab 1: Request vs Event ---

const Tab1_Intro = () => {
  // Request/Response State
  const [reqLoading, setReqLoading] = useState(false);
  const [reqData, setReqData] = useState<string | null>(null);

  // Event Driven State
  const [eventStatus, setEventStatus] = useState<"idle" | "sent" | "processing" | "done">("idle");
  const [consumerLog, setConsumerLog] = useState<string[]>([]);

  const handleRequest = () => {
    setReqLoading(true);
    setReqData(null);
    // Simulate Blocking Call
    setTimeout(() => {
      setReqData("Data Received (200 OK)");
      setReqLoading(false);
    }, 2000);
  };

  const handleEvent = () => {
    setEventStatus("sent");
    // Simulate Async Processing
    setTimeout(() => {
      setEventStatus("processing");
      setTimeout(() => {
        setEventStatus("done");
        setConsumerLog(prev => [...prev, `Event Processed at ${new Date().toLocaleTimeString()}`]);
        setTimeout(() => setEventStatus("idle"), 2000); // Reset for visual cleanliness
      }, 1500);
    }, 500);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Request / Response */}
      <Card title="Traditional: Request / Response" className="border-l-4 border-l-red-500">
        <div className="space-y-6">
          <p className="text-slate-400 text-sm">Synchronous. The caller must wait (block) until the receiver responds.</p>
          
          <div className="flex justify-between items-center bg-slate-950 p-6 rounded-lg relative">
            {/* Caller */}
            <div className={`flex flex-col items-center transition-opacity ${reqLoading ? 'opacity-50' : 'opacity-100'}`}>
              <Users className="w-10 h-10 text-slate-400 mb-2" />
              <span className="text-xs text-slate-500">Client</span>
            </div>

            {/* Connection Line */}
            <div className="flex-1 h-1 bg-slate-800 mx-4 relative">
              {reqLoading && (
                <div className="absolute inset-0 bg-red-500/50 animate-pulse"></div>
              )}
            </div>

            {/* Server */}
            <div className="flex flex-col items-center">
              <Server className={`w-10 h-10 mb-2 transition-colors ${reqLoading ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-xs text-slate-500">Service B</span>
            </div>
          </div>

          <div className="flex justify-center flex-col items-center gap-2 h-20">
             {reqLoading ? (
               <div className="flex items-center gap-2 text-red-400">
                 <Loader2 className="animate-spin" /> Waiting for response...
               </div>
             ) : (
               reqData ? <span className="text-green-400 font-bold">{reqData}</span> : <span className="text-slate-600">Idle</span>
             )}
          </div>

          <Button onClick={handleRequest} disabled={reqLoading} className="w-full">
            Make Sync Request
          </Button>
        </div>
      </Card>

      {/* Event Driven */}
      <Card title="Event-Driven Architecture" className="border-l-4 border-l-emerald-500">
        <div className="space-y-6">
          <p className="text-slate-400 text-sm">Asynchronous. Fire and forget. The client continues working immediately.</p>
          
          <div className="flex justify-between items-center bg-slate-950 p-6 rounded-lg relative overflow-hidden">
            {/* Producer */}
            <div className="flex flex-col items-center z-10">
              <Users className={`w-10 h-10 mb-2 transition-colors ${eventStatus === 'sent' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-xs text-slate-500">Producer</span>
            </div>

            {/* Broker/Queue Animation */}
            <div className="flex-1 mx-4 relative h-12 flex items-center justify-center">
               <div className="w-full h-1 bg-slate-800 absolute"></div>
               {/* Flying Packet */}
               <div className={`absolute transition-all duration-700 ease-in-out p-2 rounded-full bg-cyan-900 border border-cyan-500 text-cyan-400
                  ${eventStatus === 'idle' ? 'left-0 opacity-0' : ''}
                  ${eventStatus === 'sent' ? 'left-[40%] opacity-100 scale-110' : ''}
                  ${eventStatus === 'processing' ? 'left-[80%] opacity-100' : ''}
                  ${eventStatus === 'done' ? 'left-[100%] opacity-0' : ''}
               `}>
                 <Mail size={16} />
               </div>
            </div>

            {/* Consumer */}
            <div className="flex flex-col items-center z-10">
              <Server className={`w-10 h-10 mb-2 transition-colors ${eventStatus === 'processing' ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-xs text-slate-500">Consumer</span>
            </div>
          </div>

          <div className="h-20 bg-slate-950 rounded p-2 overflow-y-auto text-xs font-mono border border-slate-800">
            {consumerLog.length === 0 && <span className="text-slate-600 italic">No events processed yet...</span>}
            {consumerLog.map((log, i) => (
              <div key={i} className="text-cyan-400 mb-1">> {log}</div>
            ))}
          </div>

          <Button onClick={handleEvent} variant="success" className="w-full" disabled={eventStatus !== 'idle'}>
            {eventStatus === 'idle' ? 'Publish Event' : 'Client is Free!'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

// --- Tab 2: Core Components ---

const Tab2_Components = () => {
  // Steps: 0: Idle, 1: Producer->Broker, 2: In Broker, 3: Broker->Consumer, 4: Done
  const [step, setStep] = useState(0);

  const runSimulation = () => {
    setStep(1);
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 2500);
    setTimeout(() => setStep(4), 3500);
    setTimeout(() => setStep(0), 5000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4 text-center mb-8">
        <div className={`p-4 border rounded-xl transition-all ${step === 0 || step === 1 ? 'border-purple-500 bg-purple-500/10' : 'border-slate-800 bg-slate-900'}`}>
          <h4 className="text-purple-400 font-bold mb-2">1. Producer</h4>
          <p className="text-xs text-slate-400">The source that detects a change and creates the event.</p>
        </div>
        <div className={`p-4 border rounded-xl transition-all ${step === 2 ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900'}`}>
          <h4 className="text-amber-400 font-bold mb-2">2. Broker</h4>
          <p className="text-xs text-slate-400">The middleware (like Kafka/RabbitMQ) that queues and routes messages.</p>
        </div>
        <div className={`p-4 border rounded-xl transition-all ${step === 3 || step === 4 ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900'}`}>
          <h4 className="text-emerald-400 font-bold mb-2">3. Consumer</h4>
          <p className="text-xs text-slate-400">The service that listens for events and reacts to them.</p>
        </div>
      </div>

      {/* Assembly Line Visual */}
      <div className="relative h-48 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center px-12">
        {/* Track */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-800 -translate-y-1/2"></div>
        
        {/* Components */}
        <div className="w-full flex justify-between relative z-10">
          <div className="w-24 h-24 bg-slate-900 border-2 border-purple-500 rounded-lg flex flex-col items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Users size={32} className="text-purple-400" />
            <span className="text-[10px] mt-2 text-purple-200">User Sign Up</span>
          </div>

          <div className="w-32 h-24 bg-slate-900 border-2 border-amber-500 rounded-lg flex flex-col items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Database size={32} className="text-amber-400" />
            <span className="text-[10px] mt-2 text-amber-200">Message Queue</span>
          </div>

          <div className="w-24 h-24 bg-slate-900 border-2 border-emerald-500 rounded-lg flex flex-col items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Mail size={32} className="text-emerald-400" />
            <span className="text-[10px] mt-2 text-emerald-200">Email Svc</span>
          </div>
        </div>

        {/* The Event Packet */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ease-in-out"
          style={{
            left: step === 0 ? '10%' : step === 1 ? '50%' : step === 2 ? '50%' : step === 3 ? '90%' : '90%',
            opacity: step === 0 ? 0 : 1,
            transform: `translate(-50%, -50%) ${step === 2 ? 'scale(0.8)' : 'scale(1)'}`
          }}
        >
          <div className="bg-white text-slate-900 p-3 rounded-md shadow-xl flex items-center gap-2 font-bold whitespace-nowrap">
            <Box size={16} className="text-purple-600" />
            <span className="text-xs">Event: UserCreated</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={runSimulation} disabled={step !== 0} className="px-8 py-4 text-lg">
          {step === 0 ? "Generate 'New User' Event" : "Processing..."}
        </Button>
      </div>
    </div>
  );
};

// --- Tab 3: Pub/Sub ---

const Tab3_PubSub = () => {
  const [subs, setSubs] = useState({
    subA: { topic: 'sports', active: true },
    subB: { topic: 'tech', active: true },
    subC: { topic: 'tech', active: true },
  });
  
  const [publishing, setPublishing] = useState<string | null>(null); // 'sports' or 'tech'

  const handlePublish = (topic) => {
    if (publishing) return;
    setPublishing(topic);
    setTimeout(() => setPublishing(null), 2000);
  };

  const toggleSub = (id) => {
    setSubs(prev => ({
      ...prev,
      [id]: { ...prev[id], active: !prev[id].active }
    }));
  };

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Publisher Section */}
      <div className="flex justify-center gap-4">
        <Button onClick={() => handlePublish('sports')} disabled={!!publishing} className="bg-orange-600 hover:bg-orange-500">
          Publish "Game Score" (Sports)
        </Button>
        <Button onClick={() => handlePublish('tech')} disabled={!!publishing} className="bg-blue-600 hover:bg-blue-500">
          Publish "New AI Model" (Tech)
        </Button>
      </div>

      {/* Broker Pipes */}
      <div className="relative flex-1 bg-slate-900/50 rounded-xl border border-slate-800 p-8 flex justify-center gap-20">
        
        {/* Pipe: Sports */}
        <div className="relative w-16 bg-slate-800/50 rounded-full h-64 border-2 border-orange-900 flex flex-col items-center">
            <span className="mt-2 text-xs font-bold text-orange-500 tracking-widest uppercase rotate-90 origin-center translate-y-8">Sports</span>
            {publishing === 'sports' && (
              <div className="absolute top-0 w-10 h-10 bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.8)] animate-[float_2s_linear_infinite]" 
                   style={{ animationName: 'drop' }} />
            )}
        </div>

        {/* Pipe: Tech */}
        <div className="relative w-16 bg-slate-800/50 rounded-full h-64 border-2 border-blue-900 flex flex-col items-center">
            <span className="mt-2 text-xs font-bold text-blue-500 tracking-widest uppercase rotate-90 origin-center translate-y-8">Tech</span>
             {publishing === 'tech' && (
              <div className="absolute top-0 w-10 h-10 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-[float_2s_linear_infinite]" 
                   style={{ animationName: 'drop' }} />
            )}
        </div>

        {/* Inline style for the drop animation */}
        <style>{`
          @keyframes drop {
            0% { top: 0; opacity: 1; }
            90% { top: 90%; opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}</style>
      </div>

      {/* Subscribers */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { id: 'subA', label: 'Sub A', topic: 'sports', color: 'orange' },
          { id: 'subB', label: 'Sub B', topic: 'tech', color: 'blue' },
          { id: 'subC', label: 'Sub C', topic: 'tech', color: 'blue' },
        ].map((sub) => {
          const isActive = subs[sub.id].active;
          const isReceiving = publishing === sub.topic && isActive;
          
          return (
            <div key={sub.id} 
              className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center
                ${isReceiving ? `bg-${sub.color}-500/20 border-${sub.color}-400 scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]` : 
                  isActive ? 'bg-slate-900 border-slate-700' : 'bg-slate-950 border-slate-900 opacity-50'}
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                 <input 
                   type="checkbox" 
                   checked={isActive} 
                   onChange={() => toggleSub(sub.id)}
                   className="w-4 h-4"
                 />
                 <span className="font-bold text-slate-200">{sub.label}</span>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full border ${
                sub.topic === 'sports' ? 'border-orange-900 text-orange-400 bg-orange-950/30' : 'border-blue-900 text-blue-400 bg-blue-950/30'
              }`}>
                Topic: {sub.topic}
              </div>
              
              <div className={`mt-4 h-8 flex items-center justify-center font-bold transition-opacity ${isReceiving ? 'opacity-100' : 'opacity-0'}`}>
                <span className={sub.topic === 'sports' ? 'text-orange-400' : 'text-blue-400'}>
                  RECEIVED!
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Tab 4: Event Sourcing ---

const Tab4_EventSourcing = () => {
  const [events, setEvents] = useState<{id: number, type: string, amount: number}[]>([]);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [replaying, setReplaying] = useState(false);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);

  const addEvent = (amount: number) => {
    if (replaying) return;
    const newEvent = {
      id: Date.now(),
      type: amount > 0 ? 'DEPOSIT' : 'WITHDRAW',
      amount
    };
    setEvents([...events, newEvent]);
    // Note: In strict Event Sourcing, we technically only calculate on read, 
    // but for UX we usually show current state. Here we won't update displayBalance
    // automatically to enforce the "Replay" concept, or we can, but let's 
    // keep the display at 0 or "Stale" until Replay is hit to drive the point home?
    // Actually, typically systems project immediately. Let's show "Projected State" vs "Replay".
    // For this demo, let's keep DisplayBalance synced normally, but show the REPLAY animation clearly.
    setDisplayBalance(prev => prev + amount); 
  };

  const handleReplay = async () => {
    setReplaying(true);
    setDisplayBalance(0);
    setActiveEventId(null);
    
    // Slight pause before starting
    await new Promise(r => setTimeout(r, 500));

    let current = 0;
    for (const evt of events) {
      setActiveEventId(evt.id);
      await new Promise(r => setTimeout(r, 800)); // Wait 800ms per event
      current += evt.amount;
      setDisplayBalance(current);
    }
    
    setActiveEventId(null);
    setReplaying(false);
  };

  const clearEvents = () => {
    setEvents([]);
    setDisplayBalance(0);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 h-full">
      {/* Event Log Section */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 mb-4">
          <Button onClick={() => addEvent(100)} disabled={replaying} variant="success" className="flex-1">
            +$100
          </Button>
          <Button onClick={() => addEvent(-30)} disabled={replaying} className="bg-red-600 hover:bg-red-500 text-white flex-1">
            -$30
          </Button>
          <Button onClick={() => addEvent(50)} disabled={replaying} variant="success" className="flex-1">
            +$50
          </Button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl flex-1 p-4 overflow-y-auto max-h-[400px]">
          <h4 className="text-slate-400 text-xs font-bold uppercase mb-4 tracking-wider flex justify-between items-center">
            Event Store (Ledger)
            <button onClick={clearEvents} disabled={replaying} className="text-red-400 hover:text-red-300">Clear</button>
          </h4>
          
          <div className="space-y-3">
            {events.length === 0 && <p className="text-slate-600 italic text-center py-10">No events recorded.</p>}
            {events.map((evt, idx) => (
              <div 
                key={evt.id}
                className={`p-3 rounded border transition-all duration-300 flex justify-between items-center
                  ${activeEventId === evt.id 
                    ? 'bg-cyan-900/50 border-cyan-500 scale-105' 
                    : 'bg-slate-900 border-slate-800 text-slate-400'}
                `}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-500">#{idx + 1} {evt.id.toString().slice(-4)}</span>
                  <span className={`font-bold ${evt.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {evt.type}
                  </span>
                </div>
                <span className="font-mono text-lg">{evt.amount > 0 ? '+' : ''}{evt.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* State Projection Section */}
      <div className="flex flex-col justify-center items-center bg-slate-900/30 rounded-xl border border-dashed border-slate-700 p-8 relative overflow-hidden">
        {replaying && <div className="absolute inset-0 bg-cyan-500/5 animate-pulse"></div>}
        
        <h3 className="text-slate-400 uppercase tracking-widest text-sm mb-8">Calculated State (Balance)</h3>
        
        <div className={`text-6xl font-bold font-mono transition-all duration-300 ${activeEventId ? 'scale-110 text-cyan-400' : 'text-white'}`}>
          ${displayBalance}
        </div>

        <p className="mt-8 text-slate-500 text-center text-sm max-w-xs">
          State is not just a value in a database column. It is derived by replaying all past events.
        </p>

        <Button onClick={handleReplay} disabled={replaying || events.length === 0} className="mt-8 w-full max-w-xs" variant="primary">
          {replaying ? <><Loader2 className="animate-spin" /> Replaying...</> : <><RotateCcw size={18} /> Replay Events</>}
        </Button>
      </div>
    </div>
  );
};

// --- Tab 5: E-commerce Saga ---

const Tab5_Ecommerce = () => {
  const [status, setStatus] = useState<"idle" | "fired" | "propagating" | "complete">("idle");

  const triggerOrder = () => {
    setStatus("fired");
    setTimeout(() => setStatus("propagating"), 600);
    setTimeout(() => setStatus("complete"), 1600);
    setTimeout(() => setStatus("idle"), 4000);
  };

  const ServiceNode = ({ icon: Icon, label, action, position }) => {
    const isActive = status === 'complete';
    const isPropagating = status === 'propagating' || status === 'complete';
    
    // Tailwind classes for positioning
    const posStyles = {
      top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-8',
      bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-8',
      left: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-8',
      right: 'right-0 top-1/2 -translate-y-1/2 translate-x-full ml-8',
    };

    return (
      <>
        {/* The Node */}
        <div className={`absolute ${posStyles[position]} flex flex-col items-center w-32 transition-all duration-500 ${isActive ? 'opacity-100 scale-110' : 'opacity-40 scale-100'}`}>
           <div className={`p-4 rounded-full border-2 mb-2 bg-slate-900 shadow-xl z-20 ${isActive ? 'border-cyan-400 shadow-cyan-500/30' : 'border-slate-700'}`}>
             <Icon size={24} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
           </div>
           <span className="text-slate-300 font-bold text-sm">{label}</span>
           <span className={`text-xs transition-opacity duration-300 ${isActive ? 'opacity-100 text-cyan-400' : 'opacity-0'}`}>{action}</span>
        </div>

        {/* The Connector Line */}
        <div 
           className={`absolute z-0 bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-700 ease-out origin-center`}
           style={{
             top: '50%', left: '50%',
             height: '4px',
             width: isPropagating ? '140px' : '0px',
             transform: 
               position === 'top' ? 'translate(-50%, -50%) rotate(-90deg) translate(70px)' :
               position === 'bottom' ? 'translate(-50%, -50%) rotate(90deg) translate(70px)' :
               position === 'left' ? 'translate(-50%, -50%) rotate(180deg) translate(70px)' :
               'translate(-50%, -50%) translate(70px)', // right
             opacity: isPropagating ? 1 : 0
           }}
        ></div>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-[500px]">
      <div className="relative w-20 h-20">
        
        {/* Central Broker / Trigger */}
        <button 
          onClick={triggerOrder}
          disabled={status !== 'idle'}
          className={`relative z-30 w-full h-full rounded-full flex flex-col items-center justify-center border-4 shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all duration-200
            ${status === 'idle' ? 'bg-purple-600 border-purple-400 hover:scale-105 cursor-pointer' : 'bg-slate-800 border-purple-900 cursor-default scale-95'}
          `}
        >
          {status === 'idle' ? <ShoppingCart className="text-white" size={32} /> : <CheckCircle className="text-purple-500" size={32} />}
        </button>
        {status === 'idle' && <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-purple-400 font-bold animate-pulse">Click to Buy</span>}

        {/* Pulse Ring */}
        {status === 'fired' && (
           <div className="absolute inset-0 rounded-full border-4 border-purple-500 animate-ping z-10"></div>
        )}

        {/* Satellites */}
        <ServiceNode icon={Box} label="Inventory" action="-1 Item Stock" position="top" />
        <ServiceNode icon={Truck} label="Shipping" action="Label Created" position="bottom" />
        <ServiceNode icon={Bell} label="Notification" action="Email Sent" position="right" />
        <ServiceNode icon={BarChart3} label="Analytics" action="Event Logged" position="left" />

      </div>
      
      <div className="mt-40 max-w-lg text-center text-slate-400 text-sm">
        <p>Decoupling in action: The "Order Service" simply publishes an event. It doesn't know or care about shipping, inventory, or analytics. They all react independently.</p>
      </div>
    </div>
  );
};

// --- Tab 6: Summary & Quiz ---

const Tab6_Quiz = () => {
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      q: "In EDA, does the producer need to know who the consumer is?",
      options: ["Yes, always", "No, they are decoupled", "Only in synchronous mode"],
      correct: 1
    },
    {
      id: 2,
      q: "Which component acts as the buffer between producers and consumers?",
      options: ["The Database", "The Client", "The Event Broker"],
      correct: 2
    },
    {
      id: 3,
      q: "In Event Sourcing, how is the current state determined?",
      options: ["By reading the last row in a table", "By replaying the event log", "By asking the user"],
      correct: 1
    }
  ];

  const handleSelect = (qId, optionIdx) => {
    if (showResults) return;
    setAnswers(prev => ({...prev, [qId]: optionIdx}));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) score++;
    });
    return score;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Test Your Knowledge</h2>
        {questions.map((q) => {
          const isCorrect = answers[q.id] === q.correct;
          const isWrong = showResults && answers[q.id] !== undefined && answers[q.id] !== q.correct;
          
          return (
            <Card key={q.id} className={`transition-colors ${showResults ? (isCorrect ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-red-500/50 bg-red-900/10') : ''}`}>
              <h4 className="text-lg font-medium text-slate-200 mb-4">{q.q}</h4>
              <div className="space-y-2">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(q.id, idx)}
                    className={`w-full text-left p-3 rounded-lg border flex items-center gap-3 transition-all
                      ${answers[q.id] === idx 
                        ? 'bg-slate-700 border-cyan-500 text-cyan-50' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}
                    `}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                       ${answers[q.id] === idx ? 'border-cyan-400 bg-cyan-400' : 'border-slate-500'}
                    `}>
                      {answers[q.id] === idx && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    {opt}
                    {showResults && idx === q.correct && <CheckCircle size={16} className="text-emerald-400 ml-auto" />}
                  </button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {!showResults ? (
        <Button onClick={() => setShowResults(true)} className="w-full py-4 text-lg font-bold" disabled={Object.keys(answers).length < 3}>
          Submit Answers
        </Button>
      ) : (
        <div className="text-center p-6 bg-slate-800 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-slate-400 uppercase tracking-widest text-sm mb-2">Final Score</p>
          <div className="text-5xl font-bold text-white mb-4">
            {calculateScore()} / {questions.length}
          </div>
          <p className="text-slate-300">
            {calculateScore() === 3 ? "Excellent! You are an Event-Driven Architect." : "Good try! Review the concepts and try again."}
          </p>
          <Button onClick={() => {setShowResults(false); setAnswers({});}} variant="secondary" className="mt-6">
            Reset Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

// --- Main App & Navigation ---

const App = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "What is EDA?", icon: Zap, component: Tab1_Intro },
    { title: "Core Components", icon: Cpu, component: Tab2_Components },
    { title: "Pub/Sub Pattern", icon: Users, component: Tab3_PubSub },
    { title: "Event Sourcing", icon: RotateCcw, component: Tab4_EventSourcing },
    { title: "Real World Demo", icon: ShoppingCart, component: Tab5_Ecommerce },
    { title: "Quiz", icon: CheckCircle, component: Tab6_Quiz },
  ];

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              EventDriven<span className="text-slate-500 font-medium">.edu</span>
            </h1>
          </div>
          <span className="text-xs text-slate-500 border border-slate-800 rounded-full px-3 py-1">Interactive Learning Module</span>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-1 py-2 min-w-max">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeTab === idx 
                      ? 'bg-slate-800 text-cyan-400 shadow-lg shadow-cyan-900/20 ring-1 ring-cyan-500/50' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}
                  `}
                >
                  <Icon size={16} />
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ActiveComponent />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-12 py-8 text-center text-slate-600 text-sm">
        <p>© 2024 Event Driven Architectures. Built for educational purposes.</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);