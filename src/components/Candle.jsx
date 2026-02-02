// import React, { useEffect, useRef, useState } from 'react';
// import './Candle.css';

// const Candle = ({ left }) => {
//   const [state, setState] = useState('idle'); // idle | flicker | blown
//   const isBlownRef = useRef(false); // 🔁 Ref to pause detection loop
//   const blowStartRef = useRef(null); // Keep track of blow timing

//   useEffect(() => {
//     let audioContext = null;
//     let mic = null;
//     let analyser = null;
//     let dataArray = null;

//     const detectBlow = () => {
//       audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//         mic = audioContext.createMediaStreamSource(stream);
//         analyser = audioContext.createAnalyser();
//         analyser.fftSize = 256;
//         const bufferLength = analyser.frequencyBinCount;
//         dataArray = new Uint8Array(bufferLength);
//         mic.connect(analyser);

//         const loop = () => {
//           requestAnimationFrame(loop);

//           // 🔒 Pause detection when blown
//           if (isBlownRef.current) return;

//           analyser.getByteFrequencyData(dataArray);
//           const volume = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

//           if (volume > 20) {
//             if (!blowStartRef.current) blowStartRef.current = Date.now();
//             setState('flicker');

//             if (Date.now() - blowStartRef.current > 800) {
//               // 🎉 Detected long blow
//               setState('blown');
//               isBlownRef.current = true;

//               setTimeout(() => {
//                 setState('idle');
//                 isBlownRef.current = false;
//                 blowStartRef.current = null;
//               }, 2000); // 🕒 Control your no-flame zone here (6 sec)
//             }
//           } else {
//             blowStartRef.current = null;
//             if (state !== 'blown') setState('idle');
//           }
//         };

//         loop();
//       });
//     };

//     detectBlow();
//   }, []);

//   return (
//     <div className="cake" style={{ left }}>
//       {state !== 'blown' && (
//         <>
//           <div className={`fuego ${state}`}></div>
//           <div className={`fuego ${state}`}></div>
//           <div className={`fuego ${state}`}></div>
//           <div className={`fuego ${state}`}></div>
//           <div className={`fuego ${state}`}></div>
//         </>
//       )}
//       {state === 'blown' && <div className="smoke"></div>}
//     </div>
//   );
// };

// export default Candle;



// import React, { useEffect, useRef, useState } from 'react';
// import './Candle.css';

// const Candle = ({ left, onBlow }) => {
//   const [state, setState] = useState('idle');
//   const [flameIntensity, setFlameIntensity] = useState(1);
//   const isBlownRef = useRef(false);
//   const blowStartRef = useRef(null);
//   const candleRef = useRef(null);

//   useEffect(() => {
//     let audioContext = null;
//     let mic = null;
//     let analyser = null;
//     let dataArray = null;

//     const detectBlow = () => {
//       audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
//       navigator.mediaDevices.getUserMedia({ 
//         audio: { 
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: false 
//         } 
//       }).then((stream) => {
//         mic = audioContext.createMediaStreamSource(stream);
//         analyser = audioContext.createAnalyser();
//         analyser.fftSize = 512;
//         analyser.smoothingTimeConstant = 0.8;
        
//         const bufferLength = analyser.frequencyBinCount;
//         dataArray = new Uint8Array(bufferLength);
//         mic.connect(analyser);

//         const detectBlowPattern = () => {
//           if (isBlownRef.current) return;

//           analyser.getByteFrequencyData(dataArray);
          
//           // Analyze specific frequencies for blowing sound
//           const lowFreq = dataArray.slice(0, 50).reduce((a, b) => a + b, 0) / 50;
//           const midFreq = dataArray.slice(50, 150).reduce((a, b) => a + b, 0) / 100;
          
//           // Blow detection logic
//           if (lowFreq > 30 && midFreq > 25) {
//             if (!blowStartRef.current) {
//               blowStartRef.current = Date.now();
//               setState('flicker');
//               setFlameIntensity(0.5);
//             }

//             const blowDuration = Date.now() - blowStartRef.current;
            
//             // Realistic flame intensity based on blow strength
//             const intensity = Math.min(1, Math.max(0.1, 1 - (blowDuration / 1000)));
//             setFlameIntensity(intensity);

//             if (blowDuration > 300) {
//               // Successful blow
//               setState('blown');
//               isBlownRef.current = true;
//               onBlow?.();
              
//               // Add particle effects
//               createParticles();
              
