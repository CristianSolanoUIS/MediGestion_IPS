import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ArrowLeft, AlertCircle, Calendar } from "lucide-react";
import { Screen } from "../../../App";
import { Checkbox } from "../../ui/checkbox";

type Props = {
  navigate: (screen: Screen) => void;
};

const citasAfectadas = [
  { idCita: "C-10250", idPaciente: "1001", paciente: "María García", idPersonalSalud: "PS-201", fecha: "2025-11-25", hora: "10:00:00", estado: "Confirmada", motivo: "Cambio de agenda profesional" },
  { idCita: "C-10251", idPaciente: "1002", paciente: "Juan Pérez", idPersonalSalud: "PS-201", fecha: "2025-11-25", hora: "11:00:00", estado: "Confirmada", motivo: "Cambio de agenda profesional" },
  { idCita: "C-10252", idPaciente: "1003", paciente: "Carlos Ramírez", idPersonalSalud: "PS-201", fecha: "2025-11-25", hora: "14:00:00", estado: "Confirmada", motivo: "Cambio de agenda profesional" },
];

export function DirectorReprogramacion({ navigate }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("directorDashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Reprogramación Masiva de Citas</h1>
              <p className="text-sm text-gray-500">Gestiona cambios masivos de agendas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="text-gray-900 mb-2">Citas Afectadas por Reprogramación</h3>
                  <p className="text-sm text-gray-700">
                    Se han identificado {citasAfectadas.length} citas que requieren reprogramación debido a cambios en la agenda del profesional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Citas Afectadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {citasAfectadas.map((cita) => (
                  <div key={cita.idCita} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <Checkbox className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h4 className="text-gray-900">{cita.paciente}</h4>
                          <Badge className="bg-yellow-100 text-yellow-700">{cita.estado}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{cita.fecha} - {cita.hora}</span>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">ID Cita</p>
                          <p className="text-gray-900">{cita.idCita}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">ID Paciente</p>
                          <p className="text-gray-900">{cita.idPaciente}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">ID Personal Salud</p>
                          <p className="text-gray-900">{cita.idPersonalSalud}</p>
                        </div>
                        <div className="md:col-span-3">
                          <p className="text-gray-500">Motivo Reprogramación</p>
                          <p className="text-gray-900">{cita.motivo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={() => navigate("directorDashboard")} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
              Reprogramar Seleccionadas
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Nota:</strong> Al reprogramar, se actualizarán los campos "fecha", "hora" y "motivoCancelacion" de la tabla CITA para las citas seleccionadas. Se notificará automáticamente a los pacientes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
