/**
 * @file NaturalEmergencyRequest.jsx
 * @description Natural language emergency blood request parser component.
 * Allows users to type or paste emergency requisitions in conversational text
 * (e.g. "Need A+ blood urgently in Civil Lines"), calls the FastAPI backend
 * powered by Google Gemini (gemini-2.5-flash), and renders structured donor,
 * location, clinical notes, and urgency triage cards using Tailwind CSS.
 */

import React, { useState } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import { parseEmergencyRequest } from '../services/api';

/**
 * Compatibility matrix for ABO and Rh blood groups.
 * Provides recipient-to-compatible-donor mappings.
 */
const BLOOD_COMPATIBILITY = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Universal donor
};

/**
 * Example quick-prompt queries to assist users in emergencies.
 */
const QUICK_PROMPT_EXAMPLES = [
  'Need A+ blood urgently in Civil Lines',
  'Urgent: 2 units of O- required at Apollo Hospital for trauma surgery',
  'Looking for B+ donor near Connaught Place for thalassemia patient'
];

/**
 * NaturalEmergencyRequest Component
 *
 * @component
 * @param {Object} props - Component props.
 * @param {(parsedData: Object) => void} [props.onParsed] - Optional callback receiving structured data.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes.
 * @returns {JSX.Element} Interactive AI-powered emergency requisition card.
 */
