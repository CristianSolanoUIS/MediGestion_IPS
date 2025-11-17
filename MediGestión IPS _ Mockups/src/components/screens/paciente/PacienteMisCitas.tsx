import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { ArrowLeft, Calendar, Clock, User, ChevronRight } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen, data?: any) => void;
};

const citasProximas = [
  { idCita: "C-10234", idPaciente: "1001", idPersonalSalud: "PS-201", fecha: "2025-11-22", hora: "10:30:00", estado: "Confirmada", doctor: "Dr. Carlos Rodríguez", especialidad: "Cardiología" },
  { idCita: "C-10245", idPaciente: "1001", idPersonalSalud: "PS-205", fecha: "2025-12-05", hora: "14:00:00", estado: "Pendiente", doctor: "Dra. Ana López", especialidad: "Medicina General" },
];

const citasPasadas = [
  { idCita: "C-10100", idPaciente: "1001", idPersonalSalud: "PS-201", fecha: "2025-11-05", hora: "15:00:00", estado: "Atendida", doctor: "Dr. Carlos Rodríguez", especialidad: "Cardiología", motivoCancelacion: null },
  { idCita: "C-10050", idPaciente: "1001", idPersonalSalud: "PS-210", fecha: "2025-10-20", hora: "10:00:00", estado: "Cancelada", doctor: "Dr. Miguel Torres", especialidad: "Oftalmología", motivoCancelacion: "Paciente solicitó reprogramación" },
];

export function PacienteMisCitas({ navigate }: Props) {
  const getStatusBadge = (estado: string) => {
    const configs: any = {
      "Confirmada": "bg-green-100 text-green-700",
      "Pendiente": "bg-yellow-100 text-yellow-700",
      "Cancelada": "bg-red-100 text-red-700",
      "Atendida": "bg-blue-100 text-blue-700",
    };
    return <Badge className={configs[estado]}>{estado}</Badge>;
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
              <h1 className="text-gray-900">Mis Citas</h1>
              <p className="text-sm text-gray-500">Gestiona tus citas médicas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="proximas" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="proximas">Próximas</TabsTrigger>
            <TabsTrigger value="pasadas">Pasadas</TabsTrigger>
          </TabsList>

          <TabsContent value="proximas" className="mt-6 space-y-4">
            {citasProximas.map((cita) => (
              <Card key={cita.idCita} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-4">
                        <h3 className="text-gray-900">{cita.especialidad}</h3>
                        {getStatusBadge(cita.estado)}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">idCita</p>
                          <p className="text-gray-900">{cita.idCita}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Fecha</p>
                          <p className="text-gray-900">{cita.fecha}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Hora</p>
                          <p className="text-gray-900">{cita.hora}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Personal de Salud</p>
                          <p className="text-gray-900">{cita.doctor}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate("pacienteDetalleCita", cita)}
                      variant="outline"
                      size="sm"
                    >
                      Ver Detalle
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pasadas" className="mt-6 space-y-4">
            {citasPasadas.map((cita) => (
              <Card key={cita.idCita} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-4">
                        <h3 className="text-gray-900">{cita.especialidad}</h3>
                        {getStatusBadge(cita.estado)}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">idCita</p>
                          <p className="text-gray-900">{cita.idCita}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Fecha</p>
                          <p className="text-gray-900">{cita.fecha}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Hora</p>
                          <p className="text-gray-900">{cita.hora}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Personal de Salud</p>
                          <p className="text-gray-900">{cita.doctor}</p>
                        </div>
                        {cita.motivoCancelacion && (
                          <div className="md:col-span-2">
                            <p className="text-gray-500">Motivo Cancelación</p>
                            <p className="text-gray-900">{cita.motivoCancelacion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate("pacienteDetalleCita", cita)}
                      variant="outline"
                      size="sm"
                    >
                      Ver Detalle
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Button onClick={() => navigate("pacienteAgendarCita")} className="bg-blue-600 hover:bg-blue-700">
            Agendar Nueva Cita
          </Button>
        </div>
      </main>
    </div>
  );
}
