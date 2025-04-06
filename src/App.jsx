import React, { useState } from "react";

function App() {
  const [monto, setMonto] = useState("");
  const [activo, setActivo] = useState("");
  const [inversiones, setInversiones] = useState([]);

  const registrarInversion = (e) => {
    e.preventDefault();

    const valor = parseFloat(monto);
    if (isNaN(valor) || valor <= 0 || !activo.trim()) return;

    const nuevaInversion = {
      id: Date.now(),
      monto: valor,
      activo: activo.trim(),
      fecha: new Date().toLocaleDateString("es-ES"),
    };

    setInversiones([nuevaInversion, ...inversiones]);
    setMonto("");
    setActivo("");
  };

  const balanceTotal = inversiones.reduce((acc, inv) => acc + inv.monto, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">📈 Primo Finances</h1>

        <h2 className="text-xl font-semibold text-center mb-6">
          Total invertido:{" "}
          <span className="text-blue-600">{balanceTotal.toFixed(2)} €</span>
        </h2>

        <form onSubmit={registrarInversion} className="flex flex-col gap-4 mb-6">
          <input
            type="number"
            step="0.01"
            placeholder="Monto (€)"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            placeholder="Activo (Ej: BTC, AAPL, ETH)"
            value={activo}
            onChange={(e) => setActivo(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700"
          >
            Registrar Inversión
          </button>
        </form>

        <div>
          <h3 className="font-semibold mb-2">Historial de inversiones:</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {inversiones.map((inv) => (
              <li key={inv.id} className="flex justify-between text-sm border-b pb-1">
                <span>{inv.fecha} - {inv.activo}</span>
                <span className="font-semibold">{inv.monto.toFixed(2)} €</span>
              </li>
            ))}
            {inversiones.length === 0 && (
              <li className="text-gray-500">No hay inversiones aún.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
