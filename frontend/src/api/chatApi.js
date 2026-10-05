const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const sendPrompt = async (text) => {
  const response = await fetch(`${API_BASE}/send-prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
