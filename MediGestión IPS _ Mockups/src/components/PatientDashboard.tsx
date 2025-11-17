import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  Calendar, 
  CalendarCheck, 
  Bell, 
  MessageSquare, 
  Clock, 
  MapPin, 
  User,
  LogOut,
  ChevronRight
} from "lucide-react";

export function PatientDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">MediGestión IPS</h1>
                <p className="text-sm text-gray-500">Portal del Paciente</p>
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
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-gray-900 mb-1">¡Bienvenida, María!</h2>
            <p className="text-gray-600">Aquí puedes gestionar tus citas y consultar tu información médica</p>
          </div>

          {/* Next Appointment Card */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <CalendarCheck className="h-6 w-6 text-blue-600" />
                  Próxima Cita
                </CardTitle>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  Confirmada
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha y Hora</p>
                      <p className="text-gray-900">Viernes, 22 de Noviembre 2025</p>
                      <p className="text-gray-900">10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Médico</p>
                      <p className="text-gray-900">Dr. Carlos Rodríguez</p>
                      <p className="text-sm text-gray-600">Cardiología</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ubicación</p>
                      <p className="text-gray-900">Sede Centro Norte</p>
                      <p className="text-sm text-gray-600">Consultorio 302 - Piso 3</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tiempo restante</p>
                      <p className="text-gray-900">7 días, 2 horas</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-blue-100 flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Ver Detalles
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50">
                  Cancelar Cita
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h3 className="text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-6 px-4 flex flex-col items-center gap-3 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-gray-900">Mis Citas</p>
                  <p className="text-xs text-gray-500 mt-1">Ver todas las citas</p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto py-6 px-4 flex flex-col items-center gap-3 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CalendarCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <p className="text-gray-900">Agendar Cita</p>
                  <p className="text-xs text-gray-500 mt-1">Solicitar nueva cita</p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto py-6 px-4 flex flex-col items-center gap-3 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center relative">
                  <Bell className="h-6 w-6 text-orange-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    2
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-gray-900">Notificaciones</p>
                  <p className="text-xs text-gray-500 mt-1">Ver recordatorios</p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto py-6 px-4 flex flex-col items-center gap-3 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <p className="text-gray-900">PQRS</p>
                  <p className="text-xs text-gray-500 mt-1">Quejas y solicitudes</p>
                </div>
              </Button>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Historial Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-900">Consulta General</p>
                        <p className="text-xs text-gray-500">Dr. López - 05 Nov 2025</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-900">Control Cardiología</p>
                        <p className="text-xs text-gray-500">Dr. Rodríguez - 20 Oct 2025</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-900">Exámenes de Laboratorio</p>
                        <p className="text-xs text-gray-500">15 Oct 2025</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <Button variant="link" className="w-full mt-4 text-blue-600">
                  Ver historial completo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Información Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Documento</span>
                    <span className="text-sm text-gray-900">CC 1.234.567.890</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Edad</span>
                    <span className="text-sm text-gray-900">34 años</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Teléfono</span>
                    <span className="text-sm text-gray-900">+57 300 123 4567</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm text-gray-900">maria.garcia@email.com</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-500">Tipo de sangre</span>
                    <span className="text-sm text-gray-900">O+</span>
                  </div>
                </div>
                
                <Button variant="link" className="w-full mt-4 text-blue-600">
                  Actualizar información
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
