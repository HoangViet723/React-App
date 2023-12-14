import React, { useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import TeamIcon from "@mui/icons-material/Group";
import AddTeamIcon from "@mui/icons-material/GroupAdd";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import MainChart from "../../components/MainChart";
import PieChart from "../../components/PieChart";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleTeamButtonClick = () => {
    navigate("/user");
  };
  
  const handleMemberButtonClick = () => {
    navigate("/member");
  };

  const [currentChart, setCurrentChart] = useState("geography");

  const handleChartToggleClick = () => {
    setCurrentChart((prevChart) => (prevChart === "geography" ? "pie" : "geography"));
  };

  const handleAddTeamButtonClick = () => {
    navigate("/adduser");
  };

  const handleAddMemberButtonClick = () => {
    navigate("/member");
  };

  return (
    <Box m="20px" display="flex" flexDirection="column" alignItems="center">
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginBottom="20px"
      >
        <Header title="Quản lý hộ gia đình" />
      </Box>

      {/* TEAM BUTTON */}
      <Box marginBottom="10px">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<TeamIcon />}
          size="large"
          onClick={handleTeamButtonClick}
          sx={{ width: "240px", height: "80px", fontSize: "18px" }}
        >
          Hộ gia đình
        </Button>
      </Box>

      {/* ADD TEAM BUTTON */}
      <Box marginBottom="10px">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddTeamIcon />}
          size="large"
          onClick={handleAddTeamButtonClick}
          sx={{ width: "240px", height: "80px", fontSize: "18px" }}
        >
          Thêm hộ gia đình
        </Button>
      </Box>

            {/* TEAM BUTTON */}
            <Box marginBottom="10px">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<TeamIcon />}
          size="large"
          onClick={handleMemberButtonClick}
          sx={{ width: "240px", height: "80px", fontSize: "18px" }}
        >
          Thành viên
        </Button>
      </Box>

      {/* ADD MEMBER BUTTON */}
      <Box marginBottom="10px">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddTeamIcon />}
          size="large"
          onClick={handleAddMemberButtonClick}
          sx={{ width: "240px", height: "80px", fontSize: "18px" }}
        >
          Thêm thành viên
        </Button>
      </Box>

      {/* GRID & CHARTS */}
      {/* Remaining code for the grid and charts */}
      <Box marginBottom="10px">
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleChartToggleClick}
          sx={{ width: "240px", height: "80px", fontSize: "18px" }}
        >
          Chuyển đổi biểu đồ
        </Button>
      </Box>
      {currentChart === "geography" ? <GeographyChart /> : <PieChart />}
    </Box>
  );
};

export default Dashboard;
