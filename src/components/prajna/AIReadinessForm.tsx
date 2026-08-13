import React from 'react';
import type { AIReadiness } from '../../types/prajna';
import { Bot, CheckCircle2, Sparkles } from 'lucide-react';

interface AIReadinessFormProps {
  aiData: AIReadiness;
  onChange: (field: keyof AIReadiness, value: any) => void;
}

const AI_TOOLS_LIST = [
  'ChatGPT',
  'Gemini',
  'Claude',
  'Perplexity',
  'Copilot',
  'Canva AI',
  'Midjourney / DALL-E',
  'Others'
];

const AI_PURPOSES_LIST = [
  'Idea Validation',
  'Research & Literature Search',
  'Presentation & Slides',
  'Writing & Formatting Report',
  'Image Generation',
  'Coding & Technical Calculation',
  'Others'
];

export const AIReadinessForm: React.FC<AIReadinessFormProps> = ({ aiData, onChange }) => {
  const toggleTool = (tool: string) => {
    const current = aiData.aiTools || [];
    if (current.includes(tool)) {
      onChange('aiTools', current.filter(t => t !== tool));
    } else {
      onChange('aiTools', [...current, tool]);
    }
  };

  const togglePurpose = (purpose: string) => {
    const current = aiData.aiPurposes || [];
    if (current.includes(purpose)) {
      onChange('aiPurposes', current.filter(p => p !== purpose));
    } else {
      onChange('aiPurposes', [...current, purpose]);
    }
  };

  return (
    <div className="bg-[#2A0000] border-2 border-[#D4AF37]/40 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#D4AF37]/30 pb-4">
        <div className="bg-[#8B0000] text-[#FFD700] p-2.5 rounded-xl border border-[#D4AF37]/40 shadow-md">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white font-serif flex items-center gap-2">
            AI Readiness & Transparency Disclosure
            <span className="bg-[#FFD700] text-[#2A0000] text-[10px] font-black px-2 py-0.5 rounded uppercase">
              Ethical AI Checklist
            </span>
          </h4>
          <p className="text-xs text-amber-200/70 mt-0.5">
            Encouraging responsible AI usage while maintaining authentic field observations.
          </p>
        </div>
      </div>

      {/* Main Question */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-white">
          Did your team use Artificial Intelligence (AI) tools while preparing this submission?
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onChange('usedAI', 'Yes')}
            className={`flex-1 py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              aiData.usedAI === 'Yes'
                ? 'bg-[#8B0000] border-[#FFD700] text-[#FFD700] shadow-lg'
                : 'bg-[#1F0000] border-[#D4AF37]/30 text-amber-100/70 hover:border-[#D4AF37]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            Yes, we used AI assistance
          </button>

          <button
            type="button"
            onClick={() => onChange('usedAI', 'No')}
            className={`flex-1 py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              aiData.usedAI === 'No'
                ? 'bg-[#8B0000] border-[#FFD700] text-[#FFD700] shadow-lg'
                : 'bg-[#1F0000] border-[#D4AF37]/30 text-amber-100/70 hover:border-[#D4AF37]'
            }`}
          >
            No, entirely manual work
          </button>
        </div>
      </div>

      {/* If Yes: Tool and Purpose Selection */}
      {aiData.usedAI === 'Yes' && (
        <div className="space-y-6 pt-3 border-t border-[#D4AF37]/20 animate-fadeIn">
          {/* Which AI Tools? */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#FFD700] uppercase tracking-wider">
              Which AI tools were utilized? (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {AI_TOOLS_LIST.map((tool) => {
                const isSelected = (aiData.aiTools || []).includes(tool);
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-[#2A0000] border-amber-300 font-bold shadow-md'
                        : 'bg-[#1F0000] text-amber-100/80 border-[#D4AF37]/30 hover:border-[#FFD700]'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {tool}
                  </button>
                );
              })}
            </div>
          </div>

          {/* How was AI used? */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#FFD700] uppercase tracking-wider">
              How was AI utilized in your project? (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {AI_PURPOSES_LIST.map((purpose) => {
                const isSelected = (aiData.aiPurposes || []).includes(purpose);
                return (
                  <button
                    key={purpose}
                    type="button"
                    onClick={() => togglePurpose(purpose)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#8B0000] border-[#FFD700] text-[#FFD700] shadow-md'
                        : 'bg-[#1F0000] text-amber-100/80 border-[#D4AF37]/30 hover:border-[#FFD700]'
                    }`}
                  >
                    <span>{purpose}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Declaration check */}
          <div className="bg-[#1F0000] border border-[#D4AF37]/30 p-3.5 rounded-xl flex items-start gap-3">
            <input
              type="checkbox"
              id="aiDeclaration"
              checked={aiData.aiDeclaration}
              onChange={(e) => onChange('aiDeclaration', e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#FFD700] rounded cursor-pointer"
            />
            <label htmlFor="aiDeclaration" className="text-xs text-amber-100/90 cursor-pointer leading-relaxed">
              We confirm that AI tools were used purely as research assistance or formatting aids, and that the on-site problem observation, field photographs, and core proposed solution are original contributions of our team.
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
