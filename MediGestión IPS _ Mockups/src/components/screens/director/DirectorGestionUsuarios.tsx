import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ArrowLeft, Plus, Edit } from "lucide-react";
import { Screen } from "../../../App";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

type Props = {
  navigate: (screen: Screen) => void;
};

const usuarios = [
  { idUsuario: "1001", nombre: "María García López", email: "maria.garcia@email.com", telefono: "300-123-4567", direccion: "Calle 10 #20-30", estado: "Activo", rol: "Paciente" },
  { idUsuario: "PS-201", nombre: "Dr. Carlos Rodríguez", email: "c.rodriguez@medic.com", telefono: "310-456-7890", direccion: "Cra 5 #15-25", estado: "Activo", rol: "PersonalSalud" },
  { idUsuario: "2001", nombre: "Ana López Pérez", email: "a.lopez@admin.com", telefono: "320-789-0123", direccion: "Av 7 #12-18", estado: "Activo", rol: "Administrativo" },
  { idUsuario: "3001", nombre: "Dr. Luis Martínez", email: "l.martinez@director.com", telefono: "315-234-5678", direccion: "Calle 20 #30-40", estado: "Activo", rol: "Director" },
];

export function DirectorGestionUsuarios({ navigate }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("directorDashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Gestión de Usuarios y Roles</h1>
              <p className="text-sm text-gray-500">Administra los usuarios del sistema</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total de usuarios: {usuarios.length}</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Usuario</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.idUsuario}>
                      <TableCell className="font-medium">{usuario.idUsuario}</TableCell>
                      <TableCell>{usuario.nombre}</TableCell>
                      <TableCell className="text-sm">{usuario.email}</TableCell>
                      <TableCell>{usuario.telefono}</TableCell>
                      <TableCell className="text-sm">{usuario.direccion}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">{usuario.estado}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{usuario.rol}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">Asignar Rol</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Campos de USUARIOS:</strong> idUsuario, nombre, email, contrasena, telefono, direccion, estado<br />
              <strong>Tabla ROLES:</strong> idRol, nombreRol<br />
              <strong>Tabla USUARIOROL:</strong> idUsuario, idRol (relación muchos a muchos)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
