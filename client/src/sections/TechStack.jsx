import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Matter from 'matter-js';
import { useIdentity } from '../context/IdentityContext';
import { useProfile } from '../context/ProfileContext';
import ScrollReveal from '../components/ScrollReveal';

const TechStack = () => {
  const { identity } = useIdentity();
  const { profileData, loading } = useProfile();
  const [isBroken, setIsBroken] = useState(false);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  const isEngineer = identity === 'engineering';
  const accentColor = isEngineer ? 'text-orange-500' : 'text-blue-500';
  const borderColor = isEngineer ? 'border-orange-500' : 'border-blue-500';
  const bgAccent = isEngineer ? 'bg-orange-500/10' : 'bg-blue-500/10';
  const glowAccent = isEngineer ? 'shadow-orange-500/20' : 'shadow-blue-500/20';
  const borderAccent = isEngineer ? 'hover:border-orange-500' : 'hover:border-blue-500';
  const blockColor = isEngineer ? '#f97316' : '#3b82f6';

  const profile = isEngineer ? profileData?.engineering : profileData?.developer;
  const stack = profile?.techStack || [];

  useEffect(() => {
    if (isBroken && sceneRef.current) {
      const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

      const engine = Engine.create();
      engineRef.current = engine;

      const width = sceneRef.current.clientWidth;
      const height = 500;

      const render = Render.create({
        element: sceneRef.current,
        engine: engine,
        options: {
          width,
          height,
          wireframes: false,
          background: 'transparent'
        }
      });

      // Ground
      const ground = Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true });
      const leftWall = Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true });
      const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true });

      // Create a block for every skill
      const bodies = [];
      stack.forEach(group => {
        group.skills.forEach(skill => {
          const x = Math.random() * (width - 100) + 50;
          const y = Math.random() * -500 - 50; // Fall from top
          const w = Math.max(100, skill.length * 15);
          
          const body = Bodies.rectangle(x, y, w, 40, {
            restitution: 0.6,
            friction: 0.1,
            render: {
              fillStyle: '#09090b', // zinc-950
              strokeStyle: blockColor,
              lineWidth: 2
            }
          });
          
          body.label = skill;
          bodies.push(body);
        });
      });

      Composite.add(engine.world, [ground, leftWall, rightWall, ...bodies]);

      // Add mouse interaction
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: false }
        }
      });
      Composite.add(engine.world, mouseConstraint);

      // Custom render for text inside bodies
      const context = render.context;
      Matter.Events.on(render, 'afterRender', () => {
        context.font = "14px monospace";
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.textBaseline = "middle";

        bodies.forEach(body => {
          context.translate(body.position.x, body.position.y);
          context.rotate(body.angle);
          context.fillText(body.label, 0, 0);
          context.rotate(-body.angle);
          context.translate(-body.position.x, -body.position.y);
        });
      });

      Render.run(render);
      const runner = Runner.create();
      Runner.run(runner, engine);

      return () => {
        Render.stop(render);
        Runner.stop(runner);
        Engine.clear(engine);
        render.canvas.remove();
        render.canvas = null;
        render.context = null;
        render.textures = {};
      };
    }
  }, [isBroken, stack, blockColor]);

  if (loading || !profileData) return null;

  return (
    <section className={`border-l-2 md:border-l-4 ${borderColor} pl-4 md:pl-8 my-16 md:my-24 scroll-mt-32`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 mb-8 md:mb-12">
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 md:mb-4 uppercase tracking-widest ${accentColor}`}>Tech Stack</h2>
          <p className="text-slate-400 text-xs md:text-sm uppercase tracking-widest font-mono">
            Core capabilities & technologies
          </p>
        </div>
        
        {stack.length > 0 && (
          <button 
            onClick={() => setIsBroken(!isBroken)}
            className={`px-3 md:px-4 py-2 text-[10px] md:text-xs font-mono tracking-widest border transition-all ${isBroken ? `bg-red-500/20 text-red-500 border-red-500 hover:bg-red-500/30` : `text-slate-400 border-slate-700 ${borderAccent} hover:text-white`}`}
          >
            {isBroken ? 'RESTORE LAYOUT' : 'BREAK LAYOUT'}
          </button>
        )}
      </div>
      
      {stack.length > 0 ? (
        <div className="relative w-full">
          {/* Breaking Physics View */}
          {isBroken && (
            <div 
              ref={sceneRef} 
              className={`w-full h-[400px] md:h-[500px] bg-zinc-950 border border-slate-900 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-inner shadow-${blockColor}/10`}
            >
              {/* Matter.js Canvas renders here */}
            </div>
          )}

          {/* Bento Box View */}
          {!isBroken && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {stack.map((group, idx) => (
                <ScrollReveal key={idx}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className={`h-full bg-zinc-950/80 backdrop-blur-md border border-slate-800 ${borderAccent} p-8 shadow-xl hover:${glowAccent} transition-colors transition-shadow duration-300 relative overflow-hidden group`}
                  >
                    <div className={`absolute -top-24 -right-24 w-48 h-48 ${bgAccent} rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none`}></div>
                    
                    <h3 className={`text-xl font-bold mb-6 tracking-widest uppercase text-white group-hover:${accentColor} transition-colors relative z-10`}>
                      {group.category}
                    </h3>
                    
                    <div className="flex flex-wrap gap-3 relative z-10">
                      {group.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-4 py-2 bg-black border border-slate-800 rounded-none text-slate-300 text-sm font-mono tracking-widest hover:text-white hover:border-slate-500 transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 border border-slate-900 bg-zinc-950 text-center text-slate-500 font-mono tracking-widest uppercase">
          No tech stack data found. Update via Admin Dashboard.
        </div>
      )}
    </section>
  );
};

export default TechStack;