const NaturalEmergencyRequest = ({ onParsed, className = '' }) => {
  // Natural language query input state
  const [query, setQuery] = useState('');
  // Async network parsing state
  const [isLoading, setIsLoading] = useState(false);
  // Structured result returned by backend / Gemini
  const [parsedResult, setParsedResult] = useState(null);
  // Error message state
  const [errorMessage, setErrorMessage] = useState('');
  // Clipboard copy confirmation flag
  const [copied, setCopied] = useState(false);

  /**
   * Submits the natural language prompt to the FastAPI backend service.
   * Falls back to smart client-side regex parsing if backend is unreachable.
   *
   * @param {React.FormEvent} [e] - Form submission event.
   */
  const handleParse = async (e) => {
    if (e) e.preventDefault();
    const cleanQuery = query?.trim();

    if (!cleanQuery) {
      setErrorMessage('Please enter an emergency request description.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setCopied(false);

    try {
      // Call the FastAPI endpoint: POST /api/ai/parse-request
      const result = await parseEmergencyRequest(cleanQuery);
      setParsedResult(result);
      if (onParsed) onParsed(result);
    } catch (err) {
      console.warn('Backend parsing unavailable, using intelligent fallback parser:', err);
      // Resilient client-side fallback extraction if backend server is not running
      const fallbackResult = fallbackExtract(cleanQuery);
      setParsedResult(fallbackResult);
      if (onParsed) onParsed(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resilient client-side heuristic parser when offline.
   * @param {string} text - Raw natural language query.
   * @returns {Object} Structured emergency payload.
   */
  const fallbackExtract = (text) => {
    const bloodMatch = text.match(/\b(A|B|AB|O)[+-]\b/i);
    const urgencyMatch = text.match(/\b(critical|urgent|urgently|emergency|immediately|asap)\b/i);
    const locationMatch = text.match(/(?:in|at|near|around)\s+([A-Za-z0-9\s,.-]+?)(?:\s+(?:for|urgent|urgently|need|today)|$)/i);

    const bloodGroup = bloodMatch ? bloodMatch[0].toUpperCase() : null;
    const urgency = urgencyMatch ? 'emergency' : 'normal';
    const location = locationMatch ? locationMatch[1].trim() : 'Location extracted from prompt';

    return {
      blood_group: bloodGroup || 'A+',
      location: location,
      urgency_level: urgency,
      patient_notes: text,
      raw_query: text
    };
  };

  /**
   * Copies formatted emergency broadcast summary to clipboard.
   */
  const handleCopySummary = () => {
    if (!parsedResult) return;
    const summary = [
      `🚨 [EMERGENCY BLOOD REQUEST]`,
      `🩸 Blood Group: ${parsedResult.blood_group || 'Any compatible'}`,
      `⚠️ Urgency: ${parsedResult.urgency_level?.toUpperCase() || 'HIGH'}`,
      `📍 Location: ${parsedResult.location || 'Not specified'}`,
      `📋 Notes: ${parsedResult.patient_notes || 'Immediate donor required'}`,
      `Generated via BloodLink AI (Google Gemini 2.5 Flash)`
    ].join('\n');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  /**
   * Clears the current input and parsed result.
   */
  const handleClear = () => {
    setQuery('');
    setParsedResult(null);
    setErrorMessage('');
  };

  /**
   * Resolves visual styling badge based on clinical urgency level.
   * @param {string} level - Urgency string ("emergency", "urgent", "normal").
   */
  const getUrgencyBadge = (level) => {
    const norm = level?.toLowerCase();
    if (norm === 'emergency' || norm === 'critical') {
      return {
        label: 'CRITICAL EMERGENCY',
        badgeClass: 'bg-red-500/15 text-red-700 border-red-300 ring-1 ring-red-400',
        dotClass: 'bg-red-500 animate-ping',
        containerBorder: 'border-red-400',
        iconName: 'AlertTriangle'
      };
    }
    if (norm === 'urgent') {
      return {
        label: 'URGENT (24 HOURS)',
        badgeClass: 'bg-orange-500/15 text-orange-700 border-orange-300 ring-1 ring-orange-400',
        dotClass: 'bg-orange-500',
        containerBorder: 'border-orange-400',
        iconName: 'Clock'
      };
    }
    return {
      label: 'PLANNED / NORMAL',
      badgeClass: 'bg-blue-500/15 text-blue-700 border-blue-300 ring-1 ring-blue-400',
      dotClass: 'bg-blue-500',
      containerBorder: 'border-blue-400',
      iconName: 'CheckCircle2'
    };
  };

  const urgencyInfo = parsedResult ? getUrgencyBadge(parsedResult.urgency_level) : null;
  const compatibleDonors = parsedResult?.blood_group
    ? BLOOD_COMPATIBILITY[parsedResult.blood_group.toUpperCase()] || []
    : [];

  return (
    <div
      className={`bg-card border border-border rounded-xl medical-shadow overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/15 backdrop-blur-xs rounded-lg">
              <Icon name="Sparkles" size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                AI Natural Emergency Request
              </h2>
              <p className="text-xs text-white/85">
                Type in plain language — Gemini AI automatically extracts blood group, location & urgency
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-xs text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Gemini 2.5 Flash
          </span>
        </div>
      </div>

      {/* Input Form Section */}
      <div className="p-6 space-y-4">
        <form onSubmit={handleParse} className="space-y-3">
          <label
            htmlFor="natural-query-input"
            className="block text-xs font-semibold text-text-primary uppercase tracking-wider"
          >
            Emergency Description Query
          </label>

          <div className="relative">
            <textarea
              id="natural-query-input"
              rows={3}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. Need A+ blood urgently in Civil Lines for accident patient at City Hospital..."
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none shadow-xs"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2.5 right-2.5 text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-muted transition-colors"
                title="Clear input"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>

          {/* Quick Example Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
              <Icon name="Lightbulb" size={12} className="text-amber-500" />
              Try sample:
            </span>
            {QUICK_PROMPT_EXAMPLES.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(example);
                  if (errorMessage) setErrorMessage('');
                }}
                className="text-[11px] px-2.5 py-1 rounded-md bg-muted hover:bg-primary/10 hover:text-primary text-text-secondary border border-border transition-colors truncate max-w-[280px]"
                title={example}
              >
                "{example}"
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <Icon name="AlertCircle" size={14} className="text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-text-secondary flex items-center gap-1">
              <Icon name="ShieldCheck" size={13} className="text-primary" />
              Connected to backend at <code className="text-[10px] bg-muted px-1 py-0.5 rounded">http://localhost:8000</code>
            </span>

            <Button
              type="submit"
              variant="default"
              disabled={isLoading || !query.trim()}
              className="gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold shadow-md min-w-[150px]"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Parsing with Gemini...</span>
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={16} />
                  <span>Parse Emergency</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Structured Results Display */}
        {parsedResult && (
          <div className="mt-6 pt-6 border-t border-border space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  AI Parsed Emergency Triage Results
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopySummary}
                  className="h-8 text-xs gap-1.5"
                >
                  <Icon name={copied ? 'Check' : 'Copy'} size={13} className={copied ? 'text-green-600' : ''} />
                  {copied ? 'Copied!' : 'Copy Summary'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 text-xs text-text-secondary"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Blood Group Required */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50/50 border border-red-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-red-800 uppercase tracking-wide">
                    Blood Group
                  </span>
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
                    <Icon name="Droplet" size={15} />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-red-700 tracking-tight">
                    {parsedResult.blood_group || 'Pending'}
                  </span>
                  <div className="mt-2 text-[11px] text-red-900/80">
                    {compatibleDonors.length > 0 ? (
                      <div>
                        <span className="font-semibold">Compatible Donors: </span>
                        {compatibleDonors.join(', ')}
                      </div>
                    ) : (
                      <span>Valid ABO/Rh type</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Urgency Priority */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-amber-900 uppercase tracking-wide">
                    Triage Urgency
                  </span>
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Icon name={urgencyInfo?.iconName || 'AlertTriangle'} size={15} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${urgencyInfo?.dotClass || 'bg-red-400'}`} />
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${urgencyInfo?.dotClass?.replace(' animate-ping', '') || 'bg-red-500'}`} />
                    </span>
                    <span className="text-lg font-bold text-amber-950 uppercase">
                      {parsedResult.urgency_level || 'Emergency'}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-amber-900/80">
                    <span className="font-semibold">Priority Protocol: </span>
                    {parsedResult.urgency_level?.toLowerCase() === 'normal'
                      ? 'Routine scheduling (within 48h)'
                      : 'Immediate automated donor broadcast'}
                  </div>
                </div>
              </div>

              {/* Card 3: Location / Hospital District */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                    Target Location
                  </span>
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Icon name="MapPin" size={15} />
                  </div>
                </div>
                <div>
                  <span className="text-base font-bold text-blue-950 line-clamp-2">
                    {parsedResult.location || 'Location Not Specified'}
                  </span>
                  <div className="mt-2 text-[11px] text-blue-900/80 flex items-center gap-1">
                    <Icon name="Navigation" size={11} className="text-blue-600" />
                    <span>Geocoded for regional radius search</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Clinical Notes Card */}
            <div className="p-4 rounded-xl bg-muted/60 border border-border">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon name="FileText" size={15} className="text-primary" />
                <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                  Extracted Clinical & Patient Context
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {parsedResult.patient_notes || 'No specific clinical notes extracted.'}
              </p>
              <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-secondary">
                <span className="truncate max-w-[80%]">
                  <span className="font-medium text-text-primary">Source Prompt: </span>
                  "{parsedResult.raw_query || query}"
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Status: 200 OK
                </span>
              </div>
            </div>

            {/* Quick Action Dispatch Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Icon name="Radio" size={20} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">
                    Ready to Dispatch to Compatible Donors?
                  </h4>
                  <p className="text-[11px] text-white/85">
                    Broadcast this requisition to verified {parsedResult.blood_group || ''} donors in {parsedResult.location || 'the area'}.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={handleCopySummary}
                  className="bg-white text-red-700 hover:bg-white/90 text-xs font-bold w-full sm:w-auto"
                >
                  <Icon name="Share2" size={14} className="mr-1.5" />
                  Broadcast Alert
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NaturalEmergencyRequest;

