"use client";
import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  url: string;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ url, children, className }) => {
  const handleClick = () => {
    window.open(url, "_blank");
  };

  return (
    <button
      className={`${styles.button} ${className ? className : ""}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
