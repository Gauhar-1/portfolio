'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/app/actions';
import { Loader2, Radio, Target, Terminal, Wifi, Activity } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    name: z.string().min(2, { message: 'IDENTITY_UNCONFIRMED' }),
    email: z.string().email({ message: 'INVALID_COMMS_CHANNEL' }),
    message: z.string().min(10, { message: 'INTEL_FRAGMENTED' }),
});

type FormData = z.infer<typeof formSchema>;

const ContactSection = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    // HOLD BUTTON STATE
    const [holdProgress, setHoldProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', email: '', message: '' },
    });

    // --- LOGIC: LOGGING SYSTEM ---
    const addLog = useCallback((msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`, ...prev.slice(0, 5)]);
    }, []);

    // --- LOGIC: HOLD TO SUBMIT ---
    const startHold = () => {
        if (isSubmitting) return;
        setIsHolding(true);
        addLog("INITIATING_UPLINK_SEQUENCE...");

        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            setHoldProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                form.handleSubmit(onSubmit)();
            }
        }, 16);
        holdIntervalRef.current = interval;
    };

    const cancelHold = () => {
        if (holdProgress >= 100 || isSubmitting) return;
        setIsHolding(false);
        setHoldProgress(0);
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        if (holdProgress > 0) addLog("UPLINK_ABORTED");
    };

    // --- LOGIC: SUBMISSION ---
    async function onSubmit(values: FormData) {
        setIsSubmitting(true);
        addLog("ENCRYPTING_PACKET...");
        addLog("TRANSMITTING_DATA...");

        const result = await submitContactForm(values);

        if (result.success) {
            addLog("TRANSMISSION_CONFIRMED");
            toast({
                title: "MISSION ACCOMPLISHED",
                description: "Intel secured. HQ will respond shortly.",
                className: "bg-emerald-950 border-emerald-500 text-emerald-500 font-mono"
            });
            form.reset();
        } else {
            addLog("ERROR: CONNECTION_REFUSED");
            toast({
                variant: 'destructive',
                title: "MISSION FAILED",
                description: result.error || "Signal lost.",
            });
        }
        setIsSubmitting(false);
        setIsHolding(false);
        setHoldProgress(0);
    }

    useEffect(() => {
        setLogs([
            `[${new Date().toLocaleTimeString().split(' ')[0]}] SYSTEM_BOOT...`,
            "SIGNAL_WEAK...",
            "ESTABLISHING_CONNECTION..."
        ]);
    }, []);

    return (
        <section id="contact" className="relative py-24 bg-black overflow-hidden min-h-screen flex items-center justify-center">

            {/* --- CSS INJECTION FOR CRT EFFECTS --- */}
            <style jsx global>{`
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes flicker {
          0% { opacity: 0.9; }
          5% { opacity: 0.8; }
          10% { opacity: 0.95; }
          15% { opacity: 0.7; }
          20% { opacity: 0.95; }
          50% { opacity: 0.9; }
          55% { opacity: 0.6; }
          60% { opacity: 0.95; }
          80% { opacity: 0.8; }
          100% { opacity: 0.9; }
        }
        .animate-noise { animation: noise 0.2s steps(2) infinite; }
        .animate-scanline { animation: scanline 8s linear infinite; }
        .animate-flicker { animation: flicker 0.15s infinite; }
      `}</style>

            {/* --- LAYER 1: BROKEN CRT MONITOR BACKGROUND --- */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[#0a0a0a] overflow-hidden">

                {/* 1. Static Noise (The 'Snow') */}
                <div className="absolute inset-[-100%] w-[300%] h-[300%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] animate-noise grayscale"></div>

                {/* 2. Scanlines (The horizontal lines) */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]"></div>

                {/* 3. Rolling Bar (The 'Vertical Hold' failure) */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[20%] w-full animate-scanline opacity-50"></div>

                {/* 4. Phosphor Flicker & Glow */}
                <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay animate-flicker"></div>

                {/* 5. Vignette (The curved screen corners) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,#000000_95%)]"></div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* --- LEFT COL: SYSTEM LOG --- */}
                    <div className="lg:col-span-4 hidden lg:block sticky top-24">
                        <div className="bg-black/90 border-2 border-[#1f2937] p-4 font-mono text-xs text-emerald-500/80 h-96 overflow-hidden relative shadow-[0_0_20px_rgba(16,185,129,0.1)]">

                            {/* Screen Glare overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-20"></div>

                            <div className="mb-4 flex items-center justify-between border-b border-emerald-900/50 pb-2 relative z-10">
                                <span className="font-bold tracking-widest text-emerald-600">TERMINAL_RELAY_01</span>
                                <Activity className="w-3 h-3 animate-bounce text-red-500" />
                            </div>

                            <div className="space-y-1 flex flex-col-reverse h-[300px] relative z-10">
                                {logs.map((log, i) => (
                                    <div key={i} className={`opacity-${100 - i * 15} transition-all flex gap-2`}>
                                        <span className="text-emerald-800">{">"}</span>
                                        <span className={i === 0 ? "text-emerald-400 font-bold" : "text-emerald-700"}>{log}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COL: THE FIELD TABLET --- */}
                    <div className="lg:col-span-8">
                        <div className="relative bg-[#0F1012] border border-[#333] shadow-[0_0_100px_rgba(0,0,0,1)]">

                            {/* Tablet Top Bar */}
                            <div className="w-full h-8 bg-[#151515] border-b border-[#222] flex items-center justify-between px-4">
                                <div className="flex gap-2 items-center">
                                    <Wifi className="w-3 h-3 text-emerald-600" />
                                    <span className="text-[9px] font-mono text-emerald-800 font-bold tracking-widest">SIGNAL: UNSTABLE</span>
                                </div>
                                <span className="text-[9px] font-mono text-red-900 animate-pulse">ENCRYPTION: BROKEN</span>
                            </div>

                            <div className="p-8 md:p-10 relative">
                                {/* Dirty Screen Overlay on the form itself */}
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                                <div className="mb-8 relative z-10">
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 glitch-text">
                                        Field <span className="text-emerald-600">Report</span>
                                    </h2>
                                    <p className="text-emerald-900 font-mono text-xs font-bold">
                                        HARDLINE CONNECTION REQUIRED.
                                    </p>
                                </div>

                                <Form {...form}>
                                    <form ref={formRef} className="space-y-6 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <span className="absolute -top-3 left-0 text-[9px] font-mono text-emerald-700 font-bold bg-[#0F1012] px-1">OPERATIVE_ID</span>
                                                                <Input
                                                                    {...field}
                                                                    onFocus={() => addLog("INPUT_DETECTED: NAME_FIELD")}
                                                                    className="h-12 bg-[#050505] border-[#222] text-emerald-100 font-mono rounded-none focus:border-emerald-600 focus:ring-0 focus:bg-[#0a0a0a] transition-all uppercase tracking-wider"
                                                                    placeholder="ENTER NAME..."
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-red-900 font-mono text-[10px]" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <span className="absolute -top-3 left-0 text-[9px] font-mono text-emerald-700 font-bold bg-[#0F1012] px-1">COMMS_CHANNEL</span>
                                                                <Input
                                                                    {...field}
                                                                    onFocus={() => addLog("INPUT_DETECTED: EMAIL_FIELD")}
                                                                    className="h-12 bg-[#050505] border-[#222] text-emerald-100 font-mono rounded-none focus:border-emerald-600 focus:ring-0 focus:bg-[#0a0a0a] transition-all tracking-wider"
                                                                    placeholder="ENTER EMAIL..."
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-red-900 font-mono text-[10px]" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <span className="absolute -top-3 left-0 text-[9px] font-mono text-emerald-700 font-bold bg-[#0F1012] px-1">INTEL_PACKET</span>
                                                            <Textarea
                                                                {...field}
                                                                onFocus={() => addLog("INPUT_DETECTED: MESSAGE_BODY")}
                                                                onChange={(e) => {
                                                                    field.onChange(e);
                                                                    if (e.target.value.length % 5 === 0) addLog("BUFFERING...");
                                                                }}
                                                                rows={5}
                                                                className="bg-[#050505] border-[#222] text-emerald-100 font-mono rounded-none focus:border-emerald-600 focus:ring-0 focus:bg-[#0a0a0a] transition-all resize-none p-4 leading-relaxed tracking-wide"
                                                                placeholder="TYPE MESSAGE..."
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-red-900 font-mono text-[10px]" />
                                                </FormItem>
                                            )}
                                        />

                                        {/* --- HOLD TO SEND BUTTON --- */}
                                        <div className="pt-2 select-none relative">
                                            <div
                                                className="relative w-full h-16 bg-[#111] border border-[#333] flex items-center justify-center cursor-pointer overflow-hidden group hover:border-emerald-700 transition-colors"
                                                onMouseDown={startHold}
                                                onMouseUp={cancelHold}
                                                onMouseLeave={cancelHold}
                                                onTouchStart={startHold}
                                                onTouchEnd={cancelHold}
                                            >
                                                {/* Background Scanlines on Button */}
                                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.5)_50%,transparent_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none"></div>

                                                {/* PROGRESS FILL */}
                                                <div
                                                    className="absolute top-0 bottom-0 left-0 bg-emerald-700/80 z-0 transition-all duration-75 ease-linear box-border border-r-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                                    style={{ width: `${holdProgress}%` }}
                                                ></div>

                                                {/* BUTTON TEXT */}
                                                <div className="relative z-10 flex items-center gap-3">
                                                    {isSubmitting ? (
                                                        <span className="text-emerald-100 font-black tracking-[0.2em] animate-pulse">TRANSMITTING...</span>
                                                    ) : (
                                                        <>
                                                            <Terminal className={cn("w-5 h-5 text-emerald-700 group-hover:text-emerald-400 transition-colors", isHolding && "text-white animate-bounce")} />
                                                            <span className="text-emerald-800 font-bold font-mono tracking-widest text-xs group-hover:text-emerald-400 transition-colors">
                                                                {isHolding ? "ESTABLISHING UPLINK..." : "HOLD TO TRANSMIT"}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-between mt-2 text-[9px] font-mono text-emerald-900">
                                                <span>STATUS: {isHolding ? "SENDING_PACKETS" : "IDLE"}</span>
                                                <span>FREQ: 140.85 MHz</span>
                                            </div>
                                        </div>

                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;