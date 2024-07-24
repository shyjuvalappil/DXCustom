// import the OTP Input component

// import React from 'react';
import OTPInput from './index';

const VerifyUser = () => {
  // handle OTP Submit
  const handleSubmit = (pin: string) => {
    // handle api request here but I'm console logging it
    console.log(pin);
  };

  return (
    <section className='h-screen w-screen flex flex-col justify-center items-center'>
      <h2>Verify OTP</h2>

      <p>An OTP has been sent to your email address, kindly enter them here</p>

      <OTPInput length={5} onComplete={handleSubmit} />
    </section>
  );
};

export default VerifyUser;
