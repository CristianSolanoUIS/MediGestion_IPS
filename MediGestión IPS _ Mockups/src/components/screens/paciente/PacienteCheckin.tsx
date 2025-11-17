import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { ArrowLeft, CheckCircle, Calendar, Clock, User } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

export function PacienteCheckin({ navigate }: Props) {
  const [documento, setDocumento] = useState("");
  const [citaEncontrada, setCitaEncontrada] = useState(false);

  const handleBuscar = () => {
    if (documento) {
      setCitaEncontrada(true);
    }
  };

  const handleCheckin = () => {
    alert("Check-in realizado exitosamente. Por favor espera a ser llamado.");
    navigate("pacienteDashboard");
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
              <h1 className="text-gray-900">Check-in de Cita</h1>
              <p className="text-sm text-gray-500">Confirma tu asistencia</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Cita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documento">Número de Documento</Label>
                  <Input
                    id="documento"
                    type="text"
                    placeholder="Ingresa tu número de documento"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                  />
                </div>
                <Button onClick={handleBuscar} className="w-full bg-blue-600 hover:bg-blue-700">
                  Buscar Cita
                </Button>
              </div>
            </CardContent>
          </Card>

          {citaEncontrada && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-900">Cita Encontrada</CardTitle>
                  <Badge className="bg-green-600 text-white">Confirmada</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">ID Cita</p>
                      <p className="text-gray-900">C-10234</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estado</p>
                      <p className="text-gray-900">Confirmada</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Fecha</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <p className="text-gray-900">2025-11-22</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Hora</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <p className="text-gray-900">10:30:00</p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Personal de Salud</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-600" />
                        <p className="text-gray-900">Dr. Carlos Rodríguez - Cardiología</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">Instrucciones</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Confirma tu asistencia realizando el check-in</li>
                          <li>• Dirígete a la sala de espera</li>
                          <li>• Espera a ser llamado por el personal de salud</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleCheckin} className="w-full bg-green-600 hover:bg-green-700 text-white py-6">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Confirmar Check-in
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={() => navigate("pacienteDashboard")} variant="outline" className="w-full">
            Volver al Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
