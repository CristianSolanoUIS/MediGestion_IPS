import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { ArrowLeft, Calendar, Search, Plus } from "lucide-react";
import { Screen } from "../../../App";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

type Props = {
  navigate: (screen: Screen) => void;
};

const citas = [
  { idCita: "C-10234", idPaciente: "1001", paciente: "María García", idPersonalSalud: "PS-201", profesional: "Dr. Carlos Rodríguez", fecha: "2025-11-22", hora: "10:30:00", estado: "Confirmada" },
  { idCita: "C-10235", idPaciente: "1002", paciente: "Juan Pérez", idPersonalSalud: "PS-205", profesional: "Dra. Ana López", fecha: "2025-11-22", hora: "11:00:00", estado: "Pendiente" },
  { idCita: "C-10236", idPaciente: "1003", paciente: "Carlos Ramírez", idPersonalSalud: "PS-210", profesional: "Dr. Miguel Torres", fecha: "2025-11-22", hora: "14:00:00", estado: "Confirmada" },
  { idCita: "C-10237", idPaciente: "1004", paciente: "Laura Martínez", idPersonalSalud: "PS-201", profesional: "Dr. Carlos Rodríguez", fecha: "2025-11-22", hora: "15:30:00", estado: "Cancelada" },
];

export function AdministrativoGestionCitas({ navigate }: Props) {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("administrativoDashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Gestión de Citas</h1>
              <p className="text-sm text-gray-500">Administra todas las citas del sistema</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por ID, paciente, profesional..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={() => navigate("administrativoCrearCita")} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Crear Cita
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Cita</TableHead>
                    <TableHead>Paciente (ID)</TableHead>
                    <TableHead>Personal Salud (ID)</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citas.map((cita) => (
                    <TableRow key={cita.idCita}>
                      <TableCell className="font-medium">{cita.idCita}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{cita.paciente}</p>
                          <p className="text-xs text-gray-500">{cita.idPaciente}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{cita.profesional}</p>
                          <p className="text-xs text-gray-500">{cita.idPersonalSalud}</p>
                        </div>
                      </TableCell>
                      <TableCell>{cita.fecha}</TableCell>
                      <TableCell>{cita.hora}</TableCell>
                      <TableCell>{getStatusBadge(cita.estado)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Editar</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">Cancelar</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
