import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Verify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const VerifyAccount = () => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = sessionStorage.getItem("resetEmail");

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer, navigate, email]);

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const verificationCode = code.join("");

    try {
      const response = await fetch("http://localhost:5000/api/fuel_stations/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate(`/new-password?code=${verificationCode}&email=${email}`), 2000);
      } else {
        setError(data.error || "Invalid or expired code. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleResend = async () => {
    if (canResend) {
      try {
        const response = await fetch("http://localhost:5000/api/fuel_stations/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("A new reset code has been sent to your email.");
          setTimer(30);
          setCanResend(false);
        } else {
          setError(data.error || "Failed to resend code. Please try again.");
        }
      } catch (err) {
        console.error("Error resending code:", err);
        setError("An error occurred. Please try again.");
      }
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
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
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