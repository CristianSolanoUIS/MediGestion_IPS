import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ArrowLeft, Bell, Calendar, AlertCircle, Info } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

const notificaciones = [
  {
    idNotificacion: "N-1001",
    idUsuario: "1001",
    tipo: "Recordatorio",
    estado: "No leída",
    titulo: "Cita próxima - 22/Nov/2025",
    mensaje: "Recuerda tu cita de Cardiología con Dr. Carlos Rodríguez el 22 de noviembre a las 10:30 AM en Sede Centro Norte.",
    meta: JSON.stringify({ idCita: "C-10234" }),
    creadaEn: "2025-11-14T08:00:00",
    leidaEn: null,
  },
  {
    idNotificacion: "N-1002",
    idUsuario: "1001",
    tipo: "Confirmación",
    estado: "No leída",
    titulo: "Cita confirmada",
    mensaje: "Tu cita ha sido confirmada exitosamente. Por favor llega 15 minutos antes para realizar el check-in.",
    meta: JSON.stringify({ idCita: "C-10234" }),
    creadaEn: "2025-11-13T14:30:00",
    leidaEn: null,
  },
  {
    idNotificacion: "N-1003",
    idUsuario: "1001",
    tipo: "Informativo",
    estado: "Leída",
    titulo: "Actualización de datos",
    mensaje: "Te recordamos mantener actualizados tus datos de contacto (teléfono, dirección, email).",
    meta: null,
    creadaEn: "2025-11-10T10:00:00",
    leidaEn: "2025-11-10T15:20:00",
  },
];

export function PacienteNotificaciones({ navigate }: Props) {
  const getIconByType = (tipo: string) => {
    switch (tipo) {
      case "Recordatorio":
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case "Confirmación":
        return <Bell className="h-5 w-5 text-green-600" />;
      case "Alerta":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
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
              <h1 className="text-gray-900">Notificaciones</h1>
              <p className="text-sm text-gray-500">Revisa tus mensajes y alertas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {notificaciones.map((notif) => (
            <Card
              key={notif.idNotificacion}
              className={`hover:shadow-md transition-shadow ${
                notif.estado === "No leída" ? "border-blue-300 bg-blue-50" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getIconByType(notif.tipo)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-gray-900">{notif.titulo}</h3>
                        <p className="text-sm text-gray-500">ID: {notif.idNotificacion}</p>
                      </div>
                      <Badge
                        className={
                          notif.estado === "No leída"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {notif.estado}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-3">{notif.mensaje}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Tipo</p>
                        <p className="text-gray-900">{notif.tipo}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Creada en</p>
                        <p className="text-gray-900">
                          {new Date(notif.creadaEn).toLocaleString("es-ES")}
                        </p>
                      </div>
                      {notif.leidaEn && (
                        <div>
                          <p className="text-gray-500">Leída en</p>
                          <p className="text-gray-900">
                            {new Date(notif.leidaEn).toLocaleString("es-ES")}
                          </p>
                        </div>
                      )}
                      {notif.meta && (
                        <div>
                          <p className="text-gray-500">Metadata</p>
                          <p className="text-gray-900 text-xs">{notif.meta}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Button onClick={() => navigate("pacienteDashboard")} variant="outline">
            Volver al Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
