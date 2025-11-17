import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { ArrowLeft, Calendar } from "lucide-react";
import { Screen } from "../../../App";
import { useState } from "react";

type Props = {
  navigate: (screen: Screen) => void;
};

const agendas = [
  { idAgenda: "A-501", idPersonalSalud: "PS-201", profesional: "Dr. Carlos Rodríguez", fechaInicio: "2025-11-15", fechaFin: "2025-11-30", cupos: 40, bloques: "08:00-12:00, 14:00-18:00" },
  { idAgenda: "A-502", idPersonalSalud: "PS-205", profesional: "Dra. Ana López", fechaInicio: "2025-11-20", fechaFin: "2025-12-05", cupos: 50, bloques: "09:00-13:00, 15:00-19:00" },
];

export function AdministrativoAgendaProfesional({ navigate }: Props) {
  const [selectedProfesional, setSelectedProfesional] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("administrativoDashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Agenda del Profesional</h1>
              <p className="text-sm text-gray-500">Consulta disponibilidad de agendas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtrar por Profesional</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedProfesional} onValueChange={setSelectedProfesional}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un profesional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PS-201">Dr. Carlos Rodríguez</SelectItem>
                  <SelectItem value="PS-205">Dra. Ana López</SelectItem>
                  <SelectItem value="PS-210">Dr. Miguel Torres</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {agendas.map((agenda) => (
              <Card key={agenda.idAgenda}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-900">{agenda.profesional}</h3>
                      <div className="text-sm text-gray-500">ID: {agenda.idAgenda}</div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">ID Personal Salud</p>
                        <p className="text-gray-900">{agenda.idPersonalSalud}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fecha Inicio</p>
                        <p className="text-gray-900">{agenda.fechaInicio}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fecha Fin</p>
                        <p className="text-gray-900">{agenda.fechaFin}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cupos Totales</p>
                        <p className="text-gray-900">{agenda.cupos}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-500">Bloques Horarios</p>
                        <p className="text-gray-900">{agenda.bloques}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
