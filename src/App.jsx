import React, { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("ingreso");
  const [movimientos, setMovimientos] = useState([]);

  const registrarMovimiento = (e) => {
    e.preventDefault();

    const valor = parseFloat(monto);
    if (isNaN(valor) || valor <= 0) return;

    const nuevoMovimiento = {
      id: Date.now(),
      tipo,
      monto: valor,
    };

    setMovimientos([nuevoMovimiento, ...movimientos]);

    if (tipo === "ingreso") {
      setBalance(balance + valor);
    } else {
      setBalance(balance - valor);
    }

    setMonto(""); // limpiar campo
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Primo Finances</h1>

        <h2 className="text-xl font-semibold text-center mb-6">
          Balance: <span className={balance >= 0 ? "text-green-600" : "text-red-600"}>{balance.toFixed(2)} €</span>
        </h2>

        <form onSubmit={registrarMovimiento} className="flex flex-col gap-4 mb-6">
          <input
            type="number"
            step="0.01"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700"
          >
            Registrar Movimiento
          </button>
        </form>

        <div>
          <h3 className="font-semibold mb-2">Historial:</h3>
          <ul className="space-y-1">
            {movimientos.map((mov) => (
              <li key={mov.id} className="flex justify-between">
                <span>{mov.tipo}</span>
                <span className={mov.tipo === "ingreso" ? "text-green-600" : "text-red-600"}>
                  {mov.tipo === "ingreso" ? "+" : "-"}{mov.monto.toFixed(2)} €
                </span>
              </li>
            ))}
            {movimientos.length === 0 && <li className="text-gray-500">No hay movimientos aún.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
