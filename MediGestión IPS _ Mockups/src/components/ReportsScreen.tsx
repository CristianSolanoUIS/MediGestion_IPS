import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, Download, Calendar, MapPin, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";

const appointmentData = [
  { month: 'Ene', citas: 120, completadas: 98 },
  { month: 'Feb', citas: 135, completadas: 110 },
  { month: 'Mar', citas: 148, completadas: 125 },
  { month: 'Abr', citas: 162, completadas: 140 },
  { month: 'May', citas: 155, completadas: 138 },
  { month: 'Jun', citas: 178, completadas: 158 },
];

const specialtyData = [
  { name: 'Cardiología', value: 35, color: '#3B82F6' },
  { name: 'Neurología', value: 28, color: '#10B981' },
  { name: 'Dermatología', value: 22, color: '#F59E0B' },
  { name: 'Pediatría', value: 15, color: '#EF4444' },
];

export function ReportsScreen() {
  return (
    <div className="w-full border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="border-b border-dashed border-gray-300 p-4">
        <h2>Reportes y Estadísticas</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex gap-4 p-4 border-2 border-dashed border-gray-400 rounded-lg bg-white">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <Select>
              <SelectTrigger className="w-40 border-dashed border-gray-400 bg-gray-100">
                <SelectValue placeholder="Sede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las sedes</SelectItem>
                <SelectItem value="norte">Sede Norte</SelectItem>
                <SelectItem value="sur">Sede Sur</SelectItem>
                <SelectItem value="centro">Sede Centro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Select>
              <SelectTrigger className="w-40 border-dashed border-gray-400 bg-gray-100">
                <SelectValue placeholder="Especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="cardio">Cardiología</SelectItem>
                <SelectItem value="neuro">Neurología</SelectItem>
                <SelectItem value="derma">Dermatología</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Input 
              type="date" 
              className="border-dashed border-gray-400 bg-gray-100"
              placeholder="Fecha inicio"
            />
            <span className="text-gray-500">-</span>
            <Input 
              type="date" 
              className="border-dashed border-gray-400 bg-gray-100"
              placeholder="Fecha fin"
            />
          </div>

          <div className="flex gap-2 ml-auto">
            <Button className="bg-blue-200 border border-dashed border-blue-400 text-blue-800 hover:bg-blue-300">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button className="bg-green-200 border border-dashed border-green-400 text-green-800 hover:bg-green-300">
              <FileText className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-2 border-dashed border-blue-400 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-200 border border-dashed border-blue-400 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-800">1,248</p>
                  <p className="text-sm text-blue-600">Total Citas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-green-400 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-200 border border-dashed border-green-400 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-800">1,069</p>
                  <p className="text-sm text-green-600">Completadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-yellow-400 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-200 border border-dashed border-yellow-400 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-800">25</p>
                  <p className="text-sm text-yellow-600">Min Promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-purple-400 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-200 border border-dashed border-purple-400 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-800">85.7%</p>
                  <p className="text-sm text-purple-600">Tasa Éxito</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="border-2 border-dashed border-gray-400 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Citas por Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 border border-dashed border-gray-300 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Bar dataKey="citas" fill="#93c5fd" stroke="#3b82f6" strokeWidth={1} strokeDasharray="4 4" />
                    <Bar dataKey="completadas" fill="#86efac" stroke="#10b981" strokeWidth={1} strokeDasharray="4 4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="border-2 border-dashed border-gray-400 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribución por Especialidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 border border-dashed border-gray-300 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={specialtyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="#6b7280"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    >
                      {specialtyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {specialtyData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 border border-dashed rounded" 
                      style={{ backgroundColor: entry.color, borderColor: entry.color }}
                    ></div>
                    <span>{entry.name}: {entry.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-2 border-dashed border-gray-400 bg-white">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "15:30", action: "Nueva cita creada", user: "Dr. García", details: "Cardiología - 2024-01-20" },
                { time: "15:15", action: "Check-in completado", user: "Recepción", details: "Paciente: María González" },
                { time: "14:45", action: "Cita cancelada", user: "Dr. López", details: "Neurología - 2024-01-19" },
                { time: "14:30", action: "Usuario creado", user: "Admin", details: "Nuevo trabajador de la salud: Juan Pérez" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border border-dashed border-gray-300 rounded">
                  <span className="text-sm text-gray-500 w-16">{activity.time}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.details}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.user}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrollbar */}
      <div className="absolute right-0 top-0 w-2 h-full border-l border-gray-300 bg-gray-200">
        <div className="w-full h-48 bg-gray-400 rounded-sm"></div>
      </div>
    </div>
  );
}