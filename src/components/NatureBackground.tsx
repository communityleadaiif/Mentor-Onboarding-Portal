import { useEffect, useRef } from 'react';

export default function NatureBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Generate floating leaf particles
    const container = document.getElementById('leaf-container');
    if (!container) return;

    const createLeaf = () => {
      const leaf = document.createElement('div');
      leaf.className = 'leaf-particle';
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.animationDuration = (15 + Math.random() * 20) + 's';
      leaf.style.animationDelay = Math.random() * 10 + 's';
      const size = 4 + Math.random() * 8;
      leaf.style.width = size + 'px';
      leaf.style.height = size + 'px';
      const hue = 120 + Math.random() * 40;
      leaf.style.background = `radial-gradient(circle, hsla(${hue}, 70%, 50%, 0.5), transparent)`;
      container.appendChild(leaf);
    };

    for (let i = 0; i < 15; i++) createLeaf();

    return () => { container.innerHTML = ''; };
  }, []);

  return (
    <>
      <div id="leaf-container" className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />

      {/* SVG Root/vine decorations */}
      <svg ref={svgRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-20"
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {/* Bottom roots */}
        <path className="root-line" d="M0,900 Q100,800 200,850 T400,820 T600,860 T800,830" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" style={{ animationDelay: '0s' }} />
        <path className="root-line" d="M1440,900 Q1340,820 1240,860 T1040,840 T840,870" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="1" style={{ animationDelay: '0.5s' }} />
        <path className="root-line" d="M200,900 Q250,750 300,800 T400,700 T350,600" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1" style={{ animationDelay: '1s' }} />
        <path className="root-line" d="M1200,900 Q1150,770 1100,810 T1000,720 T1050,620" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1" style={{ animationDelay: '1.5s' }} />

        {/* Side vines */}
        <path className="root-line" d="M0,400 Q30,350 20,300 T40,200 T20,100 T30,0" fill="none" stroke="rgba(34,197,94,0.12)" strokeWidth="1" style={{ animationDelay: '2s' }} />
        <path className="root-line" d="M1440,500 Q1410,450 1420,380 T1400,280 T1420,180" fill="none" stroke="rgba(34,197,94,0.12)" strokeWidth="1" style={{ animationDelay: '2.5s' }} />
      </svg>
    </>
  );
}
