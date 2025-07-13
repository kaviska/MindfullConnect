'use client';

import { JoinWithSDKButton } from '@/components/ui/JoinWithSDKButton';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const statusColors: Record<string, string> = {
  waiting: 'bg-yellow-100 text-yellow-600',
  completed: 'bg-green-100 text-green-600',
  cancelled: 'bg-red-100 text-red-600',
};

interface SessionProps {
  meetingId: string;
  patientId: string;
  startTime: string;
  duration: number;
  joinUrl: string;
  status: string;
}

export default function SessionRow({
  meetingId,
  patientId,
  startTime,
  duration,
  joinUrl,
  status,
}: SessionProps) {
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    setFormattedTime(new Date(startTime).toLocaleString());
  }, [startTime]);

  return (
    <tr className="text-center border-b border-gray-200 hover:bg-gray-50 transition">
      <td className="py-3 px-2 font-mono">{meetingId}</td>
      <td className="py-3 px-2">{patientId}</td>
      <td className="py-3 px-2">{formattedTime || '-'}</td>
      <td className="py-3 px-2">{duration} min</td>
      <td className="py-3 px-2">
        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Join
        </a>
      </td>
      <td className="py-3 px-2">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[status] || 'bg-gray-200 text-gray-600'
          }`}
        >
          {status}
        </span>
      </td>
      <td className="py-3 px-2 flex justify-center gap-4">
        <JoinWithSDKButton meetingId={'85733644491'} sdkKey={'dhyhywQQlm1AqxTlNBpiw'} />
        <Pencil className="text-purple-600 hover:text-purple-800 cursor-pointer" />
        <Trash2 className="text-red-500 hover:text-red-700 cursor-pointer" />
      </td>
    </tr>
  );
}