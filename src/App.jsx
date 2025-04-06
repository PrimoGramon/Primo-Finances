import React, { useState, useEffect } from "react";
import axios from "axios";  // Importamos Axios para hacer solicitudes HTTP
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

// Lista de activos disponibles para sugerir (puedes ampliarla más)
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
  const [precioReal, setPrecioReal] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [tipoMovimiento, setTipoMovimiento] = useState("compra"); // Tipo de movimiento: compra o venta
  const [activoManual, setActivoManual] = useState(""); // Estado para permitir activos manuales

  // Función para registrar una inversión
  const registrarInversion = (e) => {
    e.preventDefault();

    if (!activo && !activoManual) return; // Debemos tener un activo, sea desde la búsqueda o manual
    if (!cantidad || !precioCompra || !precioReal) return;

    const nuevaInversion = {
      id: Date.now(),
      activo: activoManual || activo, // Usamos el activo manual si lo hay
      cantidad: parseFloat(cantidad),
      precioCompra: parseFloat(precioCompra),
      precioActual: precioReal, // Usamos el precio en tiempo real
      tipoMovimiento, // Tipo de movimiento: compra o venta
    };

    if (tipoMovimiento === "compra") {
      // Si es compra, añadimos la cantidad a la inversión
      setInversiones([nuevaInversion, ...inversiones]);
    } else {
      // Si es venta, restamos la cantidad de ese activo
      setInversiones((prevInversiones) =>
        prevInversiones.map((inv) =>
          inv.activo === activo || inv.activo === activoManual
            ? {
                ...inv,
                cantidad: inv.cantidad - parseFloat(cantidad),
              }
            : inv
        )
      );
    }

    // Guardamos el movimiento en el historial
    const ganancia = tipoMovimiento === "compra"
      ? 0
      : (parseFloat(precioReal) - parseFloat(precioCompra)) * parseFloat(cantidad);
    const nuevoMovimiento = {
      fecha: new Date().toLocaleString(),
      activo: activoManual || activo,
      cantidad: parseFloat(cantidad),
      precioCompra: parseFloat(precioCompra),
      precioActual: parseFloat(precioReal),
      ganancia,
      tipoMovimiento,
    };

    setHistorial([nuevoMovimiento, ...historial]);

    // Limpiar campos después de registrar
    setActivo("");
    setActivoManual("");
    setCantidad("");
    setPrecioCompra("");
    setPrecioReal(null);
    setTipoMovimiento("compra"); // Restablecer a compra después de la acción
  };

  const totalInvertido = inversiones.reduce(
    (acc, inv) => acc + inv.cantidad * inv.precioCompra,
    0
  );

  const totalActual = inversiones.reduce(
    (acc, inv) => acc + inv.cantidad * inv.precioActual,
    0
  );

  // Hook para obtener el precio en tiempo real del activo
  useEffect(() => {
    if (!activo && !activoManual) return; // Si no tenemos activo, no hacemos nada

    const obtenerPrecio = async () => {
      try {
        if (activo === 'bitcoin' || activo === 'ethereum') {
          const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${activo}&vs_currencies=eur`
          );
          if (response.data[activo]) {
            setPrecioReal(response.data[activo].eur);
          }
        } else {
          const apiKey = 'E4OBOBOW3O2MLDYI'; // Pon tu clave de API de Alpha Vantage aquí
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${activo.toUpperCase()}&interval=5min&apikey=${apiKey}`
          );
          if (response.data['Time Series (5min)']) {
            const data = response.data['Time Series (5min)'];
            const latestTime = Object.keys(data)[0];
            const latestClose = data[latestTime]['4. close'];
            setPrecioReal(parseFloat(latestClose));
          }
        }
      } catch (error) {
        console.error("Error al obtener el precio real:", error);
        setPrecioReal(0); // Si hay error, poner el precio a 0
      }
    };

    obtenerPrecio();

    const intervalo = setInterval(obtenerPrecio, 60000); // Cada 60 segundos
    return () => clearInterval(intervalo); // Limpiar intervalo cuando se desmonte el componente
  }, [activo, activoManual]);

  // Función para exportar a CSV
  const exportarCSV = () => {
    const headers = ["Activo", "Cantidad", "PrecioCompra", "PrecioActual"];
    const rows = inversiones.map((inv) => [
      inv.activo,
      inv.cantidad,
      inv.precioCompra,
      inv.precioActual,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inversiones.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Cartera de Inversiones</h1>

        <form onSubmit={registrarInversion} className="flex flex-col gap-4 mb-6">
          {/* Búsqueda dinámica para activos */}
          <Select
            options={activosDisponibles}
            value={activosDisponibles.find(option => option.value === activo)}
            onChange={(selectedOption) => setActivo(selectedOption?.value)}
            placeholder="Selecciona un activo"
            className="border rounded-lg px-3 py-2"
          />
          {/* Campo de texto para ingresar manualmente el activo si no está listado */}
          <input
            type="text"
            placeholder="O ingresa un activo manualmente"
            value={activoManual}
            onChange={(e) => setActivoManual(e.target.value)}
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
            placeholder="Precio actual (en tiempo real)"
            value={precioReal || ""}
            className="border rounded-lg px-3 py-2"
            disabled
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
            <p className="text-gray-500">
              Aún no hay suficientes datos para mostrar la gráfica.
            </p>
          )}
        </div>

        <button
          onClick={exportarCSV}
          className="bg-green-600 text-white rounded-lg py-2 px-4 mb-6 hover:bg-green-700"
        >
          Exportar a CSV
        </button>

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
                  Invertido: {invertido.toFixed(2)} € | Valor Actual:{" "}
                  {valorActual.toFixed(2)} €
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
