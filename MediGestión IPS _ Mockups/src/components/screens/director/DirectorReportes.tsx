import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

const reportes = [
  { idReporte: "REP-001", idPaciente: "1001", idGeneradoPor: "3001", descripcion: "Reporte mensual de citas y asistencia", fechaGeneracion: "2025-11-01 10:00:00" },
  { idReporte: "REP-002", idPaciente: null, idGeneradoPor: "3001", descripcion: "Análisis de ocupación por sede", fechaGeneracion: "2025-11-05 14:30:00" },
  { idReporte: "REP-003", idPaciente: "1002", idGeneradoPor: "PS-201", descripcion: "Historia clínica completa paciente 1002", fechaGeneracion: "2025-11-10 09:15:00" },
];

export function DirectorReportes({ navigate }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("directorDashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Reportes del Sistema</h1>
              <p className="text-sm text-gray-500">Consulta y genera reportes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Reportes disponibles</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <FileText className="h-4 w-4 mr-2" />
              Generar Nuevo Reporte
            </Button>
          </div>

          <div className="space-y-4">
            {reportes.map((reporte) => (
              <Card key={reporte.idReporte}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{reporte.descripcion}</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">ID Reporte</p>
                      <p className="text-gray-900">{reporte.idReporte}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">ID Paciente</p>
                      <p className="text-gray-900">{reporte.idPaciente || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Generado Por (ID)</p>
                      <p className="text-gray-900">{reporte.idGeneradoPor}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fecha Generación</p>
                      <p className="text-gray-900">{reporte.fechaGeneracion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Tabla REPORTE:</strong> idReporte, idPaciente, idGeneradoPor, descripcion, fechaGeneracion<br />
              <strong>Tabla DETALLEREPORTE:</strong> idDetalle, idReporte, idCita, observaciones
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
