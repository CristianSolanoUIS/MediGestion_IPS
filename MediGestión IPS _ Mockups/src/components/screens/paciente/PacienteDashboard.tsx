import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Calendar, Clock, MapPin, User, Bell, FileText, CalendarCheck, MessageSquare, LogOut } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

export function PacienteDashboard({ navigate }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">MediGestión IPS</h1>
                <p className="text-sm text-gray-500">Portal del Paciente</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("pacienteNotificaciones")}>
                <Bell className="h-5 w-5" />
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">2</span>
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-900">María García</p>
                <p className="text-xs text-gray-500">ID Usuario: 1001</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("login")}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-gray-900 mb-1">¡Bienvenida, María!</h2>
            <p className="text-gray-600">Gestiona tus citas médicas</p>
          </div>

          {/* Próxima Cita */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-900">Próxima Cita</CardTitle>
                <Badge className="bg-green-100 text-green-700">Confirmada</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">idCita</p>
                    <p className="text-gray-900">C-10234</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estado</p>
                    <p className="text-gray-900">Confirmada</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fecha</p>
                    <p className="text-gray-900">2025-11-22</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Hora</p>
                    <p className="text-gray-900">10:30:00</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Personal de Salud</p>
                    <p className="text-gray-900">Dr. Carlos Rodríguez - Cardiología</p>
                    <p className="text-sm text-gray-600">Sede: Centro Norte</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => navigate("pacienteDetalleCita")} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Ver Detalle
                  </Button>
                  <Button onClick={() => navigate("pacienteCheckin")} variant="outline" className="flex-1">
                    Check-in
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <div>
            <h3 className="text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Button
                onClick={() => navigate("pacienteMisCitas")}
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-3 border-2 hover:border-blue-400 hover:bg-blue-50"
              >
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="text-center">
                  <p className="text-gray-900">Mis Citas</p>
                </div>
              </Button>

              <Button
                onClick={() => navigate("pacienteAgendarCita")}
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-3 border-2 hover:border-green-400 hover:bg-green-50"
              >
                <CalendarCheck className="h-8 w-8 text-green-600" />
                <div className="text-center">
                  <p className="text-gray-900">Agendar Cita</p>
                </div>
              </Button>

              <Button
                onClick={() => navigate("pacienteNotificaciones")}
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-3 border-2 hover:border-orange-400 hover:bg-orange-50"
              >
                <Bell className="h-8 w-8 text-orange-600" />
                <div className="text-center">
                  <p className="text-gray-900">Notificaciones</p>
                </div>
              </Button>

              <Button
                onClick={() => navigate("pacienteRadicarPQRS")}
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-3 border-2 hover:border-purple-400 hover:bg-purple-50"
              >
                <MessageSquare className="h-8 w-8 text-purple-600" />
                <div className="text-center">
                  <p className="text-gray-900">Radicar PQRS</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
