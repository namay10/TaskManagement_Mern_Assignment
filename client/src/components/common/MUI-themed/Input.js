import { useRef, useEffect } from "react";
import "./MUI-themed.css";

const Input = ({ label, type = "text", val, setVal, required = false, className = "" }) => {
  const materialInput = useRef(null);
  const materialLabel = useRef(null);

  useEffect(() => {
    materialLabel.current.addEventListener("click", () => {
      materialInput.current.focus();
    });
  }, []);

  return (
    <div className={"input-group " + className}>
      <input
        type={type}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        required={required}
        ref={materialInput}
        placeholder="."
      />
      <label ref={materialLabel}>{label}</label>
    </div>
  );
};

export default Input;
