import React, { useState } from "react";
import Select from "react-select";  // Importamos React Select
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Lista de activos disponibles para sugerir
const activosDisponibles = [
  { value: 'bitcoin', label: 'Bitcoin (BTC)' },
  { value: 'ethereum', label: 'Ethereum (ETH)' },
  { value: 'aapl', label: 'Apple (AAPL)' },
  { value: 'msft', label: 'Microsoft (MSFT)' },
  // Puedes añadir más activos aquí si lo deseas
];

function App() {
  const [inversiones, setInversiones] = useState([]);
  const [activo, setActivo] = useState(""); // Cambiado para usar 'value' de react-select
  const [cantidad, setCantidad] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("compra"); // Tipo de movimiento: compra o venta
  const [historial, setHistorial] = useState([]);

  // Función para registrar una inversión
  const registrarInversion = (e) => {
    e.preventDefault();

    if (!activo || !cantidad || !precioCompra) return; // Debemos tener un activo y precio de compra

    const nuevaInversion = {
      id: Date.now(),
      activo,
      cantidad: parseFloat(cantidad),
      precioCompra: parseFloat(precioCompra),
      tipoMovimiento, // Tipo de movimiento: compra o venta
    };

    // Si es compra, añadimos la cantidad a la inversión
    if (tipoMovimiento === "compra") {
      setInversiones([nuevaInversion, ...inversiones]);
      setHistorial([...historial, { ...nuevaInversion, ganancia: 0 }]); // Al principio, la ganancia es 0
    } else {
      // Si es venta, restamos la cantidad de ese activo
      setInversiones((prevInversiones) =>
        prevInversiones.map((inv) =>
          inv.activo === activo
            ? {
                ...inv,
                cantidad: inv.cantidad - parseFloat(cantidad),
              }
            : inv
        )
      );
      // Calculamos la ganancia o pérdida al vender
      const venta = {
        id: Date.now(),
        activo,
        cantidad: parseFloat(cantidad),
        precioCompra: parseFloat(precioCompra),
        tipoMovimiento: "venta",
      };
      const ganancia = (venta.cantidad * precioCompra) - (venta.cantidad * precioCompra); // Asegúrate de ajustar la fórmula de la ganancia
      setHistorial([...historial, { ...venta, ganancia }]);
    }

    // Limpiar campos después de registrar
    setActivo("");
    setCantidad("");
    setPrecioCompra("");
    setTipoMovimiento("compra"); // Restablecer a compra después de la acción
  };

  // Calcular el total invertido y el total actual
  const totalInvertido = inversiones.reduce(
    (acc, inv) => acc + inv.cantidad * inv.precioCompra,
    0
  );

  const totalActual = inversiones.reduce(
    (acc, inv) => acc + inv.cantidad * inv.precioCompra,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Cartera de Inversiones</h1>

        <form onSubmit={registrarInversion} className="flex flex-col gap-4 mb-6">
          <Select
            options={activosDisponibles}
            value={activosDisponibles.find(option => option.value === activo)}
            onChange={(selectedOption) => setActivo(selectedOption?.value)}
            placeholder="Selecciona un activo"
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
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700"
            >
              Registrar Inversión
            </button>
            <button
              type="button"
              onClick={() => setTipoMovimiento(tipoMovimiento === "compra" ? "venta" : "compra")}
              className="bg-yellow-600 text-white rounded-lg py-2 font-semibold hover:bg-yellow-700"
            >
              {tipoMovimiento === "compra" ? "Cambiar a Venta" : "Cambiar a Compra"}
            </button>
          </div>
        </form>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Resumen</h2>
          <p>Total Invertido: {totalInvertido.toFixed(2)} €</p>
          <p>Valor Actual: {totalActual.toFixed(2)} €</p>
          <p
            className={totalActual - totalInvertido >= 0 ? "text-green-600" : "text-red-600"}
          >
            {totalActual - totalInvertido >= 0 ? "Ganancia" : "Pérdida"}:{" "}
            {(totalActual - totalInvertido).toFixed(2)} €
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Evolución de la Cartera</h2>
          {historial.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historial}>
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">Aún no hay suficientes datos para mostrar la gráfica.</p>
          )}
        </div>

        <button
          className="bg-green-600 text-white rounded-lg py-2 px-4 mb-6 hover:bg-green-700"
        >
          Exportar a CSV
        </button>

        <div>
          <h3 className="font-semibold mb-2">Inversiones:</h3>
          <ul className="space-y-2">
            {inversiones.map((inv) => {
              const valorActual = inv.cantidad * inv.precioCompra; // Actualiza el cálculo si es necesario
              return (
                <li key={inv.id} className="border-b pb-2">
                  <strong>{inv.activo}</strong> — {inv.cantidad} unidades
                  <br />
                  Invertido: {valorActual.toFixed(2)} €
                  <br />
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
