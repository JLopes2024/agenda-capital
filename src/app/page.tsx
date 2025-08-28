"use client"; // Next.js 13+ Client Component
import { useEffect, useState } from "react";
import Papa from "papaparse";
import "./page.css";

export default function Home() {
  const [cabecalho, setCabecalho] = useState<string[]>([]);
  const [linhas, setLinhas] = useState<string[][]>([]);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const linkCSV =
          "https://docs.google.com/spreadsheets/d/1puUc-A-JBG1mUYCDaEEXFMJDgb2je46ktxTdb6vaWDs/gviz/tq?tqx=out:csv";
        const res = await fetch(linkCSV);
        const csv = await res.text();

        const { data } = Papa.parse(csv, { skipEmptyLines: true });

        const colunasSelecionadas = [2, 3, 4, 5, 6];

        // cabeçalho na 2ª linha (índice 1)
        const header =
          data[0] && Array.isArray(data[0])
            ? data[0].filter((_: any, idx: number) =>
                colunasSelecionadas.includes(idx)
              )
            : [];
        setCabecalho(header);

        // dados a partir da 3ª linha (índice 2)
        const rows =
          data.length > 2
            ? data.slice(2).map((linha: any) =>
                linha.filter((_: any, idx: number) =>
                  colunasSelecionadas.includes(idx)
                )
              )
            : [];
        setLinhas(rows);
      } catch (error) {
        console.error("Erro ao carregar CSV:", error);
        setCabecalho([]);
        setLinhas([]);
      }
    };

    fetchCSV();
  }, []);

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
          {linhas.map((linha, i) => (
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
