import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userId } = useParams();

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/user/${userId}`
        );
        console.log("API response:", response.data);
        setUserData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userId]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      cellClassName: "name-column--cell no-border-bottom",
    },
    { field: "idCard", headerName: "ID Card", flex: 1 },
    { field: "birthDate", headerName: "Birth Date", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "nation", headerName: "Nation", flex: 1 },
  ];

  console.log("userData:", userData);

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .no-border-bottom": {
            borderBottom: "none !important",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={userData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={10}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Contacts;
