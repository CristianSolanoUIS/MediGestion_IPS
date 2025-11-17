import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Search, Filter, Calendar, Clock, User, Plus, MoreVertical } from "lucide-react";

export function AppointmentsScreen() {
  const appointments = [
    { id: 1, date: "2024-01-15", time: "09:00", doctor: "Dr. García", status: "Confirmada", specialty: "Cardiología" },
    { id: 2, date: "2024-01-16", time: "14:30", doctor: "Dra. López", status: "Pendiente", specialty: "Neurología" },
    { id: 3, date: "2024-01-17", time: "11:15", doctor: "Dr. Martín", status: "Cancelada", specialty: "Dermatología" },
    { id: 4, date: "2024-01-18", time: "16:00", doctor: "Dra. Silva", status: "Confirmada", specialty: "Pediatría" },
  ];

  return (
    <div className="w-full border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="border-b border-dashed border-gray-300 p-4 flex justify-between items-center">
        <h2>Mis Citas</h2>
        <div className="w-2 h-12 border border-gray-300 bg-gray-200 rounded-sm">
          <div className="w-full h-4 bg-gray-400 rounded-sm"></div>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar citas..." 
              className="pl-10 border-dashed border-gray-400 bg-gray-100"
            />
          </div>
          
          <Select>
            <SelectTrigger className="w-40 border-dashed border-gray-400 bg-gray-100">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-40 border-dashed border-gray-400 bg-gray-100">
              <SelectValue placeholder="Sede" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="norte">Sede Norte</SelectItem>
              <SelectItem value="sur">Sede Sur</SelectItem>
              <SelectItem value="centro">Sede Centro</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-40 border-dashed border-gray-400 bg-gray-100">
              <SelectValue placeholder="Especialidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardio">Cardiología</SelectItem>
              <SelectItem value="neuro">Neurología</SelectItem>
              <SelectItem value="derma">Dermatología</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-40 border-dashed border-gray-400 bg-gray-100">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Confirmada</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border-2 border-dashed border-gray-400 rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-dashed border-gray-300">
                <TableHead className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Fecha
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Hora
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Profesional
                </TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id} className="border-b border-dashed border-gray-200">
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>{appointment.specialty}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs border border-dashed ${
                      appointment.status === 'Confirmada' ? 'bg-green-100 border-green-400 text-green-800' :
                      appointment.status === 'Pendiente' ? 'bg-yellow-100 border-yellow-400 text-yellow-800' :
                      'bg-red-100 border-red-400 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-dashed border-blue-400 text-blue-600">
                        Reprogramar
                      </Button>
                      <Button size="sm" variant="outline" className="border-dashed border-red-400 text-red-600">
                        Cancelar
                      </Button>
                      <Button size="sm" variant="outline" className="border-dashed border-gray-400">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <Button className="rounded-full w-14 h-14 bg-blue-200 border-2 border-dashed border-blue-400 text-blue-800 hover:bg-blue-300 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Scrollbar */}
      <div className="absolute right-0 top-0 w-2 h-full border-l border-gray-300 bg-gray-200">
        <div className="w-full h-32 bg-gray-400 rounded-sm"></div>
      </div>
    </div>
  );
}