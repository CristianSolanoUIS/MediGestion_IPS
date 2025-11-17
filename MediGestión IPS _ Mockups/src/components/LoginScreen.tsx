import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Eye, User, Lock } from "lucide-react";

export function LoginScreen() {
  return (
    <Card className="w-full max-w-md border-2 border-dashed border-gray-400 bg-gray-50">
      <CardHeader className="border-b border-dashed border-gray-300 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-dashed border-blue-400 rounded bg-blue-100 flex items-center justify-center">
              <span className="text-xs">LOGO</span>
            </div>
            <span className="text-sm">MediGestión IPS</span>
          </div>
          <div className="w-2 h-16 border border-gray-300 bg-gray-200 rounded-sm">
            <div className="w-full h-6 bg-gray-400 rounded-sm"></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Usuario/Correo</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="usuario@ejemplo.com" 
                className="pl-10 border-dashed border-gray-400 bg-gray-100"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="pl-10 pr-10 border-dashed border-gray-400 bg-gray-100"
              />
              <Eye className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer" />
            </div>
          </div>
          
          <Button className="w-full bg-blue-200 border-2 border-dashed border-blue-400 text-blue-800 hover:bg-blue-300">
            Ingresar
          </Button>
          
          <div className="text-center">
            <a href="#" className="text-sm text-blue-600 underline border-b border-dashed border-blue-400">
              Registrarse
            </a>
          </div>
          
          <div className="mt-4 p-2 border border-dashed border-red-400 bg-red-50 text-red-700 text-sm rounded">
            ⚠️ Credenciales inválidas
          </div>
        </div>
      </CardContent>
    </Card>
  );
}