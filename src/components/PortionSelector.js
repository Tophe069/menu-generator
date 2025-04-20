import React from 'react';

export default function PortionSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <label className="font-medium">Nombre de personnes :</label>
      <input
        type="number"
        min={1}
        max={12}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-16 px-2 py-1 border rounded"
      />
    </div>
  );
}
