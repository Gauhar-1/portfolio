'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Copy,
  Check,
  Github,
  Linkedin,
  Twitter,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  RotateCcw,
  Star,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Clock,
  MapPin,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { getSessionId } from '@/lib/telemetry';
import {
  CONTACT_INTENTS,
  ContactIntentKey,
} from '@/constants/contact-intents';
import ContactVisuals from '@/components/contact/ContactVisuals';

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface LinksData {
  github?: string;
  linkedin?: string;
  x?: string;
  email?: string;
  resumeUrl?: string;
}

interface DispatchReceipt {
  dispatchId: string;
  timestamp: string;
  name: string;
  email: string;
  companyOrRole?: string;
  intent: ContactIntentKey;
  rating?: number;
  message: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ContactSection() {
  const [links, setLinks] = useState<LinksData | null>(null);
  const [activeIntent, setActiveIntent] = useState<ContactIntentKey>('INTERVIEW_REQUEST');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyOrRole, setCompanyOrRole] = useState('');
  const [message, setMessage] = useState<string>(CONTACT_INTENTS.INTERVIEW_REQUEST.templateMessage);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const [hasUserEditedMessage, setHasUserEditedMessage] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<DispatchReceipt | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active intent details
  const intentConfig = CONTACT_INTENTS[activeIntent];

