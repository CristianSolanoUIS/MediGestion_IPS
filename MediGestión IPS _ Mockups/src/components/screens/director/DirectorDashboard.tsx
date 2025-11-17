import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Users, FileText, Calendar, Building2, LogOut, BarChart3 } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

export function DirectorDashboard({ navigate }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">MediGestión IPS</h1>
                <p className="text-sm text-gray-500">Panel Director</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-900">Dr. Luis Martínez</p>
                <p className="text-xs text-gray-500">ID: 3001 | Cargo: Director General</p>
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
            <h2 className="text-gray-900 mb-1">Dashboard del Director</h2>
            <p className="text-gray-600">Resumen ejecutivo y gestión estratégica</p>
          </div>

          {/* Métricas */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl text-blue-600 mb-2">[Placeholder]</div>
                  <p className="text-sm text-gray-600">Total Pacientes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl text-green-600 mb-2">[Placeholder]</div>
                  <p className="text-sm text-gray-600">Personal Activo</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl text-purple-600 mb-2">[Placeholder]</div>
                  <p className="text-sm text-gray-600">Citas Mes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl text-orange-600 mb-2">[Placeholder]</div>
                  <p className="text-sm text-gray-600">Ocupación %</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Módulos */}
          <div>
            <h3 className="text-gray-900 mb-4">Módulos de Gestión</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("directorGestionUsuarios")}>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <p className="text-sm text-gray-600">Administra usuarios y roles del sistema</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Acceder
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("directorReportes")}>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Reportes</CardTitle>
                  <p className="text-sm text-gray-600">Genera y consulta reportes del sistema</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Acceder
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("directorReprogramacion")}>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Reprogramación Masiva</CardTitle>
                  <p className="text-sm text-gray-600">Gestiona cambios masivos de citas</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
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
