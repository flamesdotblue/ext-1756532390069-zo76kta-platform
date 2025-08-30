import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/UGnf9D1Hp3OG8vSG/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/10 via-neutral-950/40 to-neutral-950 pointer-events-none" />
      <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col justify-end pb-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Custom Chess: Build, Upgrade, Conquer</h1>
        <p className="mt-3 text-neutral-300 max-w-2xl">
          Earn points by capturing and winning. Spend them to grant special abilities and redefine how your army moves — before the match or mid-battle.
        </p>
      </div>
    </section>
  );
}
