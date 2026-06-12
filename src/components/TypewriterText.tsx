import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per character
  onComplete?: () => void;
  statusType?: string;
  id?: string;
}

export default function TypewriterText({ text, speed = 12, onComplete, statusType, id }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const indexRef = useRef(0);
  const completeTriggered = useRef(false);

  // Clean and verify if the line needs to bypass delayed typewriter rendering
  const skipTypewriter = 
    statusType === 'progress' || 
    text.startsWith('[download]') || 
    text.startsWith('  ->') ||
    text.length > 500 ||
    (id ? id.toString().startsWith('start-') : false);

  useEffect(() => {
    if (skipTypewriter) {
      setDisplayedText(text);
      setIsTypingComplete(true);
      if (onComplete && !completeTriggered.current) {
        completeTriggered.current = true;
        onComplete();
      }
      return;
    }

    setDisplayedText('');
    setIsTypingComplete(false);
    indexRef.current = 0;
    completeTriggered.current = false;
    
    let timer: NodeJS.Timeout;

    const tick = () => {
      if (indexRef.current < text.length) {
        const currentText = text.slice(0, indexRef.current + 1);
        setDisplayedText(currentText);
        indexRef.current += 1;
        
        let dynamicSpeed = speed;
        // Make longer sequences type out snappier to avoid stacking delays
        if (text.length > 150) {
          dynamicSpeed = Math.max(1, speed / 5);
        } else if (text.length > 60) {
          dynamicSpeed = Math.max(3, speed / 2);
        }
        
        timer = setTimeout(tick, dynamicSpeed);
      } else {
        setIsTypingComplete(true);
        if (onComplete && !completeTriggered.current) {
          completeTriggered.current = true;
          onComplete();
        }
      }
    };

    timer = setTimeout(tick, speed);

    return () => {
      clearTimeout(timer);
    };
  }, [text, speed, skipTypewriter, onComplete]);

  // Sync cursor color classes to correspond cleanly with CMD terminal status types
  const getCursorColor = () => {
    switch (statusType) {
      case 'prompt': return 'bg-slate-300';
      case 'system': return 'bg-blue-400';
      case 'progress': return 'bg-yellow-400';
      case 'error': return 'bg-rose-400';
      case 'success': return 'bg-emerald-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <span className="inline-flex items-center flex-wrap">
      <span className="whitespace-pre-wrap break-all">{displayedText}</span>
      {!isTypingComplete && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className={`ml-0.5 inline-block w-1.5 h-3 shrink-0 select-none align-middle ${getCursorColor()}`}
        />
      )}
    </span>
  );
}
