'use client';

import { useState } from 'react';

export default function Test() {
  const [text, setText] = useState('');

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={formSubmit} className="flex flex-col gap-4">
        <textarea
          className="text-black"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text here"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
