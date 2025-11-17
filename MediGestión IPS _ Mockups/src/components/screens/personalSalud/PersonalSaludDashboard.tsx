import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Calendar, FileText, Stethoscope, LogOut, Clock } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

const citasHoy = [
  { idCita: "C-10234", paciente: "María García", hora: "10:30:00", estado: "Confirmada" },
  { idCita: "C-10240", paciente: "Juan Pérez", hora: "11:30:00", estado: "Confirmada" },
  { idCita: "C-10245", paciente: "Carlos Ramírez", hora: "14:00:00", estado: "Pendiente" },
];

export function PersonalSaludDashboard({ navigate }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">MediGestión IPS</h1>
                <p className="text-sm text-gray-500">Panel Profesional</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-900">Dr. Carlos Rodríguez</p>
                <p className="text-xs text-gray-500">ID: PS-201 | Especialidad: Cardiología</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("login")}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-gray-900 mb-1">Dashboard Profesional</h2>
            <p className="text-gray-600">Gestiona tu agenda y pacientes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl text-blue-600 mb-2">{citasHoy.length}</div>
                <p className="text-sm text-gray-600">Citas del Día</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl text-green-600 mb-2">[Placeholder]</div>
                <p className="text-sm text-gray-600">Atendidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl text-yellow-600 mb-2">[Placeholder]</div>
                <p className="text-sm text-gray-600">Pendientes</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Citas del Día - {new Date().toLocaleDateString("es-ES")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {citasHoy.map((cita) => (
                  <div
                    key={cita.idCita}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate("personalSaludDetalleCita", cita)}
                  >
                    <div className="flex items-center gap-4">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-gray-900">{cita.paciente}</p>
                        <p className="text-sm text-gray-500">ID Cita: {cita.idCita}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-gray-900">{cita.hora}</p>
                      <Badge className={cita.estado === "Confirmada" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                        {cita.estado}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("personalSaludAgenda")}>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Mi Agenda</CardTitle>
                <p className="text-sm text-gray-600">Consulta tu agenda y disponibilidad</p>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Ver Agenda
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Historias Clínicas</CardTitle>
                <p className="text-sm text-gray-600">Accede a los registros de tus pacientes</p>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Ver Historias
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
