import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: "#ffffff",
        color: "#000",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <Typography variant="h6" fontWeight="bold">
          ERP Management System
        </Typography>

        {/* RIGHT SIDE */}
        <Box display="flex" alignItems="center" gap={2}>
          {user && (
            <Typography variant="body2" color="text.secondary">
              {user.name} ({user.role})
            </Typography>
          )}

          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
