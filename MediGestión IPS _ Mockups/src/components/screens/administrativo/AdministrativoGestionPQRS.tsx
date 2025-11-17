import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ArrowLeft } from "lucide-react";
import { Screen } from "../../../App";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

type Props = {
  navigate: (screen: Screen) => void;
};

const pqrs = [
  { idPQRS: "PQRS-1001", idPaciente: "1001", tipo: "Queja", estado: "En revisión", fechaRadicado: "2025-11-10", SLA: "15 días", idCita: "C-10100", responsable: "Administrativa Ana López", fechaCompromiso: "2025-11-25" },
  { idPQRS: "PQRS-1002", idPaciente: "1002", tipo: "Petición", estado: "Resuelta", fechaRadicado: "2025-11-05", SLA: "15 días", idCita: null, responsable: "Director Luis Martínez", fechaCompromiso: "2025-11-20" },
];

export function AdministrativoGestionPQRS({ navigate }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("administrativoDashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Gestión de PQRS</h1>
              <p className="text-sm text-gray-500">Administra peticiones, quejas, reclamos y sugerencias</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID PQRS</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Radicado</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Fecha Compromiso</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pqrs.map((item) => (
                  <TableRow key={item.idPQRS}>
                    <TableCell className="font-medium">{item.idPQRS}</TableCell>
                    <TableCell>{item.idPaciente}</TableCell>
                    <TableCell>{item.tipo}</TableCell>
                    <TableCell>
                      <Badge className={item.estado === "Resuelta" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                        {item.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.fechaRadicado}</TableCell>
                    <TableCell>{item.SLA}</TableCell>
                    <TableCell>{item.responsable}</TableCell>
                    <TableCell>{item.fechaCompromiso}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Asignar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
