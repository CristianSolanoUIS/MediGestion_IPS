import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

const agendas = [
  { idAgenda: "A-501", idPersonalSalud: "PS-201", fechaInicio: "2025-11-15", fechaFin: "2025-11-30", cupos: 40, bloques: "08:00-12:00, 14:00-18:00" },
  { idAgenda: "A-505", idPersonalSalud: "PS-201", fechaInicio: "2025-12-01", fechaFin: "2025-12-15", cupos: 35, bloques: "09:00-13:00, 15:00-17:00" },
];

export function PersonalSaludAgenda({ navigate }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("personalSaludDashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Mi Agenda</h1>
              <p className="text-sm text-gray-500">Consulta tu disponibilidad</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {agendas.map((agenda) => (
            <Card key={agenda.idAgenda}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Agenda {agenda.idAgenda}</CardTitle>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ID Agenda</p>
                    <p className="text-gray-900">{agenda.idAgenda}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID Personal Salud</p>
                    <p className="text-gray-900">{agenda.idPersonalSalud}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cupos Totales</p>
                    <p className="text-gray-900">{agenda.cupos}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha Inicio</p>
                    <p className="text-gray-900">{agenda.fechaInicio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha Fin</p>
                    <p className="text-gray-900">{agenda.fechaFin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bloques Horarios</p>
                    <p className="text-gray-900 text-sm">{agenda.bloques}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
