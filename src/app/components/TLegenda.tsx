import React from "react";
import styles from "./TabelaLegenda.module.css";

const legendaDados = [
  { classe: "hoje", label: "HOJE" },
  { classe: "alerta", label: "1-3 dias" },
  { classe: "aviso", label: "4-7 dias" },
  { classe: "dias", label: "8-15 dias" },
  { classe: "", label: "15 dias +" },
];

const TabelaLegenda: React.FC = () => {
  return (
    <table
      className={`${styles.table} ${styles.legenda}`}
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
        {legendaDados.map((item, i) => (
          <tr key={i}>
            <td className={item.classe ? styles[item.classe] : ""} style={{ width: "50px" }}>
              &nbsp;
            </td>
            <td>{item.label}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TabelaLegenda;
