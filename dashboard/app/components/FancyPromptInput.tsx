'use client'

import { useRef } from 'react'

interface FancyPromptInputProps {
  value: string
  onChange: (val: string) => void
  onSubmit: () => void
  loading?: boolean
  placeholder?: string
}

export default function FancyPromptInput({
  value,
  onChange,
  onSubmit,
  loading,
  placeholder = "Describe your idea, question, or code problem..."
}: FancyPromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="relative group">
      {/* Glow border on focus */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none 
          transition shadow-2xl
          ${value
            ? "ring-2 ring-blue-400/60 group-focus-within:ring-4 group-focus-within:ring-blue-500/80"
            : "ring-1 ring-gray-200 group-hover:ring-blue-300/40"}
        `}
      />
      <textarea
        ref={textareaRef}
        className={`
          w-full p-5 pt-6 min-h-[96px] rounded-2xl resize-none
          bg-white/90 dark:bg-gray-800/80
          text-lg text-gray-900 dark:text-blue-100
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          outline-none border-none z-10 relative shadow-inner
          transition focus:ring-2 focus:ring-blue-400
        `}
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit()
          }
        }}
        disabled={loading}
        spellCheck={false}
        autoFocus
      />
      {/* Floating label */}
      <span className={`
        absolute left-5 top-3 text-xs z-20 
        ${value ? "text-blue-400" : "text-gray-400"}
        pointer-events-none transition-all duration-200
      `}>
        ZeroDev Prompt
      </span>
      {/* Submit button */}
      <button
        type="button"
        className={`
          absolute bottom-3 right-3 rounded-full p-2
          bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900
          text-white shadow-lg transition
          ${loading ? "opacity-60 pointer-events-none" : ""}
        `}
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        aria-label="Send Prompt"
      >
        {loading ? (
          <svg className="animate-spin w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          // Send icon
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mx-auto">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        )}
      </button>
    </div>
  )
}
