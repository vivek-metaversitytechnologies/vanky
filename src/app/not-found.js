'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/not-found.css';

export default function NotFound() {
  const sceneRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const handleMouseMove = (e) => {
      const rect = scene.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // normalise to roughly -1 … +1
      const xRatio = (e.clientX - cx) / (window.innerWidth  / 2);
      const yRatio = (e.clientY - cy) / (window.innerHeight / 2);

      const layers = scene.querySelectorAll('[data-depth]');
      layers.forEach((layer) => {
        const depth  = parseFloat(layer.dataset.depth);
        const moveX  = xRatio * depth * 22;
        const moveY  = yRatio * depth * 22;

        if (layer.classList.contains('p404')) {
          // keep the existing -50%/-50% centering and add the parallax offset
          layer.style.transform =
            `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        } else {
          layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="wrapper-404">
      <div className="container-404">
        {/* Parallax scene */}
        <div
          id="scene"
          ref={sceneRef}
          className="scene-404"
          data-hover-only="false"
        >
          <div data-depth="1.2"  className="circle-404" />

          <div data-depth="0.9"  className="one-404">
            <div className="content-404">
              <span className="piece-404" />
              <span className="piece-404" />
              <span className="piece-404" />
            </div>
          </div>

          <div data-depth="0.60" className="two-404">
            <div className="content-404">
              <span className="piece-404" />
              <span className="piece-404" />
              <span className="piece-404" />
            </div>
          </div>

          <div data-depth="0.40" className="three-404">
            <div className="content-404">
              <span className="piece-404" />
              <span className="piece-404" />
              <span className="piece-404" />
            </div>
          </div>

          {/* two "404" text layers — different depths create the 3-D effect */}
          <p data-depth="0.50" className="p404">404</p>
          <p data-depth="0.10" className="p404">404</p>
        </div>

        {/* Text / CTA */}
        <div className="text-404">
          <article>
            <p>
              Uh oh! Looks like you got lost.{' '}
              <br />
              Go back to the homepage if you dare!
            </p>
            <button onClick={() => router.push('/home')}>i dare!</button>
          </article>
        </div>
      </div>
    </section>
  );
}
