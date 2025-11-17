import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, Users, FileText, Bell, CheckCircle, LogOut } from "lucide-react";

export function DashboardScreen() {
  return (
    <div className="w-full border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="border-b border-dashed border-gray-300 p-4 flex justify-between items-center">
        <h2>Dashboard</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm">Juan Pérez</span>
          <Button variant="outline" size="sm" className="border-dashed border-gray-400">
            <LogOut className="h-4 w-4 mr-1" />
            Cerrar sesión
          </Button>
        </div>
        <div className="w-2 h-12 border border-gray-300 bg-gray-200 rounded-sm">
          <div className="w-full h-4 bg-gray-400 rounded-sm"></div>
        </div>
      </div>

      <div className="flex h-96">
        {/* Sidebar */}
        <div className="w-64 border-r border-dashed border-gray-300 p-4">
          <nav className="space-y-2">
            <div className="flex items-center gap-3 p-2 border border-dashed border-blue-400 bg-blue-100 rounded">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Citas</span>
            </div>
            <div className="flex items-center gap-3 p-2 border border-dashed border-gray-400 rounded">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Check-in</span>
            </div>
            <div className="flex items-center gap-3 p-2 border border-dashed border-gray-400 rounded">
              <Users className="h-5 w-5" />
              <span className="text-sm">Usuarios</span>
            </div>
            <div className="flex items-center gap-3 p-2 border border-dashed border-gray-400 rounded">
              <FileText className="h-5 w-5" />
              <span className="text-sm">Reportes</span>
            </div>
            <div className="flex items-center gap-3 p-2 border border-dashed border-gray-400 rounded">
              <Bell className="h-5 w-5" />
              <span className="text-sm">Notificaciones</span>
              <span className="ml-auto bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">3</span>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-2 border-dashed border-blue-400 bg-blue-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <h3>Gestión de Citas</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Programar y gestionar citas médicas</p>
                <Button className="mt-3 w-full bg-blue-200 border border-dashed border-blue-400 text-blue-800 hover:bg-blue-300">
                  Acceder
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-green-400 bg-green-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3>Check-in Pacientes</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Confirmar asistencia a citas</p>
                <Button className="mt-3 w-full bg-green-200 border border-dashed border-green-400 text-green-800 hover:bg-green-300">
                  Acceder
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-purple-400 bg-purple-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-purple-600" />
                  <h3>Usuarios y Roles</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Administrar usuarios del sistema</p>
                <Button className="mt-3 w-full bg-purple-200 border border-dashed border-purple-400 text-purple-800 hover:bg-purple-300">
                  Acceder
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-orange-400 bg-orange-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-orange-600" />
                  <h3>Reportes</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Generar reportes y estadísticas</p>
                <Button className="mt-3 w-full bg-orange-200 border border-dashed border-orange-400 text-orange-800 hover:bg-orange-300">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Scrollbar */}
        <div className="w-2 border-l border-gray-300 bg-gray-200">
          <div className="w-full h-20 bg-gray-400 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
}