import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { User, UserPlus, UserX, Mail, Shield } from "lucide-react";

export function UsersScreen() {
  const users = [
    { id: 1, name: "Dr. Juan García", email: "j.garcia@medigestion.com", role: "Trabajador de la salud" },
    { id: 2, name: "Dra. María López", email: "m.lopez@medigestion.com", role: "Trabajador de la salud" },
    { id: 3, name: "Ana Martínez", email: "a.martinez@medigestion.com", role: "Paciente" },
    { id: 4, name: "Carlos Ruiz", email: "c.ruiz@medigestion.com", role: "Administrativo" },
    { id: 5, name: "Laura Silva", email: "l.silva@medigestion.com", role: "Director" },
    { id: 6, name: "Pedro Díaz", email: "p.diaz@medigestion.com", role: "Trabajador de la salud" },
    { id: 7, name: "Elena Torres", email: "e.torres@medigestion.com", role: "Paciente" },
    { id: 8, name: "Sofía Herrera", email: "s.herrera@medigestion.com", role: "Administrativo" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Trabajador de la salud': return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'Paciente': return 'bg-green-100 border-green-400 text-green-800';
      case 'Administrativo': return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'Director': return 'bg-purple-100 border-purple-400 text-purple-800';
      default: return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  return (
    <div className="w-full border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="border-b border-dashed border-gray-300 p-4 flex justify-between items-center">
        <h2>Gestión de Usuarios y Roles</h2>
        <Button className="bg-blue-200 border border-dashed border-blue-400 text-blue-800 hover:bg-blue-300">
          <UserPlus className="h-4 w-4 mr-2" />
          Crear Usuario
        </Button>
      </div>

      <div className="p-6">
        {/* Table */}
        <div className="border-2 border-dashed border-gray-400 rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-dashed border-gray-300">
                <TableHead className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Nombre
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Correo Electrónico
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Rol
                </TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-b border-dashed border-gray-200">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={`border border-dashed ${getRoleColor(user.role)}`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-dashed border-blue-400 text-blue-600">
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="border-dashed border-red-400 text-red-600">
                        <UserX className="h-4 w-4 mr-1" />
                        Revocar Rol
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent className="border border-dashed border-gray-400 rounded-lg bg-white p-2">
              <PaginationItem>
                <PaginationPrevious href="#" className="border border-dashed border-gray-300" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="bg-blue-100 border border-dashed border-blue-400 text-blue-800">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="border border-dashed border-gray-300">
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="border border-dashed border-gray-300">
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="border border-dashed border-gray-300" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* User Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="border-2 border-dashed border-blue-400 bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-800">3</div>
            <div className="text-sm text-blue-600">Trabajadores de la salud</div>
          </div>
          <div className="border-2 border-dashed border-green-400 bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-800">2</div>
            <div className="text-sm text-green-600">Pacientes</div>
          </div>
          <div className="border-2 border-dashed border-yellow-400 bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-800">2</div>
            <div className="text-sm text-yellow-600">Administrativos</div>
          </div>
          <div className="border-2 border-dashed border-purple-400 bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-800">1</div>
            <div className="text-sm text-purple-600">Directores</div>
          </div>
        </div>
      </div>

      {/* Scrollbar */}
      <div className="absolute right-0 top-0 w-2 h-full border-l border-gray-300 bg-gray-200">
        <div className="w-full h-24 bg-gray-400 rounded-sm"></div>
      </div>
    </div>
  );
}