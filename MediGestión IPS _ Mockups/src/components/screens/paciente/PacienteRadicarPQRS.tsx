import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

export function PacienteRadicarPQRS({ navigate }: Props) {
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idCita, setIdCita] = useState("");

  const handleSubmit = () => {
    alert("PQRS radicada exitosamente. Estado: En revisión");
    navigate("pacienteDashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("pacienteDashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Radicar PQRS</h1>
              <p className="text-sm text-gray-500">Peticiones, Quejas, Reclamos y Sugerencias</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Formulario PQRS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de PQRS</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petición">Petición</SelectItem>
                    <SelectItem value="Queja">Queja</SelectItem>
                    <SelectItem value="Reclamo">Reclamo</SelectItem>
                    <SelectItem value="Sugerencia">Sugerencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idCita">Relacionada con Cita (Opcional)</Label>
                <Select value={idCita} onValueChange={setIdCita}>
                  <SelectTrigger id="idCita">
                    <SelectValue placeholder="Seleccione una cita (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguna</SelectItem>
                    <SelectItem value="C-10234">C-10234 - Cardiología - 22/Nov/2025</SelectItem>
                    <SelectItem value="C-10100">C-10100 - Cardiología - 05/Nov/2025 (Atendida)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe tu petición, queja, reclamo o sugerencia..."
                  rows={6}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900 space-y-1">
                    <p><strong>Campos automáticos del sistema:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>idPaciente: Se asignará automáticamente</li>
                      <li>estado: Iniciará como "En revisión"</li>
                      <li>fechaRadicado: Fecha y hora actual</li>
                      <li>SLA: Se calculará según tipo de PQRS</li>
                      <li>responsable: Se asignará al área correspondiente</li>
                      <li>fechaCompromiso: Se calculará según SLA</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-gray-500">ID Paciente</p>
                  <p className="text-gray-900">1001 (automático)</p>
                </div>
                <div>
                  <p className="text-gray-500">Estado</p>
                  <p className="text-gray-900">En revisión (automático)</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha Radicado</p>
                  <p className="text-gray-900">{new Date().toLocaleString("es-ES")}</p>
                </div>
                <div>
                  <p className="text-gray-500">SLA (días hábiles)</p>
                  <p className="text-gray-900">15 días (según normativa)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate("pacienteDashboard")} variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Enviar PQRS
          </Button>
        </div>
      </main>
    </div>
  );
}
