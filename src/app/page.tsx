import "./page.css";

export default async function Home() {
  const linkCSV =
    "https://docs.google.com/spreadsheets/d/1glkGATn0A6_fdyDNxaKu6frHzvSuULyEMVrqsjrv4b8/gviz/tq?tqx=out:csv";

  const res = await fetch(linkCSV);
  const csv = await res.text();

  // Remove aspas e espaços extras de cada célula
  const dados = csv
    .split("\n")
    .map((linha) =>
      linha
        .split(",")
        .map((celula) => celula.trim().replace(/^["']+|["']+$/g, ""))
    );

  const colunasSelecionadas = [0, 1, 2];

  const cabecalho = dados[0].filter((_, idx) =>
    colunasSelecionadas.includes(idx)
  );

  const linhas = dados.slice(1).map((linha) =>
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
