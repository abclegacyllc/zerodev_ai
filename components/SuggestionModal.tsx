"use client";

import React from "react";

type Suggestion = {
  suggested_prompt: string;
  confidence: number;
  explanation?: string;
};

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: Suggestion[];
  onApply: (value: string) => void;
}

export default function SuggestionModal({
  isOpen,
  onClose,
  suggestions,
  onApply
}: SuggestionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h3 className="text-lg font-semibold mb-4">✍️ AI Suggestions</h3>

        <ul className="space-y-3">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="border rounded p-3 hover:bg-gray-100 transition cursor-pointer"
              onClick={() => {
                onApply(s.suggested_prompt);
                onClose();
              }}
            >
              <p className="text-sm text-gray-800 mb-1">{s.suggested_prompt}</p>

              {s.explanation && (
                <p className="text-xs text-gray-600 italic mb-1">
                  💡 {s.explanation}
                </p>
              )}

              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="h-2 bg-green-500 rounded"
                  style={{ width: `${s.confidence * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Confidence: {(s.confidence * 100).toFixed(0)}%
              </p>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