//               setTimeout(() => {
//                 setState('idle');
//                 isBlownRef.current = false;
//                 blowStartRef.current = null;
//                 setFlameIntensity(1);
//               }, 3000);
//             }
//           } else {
//             if (state === 'flicker') {
//               setState('idle');
//               setFlameIntensity(1);
//             }
//             blowStartRef.current = null;
//           }
          
//           requestAnimationFrame(detectBlowPattern);
//         };

//         detectBlowPattern();
//       }).catch(err => {
//         console.log("Microphone access error:", err);
//         // Fallback to click blow
//         candleRef.current.addEventListener('click', () => {
//           if (!isBlownRef.current) {
//             setState('blown');
//             isBlownRef.current = true;
//             onBlow?.();
//             createParticles();
            
//             setTimeout(() => {
//               setState('idle');
//               isBlownRef.current = false;
//             }, 3000);
//           }
//         });
//       });
//     };

//     detectBlow();

//     return () => {
//       if (audioContext) {
//         audioContext.close();
//       }
//     };
//   }, [onBlow]);

//   const createParticles = () => {
//     if (!candleRef.current) return;
    
//     for(let i = 0; i < 20; i++) {
//       const particle = document.createElement('div');
//       particle.className = 'sparkle';
//       particle.style.left = `${Math.random() * 20 - 10}px`;
//       particle.style.top = `${Math.random() * 20 - 10}px`;
//       particle.style.opacity = Math.random();
//       particle.style.animationDelay = `${Math.random() * 0.5}s`;
      
//       candleRef.current.appendChild(particle);
      
//       setTimeout(() => {
//         if (particle.parentNode) {
//           particle.parentNode.removeChild(particle);
//         }
//       }, 1000);
//     }
//   };

//   return (
//     <div className="candle-container" style={{ left }} ref={candleRef}>
//       <div className={`cake ${state}`}>
//         {state !== 'blown' && (
//           <div 
//             className={`fuego ${state}`}
//             style={{
//               transform: `scale(${flameIntensity})`,
//               opacity: flameIntensity
//             }}
//           >
//             <div className="flame-inner"></div>
//             <div className="flame-outer"></div>
//           </div>
//         )}
//         {state === 'blown' && (
//           <>
//             <div className="smoke"></div>
//             <div className="sparkle"></div>
//             <div className="sparkle"></div>
//             <div className="sparkle"></div>
//           </>
//         )}
//       </div>
//       <div className="candle-wick"></div>
//     </div>
//   );
// };

// export default Candle;



// import React, { useEffect, useRef, useState } from 'react';
// import './Candle.css';

// const Candle = ({ left, onBlow }) => {
//   const [state, setState] = useState('idle');
//   const [flameIntensity, setFlameIntensity] = useState(1);
//   const [glowEffect, setGlowEffect] = useState(false);
//   const [particles, setParticles] = useState([]);
  
//   const isBlownRef = useRef(false);
//   const blowStartRef = useRef(null);
//   const candleRef = useRef(null);
//   const flameRef = useRef(null);

//   useEffect(() => {
//     // Initialize candle with slight flicker
//     const randomDelay = Math.random() * 1000;
//     setTimeout(() => {
//       setGlowEffect(true);
//       createParticles(3);
//     }, randomDelay);

//     let audioContext = null;
//     let mic = null;
//     let analyser = null;
//     let dataArray = null;

//     const detectBlow = () => {
//       try {
//         audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
//         navigator.mediaDevices.getUserMedia({ 
//           audio: { 
//             echoCancellation: false,
//             noiseSuppression: false,
//             autoGainControl: false 
//           } 
//         }).then((stream) => {
//           mic = audioContext.createMediaStreamSource(stream);
//           analyser = audioContext.createAnalyser();
//           analyser.fftSize = 1024;
//           analyser.smoothingTimeConstant = 0.2;
          
//           const bufferLength = analyser.frequencyBinCount;
//           dataArray = new Uint8Array(bufferLength);
//           mic.connect(analyser);

//           const detectBlowPattern = () => {
//             if (isBlownRef.current) {
//               requestAnimationFrame(detectBlowPattern);
//               return;
//             }

//             analyser.getByteFrequencyData(dataArray);
            
//             // Enhanced blow detection
//             const blowRange = dataArray.slice(40, 200);
//             const blowIntensity = blowRange.reduce((a, b) => a + b, 0) / blowRange.length;
            
//             if (blowIntensity > 25) {
//               if (!blowStartRef.current) {
//                 blowStartRef.current = Date.now();
//                 setState('flicker');
//                 setFlameIntensity(0.6);
//                 createParticles(5);
//               }

//               const blowDuration = Date.now() - blowStartRef.current;
              
//               // Dynamic flame response
//               const intensity = Math.max(0.1, 1 - (blowDuration / 800));
//               setFlameIntensity(intensity);
              
