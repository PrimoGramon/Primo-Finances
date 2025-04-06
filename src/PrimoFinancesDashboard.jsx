import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "./context/ThemeContext";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a0e7e5", "#b4f8c8"];

const initialData = [
  { activo: "Criptomonedas", objetivo: 0.3, actual: 0.28 },
  { activo: "ETFs", objetivo: 0.4, actual: 0.45 },
  { activo: "Cuenta Ahorro", objetivo: 0.3, actual: 0.27 },
];

const monthlyInvestments = [
  { mes: "Ene", total: 100 },
  { mes: "Feb", total: 150 },
  { mes: "Mar", total: 180 },
  { mes: "Abr", total: 200 },
];

export default function PrimoFinancesDashboard() {
  const [inversiones, setInversiones] = useState(initialData);
  const [movimiento, setMovimiento] = useState({ tipo: "Compra", activo: "", cantidad: "" });
  const { darkMode, toggleTheme } = useTheme();

  const totalInvertido = 500;
  const rentabilidad = inversiones.map((inv) => {
    const valorActual = inv.actual * totalInvertido;
    const invertido = inv.objetivo * totalInvertido;
    const roi = ((valorActual - invertido) / invertido) * 100;
    return { ...inv, invertido, valorActual, roi };
  });

  const handleMovimientoChange = (e) => {
    const { name, value } = e.target;
    setMovimiento((prev) => ({ ...prev, [name]: value }));
  };

  const registrarMovimiento = () => {
    alert("Funcionalidad en desarrollo: próximamente se guardará el movimiento automáticamente.");
    setMovimiento({ tipo: "Compra", activo: "", cantidad: "" });
  };

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-[#f7f9fb] text-gray-800"}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Primo Finances</h1>
        <Button onClick={toggleTheme}>
          Cambiar a {darkMode ? "modo claro" : "modo oscuro"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Distribución Actual</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  dataKey="actual"
                  data={inversiones}
                  nameKey="activo"
                  outerRadius={90}
                  label
                >
                  {inversiones.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Evolución Mensual</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyInvestments}>
                <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
                <Tooltip />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Rentabilidad por Activo</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {rentabilidad.map((item, i) => (
            <Card key={i} className="bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold">{item.activo}</h3>
                <p>Invertido: €{item.invertido.toFixed(2)}</p>
                <p>Valor Actual: €{item.valorActual.toFixed(2)}</p>
                <p className={item.roi >= 0 ? "text-green-600" : "text-red-500"}>
                  ROI: {item.roi.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2 text-center">Añadir Movimiento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Tipo</Label>
            <select
              name="tipo"
              value={movimiento.tipo}
              onChange={handleMovimientoChange}
              className="w-full p-2 rounded border"
            >
              <option value="Compra">Compra</option>
              <option value="Venta">Venta</option>
              <option value="Ingreso">Ingreso</option>
            </select>
          </div>
          <div>
            <Label>Activo</Label>
            <Input
              name="activo"
              value={movimiento.activo}
              onChange={handleMovimientoChange}
              placeholder="Ej: Criptomonedas"
            />
          </div>
          <div>
            <Label>Cantidad (€)</Label>
            <Input
              type="number"
              name="cantidad"
              value={movimiento.cantidad}
              onChange={handleMovimientoChange}
            />
          </div>
        </div>
        <div className="text-center mt-4">
          <Button onClick={registrarMovimiento}>Registrar Movimiento</Button>
        </div>
      </div>
    </div>
  );
}
