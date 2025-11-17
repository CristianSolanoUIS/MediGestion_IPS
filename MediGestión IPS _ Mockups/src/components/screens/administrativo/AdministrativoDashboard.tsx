import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Calendar, Users, MessageSquare, CheckCircle, Settings, LogOut, FileText } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

export function AdministrativoDashboard({ navigate }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">MediGestión IPS</h1>
                <p className="text-sm text-gray-500">Panel Administrativo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-900">Ana López Pérez</p>
                <p className="text-xs text-gray-500">ID Usuario: 2001 | Área: Recepción</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("login")}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-gray-900 mb-1">Dashboard Operativo</h2>
            <p className="text-gray-600">Gestión administrativa del sistema</p>
          </div>

          {/* Métricas */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl text-blue-600 mb-2">[Placeholder]</div>
                  <p className="text-sm text-gray-600">Citas Hoy</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl text-green-600 mb-2">[Placeholder]</div>
                  <p className="text-sm text-gray-600">Check-ins</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl text-yellow-600 mb-2">[Placeholder]</div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl text-purple-600 mb-2">[Placeholder]</div>
                  <p className="text-sm text-gray-600">PQRS Activas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Módulos */}
          <div>
            <h3 className="text-gray-900 mb-4">Módulos de Gestión</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("administrativoGestionCitas")}>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Gestión de Citas</CardTitle>
                  <p className="text-sm text-gray-600">Crear, editar y gestionar citas</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Acceder
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("administrativoAgendaProfesional")}>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Agenda del Profesional</CardTitle>
                  <p className="text-sm text-gray-600">Consultar agendas disponibles</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Acceder
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("administrativoCheckin")}>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Check-in Recepción</CardTitle>
                  <p className="text-sm text-gray-600">Gestionar llegada de pacientes</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Acceder
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("administrativoGestionPQRS")}>
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Gestión PQRS</CardTitle>
                  <p className="text-sm text-gray-600">Administrar solicitudes y quejas</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Acceder
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
