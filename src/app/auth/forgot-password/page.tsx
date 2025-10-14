'use client';

import { useForgotPassword } from './hooks/useForgotPassword';
import EmailStage from './components/EmailStage';
import OtpStage from './components/OtpStage';
import ResetStage from './components/ResetStage';

export default function ForgotPasswordPage() {
  const { state, actions } = useForgotPassword();

  return (
    <>
      {state.stage === 'email' && <EmailStage state={state} actions={actions} />}
      {state.stage === 'otp' && <OtpStage state={state} actions={actions} />}
      {state.stage === 'reset' && <ResetStage state={state} actions={actions} />}
    </>
  );
}
