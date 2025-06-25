import React, { useState } from "react";

// --- Helper Functions for Document Generation ---

// Generates an array of 9 random digits.
const randomDigits = (n: number): number[] => {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10));
};

// Calculates the verifier digit for CPF.
const calculateCpfVerifier = (digits: number[]): number => {
  const weights = Array.from(
    { length: digits.length },
    (_, i) => digits.length + 1 - i
  );
  const sum = digits.reduce((acc, digit, i) => acc + digit * weights[i], 0);
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
};

// Calculates the verifier digit for CNPJ.
const calculateCnpjVerifier = (digits: number[]): number => {
  const weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  if (digits.length === 13) {
    weights.unshift(6);
  }
  const sum = digits.reduce((acc, digit, i) => acc + digit * weights[i], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

// --- Main App Component ---

const App = () => {
  // --- State Management ---
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [copiedCpf, setCopiedCpf] = useState(false);
  const [copiedCnpj, setCopiedCnpj] = useState(false);

  // --- Core Logic ---

  /**
   * Generates a valid and formatted CPF number.
   */
  const handleGenerateCpf = () => {
    const baseDigits = randomDigits(9);
    const firstVerifier = calculateCpfVerifier(baseDigits);
    const secondVerifier = calculateCpfVerifier([...baseDigits, firstVerifier]);
    const fullCpf = [...baseDigits, firstVerifier, secondVerifier].join("");

    // Format the CPF: XXX.XXX.XXX-XX
    const formattedCpf = fullCpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );

    setCpf(formattedCpf);
    setCopiedCpf(false); // Reset copy status
  };

  /**
   * Generates a valid and formatted CNPJ number.
   */
  const handleGenerateCnpj = () => {
    const baseDigits = randomDigits(12);
    const firstVerifier = calculateCnpjVerifier(baseDigits);
    const secondVerifier = calculateCnpjVerifier([
      ...baseDigits,
      firstVerifier,
    ]);
    const fullCnpj = [...baseDigits, firstVerifier, secondVerifier].join("");

    // Format the CNPJ: XX.XXX.XXX/XXXX-XX
    const formattedCnpj = fullCnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );

    setCnpj(formattedCnpj);
    setCopiedCnpj(false); // Reset copy status
  };

  /**
   * Copies the given text to the clipboard.
   * Uses the document.execCommand for broader compatibility within iFrames.
   */
  const copyToClipboard = (text: string, type: "cpf" | "cnpj") => {
    if (!text) return;

    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      if (type === "cpf") {
        setCopiedCpf(true);
        setTimeout(() => setCopiedCpf(false), 2000); // Reset after 2 seconds
      } else {
        setCopiedCnpj(true);
        setTimeout(() => setCopiedCnpj(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
    document.body.removeChild(textArea);
  };

  // --- UI Rendering ---

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center font-sans text-white p-4">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-cyan-400">
            Gerador de Documentos
          </h1>
          <p className="text-slate-400 mt-2">
            Gere números de CPF e CNPJ válidos para testes.
          </p>
        </header>

        <main className="space-y-8">
          {/* CPF Generator Section */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-slate-200">CPF</h2>
            <div className="relative flex items-center mb-4">
              <input
                type="text"
                value={cpf}
                readOnly
                placeholder="Clique em 'Gerar' para um novo CPF"
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 pr-24 text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                onClick={() => copyToClipboard(cpf, "cpf")}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                  copiedCpf
                    ? "bg-green-500 text-white"
                    : "bg-slate-600 hover:bg-cyan-500 text-slate-300 hover:text-white"
                }`}
              >
                {copiedCpf ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <button
              onClick={handleGenerateCpf}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-md transition-transform transform hover:scale-105"
            >
              Gerar CPF
            </button>
          </div>

          {/* CNPJ Generator Section */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-slate-200">CNPJ</h2>
            <div className="relative flex items-center mb-4">
              <input
                type="text"
                value={cnpj}
                readOnly
                placeholder="Clique em 'Gerar' para um novo CNPJ"
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 pr-24 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => copyToClipboard(cnpj, "cnpj")}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                  copiedCnpj
                    ? "bg-green-500 text-white"
                    : "bg-slate-600 hover:bg-indigo-500 text-slate-300 hover:text-white"
                }`}
              >
                {copiedCnpj ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <button
              onClick={handleGenerateCnpj}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-md transition-transform transform hover:scale-105"
            >
              Gerar CNPJ
            </button>
          </div>
        </main>

        <footer className="text-center mt-10 text-slate-500 text-sm">
          <p>Feito para fins de desenvolvimento e teste.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
