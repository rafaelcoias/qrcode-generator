import React from 'react';

interface InputProps {
  label: string;
  type?: string;
  value: string | number;
  setValue: (value: any) => void;
  error?: string;
}

export default function Input({ label, type = 'text', value, setValue , error}: InputProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      <div className='flex items-center gap-4 '>

      <p className="pl-4 font-garet text-balance">{label}</p>
     {error && <span className='text-xs text-red-800 '>*{error}</span>}
      </div>
      <input
        type={type}
        placeholder=""
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input"
      />
      
    </div>
  );
}
