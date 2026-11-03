
import { NavLink, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../firebase/auth";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  FolderKanban,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import "./Sidebar.css";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { title: "Courses", icon: BookOpen, path: "/admin/courses" },
  { title: "Classes", icon: GraduationCap, path: "/admin/classes" },
  { title: "PDF Library", icon: FileText, path: "/admin/pdfs" },
  { title: "Projects", icon: FolderKanban, path: "/admin/projects" },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      onClose();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand">
        <span className="sidebar-logo">∞</span>
        <div>
          <h2>INIFLOW</h2>
          <p>CREATIVE STUDIO</p>
        </div>

        <button
          type="button"
          className="sidebar-close"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <X size={21} />
        </button>
      </div>

      <div className="sidebar-menu-heading">MAIN MENU</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-status">
          <span className="status-dot" />
          System Online
        </div>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        <div className="sidebar-version">
          INIFLOW ADMIN PANEL · V1.0
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
