"use client";
import React from "react";
import styles from "./TPrincipal.module.css";

interface Linha {
  valores: string[];
  classe: string;
}

interface TabelaPrincipalProps {
  cabecalho: string[];
  linhas: Linha[];
}

const TabelaPrincipal: React.FC<TabelaPrincipalProps> = ({ cabecalho, linhas }) => {
  return (
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
          <tr key={i} className={linha.classe ? styles[linha.classe] : ""}>
            {linha.valores.map((celula, j) => (
              <td key={j}>{celula}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TabelaPrincipal;