//               // Visual feedback based on blow strength
//               if (blowIntensity > 40) {
//                 createParticles(3);
//               }

//               if (blowDuration > 400) {
//                 // Successful blow
//                 blowCandle();
//               }
//             } else {
//               if (state === 'flicker') {
//                 // Return to normal
//                 setState('idle');
//                 setFlameIntensity(1);
//               }
//               blowStartRef.current = null;
//             }
            
//             requestAnimationFrame(detectBlowPattern);
//           };

//           detectBlowPattern();
//         }).catch(err => {
//           console.log("Microphone access error:", err);
//           setupClickFallback();
//         });
//       } catch (error) {
//         console.log("Audio context error:", error);
//         setupClickFallback();
//       }
//     };

//     const setupClickFallback = () => {
//       const handleClick = (e) => {
//         if (!isBlownRef.current) {
//           e.stopPropagation();
//           blowCandle();
//         }
//       };
      
//       const handleTouch = (e) => {
//         if (!isBlownRef.current) {
//           e.stopPropagation();
//           blowCandle();
//           createParticles(10);
//         }
//       };
      
//       if (candleRef.current) {
//         candleRef.current.addEventListener('click', handleClick);
//         candleRef.current.addEventListener('touchstart', handleTouch);
        
//         return () => {
//           candleRef.current?.removeEventListener('click', handleClick);
//           candleRef.current?.removeEventListener('touchstart', handleTouch);
//         };
//       }
//     };

//     detectBlow();

//     return () => {
//       if (audioContext) {
//         audioContext.close();
//       }
//     };
//   }, [onBlow]);

//   const blowCandle = () => {
//     if (isBlownRef.current) return;
    
//     setState('blown');
//     isBlownRef.current = true;
    
//     // Create explosion of particles
//     createParticles(30);
    
//     // Visual effects
//     if (flameRef.current) {
//       flameRef.current.style.animation = 'flameOut 0.5s ease-out forwards';
//     }
    
//     // Trigger parent callback
//     setTimeout(() => onBlow?.(), 100);
    
//     // Smoke effect
//     createSmoke();
    
//     // Reset after celebration
//     setTimeout(() => {
//       setState('idle');
//       isBlownRef.current = false;
//       blowStartRef.current = null;
//       setFlameIntensity(1);
//       setGlowEffect(true);
//     }, 4000);
//   };

//   const createParticles = (count) => {
//     const newParticles = [];
//     for (let i = 0; i < count; i++) {
//       newParticles.push({
//         id: Date.now() + i + Math.random(),
//         x: Math.random() * 40 - 20,
//         y: Math.random() * 40 - 20,
//         size: Math.random() * 8 + 2,
//         color: `hsl(${Math.random() * 60 + 30}, 100%, ${Math.random() * 30 + 60}%)`,
//         duration: Math.random() * 1 + 0.5,
//         direction: {
//           x: (Math.random() - 0.5) * 2,
//           y: -(Math.random() * 2 + 1)
//         }
//       });
//     }
//     setParticles(prev => [...prev, ...newParticles]);
    
//     // Auto cleanup
//     setTimeout(() => {
//       setParticles(prev => prev.slice(count));
//     }, 2000);
//   };

//   const createSmoke = () => {
//     const smokeParticles = [];
//     for (let i = 0; i < 15; i++) {
//       smokeParticles.push({
//         id: Date.now() + i + Math.random(),
//         x: Math.random() * 30 - 15,
//         y: Math.random() * 20 - 10,
//         size: Math.random() * 20 + 10,
//         opacity: Math.random() * 0.5 + 0.3,
//         duration: Math.random() * 2 + 1
//       });
//     }
//     // Add smoke to particles
//     setParticles(prev => [...prev, ...smokeParticles]);
//   };

//   return (
//     <div 
//       className={`candle-container ${state} ${glowEffect ? 'glow' : ''}`} 
//       style={{ left }}
//       ref={candleRef}
//     >
//       {/* Candle Body */}
//       <div className="candle-body">
//         <div className="candle-wax">
//           <div className="wax-drip wax-drip-1"></div>
//           <div className="wax-drip wax-drip-2"></div>
//           <div className="wax-drip wax-drip-3"></div>
//         </div>
        
//         {/* Flame */}
//         {state !== 'blown' && (
//           <div 
//             className={`flame-container ${state}`}
//             ref={flameRef}
//             style={{
//               transform: `scale(${flameIntensity})`,
//               opacity: flameIntensity
//             }}
//           >
//             <div className="flame-outer"></div>
//             <div className="flame-middle"></div>
//             <div className="flame-inner"></div>
//             <div className="flame-sparkle"></div>
//             <div className="flame-glow"></div>
//           </div>
//         )}
        
