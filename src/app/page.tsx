import React from "react";
import Papa from "papaparse"; // npm install papaparse
import "./page.css";

export default async function Home() {
  const linkCSV =
    "https://docs.google.com/spreadsheets/d/1puUc-A-JBG1mUYCDaEEXFMJDgb2je46ktxTdb6vaWDs/gviz/tq?tqx=out:csv";

  let dados: string[][] = [];

  try {
    const res = await fetch(linkCSV, { cache: "no-store" });
    const csv = await res.text();

    // Parse CSV corretamente
    const parsed = Papa.parse<string[]>(csv, {
      skipEmptyLines: true,
    });

    if (parsed.data) {
      dados = parsed.data as string[][];
    }
  } catch (error) {
    console.error("Erro ao carregar CSV:", error);
  }

  // Colunas desejadas (ajuste conforme seu CSV real)
  const colunasSelecionadas = [2, 3, 4, 5, 6];

  const cabecalho = dados.length
    ? dados[0].filter((_, idx) => colunasSelecionadas.includes(idx))
    : [];

  const linhas =
    dados.length > 1
      ? dados.slice(1).map((linha) =>
          linha.filter((_, idx) => colunasSelecionadas.includes(idx))
        )
      : [];

  return (
    <div className="container">
      <h1 className="title">📊 Teste agenda SP</h1>

      {dados.length === 0 ? (
        <p>Carregando dados...</p>
      ) : (
        <table className="table" border={1} cellPadding={8}>
          <thead>
            <tr>
              {cabecalho.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha, i) => (
              <tr key={i}>
                {linha.map((celula, j) => (
                  <td key={j}>{celula}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
