import { Key } from "react";
import "./page.css";
import Papa from "papaparse";

export default async function Home() {
  const linkCSV =
    "https://docs.google.com/spreadsheets/d/1puUc-A-JBG1mUYCDaEEXFMJDgb2je46ktxTdb6vaWDs/gviz/tq?tqx=out:csv";

  const res = await fetch(linkCSV);
  const csv = await res.text();

  // Parseando corretamente o CSV
  const { data } = Papa.parse(csv, {
    delimiter: "", // Papa tenta detectar automaticamente
    skipEmptyLines: true,
  });

  const colunasSelecionadas = [2,3,4,5,6];

  // cabeçalho na 2ª linha
  const cabecalho = data[0].filter((_, idx) =>
    colunasSelecionadas.includes(idx)
  );

  // dados a partir da 3ª linha
  const linhas = data.slice(2).map((linha) =>
    linha.filter((_, idx) => colunasSelecionadas.includes(idx))
  );

  return (
    <div className="container">
      <h1 className="title">📊 Teste agenda SP</h1>
      <table className="table" border={1} cellPadding={8}>
        <thead>
          <tr>
            {cabecalho.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha: any[], i: Key | null | undefined) => (
            <tr key={i}>
              {linha.map((celula, j) => (
                <td key={j}>{celula}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
