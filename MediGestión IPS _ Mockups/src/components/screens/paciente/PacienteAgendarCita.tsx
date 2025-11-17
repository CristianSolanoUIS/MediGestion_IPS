import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { ArrowLeft, Calendar } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

export function PacienteAgendarCita({ navigate }: Props) {
  const [especialidad, setEspecialidad] = useState("");
  const [sede, setSede] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [idPersonalSalud, setIdPersonalSalud] = useState("");

  const handleSubmit = () => {
    // Simulate creating appointment
    alert("Solicitud de cita enviada. Estado: Pendiente de confirmación");
    navigate("pacienteMisCitas");
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
              <h1 className="text-gray-900">Agendar Nueva Cita</h1>
              <p className="text-sm text-gray-500">Solicita tu cita médica</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Cita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Select value={especialidad} onValueChange={setEspecialidad}>
                  <SelectTrigger id="especialidad">
                    <SelectValue placeholder="Seleccione especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiología">Cardiología</SelectItem>
                    <SelectItem value="Medicina General">Medicina General</SelectItem>
                    <SelectItem value="Oftalmología">Oftalmología</SelectItem>
                    <SelectItem value="Dermatología">Dermatología</SelectItem>
                    <SelectItem value="Pediatría">Pediatría</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sede">Sede</Label>
                <Select value={sede} onValueChange={setSede}>
                  <SelectTrigger id="sede">
                    <SelectValue placeholder="Seleccione sede" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Centro Norte">Centro Norte</SelectItem>
                    <SelectItem value="Sur">Sur</SelectItem>
                    <SelectItem value="Norte">Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idPersonalSalud">Personal de Salud (ID)</Label>
                <Select value={idPersonalSalud} onValueChange={setIdPersonalSalud}>
                  <SelectTrigger id="idPersonalSalud">
                    <SelectValue placeholder="Seleccione profesional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PS-201">PS-201 - Dr. Carlos Rodríguez (Cardiología)</SelectItem>
                    <SelectItem value="PS-205">PS-205 - Dra. Ana López (Medicina General)</SelectItem>
                    <SelectItem value="PS-210">PS-210 - Dr. Miguel Torres (Oftalmología)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora">Hora</Label>
                  <Input
                    id="hora"
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Nota:</strong> La cita quedará en estado "Pendiente" hasta que el personal administrativo la confirme según disponibilidad en la agenda.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate("pacienteDashboard")} variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Enviar Solicitud
          </Button>
        </div>
      </main>
    </div>
  );
}