  // Auto-resize textarea to eliminate vertical scrollbar
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(140, textareaRef.current.scrollHeight)}px`;
    }
  }, [message]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setHasUserEditedMessage(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(140, textareaRef.current.scrollHeight)}px`;
    }
  };

  // Word count and read time
  const wordCount = message.trim().split(/\s+/).filter(Boolean).length;
  const readTimeSeconds = Math.max(5, Math.round((wordCount / 200) * 60));

  // Telemetry event logger
  const trackTelemetry = useCallback((action: string) => {
    const sessionId = getSessionId();
    if (sessionId) {
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          score: 10,
          action: `[Comms Dispatch] ${action}`,
        }),
      }).catch(console.error);
    }
  }, []);

  // Hydrate links from database
  useEffect(() => {
    let isMounted = true;
    async function fetchLinks() {
      try {
        const res = await fetch('/api/links');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) setLinks(data);
        }
      } catch (err) {
        console.error('Failed to load links for contact section', err);
      }
    }
    fetchLinks();
    return () => {
      isMounted = false;
    };
  }, []);

  // When switching intent pills: update active intent, morph theme, and inject template if clean
  const handleSelectIntent = (intentKey: ContactIntentKey) => {
    setActiveIntent(intentKey);
    trackTelemetry(`Selected Intent: ${intentKey}`);
    if (!hasUserEditedMessage) {
      setMessage(CONTACT_INTENTS[intentKey].templateMessage);
    }
  };

  const handleResetToTemplate = () => {
    setMessage(intentConfig.templateMessage);
    setHasUserEditedMessage(false);
    trackTelemetry(`Reset to Template for ${activeIntent}`);
  };

  // 1-Click Copy Email
  const operatorEmail = links?.email || 'goharkhan1084@gmail.com';
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(operatorEmail);
      setCopiedEmail(true);
      trackTelemetry('1-Click Copied Direct Email');
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch (err) {
      console.error('Failed to copy email', err);
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please provide your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    const sessionId = getSessionId() || undefined;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          companyOrRole: companyOrRole.trim(),
          intent: activeIntent,
          rating: activeIntent === 'PORTFOLIO_REVIEW' ? rating : undefined,
          message: message.trim(),
          sessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Transmission failed. Please try again.');
      }

      setReceipt({
        dispatchId: data.dispatchId || 'DISPATCH_VERIFIED',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        name,
        email,
        companyOrRole,
        intent: activeIntent,
        rating: activeIntent === 'PORTFOLIO_REVIEW' ? rating : undefined,
        message,
      });

      trackTelemetry(`Submitted Contact Dispatch: ${activeIntent}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to transmit message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAll = () => {
    setReceipt(null);
    setName('');
    setEmail('');
    setCompanyOrRole('');
    setActiveIntent('INTERVIEW_REQUEST');
    setMessage(CONTACT_INTENTS.INTERVIEW_REQUEST.templateMessage);
    setHasUserEditedMessage(false);
    setRating(5);
  };

  return (
    <section
      id="contact"
      style={
        {
          '--theme-primary': intentConfig.primaryHex,
          '--theme-bg': intentConfig.backgroundHex,
          '--theme-text': intentConfig.textHex,
          backgroundColor: 'var(--theme-bg)',
          color: 'var(--theme-text)',
          transition: 'background-color 700ms ease, color 700ms ease',
        } as React.CSSProperties
      }
      className="relative h-[100dvh] min-h-[100dvh] max-h-[100dvh] w-full overflow-hidden px-4 md:px-8 lg:px-14 py-3 md:py-5 flex flex-col justify-between transition-colors duration-700"
    >
      {/* Dynamic Ambient Chameleon Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 80% 25%, color-mix(in srgb, var(--theme-primary) 18%, transparent) 0%, transparent 60%), radial-gradient(circle at 15% 75%, color-mix(in srgb, var(--theme-primary) 12%, transparent) 0%, transparent 50%)`,
        }}
      />

      {/* Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--theme-text) 1px, transparent 1px), linear-gradient(to bottom, var(--theme-text) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* ── Top Header Strip (shrink-0) ────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center justify-between pb-2 border-b relative z-10"
        style={{ borderColor: 'color-mix(in srgb, var(--theme-text) 12%, transparent)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded font-mono text-[10px] md:text-xs font-bold tracking-widest uppercase border"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
              borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
              color: 'var(--theme-primary)',
            }}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>MISSION_COMMS // DIRECT DISPATCH TERMINAL</span>
          </div>
          <span
            className="hidden sm:inline font-mono text-[11px]"
            style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}
          >
            [ENCRYPTED 256-BIT DISPATCH]
          </span>
        </div>

        {/* Live Channel Status */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-primary)' }} />
          <span className="font-bold hidden sm:inline" style={{ color: 'var(--theme-primary)' }}>
            CH_01 ONLINE
          </span>
        </div>
      </div>

      {/* ── Center Stage: 2-Column Terminal (flex-1 min-h-0) ───────────── */}
      <div className="flex-1 min-h-0 my-2 md:my-2.5 grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-6 items-stretch relative z-10">
        {/* ════ Left Column: Operator Uplink & SLA Dossier (lg:col-span-5) ═ */}
        <div
          className="lg:col-span-5 rounded-2xl border p-3.5 sm:p-4 lg:p-5 flex flex-col justify-between overflow-hidden shadow-xl"
          style={{
            background: 'color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 10%)',
            borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
          }}
        >
          {/* Top Dossier Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              {/* Live Availability Badge */}
              <div
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold uppercase tracking-wider border shadow-sm"
                style={{
                  background: 'color-mix(in srgb, var(--theme-primary) 14%, var(--theme-bg) 86%)',
                  borderColor: 'var(--theme-primary)',
                  color: 'var(--theme-primary)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: 'var(--theme-primary)' }} />
                <span>READY FOR DEPLOYMENT</span>
              </div>

              {/* Role Class Badge */}
              <span
                className="px-2 py-0.5 rounded text-[8.5px] font-mono uppercase tracking-wider border font-bold"
                style={{
                  background: 'color-mix(in srgb, var(--theme-bg) 80%, var(--theme-text) 20%)',
                  borderColor: 'color-mix(in srgb, var(--theme-primary) 40%, transparent)',
                  color: 'var(--theme-primary)',
                }}
              >
                {intentConfig.roleClass}
              </span>
            </div>

            {/* Dynamic Conversion Headline */}
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-tight leading-tight">
              {intentConfig.headline}
            </h2>

            {/* Dynamic Subheadline */}
            <p
              className="font-mono text-[11px] sm:text-xs leading-relaxed line-clamp-2"
              style={{ color: 'color-mix(in srgb, var(--theme-text) 72%, transparent)' }}
            >
              {intentConfig.subheadline}
            </p>
          </div>

          {/* Embedded Intent Workflow Visual (Swaps per activeIntent) */}
          <div className="my-1.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIntent}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <ContactVisuals
                  visualType={intentConfig.visualType}
                  visualTitle={intentConfig.visualTitle}
                  rating={rating}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Instant Direct-Action Cards (Zero-Form Friction Alternative) */}
          <div className="space-y-1.5 my-1">
            {/* 1-Click Copy Email Card */}
            <div
              className="p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors"
              style={{
                background: 'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 15%)',
                borderColor: copiedEmail
                  ? 'var(--theme-primary)'
                  : 'color-mix(in srgb, var(--theme-text) 14%, transparent)',
              }}
            >
              <div className="min-w-0">
                <span
                  className="block text-[8.5px] font-mono uppercase tracking-wider"
                  style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}
                >
                  Direct Operator Comms
                </span>
                <span className="font-mono text-xs font-bold truncate block">
                  {operatorEmail}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-2 py-1.5 rounded-lg font-mono text-[9.5px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                style={{
                  backgroundColor: copiedEmail
                    ? 'var(--theme-primary)'
                    : 'color-mix(in srgb, var(--theme-bg) 70%, var(--theme-text) 18%)',
                  color: copiedEmail ? 'var(--theme-bg)' : 'var(--theme-text)',
                  border: `1px solid ${
                    copiedEmail
                      ? 'var(--theme-primary)'
                      : 'color-mix(in srgb, var(--theme-text) 20%, transparent)'
                  }`,
                }}
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>COPIED ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Links Row */}
            <div className="grid grid-cols-4 gap-1.5">
              <a
                href={links?.github || 'https://github.com/Gauhar-1'}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackTelemetry('Clicked Uplink GitHub')}
                className="p-1.5 sm:p-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-200 hover:scale-[1.03] group text-center"
                style={{
                  background: 'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 15%)',
                  borderColor: 'color-mix(in srgb, var(--theme-text) 14%, transparent)',
                }}
              >
                <Github className="w-3.5 h-3.5 group-hover:text-[var(--theme-primary)] transition-colors" />
                <span className="text-[8.5px] font-mono uppercase tracking-wider">GitHub</span>
              </a>

              <a
                href={links?.linkedin || 'https://linkedin.com/in/mdgoharkhan'}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackTelemetry('Clicked Uplink LinkedIn')}
                className="p-1.5 sm:p-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-200 hover:scale-[1.03] group text-center"
                style={{
                  background: 'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 15%)',
                  borderColor: 'color-mix(in srgb, var(--theme-text) 14%, transparent)',
                }}
              >
                <Linkedin className="w-3.5 h-3.5 group-hover:text-[var(--theme-primary)] transition-colors" />
                <span className="text-[8.5px] font-mono uppercase tracking-wider">LinkedIn</span>
              </a>

              <a
                href={links?.x || 'https://x.com'}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackTelemetry('Clicked Uplink X')}
                className="p-1.5 sm:p-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-200 hover:scale-[1.03] group text-center"
                style={{
                  background: 'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 15%)',
                  borderColor: 'color-mix(in srgb, var(--theme-text) 14%, transparent)',
                }}
              >
                <Twitter className="w-3.5 h-3.5 group-hover:text-[var(--theme-primary)] transition-colors" />
                <span className="text-[8.5px] font-mono uppercase tracking-wider">X / Intel</span>
              </a>

              <a
                href={links?.resumeUrl || '/resume.pdf'}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackTelemetry('Clicked Uplink Resume PDF')}
                className="p-1.5 sm:p-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-200 hover:scale-[1.03] group text-center"
                style={{
                  background:
                    'color-mix(in srgb, var(--theme-primary) 14%, var(--theme-bg) 86%)',
                  borderColor: 'color-mix(in srgb, var(--theme-primary) 40%, transparent)',
                  color: 'var(--theme-primary)',
                }}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[8.5px] font-mono uppercase tracking-wider font-bold">
                  Resume
                </span>
              </a>
            </div>
          </div>

          {/* Operator Telemetry Box */}
          <div
            className="p-2 sm:p-2.5 rounded-xl border font-mono text-[9.5px] sm:text-[10px] space-y-1 mt-auto"
            style={{
              background: 'color-mix(in srgb, var(--theme-bg) 95%, var(--theme-text) 5%)',
              borderColor: 'color-mix(in srgb, var(--theme-text) 10%, transparent)',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="flex items-center gap-1.5"
                style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}
              >
                <Clock className="w-3 h-3 text-emerald-400" /> RESPONSE_SLA:
              </span>
              <span className="font-bold text-emerald-400">&lt; 4 Hours</span>
            </div>

            <div className="flex items-center justify-between">
              <span
                className="flex items-center gap-1.5"
                style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}
              >
                <MapPin className="w-3 h-3 text-amber-400" /> TIMEZONE:
              </span>
              <span className="font-semibold text-right">IST (UTC +5:30) // Remote Ready</span>
            </div>

            <div className="flex items-center justify-between">
              <span
                className="flex items-center gap-1.5"
                style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}
              >
                <GraduationCap className="w-3 h-3 text-blue-400" /> EDUCATION:
              </span>
              <span className="font-semibold text-right">NIT Silchar &apos;26 • NCC Cadet</span>
            </div>
          </div>
        </div>

        {/* ════ Right Column: Interactive 1-Click Dispatch Console (lg:col-span-7) ═ */}
        <div
          className="lg:col-span-7 rounded-2xl border p-3.5 sm:p-4 lg:p-5 flex flex-col justify-between overflow-hidden shadow-2xl relative"
          style={{
            background: 'color-mix(in srgb, var(--theme-bg) 90%, var(--theme-text) 10%)',
            borderColor: 'color-mix(in srgb, var(--theme-primary) 35%, transparent)',
            boxShadow: `0 20px 50px color-mix(in srgb, var(--theme-primary) 12%, transparent)`,
          }}
        >
          <AnimatePresence mode="wait">
            {!receipt ? (
              <motion.form
                key="dispatch-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="flex flex-col justify-between h-full space-y-2.5"
              >
                {/* Step 1: 4 Interactive Intent Preset Pills */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="font-mono text-xs uppercase tracking-wider font-bold"
                      style={{ color: 'var(--theme-primary)' }}
                    >
                      Step 1 // Select Transmission Intent:
                    </span>
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}
                    >
                      [Auto-Fills Tailored Draft]
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(CONTACT_INTENTS) as ContactIntentKey[]).map((intentKey) => {
                      const cfg = CONTACT_INTENTS[intentKey];
                      const isSelected = activeIntent === intentKey;

                      return (
                        <button
                          key={intentKey}
                          type="button"
                          onClick={() => handleSelectIntent(intentKey)}
                          className="px-2.5 py-1.5 sm:py-2 rounded-xl border font-mono text-[10.5px] sm:text-[11px] font-bold transition-all duration-200 text-left flex items-center justify-between gap-1.5 cursor-pointer"
                          style={{
                            background: isSelected
                              ? `color-mix(in srgb, ${cfg.primaryHex} 18%, var(--theme-bg) 82%)`
                              : 'color-mix(in srgb, var(--theme-bg) 95%, var(--theme-text) 5%)',
                            borderColor: isSelected
                              ? cfg.primaryHex
                              : 'color-mix(in srgb, var(--theme-text) 14%, transparent)',
                            color: isSelected
                              ? cfg.primaryHex
                              : 'color-mix(in srgb, var(--theme-text) 75%, transparent)',
                            boxShadow: isSelected
                              ? `0 0 16px color-mix(in srgb, ${cfg.primaryHex} 25%, transparent)`
                              : 'none',
                          }}
                        >
                          <span className="truncate">{cfg.label}</span>
                          {isSelected && (
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: cfg.primaryHex }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Form Inputs */}
                <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                  {/* Compact 3-Column Sender Credentials Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
                    {/* Name */}
                    <div>
                      <label
                        className="block font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] font-semibold mb-1"
                        style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, var(--theme-bg))' }}
                      >
                        Sender Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm border focus:outline-none transition-all leading-normal"
                        style={{
                          background:
                            'color-mix(in srgb, var(--theme-bg) 94%, var(--theme-text) 6%)',
                          borderColor:
                            'color-mix(in srgb, var(--theme-text) 14%, transparent)',
                          color: 'var(--theme-text)',
                        }}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        className="block font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] font-semibold mb-1"
                        style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, var(--theme-bg))' }}
                      >
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm border focus:outline-none transition-all leading-normal"
                        style={{
                          background:
                            'color-mix(in srgb, var(--theme-bg) 94%, var(--theme-text) 6%)',
                          borderColor:
                            'color-mix(in srgb, var(--theme-text) 14%, transparent)',
                          color: 'var(--theme-text)',
                        }}
                      />
                    </div>

                    {/* Company / Secondary Input */}
                    <div>
                      <label
                        className="block font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] font-semibold mb-1 truncate"
                        style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, var(--theme-bg))' }}
                      >
                        {intentConfig.secondaryInputLabel}
                      </label>
                      <input
                        type="text"
                        value={companyOrRole}
                        onChange={(e) => setCompanyOrRole(e.target.value)}
                        placeholder={intentConfig.secondaryInputPlaceholder}
                        className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm border focus:outline-none transition-all leading-normal"
                        style={{
                          background:
                            'color-mix(in srgb, var(--theme-bg) 94%, var(--theme-text) 6%)',
                          borderColor: 'color-mix(in srgb, var(--theme-text) 14%, transparent)',
                          color: 'var(--theme-text)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Special UI: 5-Star / 5-Bolt Rating Selector if PORTFOLIO_REVIEW */}
                  <AnimatePresence>
                    {activeIntent === 'PORTFOLIO_REVIEW' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-3.5 py-2 rounded-xl border flex items-center justify-between"
                          style={{
                            background:
                              'color-mix(in srgb, var(--theme-primary) 10%, var(--theme-bg) 90%)',
                            borderColor:
                              'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
                            <span
                              className="font-mono text-xs font-bold uppercase tracking-wider"
                              style={{ color: 'var(--theme-primary)' }}
                            >
                              Portfolio System Score:
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((starVal) => {
                              const activeStars = hoverRating !== null ? hoverRating : rating;
                              const isFilled = starVal <= activeStars;
                              return (
                                <button
                                  key={starVal}
                                  type="button"
                                  onMouseEnter={() => setHoverRating(starVal)}
                                  onMouseLeave={() => setHoverRating(null)}
                                  onClick={() => setRating(starVal)}
                                  className="p-1 rounded transition-transform hover:scale-125 cursor-pointer"
                                >
                                  <Star
                                    className={`w-4 h-4 transition-colors ${
                                      isFilled ? 'fill-current' : 'opacity-30'
                                    }`}
                                    style={{ color: 'var(--theme-primary)' }}
                                  />
                                </button>
                              );
                            })}
                            <span
                              className="font-mono text-xs font-bold ml-1.5"
                              style={{ color: 'var(--theme-primary)' }}
                            >
                              {rating} / 5
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Zero-Scroll Auto-Expanding Message Canvas */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-1">
                      <label
                        className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] font-semibold"
                        style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, var(--theme-bg))' }}
                      >
                        Transmission Brief & Scope *
                      </label>

                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-[10px]"
                          style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}
                        >
                          ~{readTimeSeconds}s read • {wordCount} words
                        </span>

                        <button
                          type="button"
                          onClick={handleResetToTemplate}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border hover:underline cursor-pointer transition-colors"
                          style={{
                            background: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--theme-primary) 25%, transparent)',
                            color: 'var(--theme-primary)',
                          }}
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Reset Template</span>
                        </button>
                      </div>
                    </div>

                    <div
                      className="flex-1 rounded-xl border p-1 relative transition-all overflow-hidden"
                      style={{
                        background:
                          'color-mix(in srgb, var(--theme-bg) 94%, var(--theme-text) 6%)',
                        borderColor: 'color-mix(in srgb, var(--theme-text) 14%, transparent)',
                      }}
                    >
                      <textarea
                        ref={textareaRef}
                        required
                        value={message}
                        onChange={handleMessageChange}
                        className="w-full h-full min-h-[135px] sm:min-h-[155px] p-2.5 sm:p-3 rounded-lg font-medium text-xs sm:text-[14.5px] leading-relaxed bg-transparent border-0 focus:outline-none resize-none overflow-hidden"
                        style={{
                          color: 'var(--theme-text)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-2 rounded text-xs font-mono bg-red-500/10 border border-red-500/30 text-red-400">
                    {errorMsg}
                  </div>
                )}

                {/* Step 3: Transmit Button */}
                <div className="pt-0.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 rounded-xl font-mono text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] shadow-xl cursor-pointer disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--theme-primary)',
                      color: 'var(--theme-bg)',
                      boxShadow: `0 0 24px color-mix(in srgb, var(--theme-primary) 35%, transparent)`,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>ENCRYPTING & TRANSMITTING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>TRANSMIT DISPATCH PAYLOAD →</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              /* ── Transmission Receipt Verified Screen ─────────────────── */
              <motion.div
                key="dispatch-receipt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col justify-between h-full space-y-3"
              >
                {/* Verified Header */}
                <div
                  className="border-b pb-2.5"
                  style={{ borderColor: 'color-mix(in srgb, var(--theme-text) 15%, transparent)' }}
                >
                  <div
                    className="flex items-center gap-2 font-mono text-xs font-bold uppercase mb-1"
                    style={{ color: 'var(--theme-primary)' }}
                  >
                    <CheckCircle2 className="w-4 h-4 animate-bounce" style={{ color: 'var(--theme-primary)' }} />
                    <span>TRANSMISSION VERIFIED // DISPATCH RECEIPT</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                    Intel Secured In Operator HUD
                  </h3>
                  <div className="flex items-center gap-3 mt-1 font-mono text-[11px]">
                    <span
                      className="px-2 py-0.5 rounded font-bold border"
                      style={{
                        background: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
                        borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
                        color: 'var(--theme-primary)',
                      }}
                    >
                      ID: #TX-{receipt.dispatchId.slice(-6).toUpperCase()}
                    </span>
                    <span style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>
                      TIMESTAMP: {receipt.timestamp}
                    </span>
                  </div>
                </div>

                {/* Echoed Message Dossier */}
                <div
                  className="p-3.5 rounded-xl border font-mono text-xs space-y-2.5"
                  style={{
                    background: 'color-mix(in srgb, var(--theme-bg) 85%, var(--theme-text) 15%)',
                    borderColor: 'color-mix(in srgb, var(--theme-text) 15%, transparent)',
                  }}
                >
                  <div
                    className="flex items-center justify-between border-b pb-1.5"
                    style={{ borderColor: 'color-mix(in srgb, var(--theme-text) 10%, transparent)' }}
                  >
                    <div>
                      <span className="text-[9px] uppercase opacity-60 block">Sender</span>
                      <strong>{receipt.name}</strong> ({receipt.email})
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase"
                      style={{
                        background: 'color-mix(in srgb, var(--theme-primary) 15%, transparent)',
                        borderColor: 'var(--theme-primary)',
                        color: 'var(--theme-primary)',
                      }}
                    >
                      {intentConfig.label}
                    </span>
                  </div>

                  {receipt.companyOrRole && (
                    <div
                      className="border-b pb-1.5"
                      style={{ borderColor: 'color-mix(in srgb, var(--theme-text) 10%, transparent)' }}
                    >
                      <span className="text-[9px] uppercase opacity-60 block">Entity / Role</span>
                      <span>{receipt.companyOrRole}</span>
                    </div>
                  )}

                  {receipt.rating && (
                    <div
                      className="flex items-center gap-1.5 border-b pb-1.5"
                      style={{ borderColor: 'color-mix(in srgb, var(--theme-text) 10%, transparent)' }}
                    >
                      <span className="text-[9px] uppercase opacity-60 block mr-2">Review Score:</span>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= receipt.rating!
                              ? 'fill-current'
                              : 'opacity-30'
                          }`}
                          style={{ color: 'var(--theme-primary)' }}
                        />
                      ))}
                      <span className="font-bold ml-1" style={{ color: 'var(--theme-primary)' }}>
                        {receipt.rating}/5
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-[9px] uppercase opacity-60 block mb-1">Payload Content</span>
                    <p className="whitespace-pre-wrap leading-relaxed opacity-90 text-[11px]">
                      {receipt.message}
                    </p>
                  </div>
                </div>

                {/* SLA Guarantee Note */}
                <div
                  className="p-2.5 rounded-lg border font-mono text-[10px] flex items-center gap-2"
                  style={{
                    background: 'color-mix(in srgb, var(--theme-primary) 8%, var(--theme-bg) 92%)',
                    borderColor: 'color-mix(in srgb, var(--theme-primary) 25%, transparent)',
                    color: 'var(--theme-primary)',
                  }}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                  <span>
                    DISPATCH ROUTED DIRECTLY TO OPERATOR TERMINAL // GUARANTEED SLA &lt; 4 HOURS.
                  </span>
                </div>

                {/* Receipt Action Buttons */}
                <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="flex-1 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border transition-colors hover:border-current cursor-pointer"
                    style={{
                      background: 'color-mix(in srgb, var(--theme-bg) 80%, var(--theme-text) 10%)',
                      borderColor: 'color-mix(in srgb, var(--theme-text) 20%, transparent)',
                    }}
                  >
                    Send Another Transmission
                  </button>

                  <a
                    href={links?.resumeUrl || '/resume.pdf'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-center transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--theme-primary)',
                      color: 'var(--theme-bg)',
                    }}
                  >
                    <span>Download Resume (PDF)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
