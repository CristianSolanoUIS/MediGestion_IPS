import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calendar, Lock, Mail } from "lucide-react";
import { Screen } from "../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

export function LoginScreen({ navigate }: Props) {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleLogin = () => {
    // Simulate login - navigate to role selection
    navigate("roleSelection");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Calendar className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl text-gray-900">MediGestión IPS</CardTitle>
            <p className="text-gray-600 mt-2">Sistema de Gestión Médica</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrasena">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="contrasena"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
          >
            Iniciar Sesión
          </Button>

          <div className="text-center text-sm text-gray-600">
            <a href="#" className="text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
