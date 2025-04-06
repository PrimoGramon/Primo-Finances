// src/App.jsx
import React, { useState } from "react";

function App() {
  const [inversiones, setInversiones] = useState([]);
  const [activo, setActivo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioActual, setPrecioActual] = useState("");

  const registrarInversion = (e) => {
    e.preventDefault();

    if (!activo || !cantidad || !precioCompra || !precioActual) return;

    const nuevaInversion = {
      id: Date.now(),
      activo,
      cantidad: parseFloat(cantidad),
      precioCompra: parseFloat(precioCompra),
      precioActual: parseFloat(precioActual),
    };

    setInversiones([nuevaInversion, ...inversiones]);

    // Limpiar campos
    setActivo("");
    setCantidad("");
    setPrecioCompra("");
    setPrecioActual("");
  };

  const totalInvertido = inversiones.reduce(
    (acc, inv) => acc + inv.cantidad * inv.precioCompra,
    0
  );

  const totalActual = inversiones.reduce(
    (acc, inv) => acc + inv.cantidad * inv.precioActual,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Cartera de Inversiones</h1>

        <form onSubmit={registrarInversion} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Activo (Ej: BTC)"
            value={activo}
            onChange={(e) => setActivo(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            placeholder="Precio de compra"
            value={precioCompra}
            onChange={(e) => setPrecioCompra(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            placeholder="Precio actual"
            value={precioActual}
            onChange={(e) => setPrecioActual(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700"
          >
            Registrar Inversión
          </button>
        </form>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Resumen</h2>
          <p>Total Invertido: {totalInvertido.toFixed(2)} €</p>
          <p>Valor Actual: {totalActual.toFixed(2)} €</p>
          <p className={totalActual - totalInvertido >= 0 ? "text-green-600" : "text-red-600"}>
            {totalActual - totalInvertido >= 0 ? "Ganancia" : "Pérdida"}: {(totalActual - totalInvertido).toFixed(2)} €
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Inversiones:</h3>
          <ul className="space-y-2">
            {inversiones.map((inv) => {
              const valorActual = inv.cantidad * inv.precioActual;
              const invertido = inv.cantidad * inv.precioCompra;
              const porcentaje = ((valorActual / totalActual) * 100).toFixed(1);
              const ganancia = valorActual - invertido;
              return (
                <li key={inv.id} className="border-b pb-2">
                  <strong>{inv.activo}</strong> — {inv.cantidad} unidades
                  <br />
                  Invertido: {invertido.toFixed(2)} € | Valor Actual: {valorActual.toFixed(2)} €
                  <br />
                  Proporción: {porcentaje}% |{" "}
                  <span className={ganancia >= 0 ? "text-green-600" : "text-red-600"}>
                    {ganancia >= 0 ? "↑" : "↓"} {ganancia.toFixed(2)} €
                  </span>
                </li>
              );
            })}
            {inversiones.length === 0 && (
              <li className="text-gray-500">No hay inversiones registradas.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