//         {/* Smoke */}
//         {state === 'blown' && (
//           <div className="smoke-container">
//             <div className="smoke smoke-1"></div>
//             <div className="smoke smoke-2"></div>
//             <div className="smoke smoke-3"></div>
//           </div>
//         )}
//       </div>
      
//       {/* Particles */}
//       {particles.map(particle => (
//         <div
//           key={particle.id}
//           className="particle"
//           style={{
//             left: `${particle.x}px`,
//             top: `${particle.y}px`,
//             width: `${particle.size}px`,
//             height: `${particle.size}px`,
//             background: particle.color || '#FFD700',
//             animation: `particleFloat ${particle.duration}s ease-out forwards`,
//             '--dir-x': particle.direction?.x || 0,
//             '--dir-y': particle.direction?.y || -1
//           }}
//         />
//       ))}
      
//       {/* Wick */}
//       <div className={`wick ${state === 'blown' ? 'burnt' : ''}`}>
//         <div className="wick-tip"></div>
//       </div>
      
//       {/* Glow Effect */}
//       <div className="candle-glow"></div>
//     </div>
//   );
// };

// export default Candle;






// import React, { useEffect, useRef, useState } from 'react';
// import './Candle.css';

// const Candle = ({ left, onBlow }) => {
//   const [state, setState] = useState('idle');
//   const [isBlown, setIsBlown] = useState(false);
//   const candleRef = useRef(null);

//   useEffect(() => {
//     const handleClick = () => {
//       if (!isBlown) {
//         blowCandle();
//       }
//     };

//     const candle = candleRef.current;
//     if (candle) {
//       candle.addEventListener('click', handleClick);
//       candle.addEventListener('touchstart', handleClick);
      
//       return () => {
//         candle.removeEventListener('click', handleClick);
//         candle.removeEventListener('touchstart', handleClick);
//       };
//     }
//   }, [isBlown, onBlow]);

//   const blowCandle = () => {
//     if (isBlown) return;
    
//     setState('blown');
//     setIsBlown(true);
    
//     // Create particles
//     createParticles();
    
//     // Call parent callback
//     setTimeout(() => {
//       onBlow?.();
//     }, 300);
    
//     // Reset after some time
//     setTimeout(() => {
//       setState('idle');
//       setIsBlown(false);
//     }, 4000);
//   };

//   const createParticles = () => {
//     const particleContainer = document.createElement('div');
//     particleContainer.className = 'particle-container';
//     particleContainer.style.position = 'absolute';
//     particleContainer.style.top = '-50px';
//     particleContainer.style.left = '50%';
//     particleContainer.style.transform = 'translateX(-50%)';
//     particleContainer.style.zIndex = '100';
//     particleContainer.style.pointerEvents = 'none';
    
//     for (let i = 0; i < 15; i++) {
//       const particle = document.createElement('div');
//       particle.className = 'spark';
//       particle.style.position = 'absolute';
//       particle.style.width = `${Math.random() * 10 + 5}px`;
//       particle.style.height = particle.style.width;
//       particle.style.background = `radial-gradient(circle, 
//         rgba(255, 255, 200, 0.9) 0%,
//         rgba(255, 200, 100, 0.7) 50%,
//         rgba(255, 100, 50, 0.5) 100%)`;
//       particle.style.borderRadius = '50%';
//       particle.style.left = `${Math.random() * 40 - 20}px`;
//       particle.style.top = `${Math.random() * 40 - 20}px`;
//       particle.style.animation = `sparkFloat ${Math.random() * 1 + 0.5}s ease-out forwards`;
      
//       particleContainer.appendChild(particle);
//     }
    
//     if (candleRef.current) {
//       candleRef.current.appendChild(particleContainer);
      
//       setTimeout(() => {
//         if (particleContainer.parentNode) {
//           particleContainer.parentNode.removeChild(particleContainer);
//         }
//       }, 1000);
//     }
//   };

//   return (
//     <div 
//       className="candle-wrapper"
//       style={{ left }}
//       ref={candleRef}
//     >
//       <div className={`candle ${state}`}>
//         <div className="candle-body">
//           {/* Flame */}
//           {state !== 'blown' && (
//             <div className="flame-wrapper">
//               <div className={`flame ${state}`}>
//                 <div className="flame-inner"></div>
//                 <div className="flame-outer"></div>
//               </div>
//               <div className="flame-glow"></div>
//             </div>
//           )}
          
