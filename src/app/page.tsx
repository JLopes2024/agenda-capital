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

    const parsed = Papa.parse<string[]>(csv, {
      skipEmptyLines: true,
    });

    if (parsed.data) {
      dados = parsed.data as string[][];
    }
  } catch (error) {
    console.error("Erro ao carregar CSV:", error);
  }

  const colunasSelecionadas = [2, 3, 4, 5, 6,16, 23];

  const cabecalho = dados.length
    ? dados[0].filter((_, idx) => colunasSelecionadas.includes(idx))
    : [];

  let linhasBrutas = dados.length > 1 ? dados.slice(1) : [];

  function parseDateDMY(value: string | undefined | null): Date | null {
    if (!value) return null;
    const datePart = value.split(" ")[0].trim();
    const parts = datePart.split("/");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (year < 100) year += 2000;
    return new Date(year, month - 1, day); // agora retorna Date em vez de timestamp
  }

  // Ordenar pela coluna 3 (índice 2 no CSV original)
  linhasBrutas = linhasBrutas.sort((a, b) => {
    const aDate = parseDateDMY(a[2]);
    const bDate = parseDateDMY(b[2]);

    if (aDate && bDate) return aDate.getTime() - bDate.getTime();
    if (aDate) return -1;
    if (bDate) return 1;
    return 0;
  });

  const hoje = new Date();

  const linhas = linhasBrutas.map((linha) => {
    const dataEvento = parseDateDMY(linha[2]);
    let alerta = false;

    if (dataEvento) {
      const diffMs = dataEvento.getTime() - hoje.getTime();
      const diffDias = diffMs / (1000 * 60 * 60 * 24);
      if (diffDias >= 0 && diffDias < 7) {
        alerta = true;
      }
    }

    return {
      valores: linha.filter((_, idx) => colunasSelecionadas.includes(idx)),
      alerta,
    };
  });

  return (
    <div className="container">
      <h1 className="title">Agenda Externa - SP Capital</h1>

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
              <tr key={i} className={linha.alerta ? "alerta" : ""}>
                {linha.valores.map((celula, j) => (
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