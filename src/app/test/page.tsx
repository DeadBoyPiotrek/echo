'use client';

import { useState } from 'react';

export default function Test() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setLoading(false);
      setResponse(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={formSubmit} className="flex flex-col gap-4 w-96">
        <textarea
          className="text-black"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text here"
        />
        <button
          className={`${loading ? 'bg-slate-500' : ''} border p-2 rounded-md ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
          type="submit"
        >
          Submit
        </button>
        <div className="text-white">{response}</div>
      </form>
    </div>
  );
}
