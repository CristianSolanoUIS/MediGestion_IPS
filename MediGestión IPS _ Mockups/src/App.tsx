import { useState } from "react";
import { LoginScreen } from "./components/screens/LoginScreen";
import { RoleSelectionScreen } from "./components/screens/RoleSelectionScreen";

// Paciente screens
import { PacienteDashboard } from "./components/screens/paciente/PacienteDashboard";
import { PacienteMisCitas } from "./components/screens/paciente/PacienteMisCitas";
import { PacienteDetalleCita } from "./components/screens/paciente/PacienteDetalleCita";
import { PacienteAgendarCita } from "./components/screens/paciente/PacienteAgendarCita";
import { PacienteNotificaciones } from "./components/screens/paciente/PacienteNotificaciones";
import { PacienteRadicarPQRS } from "./components/screens/paciente/PacienteRadicarPQRS";
import { PacienteCheckin } from "./components/screens/paciente/PacienteCheckin";

// Administrativo screens
import { AdministrativoDashboard } from "./components/screens/administrativo/AdministrativoDashboard";
import { AdministrativoGestionCitas } from "./components/screens/administrativo/AdministrativoGestionCitas";
import { AdministrativoCrearCita } from "./components/screens/administrativo/AdministrativoCrearCita";
import { AdministrativoAgendaProfesional } from "./components/screens/administrativo/AdministrativoAgendaProfesional";
import { AdministrativoGestionPQRS } from "./components/screens/administrativo/AdministrativoGestionPQRS";
import { AdministrativoCheckin } from "./components/screens/administrativo/AdministrativoCheckin";

// Personal de Salud screens
import { PersonalSaludDashboard } from "./components/screens/personalSalud/PersonalSaludDashboard";
import { PersonalSaludAgenda } from "./components/screens/personalSalud/PersonalSaludAgenda";
import { PersonalSaludDetalleCita } from "./components/screens/personalSalud/PersonalSaludDetalleCita";

// Director screens
import { DirectorDashboard } from "./components/screens/director/DirectorDashboard";
import { DirectorGestionUsuarios } from "./components/screens/director/DirectorGestionUsuarios";
import { DirectorReportes } from "./components/screens/director/DirectorReportes";
import { DirectorReprogramacion } from "./components/screens/director/DirectorReprogramacion";

export type Screen = 
  | "login"
  | "roleSelection"
  // Paciente
  | "pacienteDashboard"
  | "pacienteMisCitas"
  | "pacienteDetalleCita"
  | "pacienteAgendarCita"
  | "pacienteNotificaciones"
  | "pacienteRadicarPQRS"
  | "pacienteCheckin"
  // Administrativo
  | "administrativoDashboard"
  | "administrativoGestionCitas"
  | "administrativoCrearCita"
  | "administrativoAgendaProfesional"
  | "administrativoGestionPQRS"
  | "administrativoCheckin"
  // Personal de Salud
  | "personalSaludDashboard"
  | "personalSaludAgenda"
  | "personalSaludDetalleCita"
  // Director
  | "directorDashboard"
  | "directorGestionUsuarios"
  | "directorReportes"
  | "directorReprogramacion";

export type NavigationContextType = {
  currentScreen: Screen;
  navigate: (screen: Screen, data?: any) => void;
  navigationData: any;
  userRole: string;
  setUserRole: (role: string) => void;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [navigationData, setNavigationData] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");

  const navigate = (screen: Screen, data?: any) => {
    setCurrentScreen(screen);
    if (data) {
      setNavigationData(data);
    }
  };

  const navigationContext: NavigationContextType = {
    currentScreen,
    navigate,
    navigationData,
    userRole,
    setUserRole,
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return <LoginScreen navigate={navigate} />;
      case "roleSelection":
        return <RoleSelectionScreen navigate={navigate} setUserRole={setUserRole} />;
      
      // Paciente
      case "pacienteDashboard":
        return <PacienteDashboard navigate={navigate} />;
      case "pacienteMisCitas":
        return <PacienteMisCitas navigate={navigate} />;
      case "pacienteDetalleCita":
        return <PacienteDetalleCita navigate={navigate} data={navigationData} />;
      case "pacienteAgendarCita":
        return <PacienteAgendarCita navigate={navigate} />;
      case "pacienteNotificaciones":
        return <PacienteNotificaciones navigate={navigate} />;
      case "pacienteRadicarPQRS":
        return <PacienteRadicarPQRS navigate={navigate} />;
      case "pacienteCheckin":
        return <PacienteCheckin navigate={navigate} />;
      
      // Administrativo
      case "administrativoDashboard":
        return <AdministrativoDashboard navigate={navigate} />;
      case "administrativoGestionCitas":
        return <AdministrativoGestionCitas navigate={navigate} />;
      case "administrativoCrearCita":
        return <AdministrativoCrearCita navigate={navigate} />;
      case "administrativoAgendaProfesional":
        return <AdministrativoAgendaProfesional navigate={navigate} />;
      case "administrativoGestionPQRS":
        return <AdministrativoGestionPQRS navigate={navigate} />;
      case "administrativoCheckin":
        return <AdministrativoCheckin navigate={navigate} />;
      
      // Personal de Salud
      case "personalSaludDashboard":
        return <PersonalSaludDashboard navigate={navigate} />;
      case "personalSaludAgenda":
        return <PersonalSaludAgenda navigate={navigate} />;
      case "personalSaludDetalleCita":
        return <PersonalSaludDetalleCita navigate={navigate} data={navigationData} />;
      
      // Director
      case "directorDashboard":
        return <DirectorDashboard navigate={navigate} />;
      case "directorGestionUsuarios":
        return <DirectorGestionUsuarios navigate={navigate} />;
      case "directorReportes":
        return <DirectorReportes navigate={navigate} />;
      case "directorReprogramacion":
        return <DirectorReprogramacion navigate={navigate} />;
      
      default:
        return <LoginScreen navigate={navigate} />;
    }
  };

  return <div className="min-h-screen">{renderScreen()}</div>;
}
