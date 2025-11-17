import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  Filter,
  ArrowLeft,
  ChevronRight,
  Stethoscope,
  Bell,
  LogOut,
} from "lucide-react";

// Mock data for appointments
const upcomingAppointments = [
  {
    id: 1,
    date: "2025-11-22",
    time: "10:30 AM",
    specialty: "Cardiología",
    doctor: "Dr. Carlos Rodríguez",
    location: "Sede Centro Norte - Consultorio 302",
    status: "Confirmed",
  },
  {
    id: 2,
    date: "2025-11-28",
    time: "02:00 PM",
    specialty: "Medicina General",
    doctor: "Dra. Ana López",
    location: "Sede Sur - Consultorio 105",
    status: "Pending",
  },
  {
    id: 3,
    date: "2025-12-05",
    time: "09:00 AM",
    specialty: "Oftalmología",
    doctor: "Dr. Miguel Torres",
    location: "Sede Norte - Consultorio 201",
    status: "Confirmed",
  },
  {
    id: 4,
    date: "2025-12-12",
    time: "11:30 AM",
    specialty: "Dermatología",
    doctor: "Dra. Laura Martínez",
    location: "Sede Centro Norte - Consultorio 405",
    status: "Pending",
  },
];

const pastAppointments = [
  {
    id: 5,
    date: "2025-11-05",
    time: "03:00 PM",
    specialty: "Medicina General",
    doctor: "Dra. Ana López",
    location: "Sede Sur - Consultorio 105",
    status: "Attended",
  },
  {
    id: 6,
    date: "2025-10-20",
    time: "10:00 AM",
    specialty: "Cardiología",
    doctor: "Dr. Carlos Rodríguez",
    location: "Sede Centro Norte - Consultorio 302",
    status: "Attended",
  },
  {
    id: 7,
    date: "2025-10-15",
    time: "08:30 AM",
    specialty: "Laboratorio",
    doctor: "Análisis Clínicos",
    location: "Sede Sur - Laboratorio",
    status: "Attended",
  },
  {
    id: 8,
    date: "2025-09-28",
    time: "04:00 PM",
    specialty: "Pediatría",
    doctor: "Dr. Juan Pérez",
    location: "Sede Norte - Consultorio 110",
    status: "Cancelled",
  },
  {
    id: 9,
    date: "2025-09-10",
    time: "02:30 PM",
    specialty: "Odontología",
    doctor: "Dra. Sofia Ramírez",
    location: "Sede Centro Norte - Consultorio 501",
    status: "Attended",
  },
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    Confirmed: { className: "bg-green-100 text-green-700", label: "Confirmada" },
    Pending: { className: "bg-yellow-100 text-yellow-700", label: "Pendiente" },
    Cancelled: { className: "bg-red-100 text-red-700", label: "Cancelada" },
    Attended: { className: "bg-blue-100 text-blue-700", label: "Atendida" },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <Badge className={`${config.className} hover:${config.className}`}>
      {config.label}
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export function MyAppointments() {
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-gray-900">MediGestión IPS</h1>
                  <p className="text-sm text-gray-500">Mis Citas</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  2
                </span>
              </Button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm text-gray-900">María García López</p>
                  <p className="text-xs text-gray-500">Paciente</p>
                </div>
                <Avatar className="h-10 w-10 bg-blue-600">
                  <AvatarFallback className="bg-blue-600 text-white">MG</AvatarFallback>
                </Avatar>
              </div>
              
              <Button variant="ghost" size="sm">
                <LogOut className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">Mis Citas Médicas</h2>
              <p className="text-gray-600">Gestiona y consulta tus citas programadas</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Descargar Historial
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Rango de Fecha</label>
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las fechas</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mes</SelectItem>
                      <SelectItem value="quarter">Último trimestre</SelectItem>
                      <SelectItem value="year">Este año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Especialidad</label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="cardiology">Cardiología</SelectItem>
                      <SelectItem value="general">Medicina General</SelectItem>
                      <SelectItem value="ophthalmology">Oftalmología</SelectItem>
                      <SelectItem value="dermatology">Dermatología</SelectItem>
                      <SelectItem value="pediatrics">Pediatría</SelectItem>
                      <SelectItem value="dentistry">Odontología</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Sede</label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las sedes</SelectItem>
                      <SelectItem value="north">Sede Centro Norte</SelectItem>
                      <SelectItem value="south">Sede Sur</SelectItem>
                      <SelectItem value="north-branch">Sede Norte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Estado</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                      <SelectItem value="attended">Atendida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Upcoming/Past */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upcoming">
                Próximas ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Pasadas ({pastAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-6 flex-1">
                          {/* Date Column */}
                          <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg px-4 py-3 min-w-[100px]">
                            <p className="text-xs text-blue-600 uppercase">{formatDate(appointment.date).split(',')[0]}</p>
                            <p className="text-2xl text-blue-900">{new Date(appointment.date).getDate()}</p>
                            <p className="text-xs text-blue-600">{formatDate(appointment.date).split(',')[1].trim().split(' ')[0]}</p>
                          </div>

                          {/* Details Column */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Stethoscope className="h-4 w-4 text-blue-600" />
                                <h3 className="text-gray-900">{appointment.specialty}</h3>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{appointment.time}</span>
                                </div>
                                {getStatusBadge(appointment.status)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>{appointment.doctor}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions Column */}
                        <div className="flex flex-col gap-2 ml-4">
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Ver Detalles
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                          {appointment.status === "Pending" && (
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-6 flex-1">
                          {/* Date Column */}
                          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg px-4 py-3 min-w-[100px]">
                            <p className="text-xs text-gray-600 uppercase">{formatDate(appointment.date).split(',')[0]}</p>
                            <p className="text-2xl text-gray-900">{new Date(appointment.date).getDate()}</p>
                            <p className="text-xs text-gray-600">{formatDate(appointment.date).split(',')[1].trim().split(' ')[0]}</p>
                          </div>

                          {/* Details Column */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Stethoscope className="h-4 w-4 text-gray-600" />
                                <h3 className="text-gray-900">{appointment.specialty}</h3>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{appointment.time}</span>
                                </div>
                                {getStatusBadge(appointment.status)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>{appointment.doctor}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions Column */}
                        <div className="flex flex-col gap-2 ml-4">
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Ver Detalles
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                          {appointment.status === "Attended" && (
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                              Ver Historia
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
