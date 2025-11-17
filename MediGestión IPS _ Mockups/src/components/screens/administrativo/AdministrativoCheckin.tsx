import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { ArrowLeft, Search, CheckCircle } from "lucide-react";
import { Screen } from "../../../App";

type Props = {
  navigate: (screen: Screen) => void;
};

export function AdministrativoCheckin({ navigate }: Props) {
  const [documento, setDocumento] = useState("");
  const [citaEncontrada, setCitaEncontrada] = useState(false);

  const handleBuscar = () => {
    if (documento) setCitaEncontrada(true);
  };

  const handleCheckin = () => {
    alert("Check-in registrado exitosamente");
    setCitaEncontrada(false);
    setDocumento("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("administrativoDashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Check-in Recepción</h1>
              <p className="text-sm text-gray-500">Registra la llegada de pacientes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documento">Número de Documento</Label>
                  <div className="flex gap-3">
                    <Input
                      id="documento"
                      type="text"
                      placeholder="Ingresa el número de documento"
                      value={documento}
                      onChange={(e) => setDocumento(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleBuscar} className="bg-orange-600 hover:bg-orange-700">
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </Button>
                  </div>
                </div>
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
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">ID Cita</p>
                      <p className="text-gray-900">C-10234</p>
                    </div>
                    <div>
                      <p className="text-gray-600">ID Paciente</p>
                      <p className="text-gray-900">1001</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Paciente</p>
                      <p className="text-gray-900">María García López</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Personal Salud</p>
                      <p className="text-gray-900">Dr. Carlos Rodríguez</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha</p>
                      <p className="text-gray-900">2025-11-22</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Hora</p>
                      <p className="text-gray-900">10:30:00</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Estado</p>
                      <p className="text-gray-900">Confirmada</p>
                    </div>
                  </div>

                  <Button onClick={handleCheckin} className="w-full bg-green-600 hover:bg-green-700 py-6">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Confirmar Check-in
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
