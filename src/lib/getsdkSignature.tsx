export async function getZoomSignature(meetingNumber: string, role = 0) {
  const res = await fetch('/api/zoom/sdkSignature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meetingNumber, role }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Failed to generate signature');
  return data.signature;
}
