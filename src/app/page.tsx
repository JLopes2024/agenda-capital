"use client";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./page.css";
import Button from "./components/Button";
import TabelaLegenda from "./components/TLegenda";
import TabelaPrincipal from "./components/TabelaPrincipal";

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
          const dataEvento = parseDateDMY(valores[1]);
          if (dataEvento) {
            const diffDias = Math.floor((dataEvento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDias === 0) classe = "hoje";
            else if (diffDias < 0) classe = "passado";
            else if (diffDias <= 3) classe = "alerta";
            else if (diffDias <= 7) classe = "aviso";
            else if (diffDias <= 15) classe = "dias";
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
          <TabelaPrincipal cabecalho={cabecalho} linhas={linhas} />
          <div className="legenda-botao-container">
            <TabelaLegenda />
            <Button
              url="https://docs.google.com/spreadsheets/d/1puUc-A-JBG1mUYCDaEEXFMJDgb2je46ktxTdb6vaWDs/edit?gid=1878849380#gid=1878849380"
              className="button-planilha"
            >
              Abrir Planilha
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
