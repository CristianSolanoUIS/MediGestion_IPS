import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { User, Stethoscope, Settings, Building2, Calendar } from "lucide-react";
import { Screen } from "../../App";

type Props = {
  navigate: (screen: Screen) => void;
  setUserRole: (role: string) => void;
};

export function RoleSelectionScreen({ navigate, setUserRole }: Props) {
  const handleRoleSelect = (role: string, screen: Screen) => {
    setUserRole(role);
    navigate(screen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl text-gray-900 mb-2">MediGestión IPS</h1>
          <p className="text-gray-600">Selecciona tu rol para continuar</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Paciente */}
          <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-400">
            <CardHeader>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-gray-900">Paciente</CardTitle>
              <p className="text-sm text-gray-600">Gestiona tus citas y consultas médicas</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleRoleSelect("Paciente", "pacienteDashboard")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Ingresar como Paciente
              </Button>
            </CardContent>
          </Card>

          {/* Personal de Salud */}
          <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-green-400">
            <CardHeader>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                <Stethoscope className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-gray-900">Personal de Salud</CardTitle>
              <p className="text-sm text-gray-600">Gestiona tu agenda y atiende pacientes</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleRoleSelect("PersonalSalud", "personalSaludDashboard")}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Ingresar como Personal de Salud
              </Button>
            </CardContent>
          </Card>

          {/* Administrativo */}
          <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-orange-400">
            <CardHeader>
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-gray-900">Administrativo</CardTitle>
              <p className="text-sm text-gray-600">Gestiona citas, agendas y PQRS</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleRoleSelect("Administrativo", "administrativoDashboard")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Ingresar como Administrativo
              </Button>
            </CardContent>
          </Card>

          {/* Director */}
          <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-400">
            <CardHeader>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-gray-900">Director</CardTitle>
              <p className="text-sm text-gray-600">Gestiona usuarios, reportes y operaciones</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleRoleSelect("Director", "directorDashboard")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Ingresar como Director
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => navigate("login")}
            className="text-gray-600"
          >
            Volver al inicio de sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
