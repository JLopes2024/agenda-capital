"use client"; // necessário para Client Component
import { useEffect, useState } from "react";
import Papa from "papaparse";
import styles from "./page.module.css"; // CSS Module

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

        const { data } = Papa.parse<string[]>(csv, { skipEmptyLines: true });

        const colunasSelecionadas = [2, 3, 4, 5, 6];

        // cabeçalho na 2ª linha (índice 1)
        const header: string[] =
          data[1]?.filter((_, idx) => colunasSelecionadas.includes(idx)) || [];
        setCabecalho(header);

        // dados a partir da 3ª linha (índice 2)
        const rows: string[][] =
          data.length > 2
            ? data.slice(2).map((linha: string[]) =>
                linha.filter((_, idx) => colunasSelecionadas.includes(idx))
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
    <div className={styles.container}>
      <h1 className={styles.title}>📊 Teste agenda SP</h1>
      <table className={styles.table} border={1} cellPadding={8}>
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
