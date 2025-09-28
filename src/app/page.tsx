"use client";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const [dados, setDados] = useState<string[][]>([]);
  const linkCSV =
    "https://docs.google.com/spreadsheets/d/1puUc-A-JBG1mUYCDaEEXFMJDgb2je46ktxTdb6vaWDs/gviz/tq?tqx=out:csv";

  const colunasSelecionadas = [2, 3, 4, 5, 16, 23];

  useEffect(() => {
    async function fetchCSV() {
      try {
        const res = await fetch(linkCSV, { cache: "no-store" });
        const csv = await res.text();
        const parsed = Papa.parse<string[]>(csv, { skipEmptyLines: true });
        if (parsed.data) setDados(parsed.data as string[][]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCSV();
  }, []);

  function parseDateDMY(dateStr: string): Date | null {
    if (!dateStr) return null;
    const [dia, mes, ano] = dateStr.split("/").map(Number);
    if (!dia || !mes || !ano) return null;
    return new Date(ano, mes - 1, dia);
  }

  const cabecalho = dados.length
    ? dados[0].filter((_, idx) => colunasSelecionadas.includes(idx))
    : [];

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const linhas =
    dados.length > 1
      ? dados.slice(1).map((linha) => {
          const valores = linha.filter((_, idx) =>
            colunasSelecionadas.includes(idx)
          );

          let classe = "";
          const dataEvento = parseDateDMY(valores[1]);
          if (dataEvento) {
            const diffDias = Math.floor(
              (dataEvento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (diffDias === 0) classe = "table-danger"; // HOJE
            else if (diffDias < 0) classe = "table-secondary"; // Passado
            else if (diffDias <= 3) classe = "table-warning"; // 1-3 dias
            else if (diffDias <= 7) classe = "table-orange"; // 4-7 dias (custom)
            else if (diffDias <= 15) classe = "table-info"; // 8-15 dias
          }

          return { valores, classe };
        })
      : [];

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-primary">Agenda Externa - SP Capital</h1>

      {dados.length === 0 ? (
        <p>Carregando dados...</p>
      ) : (
        <>
          {/* Tabela principal */}
          <table className="table table-bordered table-hover rounded">
            <thead className="table-dark">
              <tr>
                {cabecalho.map((col, i) => (
                  <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha, i) => (
                <tr key={i} className={linha.classe}>
                  {linha.valores.map((celula, j) => (
                    <td key={j}>{celula}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legenda + botão */}
          <div className="d-flex justify-content-center align-items-center mt-3 gap-4 flex-wrap">
            <table className="table table-sm table-bordered mb-0">
              <thead>
                <tr>
                  <th>Cor</th>
                  <th>Significado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="table-danger">&nbsp;</td>
                  <td>HOJE</td>
                </tr>
                <tr>
                  <td className="table-warning">&nbsp;</td>
                  <td>1-3 dias</td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: "orange" }}>&nbsp;</td>
                  <td>4-7 dias</td>
                </tr>
                <tr>
                  <td className="table-info">&nbsp;</td>
                  <td>8-15 dias</td>
                </tr>
                <tr>
                  <td className="table-light">&nbsp;</td>
                  <td>15+ dias</td>
                </tr>
              </tbody>
            </table>

            <button
              className="btn btn-primary btn-lg"
              onClick={() =>
                window.open(
                  "https://docs.google.com/spreadsheets/d/1puUc-A-JBG1mUYCDaEEXFMJDgb2je46ktxTdb6vaWDs/edit?gid=1878849380#gid=1878849380",
                  "_blank"
                )
              }
            >
              Abrir Planilha
            </button>
          </div>
        </>
      )}
    </div>
  );
}
