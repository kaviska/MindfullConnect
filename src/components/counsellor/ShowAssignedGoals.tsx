"use client";

import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
} from "@mui/material";

interface ShowAssignedGoalsProps {
  counsellor_id: string;
  patient_id: string;
}

export default function ShowAssignedGoals({ counsellor_id, patient_id }: ShowAssignedGoalsProps) {
  const [assignedGoals, setAssignedGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignedGoals = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/assign-goal?counsellor_id=${counsellor_id}&patient_id=${patient_id}`
        );
        const data = await response.json();

        if (response.ok) {
          setAssignedGoals(data.assignedGoals);
        } else {
          setError(data.message || "Failed to fetch assigned goals.");
        }
      } catch (err) {
        console.error("Error fetching assigned goals:", err);
        setError("An error occurred while fetching assigned goals.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedGoals();
  }, [counsellor_id, patient_id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="64vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="64vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (assignedGoals.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="64vh">
        <Alert severity="info">No assigned goals found for this patient.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Assigned Goals
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }}
        gap={4}
      >
        {assignedGoals.map((goal) => (
          <Card key={goal._id} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {goal.goal_id.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {goal.goal_id.description}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Status:</strong> {goal.status}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Assigned At:</strong> {new Date(goal.assignedAt).toLocaleDateString()}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => console.log(`View Milestones for Goal ID: ${goal.goal_id._id}`)}
                sx={{ marginTop: 2 }}
              >
                View Milestones
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}