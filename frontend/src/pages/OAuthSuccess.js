// src/pages/OAuthSuccess.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Avatar,
  Typography,
  Paper,
  Button,
} from "@mui/material";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5000";

export default function OAuthSuccess() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // pull the logged-in user from the backend session
    fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      credentials: "include", // IMPORTANT: send cookies
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Not authenticated");
        const data = await r.json();
        setUser(data.user);
      })
      .catch(() => {
        navigate("/"); // or your login route
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Signing you in…</Typography>
      </Box>
    );
  }

  if (!user) return null;

  // OPTIONAL: if you map roles by email or domain, decide here then navigate
  // Example:
  // const role = getRoleFromEmail(user.email);
  // navigate(`/${role}/dashboard`);

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: 380,
        }}
      >
        <Avatar src={user.photo} sx={{ width: 72, height: 72 }} />
        <Typography variant="h6">Welcome, {user.displayName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Paper>
    </Box>
  );
}
