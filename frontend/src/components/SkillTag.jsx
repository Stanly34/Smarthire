import React from 'react';

export default function SkillTag({ name, removable, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
      {name}
      {removable && (
        <button
          onClick={() => onRemove(name)}
          className="ml-1 text-blue-600 hover:text-blue-900 font-bold"
        >
          ×
        </button>
      )}
    </span>
  );
}
