import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
  data?: any;
};

export function PersonalSaludDetalleCita({ navigate, data }: Props) {
  const cita = data || {
    idCita: "C-10234",
    idPaciente: "1001",
    paciente: "María García López",
    idPersonalSalud: "PS-201",
    fecha: "2025-11-22",
    hora: "10:30:00",
    estado: "Confirmada",
    motivoCancelacion: null,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("personalSaludDashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Detalle de Cita</h1>
              <p className="text-sm text-gray-500">{cita.idCita}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información de la Cita</CardTitle>
                <Badge className="bg-green-100 text-green-700">{cita.estado}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID Cita</p>
                  <p className="text-gray-900">{cita.idCita}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estado</p>
                  <p className="text-gray-900">{cita.estado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID Paciente</p>
                  <p className="text-gray-900">{cita.idPaciente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Paciente</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <p className="text-gray-900">{cita.paciente}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <p className="text-gray-900">{cita.fecha}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Hora</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <p className="text-gray-900">{cita.hora}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID Personal Salud</p>
                  <p className="text-gray-900">{cita.idPersonalSalud}</p>
                </div>
                {cita.motivoCancelacion && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Motivo Cancelación</p>
                    <p className="text-gray-900">{cita.motivoCancelacion}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={() => navigate("personalSaludDashboard")} variant="outline" className="flex-1">
              Volver
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              Ver Historia Clínica
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
