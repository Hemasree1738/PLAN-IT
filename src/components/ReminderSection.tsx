import { useState, useRef, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

const ReminderSection = () => {
  const [buzzerEnabled, setBuzzerEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBuzzer = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Three short beeps
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, now + i * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.25);
      osc.stop(now + i * 0.25 + 0.2);
    }
  }, []);

  return (
    <div className="animate-slide-in space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Session Reminder 🔔</h2>

      <div className="glass-card rounded-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full gradient-accent mx-auto flex items-center justify-center">
          {buzzerEnabled ? <Volume2 size={32} className="text-primary-foreground" /> : <VolumeX size={32} className="text-primary-foreground" />}
        </div>

        <div>
          <h3 className="font-display font-semibold text-card-foreground text-lg">Sound Buzzer</h3>
          <p className="text-muted-foreground text-sm mt-1">
            A beep sound will play at the end of each study and break session.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground">Buzzer</span>
          <button
            onClick={() => setBuzzerEnabled(!buzzerEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${buzzerEnabled ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-primary-foreground transition-transform ${buzzerEnabled ? "left-6" : "left-0.5"}`} />
          </button>
          <span className="text-sm text-muted-foreground">{buzzerEnabled ? "On" : "Off"}</span>
        </div>

        <button
          onClick={playBuzzer}
          className="gradient-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Test Buzzer
        </button>
      </div>
    </div>
  );
};

export default ReminderSection;
