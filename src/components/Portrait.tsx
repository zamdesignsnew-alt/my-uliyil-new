'use client';
import { useState } from 'react';
import { site } from '@/lib/config';
import { UserRound } from 'lucide-react';

export function Portrait({ className = '', src }: { className?: string; src?: string }) {
  const [failed, setFailed] = useState(false);
  const imageSrc = src || site.councillor.portrait;

  return (
    <div className={`portrait ${className}`}>
      {!failed ? (
        <img
          src={imageSrc}
          alt="Shabna Teacher, Ward Councillor"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="portrait-placeholder">
          <UserRound size={42} strokeWidth={1.3} />
          <span>
            Councillor portrait
            <br />
            awaiting upload
          </span>
        </div>
      )}
    </div>
  );
}
