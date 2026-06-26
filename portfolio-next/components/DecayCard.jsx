'use client';

import { useEffect, useRef, useId } from 'react';
import { gsap } from 'gsap';

export default function DecayCard({
  width = 300,
  height = 400,
  image = '',
  baseFrequency = 0.015,
  numOctaves = 5,
  seed = 4,
  maxDisplacement = 400,
  movementBound = 50,
  children,
}) {
  const uid = useId().replace(/:/g, '');
  const filterId = `decay-filter-${uid}`;
  const svgRef = useRef(null);
  const displacementMapRef = useRef(null);
  const cursor = useRef({ x: 0, y: 0 });
  const cachedCursor = useRef({ x: 0, y: 0 });
  const winsize = useRef({ width: 0, height: 0 });

  useEffect(() => {
    cursor.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    cachedCursor.current = { ...cursor.current };
    winsize.current = { width: window.innerWidth, height: window.innerHeight };

    const lerp = (a, b, n) => (1 - n) * a + n * b;
    const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;
    const distance = (x1, x2, y1, y2) => Math.hypot(x1 - x2, y1 - y2);

    const handleResize = () => {
      winsize.current = { width: window.innerWidth, height: window.innerHeight };
    };
    const handleMouseMove = (ev) => {
      cursor.current = { x: ev.clientX, y: ev.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const imgValues = { imgTransforms: { x: 0, y: 0, rz: 0 }, displacementScale: 0 };

    let rafId;
    const render = () => {
      let targetX = lerp(imgValues.imgTransforms.x, map(cursor.current.x, 0, winsize.current.width, -120, 120), 0.1);
      let targetY = lerp(imgValues.imgTransforms.y, map(cursor.current.y, 0, winsize.current.height, -120, 120), 0.1);
      let targetRz = lerp(imgValues.imgTransforms.rz, map(cursor.current.x, 0, winsize.current.width, -10, 10), 0.1);

      if (targetX > movementBound)  targetX = movementBound  + (targetX - movementBound)  * 0.2;
      if (targetX < -movementBound) targetX = -movementBound + (targetX + movementBound)  * 0.2;
      if (targetY > movementBound)  targetY = movementBound  + (targetY - movementBound)  * 0.2;
      if (targetY < -movementBound) targetY = -movementBound + (targetY + movementBound)  * 0.2;

      imgValues.imgTransforms.x  = targetX;
      imgValues.imgTransforms.y  = targetY;
      imgValues.imgTransforms.rz = targetRz;

      if (svgRef.current) {
        gsap.set(svgRef.current, { x: targetX, y: targetY, rotateZ: targetRz });
      }

      const dist = distance(cachedCursor.current.x, cursor.current.x, cachedCursor.current.y, cursor.current.y);
      imgValues.displacementScale = lerp(
        imgValues.displacementScale,
        map(dist, 0, 200, 0, maxDisplacement),
        0.06
      );

      if (displacementMapRef.current) {
        gsap.set(displacementMapRef.current, { attr: { scale: imgValues.displacementScale } });
      }

      cachedCursor.current = { ...cursor.current };
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [maxDisplacement, movementBound]);

  return (
    <div ref={svgRef} style={{ position: 'relative', width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height, willChange: 'transform' }}>
      <svg
        viewBox="-60 -75 720 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="turbulence"
              baseFrequency={baseFrequency}
              numOctaves={numOctaves}
              seed={seed}
              stitchTiles="stitch"
              x="0%" y="0%" width="100%" height="100%"
              result="turbulence1"
            />
            <feDisplacementMap
              ref={displacementMapRef}
              in="SourceGraphic"
              in2="turbulence1"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="B"
              x="0%" y="0%" width="100%" height="100%"
              result="displacementMap3"
            />
          </filter>
        </defs>
        <g>
          <image
            href={image}
            x="-60" y="-75"
            width="720" height="900"
            filter={`url(#${filterId})`}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </svg>
      {children && (
        <div style={{ position: 'absolute', bottom: '1.2em', left: '1em', letterSpacing: '-0.5px', fontWeight: 900, fontSize: '2.5rem', lineHeight: '1.5em' }}>
          {children}
        </div>
      )}
    </div>
  );
}
