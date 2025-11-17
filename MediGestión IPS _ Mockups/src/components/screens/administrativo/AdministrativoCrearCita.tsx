import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { ArrowLeft } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

export function AdministrativoCrearCita({ navigate }: Props) {
  const [idPaciente, setIdPaciente] = useState("");
  const [idPersonalSalud, setIdPersonalSalud] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [estado, setEstado] = useState("");

  const handleCrear = () => {
    alert("Cita creada exitosamente");
    navigate("administrativoGestionCitas");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("administrativoGestionCitas")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Crear Nueva Cita</h1>
              <p className="text-sm text-gray-500">Registra una cita médica</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Datos de la Cita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="idPaciente">ID Paciente</Label>
                <Select value={idPaciente} onValueChange={setIdPaciente}>
                  <SelectTrigger id="idPaciente">
                    <SelectValue placeholder="Seleccione paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1001">1001 - María García López</SelectItem>
                    <SelectItem value="1002">1002 - Juan Pérez Gómez</SelectItem>
                    <SelectItem value="1003">1003 - Carlos Ramírez Torres</SelectItem>
                    <SelectItem value="1004">1004 - Laura Martínez Ruiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idPersonalSalud">ID Personal de Salud</Label>
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

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={estado} onValueChange={setEstado}>
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Confirmada">Confirmada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Nota:</strong> Verifica la disponibilidad en la agenda del profesional antes de confirmar la cita.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate("administrativoGestionCitas")} variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleCrear} className="flex-1 bg-orange-600 hover:bg-orange-700">
            Crear Cita
          </Button>
        </div>
      </main>
    </div>
  );
}
