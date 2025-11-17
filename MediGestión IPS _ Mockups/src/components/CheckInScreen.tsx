import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { FileText, User, CheckCircle, Clock, AlertCircle } from "lucide-react";

export function CheckInScreen() {
  return (
    <div className="w-full border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="border-b border-dashed border-gray-300 p-4">
        <h2>Check-in de Pacientes</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm">ID de Cita</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Ej: CIT-2024-001234" 
                className="pl-10 border-dashed border-gray-400 bg-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Documento del Paciente</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Ej: 12345678" 
                className="pl-10 border-dashed border-gray-400 bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Check-in Button */}
        <Button className="w-full bg-blue-200 border-2 border-dashed border-blue-400 text-blue-800 hover:bg-blue-300">
          <CheckCircle className="h-4 w-4 mr-2" />
          Confirmar Asistencia
        </Button>

        {/* Results Section */}
        <div className="space-y-4">
          <label className="text-sm">Estado de la Cita</label>
          
          {/* En Sala */}
          <Card className="border-2 border-dashed border-green-400 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-200 border border-dashed border-green-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-green-800">En Sala de Espera</h4>
                  <p className="text-sm text-green-600">Paciente confirmado y en espera</p>
                  <p className="text-xs text-gray-600 mt-1">Hora de llegada: 14:25</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atendido */}
          <Card className="border-2 border-dashed border-blue-400 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-200 border border-dashed border-blue-400 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-blue-800">Atendido</h4>
                  <p className="text-sm text-blue-600">Consulta completada exitosamente</p>
                  <p className="text-xs text-gray-600 mt-1">Duración: 30 minutos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* No Asistió */}
          <Card className="border-2 border-dashed border-red-400 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-200 border border-dashed border-red-400 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-red-800">No Asistió</h4>
                  <p className="text-sm text-red-600">Paciente no se presentó a la cita</p>
                  <p className="text-xs text-gray-600 mt-1">Cita programada: 14:30</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Check-ins */}
        <div className="space-y-2">
          <label className="text-sm">Últimos Check-ins</label>
          <div className="border-2 border-dashed border-gray-400 rounded-lg bg-white p-4">
            <div className="space-y-3">
              {[
                { time: "14:45", patient: "María González", status: "En sala", id: "CIT-001" },
                { time: "14:30", patient: "Juan Pérez", status: "Atendido", id: "CIT-002" },
                { time: "14:15", patient: "Ana López", status: "En sala", id: "CIT-003" },
                { time: "14:00", patient: "Carlos Ruiz", status: "No asistió", id: "CIT-004" },
              ].map((checkin, index) => (
                <div key={index} className="flex justify-between items-center p-2 border border-dashed border-gray-300 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{checkin.time}</span>
                    <span className="text-sm">{checkin.patient}</span>
                    <span className="text-xs text-gray-400">({checkin.id})</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border border-dashed ${
                    checkin.status === 'En sala' ? 'bg-green-100 border-green-400 text-green-800' :
                    checkin.status === 'Atendido' ? 'bg-blue-100 border-blue-400 text-blue-800' :
                    'bg-red-100 border-red-400 text-red-800'
                  }`}>
                    {checkin.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollbar */}
      <div className="absolute right-0 top-0 w-2 h-full border-l border-gray-300 bg-gray-200">
        <div className="w-full h-32 bg-gray-400 rounded-sm"></div>
      </div>
    </div>
  );
}