//           {/* Smoke */}
//           {state === 'blown' && (
//             <div className="smoke-wrapper">
//               <div className="smoke smoke-1"></div>
//               <div className="smoke smoke-2"></div>
//               <div className="smoke smoke-3"></div>
//             </div>
//           )}
//         </div>
        
//         <div className="wick"></div>
//       </div>
//     </div>
//   );
// };

// export default Candle;








// import React, { useEffect, useRef, useState } from 'react';
// import './Candle.css';

// const Candle = ({ left, onBlow }) => {
//   const [state, setState] = useState('idle');
//   const [isBlown, setIsBlown] = useState(false);
//   const candleRef = useRef(null);

//   useEffect(() => {
//     const handleClick = () => {
//       if (!isBlown) {
//         blowCandle();
//       }
//     };

//     const candle = candleRef.current;
//     if (candle) {
//       candle.addEventListener('click', handleClick);
//       candle.addEventListener('touchstart', handleClick);
      
//       return () => {
//         candle.removeEventListener('click', handleClick);
//         candle.removeEventListener('touchstart', handleClick);
//       };
//     }
//   }, [isBlown, onBlow]);

//   const blowCandle = () => {
//     if (isBlown) return;
    
//     setState('blown');
//     setIsBlown(true);
    
//     // Create particles
//     createParticles();
    
//     // Call parent callback
//     setTimeout(() => {
//       onBlow?.();
//     }, 300);
    
//     // Reset after some time
//     setTimeout(() => {
//       setState('idle');
//       setIsBlown(false);
//     }, 3000);
//   };

//   const createParticles = () => {
//     const particleContainer = document.createElement('div');
//     particleContainer.className = 'particle-container';
//     particleContainer.style.position = 'absolute';
//     particleContainer.style.top = '-50px';
//     particleContainer.style.left = '50%';
//     particleContainer.style.transform = 'translateX(-50%)';
//     particleContainer.style.zIndex = '100';
//     particleContainer.style.pointerEvents = 'none';
    
//     for (let i = 0; i < 10; i++) {
//       const particle = document.createElement('div');
//       particle.className = 'spark';
//       particle.style.position = 'absolute';
//       particle.style.width = `${Math.random() * 10 + 5}px`;
//       particle.style.height = particle.style.width;
//       particle.style.background = `radial-gradient(circle, 
//         rgba(255, 255, 200, 0.9) 0%,
//         rgba(255, 200, 100, 0.7) 50%,
//         rgba(255, 100, 50, 0.5) 100%)`;
//       particle.style.borderRadius = '50%';
//       particle.style.left = `${Math.random() * 40 - 20}px`;
//       particle.style.top = `${Math.random() * 40 - 20}px`;
//       particle.style.animation = `sparkFloat ${Math.random() * 1 + 0.5}s ease-out forwards`;
      
//       particleContainer.appendChild(particle);
//     }
    
//     if (candleRef.current) {
//       candleRef.current.appendChild(particleContainer);
      
//       setTimeout(() => {
//         if (particleContainer.parentNode) {
//           particleContainer.parentNode.removeChild(particleContainer);
//         }
//       }, 1000);
//     }
//   };

//   return (
//     <div 
//       className="candle-wrapper"
//       style={{ left }}
//       ref={candleRef}
//     >
//       <div className={`candle ${state}`}>
//         <div className="candle-body">
//           {/* Flame */}
//           {state !== 'blown' && (
//             <div className="flame-wrapper">
//               <div className={`flame ${state}`}>
//                 <div className="flame-inner"></div>
//                 <div className="flame-outer"></div>
//                 <div className="flame-sparkle"></div>
//               </div>
//               <div className="flame-glow"></div>
//             </div>
//           )}
          
//           {/* Smoke */}
//           {state === 'blown' && (
//             <div className="smoke-wrapper">
//               <div className="smoke smoke-1"></div>
//               <div className="smoke smoke-2"></div>
//               <div className="smoke smoke-3"></div>
//             </div>
//           )}
//         </div>
        
//         <div className="wick"></div>
//       </div>
//     </div>
//   );
// };

// export default Candle;






import React from 'react';
import './Candle.css';

const Candle = ({ left, onBlow, isBlown }) => {
  return (
    <div 
      className={`candle-wrapper ${isBlown ? 'blown' : ''}`} 
      style={{ left }}
      onClick={onBlow}
    >
      {!isBlown && (
        <div className="flame">
          <div className="flame-main"></div>
          <div className="flame-core"></div>
        </div>
      )}
      <div className="candle-stick">
        <div className="candle-stripes"></div>
      </div>
    </div>
  );
};

export default Candle;