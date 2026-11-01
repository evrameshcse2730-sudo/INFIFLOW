
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../../firebase/auth";
import { useAuth } from "../../../AuthContext";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  FolderKanban,
  Settings,
  LogOut,
  LayoutDashboard,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import "./Dashboard.css";

const dashboardItems = [
  {
    title: "Manage Courses",
    description: "Add, edit and manage your learning courses.",
    icon: BookOpen,
    path: "/admin/courses",
    count: "Courses",
  },
  {
    title: "Manage PDFs",
    description: "Upload and organize course PDF resources.",
    icon: FileText,
    path: "/admin/pdfs",
    count: "PDF Library",
  },
  {
    title: "Manage Projects",
    description: "Update your portfolio and featured projects.",
    icon: FolderKanban,
    path: "/admin/projects",
    count: "Portfolio",
  },
  {
    title: "Website Settings",
    description: "Manage contact details and social links.",
    icon: Settings,
    path: "/admin/settings",
    count: "Settings",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-glow dashboard-glow-one" />
      <div className="dashboard-glow dashboard-glow-two" />

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <span>∞</span>
          INIFLOW
          <small>ADMIN</small>
        </div>

        <div className="dashboard-header-right">
          <a href="/" target="_blank" rel="noreferrer">
            View Website <ExternalLink size={15} />
          </a>

          <button onClick={handleLogout} className="logout-button">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <motion.div
          className="dashboard-welcome"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="dashboard-eyebrow">
            <LayoutDashboard size={14} /> ADMIN CONTROL CENTER
          </span>

          <h1>
            Welcome back<span>.</span>
          </h1>

          <p>
            Manage your creative portfolio, courses and learning resources
            from one place.
          </p>

          <div className="dashboard-user">
            Logged in as <strong>{user?.email || "Admin"}</strong>
          </div>
        </motion.div>

        <div className="dashboard-section-heading">
          <div>
            <h2>Website Management</h2>
            <p>Choose what you want to manage.</p>
          </div>
          <span>ADMIN PANEL</span>
        </div>

        <div className="dashboard-grid">
          {dashboardItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.button
                type="button"
                className="dashboard-card"
                key={item.title}
                onClick={() => navigate(item.path)}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="dashboard-card-top">
                  <div className="dashboard-card-icon">
                    <Icon size={23} />
                  </div>
                  <ArrowUpRight size={20} className="dashboard-arrow" />
                </div>

                <span className="dashboard-card-label">{item.count}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      <footer className="dashboard-footer">
        INIFLOW ADMIN PANEL <span>•</span> CREATIVE MANAGEMENT
      </footer>
    </main>
  );
}

export default Dashboard;
