import React, { useState, useEffect } from "react";
import "./Verify.css"; // Import the CSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const VerifyAccount = () => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30); // 30-second timer
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true); // Allow resend after timer ends
    }
  }, [timer]);

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // Ensure only one character is entered
    setCode(newCode);

    // Automatically focus the next input box
    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    console.log("Verification code submitted:", verificationCode);
    // Add logic to handle verification
  };

  const handleResend = () => {
    if (canResend) {
      console.log("Resend verification code");
      setTimer(30); // Reset the timer
      setCanResend(false); // Disable resend until timer ends
    }
  };

  return (
    <div className="verify-account-container">
      <form className="verify-account-form" onSubmit={handleSubmit}>
        <h2 className="verify-account-title">
          <FontAwesomeIcon icon={faCheckCircle} className="verify-account-icon" /> Verify Account
        </h2>
        <p className="verify-account-instructions">
          Enter the 6-digit verification code sent to your email.
        </p>
        <div className="verification-code-container">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="verification-code-input"
              maxLength="1"
            />
          ))}
        </div>
      
        <button type="submit" className="verify-account-button">
          Verify
        </button>
        <div className="resend-container">
          <span className="resend-code">
            Didn't get the code?{" "}
            <span
              onClick={handleResend}
              className={`resend-link ${canResend ? "" : "disabled"}`}
            >
              Resend
            </span>
          </span>
          <span className="timer">{!canResend && `(${timer}s)`}</span>
        </div>
      </form>
    </div>
  );
};

export default VerifyAccount;