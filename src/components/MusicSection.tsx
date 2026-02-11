import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface Track {
  name: string;
  type: string;
  emoji: string;
  frequency?: number;
}

const tracks: Track[] = [
  { name: "Binaural Focus (40Hz)", type: "binaural", emoji: "🧠", frequency: 40 },
  { name: "Binaural Deep Focus (14Hz)", type: "binaural", emoji: "🎯", frequency: 14 },
  { name: "White Noise", type: "white", emoji: "⚪" },
  { name: "Pink Noise", type: "pink", emoji: "🩷" },
  { name: "Brown Noise", type: "brown", emoji: "🟤" },
  { name: "Rain Ambience", type: "rain", emoji: "🌧️" },
  { name: "Ocean Waves", type: "ocean", emoji: "🌊" },
  { name: "Forest Birds", type: "forest", emoji: "🌲" },
];

const MusicSection = () => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const secondOscRef = useRef<OscillatorNode | null>(null);

  const stopAudio = () => {
    try {
      sourceRef.current?.stop();
    } catch {}
    try {
      secondOscRef.current?.stop();
    } catch {}
    sourceRef.current = null;
    secondOscRef.current = null;
  };

  useEffect(() => {
    return () => {
      stopAudio();
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const generateNoise = (type: string, ctx: AudioContext, duration: number = 4) => {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === "white") {
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    } else if (type === "pink") {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === "brown") {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    } else {
      // ambient-like tones for rain/ocean/forest
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        const base = Math.sin(2 * Math.PI * 220 * t) * 0.05;
        const noise = (Math.random() * 2 - 1) * 0.3;
        data[i] = base + noise * Math.sin(t * 0.5);
      }
    }

    return buffer;
  };

  const playTrack = (index: number) => {
    if (playingIndex === index) {
      stopAudio();
      setPlayingIndex(null);
      return;
    }

    stopAudio();

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    const gain = ctx.createGain();
    gain.gain.value = isMuted ? 0 : volume;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    const track = tracks[index];

    if (track.type === "binaural" && track.frequency) {
      const baseFreq = 200;
      const osc1 = ctx.createOscillator();
      osc1.frequency.value = baseFreq;
      osc1.type = "sine";

      const osc2 = ctx.createOscillator();
      osc2.frequency.value = baseFreq + track.frequency;
      osc2.type = "sine";

      const g1 = ctx.createGain();
      g1.gain.value = 0.3;
      const g2 = ctx.createGain();
      g2.gain.value = 0.3;

      osc1.connect(g1).connect(gain);
      osc2.connect(g2).connect(gain);

      osc1.start();
      osc2.start();
      sourceRef.current = osc1;
      secondOscRef.current = osc2;
    } else {
      const buffer = generateNoise(track.type, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();
      sourceRef.current = source;
    }

    setPlayingIndex(index);
  };

  return (
    <div className="animate-slide-in space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Study Music 🎵</h2>
      <p className="text-sm text-muted-foreground">Focus-enhancing sounds to boost your concentration</p>

      {/* Volume control */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-4">
        <button onClick={() => setIsMuted(!isMuted)} className="text-muted-foreground hover:text-foreground transition-colors">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 accent-primary h-1.5"
        />
        <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(volume * 100)}%</span>
      </div>

      {/* Track list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tracks.map((track, i) => (
          <button
            key={i}
            onClick={() => playTrack(i)}
            className={`glass-card rounded-xl p-4 flex items-center gap-3 text-left hover:scale-[1.02] transition-all duration-200 ${
              playingIndex === i ? "ring-2 ring-primary shadow-glow" : ""
            }`}
          >
            <span className="text-2xl">{track.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">{track.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{track.type}</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              playingIndex === i ? "gradient-primary" : "bg-muted"
            }`}>
              {playingIndex === i ? (
                <Pause size={14} className="text-primary-foreground" />
              ) : (
                <Play size={14} className="text-muted-foreground ml-0.5" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MusicSection;
