'use client';

import React, { useEffect, useRef } from 'react';
import { AmbientKind } from '@/types/audio';

interface AmbientBedProps {
  kind: AmbientKind | null;
  volume?: number;
}

function makeNoiseBuffer(
  ctx: AudioContext,
  seconds: number,
  color: 'white' | 'pink' | 'brown'
): AudioBuffer {
  const length = Math.floor(seconds * ctx.sampleRate);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  let last = 0;

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (color === 'white') {
      data[i] = white * 0.18;
      continue;
    }
    if (color === 'brown') {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
      continue;
    }
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
    b6 = white * 0.115926;
  }

  return buffer;
}

function startLoop(ctx: AudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.start(0);
  return source;
}

export const AmbientBed: React.FC<AmbientBedProps> = ({ kind, volume = 0.22 }) => {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const stopAll = () => {
      timersRef.current.forEach((id) => window.clearInterval(id));
      timersRef.current = [];
      sourcesRef.current.forEach((node) => {
        try {
          node.stop();
          node.disconnect();
        } catch {
          // ignore
        }
      });
      sourcesRef.current = [];
      if (ctxRef.current) {
        try {
          ctxRef.current.close();
        } catch {
          // ignore
        }
      }
      ctxRef.current = null;
      masterRef.current = null;
    };

    if (!kind) {
      stopAll();
      return stopAll;
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      void ctx.resume();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      masterRef.current = master;

      if (kind === 'rain') {
        const source = startLoop(ctx, makeNoiseBuffer(ctx, 2, 'pink'));
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        source.connect(filter);
        filter.connect(master);
        sourcesRef.current.push(source);
      }

      if (kind === 'coffee') {
        const room = startLoop(ctx, makeNoiseBuffer(ctx, 2.4, 'brown'));
        const roomFilter = ctx.createBiquadFilter();
        roomFilter.type = 'lowpass';
        roomFilter.frequency.value = 520;
        const roomGain = ctx.createGain();
        roomGain.gain.value = 0.7;
        room.connect(roomFilter);
        roomFilter.connect(roomGain);
        roomGain.connect(master);
        sourcesRef.current.push(room);

        const chatter = startLoop(ctx, makeNoiseBuffer(ctx, 2.2, 'pink'));
        const chatterFilter = ctx.createBiquadFilter();
        chatterFilter.type = 'bandpass';
        chatterFilter.frequency.value = 900;
        chatterFilter.Q.value = 0.7;
        const chatterGain = ctx.createGain();
        chatterGain.gain.value = 0.22;
        chatter.connect(chatterFilter);
        chatterFilter.connect(chatterGain);
        chatterGain.connect(master);
        sourcesRef.current.push(chatter);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.13;
        lfoGain.gain.value = 0.08;
        lfo.connect(lfoGain);
        lfoGain.connect(chatterGain.gain);
        lfo.start(0);

        const clink = () => {
          if (!ctxRef.current) return;
          const osc = ctx.createOscillator();
          const env = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = 1800 + Math.random() * 2200;
          env.gain.setValueAtTime(0.0001, ctx.currentTime);
          env.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
          env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
          osc.connect(env);
          env.connect(master);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        };
        timersRef.current.push(window.setInterval(clink, 4200));
      }

      if (kind === 'air') {
        const wind = startLoop(ctx, makeNoiseBuffer(ctx, 3, 'brown'));
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 280;
        const windGain = ctx.createGain();
        windGain.gain.value = 0.85;
        wind.connect(filter);
        filter.connect(windGain);
        windGain.connect(master);
        sourcesRef.current.push(wind);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.07;
        lfoGain.gain.value = 120;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start(0);
      }

      if (kind === 'crowd') {
        const murmur = startLoop(ctx, makeNoiseBuffer(ctx, 2.5, 'pink'));
        const band = ctx.createBiquadFilter();
        band.type = 'bandpass';
        band.frequency.value = 650;
        band.Q.value = 0.55;
        const murmurGain = ctx.createGain();
        murmurGain.gain.value = 0.45;
        murmur.connect(band);
        band.connect(murmurGain);
        murmurGain.connect(master);
        sourcesRef.current.push(murmur);

        const voices = startLoop(ctx, makeNoiseBuffer(ctx, 2.1, 'pink'));
        const voiceBand = ctx.createBiquadFilter();
        voiceBand.type = 'bandpass';
        voiceBand.frequency.value = 1400;
        voiceBand.Q.value = 0.8;
        const voiceGain = ctx.createGain();
        voiceGain.gain.value = 0.18;
        voices.connect(voiceBand);
        voiceBand.connect(voiceGain);
        voiceGain.connect(master);
        sourcesRef.current.push(voices);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.11;
        lfoGain.gain.value = 0.12;
        lfo.connect(lfoGain);
        lfoGain.connect(murmurGain.gain);
        lfo.start(0);
      }
    } catch (err) {
      console.warn('Ambient bed failed:', err);
    }

    return stopAll;
    // rebuild only when the selected bed changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.gain.value = volume;
    }
  }, [volume]);

  return null;
};
