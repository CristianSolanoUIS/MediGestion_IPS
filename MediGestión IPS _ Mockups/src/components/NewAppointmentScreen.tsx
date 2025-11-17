import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Calendar, Clock, MapPin, User, Search } from "lucide-react";

export function NewAppointmentScreen() {
  const availableSlots = [
    { date: "2024-01-15", time: "09:00", doctor: "Dr. García", location: "Consultorio 101" },
    { date: "2024-01-15", time: "10:30", doctor: "Dr. García", location: "Consultorio 101" },
    { date: "2024-01-16", time: "14:00", doctor: "Dra. López", location: "Consultorio 205" },
    { date: "2024-01-16", time: "15:30", doctor: "Dra. López", location: "Consultorio 205" },
    { date: "2024-01-17", time: "11:00", doctor: "Dr. Martín", location: "Consultorio 308" },
  ];

  return (
    <div className="w-full border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="border-b border-dashed border-gray-300 p-4">
        <h2>Nueva Cita</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm">Especialidad</label>
            <Select>
              <SelectTrigger className="border-dashed border-gray-400 bg-gray-100">
                <SelectValue placeholder="Seleccionar especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardio">Cardiología</SelectItem>
                <SelectItem value="neuro">Neurología</SelectItem>
                <SelectItem value="derma">Dermatología</SelectItem>
                <SelectItem value="pediatria">Pediatría</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Sede</label>
            <Select>
              <SelectTrigger className="border-dashed border-gray-400 bg-gray-100">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Seleccionar sede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="norte">Sede Norte</SelectItem>
                <SelectItem value="sur">Sede Sur</SelectItem>
                <SelectItem value="centro">Sede Centro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Profesional</label>
            <Select>
              <SelectTrigger className="border-dashed border-gray-400 bg-gray-100">
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Seleccionar profesional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="garcia">Dr. García</SelectItem>
                <SelectItem value="lopez">Dra. López</SelectItem>
                <SelectItem value="martin">Dr. Martín</SelectItem>
                <SelectItem value="silva">Dra. Silva</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Rango de Fechas</label>
            <div className="flex gap-2">
              <Input 
                type="date" 
                className="border-dashed border-gray-400 bg-gray-100"
                placeholder="Fecha inicio"
              />
              <Input 
                type="date" 
                className="border-dashed border-gray-400 bg-gray-100"
                placeholder="Fecha fin"
              />
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-2">
          <label className="text-sm">Franjas Horarias Preferidas</label>
          <div className="flex gap-2">
            <Button variant="outline" className="border-dashed border-blue-400 bg-blue-100 text-blue-800">
              <Clock className="h-4 w-4 mr-2" />
              Mañana (8:00-12:00)
            </Button>
            <Button variant="outline" className="border-dashed border-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              Tarde (12:00-18:00)
            </Button>
            <Button variant="outline" className="border-dashed border-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              Noche (18:00-20:00)
            </Button>
          </div>
        </div>

        {/* Search Button */}
        <Button className="w-full bg-blue-200 border-2 border-dashed border-blue-400 text-blue-800 hover:bg-blue-300">
          <Search className="h-4 w-4 mr-2" />
          Buscar Cupos Disponibles
        </Button>

        {/* Results */}
        <div className="space-y-2">
          <label className="text-sm">Cupos Disponibles</label>
          <div className="border-2 border-dashed border-gray-400 rounded-lg bg-white max-h-64 overflow-y-auto">
            <div className="p-4 space-y-3">
              {availableSlots.map((slot, index) => (
                <Card key={index} className="border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{slot.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{slot.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{slot.doctor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{slot.location}</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-green-200 border border-dashed border-green-400 text-green-800 hover:bg-green-300">
                        Seleccionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Results Scrollbar */}
            <div className="absolute right-1 top-1 w-1 h-32 bg-gray-300 rounded">
              <div className="w-full h-8 bg-gray-500 rounded"></div>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <Button className="w-full bg-green-200 border-2 border-dashed border-green-400 text-green-800 hover:bg-green-300">
          <Calendar className="h-4 w-4 mr-2" />
          Crear Cita
        </Button>
      </div>

      {/* Main Scrollbar */}
      <div className="absolute right-0 top-0 w-2 h-full border-l border-gray-300 bg-gray-200">
        <div className="w-full h-40 bg-gray-400 rounded-sm"></div>
      </div>
    </div>
  );
}