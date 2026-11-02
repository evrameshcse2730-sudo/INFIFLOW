
import { useAuth } from "../../AuthContext";
import { useLocation } from "react-router-dom";
import { Bell, UserCircle, Menu } from "lucide-react";
import "./AdminNavbar.css";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/courses": "Courses Management",
  "/admin/pdfs": "PDF Library",
  "/admin/projects": "Projects Management",
  "/admin/settings": "Website Settings",
};

function AdminNavbar({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();

  const currentTitle =
    pageTitles[location.pathname] || "INIFLOW Admin";

  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="navbar-menu-button"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <div>
          <h2>{currentTitle}</h2>
          <p>Welcome to INIFLOW Admin Panel</p>
        </div>
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className="navbar-icon-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />
        </button>

        <div className="navbar-profile">
          <div className="navbar-avatar">
            <UserCircle size={23} />
          </div>

          <div className="navbar-user-info">
            <strong>Administrator</strong>
            <span>{user?.email || "Admin"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
