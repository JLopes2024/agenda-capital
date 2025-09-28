"use client";
import React, { useEffect, useState } from "react";
import Papa from "papaparse"; // npm install papaparse
import "./page.css";

export default function Home() {
  const [dados, setDados] = useState<string[][]>([]);
  const linkCSV =
    "https://docs.google.com/spreadsheets/d/1puUc-A-JBG1mUYCDaEEXFMJDgb2je46ktxTdb6vaWDs/gviz/tq?tqx=out:csv";

  const colunasSelecionadas = [2, 3, 4, 5, 16, 23]; // ajuste conforme seu CSV

  useEffect(() => {
    async function fetchCSV() {
      try {
        const res = await fetch(linkCSV, { cache: "no-store" });
        const csv = await res.text();
        const parsed = Papa.parse<string[]>(csv, { skipEmptyLines: true });

        if (parsed.data) {
          setDados(parsed.data as string[][]);
        }
      } catch (error) {
        console.error("Erro ao carregar CSV:", error);
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
          const dataBruta = valores[1]; // supondo que a data está na segunda coluna selecionada
          const dataEvento = parseDateDMY(dataBruta);

          if (dataEvento) {
            const diffMs = dataEvento.getTime() - hoje.getTime();
            const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // arredonda para dias inteiros

            if (diffDias === 0) {
              classe = "hoje"; // exatamente hoje
            } else if (diffDias < 0) {
              classe = "passado"; // evento já ocorreu
            } else if (diffDias <= 3) {
              classe = "alerta"; // 1 a 3 dias
            } else if (diffDias <= 7) {
              classe = "aviso"; // 4 a 7 dias
            } else if (diffDias <= 15) {
              classe = "dias"; // 8 a 15 dias
            }
          }

          return { valores, classe };
        })
      : [];

  return (
    <div className="container">
      <h1 className="title">Agenda Externa - SP Capital</h1>

      {dados.length === 0 ? (
        <p>Carregando dados...</p>
      ) : (
        <>
          {/* Tabela principal */}
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
                <tr key={i} className={linha.classe}>
                  {linha.valores.map((celula, j) => (
                    <td key={j}>{celula}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Container flexível para legenda + botão */}
          <div className="legenda-botao-container">
            {/* Mini tabela de legenda */}
            <table
              className="table legenda"
              border={1}
              cellPadding={4}
              style={{ width: "fit-content" }}
            >
              <thead>
                <tr>
                  <th>Cor</th>
                  <th>Significado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="hoje" style={{ width: "50px" }}>&nbsp;</td>
                  <td>HOJE</td>
                </tr>
                <tr>
                  <td className="alerta" style={{ width: "50px" }}>&nbsp;</td>
                  <td>1-3 dias</td>
                </tr>
                <tr>
                  <td className="aviso" style={{ width: "50px" }}>&nbsp;</td>
                  <td>4-7 dias</td>
                </tr>
                <tr>
                  <td className="dias" style={{ width: "50px" }}>&nbsp;</td>
                  <td>8-15 dias</td>
                </tr>
                <tr>
                  <td className="" style={{ width: "50px" }}>&nbsp;</td>
                  <td>15 dias +</td>
                </tr>
              </tbody>
            </table>

            {/* Botão */}
            <button
              className="button-planilha"
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
