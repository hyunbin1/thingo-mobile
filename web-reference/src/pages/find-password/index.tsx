import { useState } from 'react';
import FindPasswordStep0 from './step-0';
import FindPasswordStep1 from './step-1';

export default function FindPasswordPage() {
  const [step, setStep] = useState<0 | 1>(0);
  const [email, setEmail] = useState('');

  const handleVerified = (verifiedEmail: string) => {
    setEmail(verifiedEmail);
    setStep(1);
  };

  if (step === 1) {
    return <FindPasswordStep1 email={email} />;
  }

  return <FindPasswordStep0 onVerified={handleVerified} />;
}
