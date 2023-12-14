import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate, useLocation 
  } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Add, Search, CloudUpload, GetApp, Edit, Delete } from "@mui/icons-material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

const Members = () => {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:3001/member")
      .then((response) => {
        const data = [...response.data];
        data.reverse();
        setRows(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEdit = (id) => {
    console.log("Edit row with id:", id);
    // Xử lý logic sửa dòng dữ liệu có id tương ứng

    // Mở trang chỉnh sửa dữ liệu trong cùng tab hiện tại
    window.location.href = `/editmember/${id}`;
  };

  const handleDelete = (memberID) => {
    axios
      .delete(`http://localhost:3001/member/${memberID}`)
      .then((response) => {
        setRows((prevRows) => prevRows.filter((row) => row.memberID !== memberID));
        console.log("Row deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting row:", error);
      });
  };

  const handleAddNew = () => {
    navigate("/addmember");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const columns = [
    { field: "memberID", headerName: "ID thành viên" },
    { field: "fullName", headerName: "Tên chủ hộ", flex: 1 },
    { field: "memberFullName", headerName: "Tên thành viên", flex: 1 },
    { field: "memberIdCard", headerName: "Căn cước công dân", flex: 1 },
    { field: "memberBirthDate", headerName: "Ngày sinh", flex: 1 },
    { field: "memberAddress", headerName: "Địa chỉ", flex: 1 },
    { field: "memberSex", headerName: "Giới tính", flex: 1 },
    { field: "memberNation", headerName: "Dân tộc", flex: 1 },
    { field: "relationship", headerName: "Mối quan hệ", flex: 1 },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 1,
      renderCell: ({ row }) => (
        <>
          <button onClick={() => handleEdit(row.memberID)}>Sửa</button>
          <button onClick={() => handleDelete(row.memberID)}>Xóa</button>
        </>
      ),
    },
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách thành viên");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = "danh_sach_thanh_vien.xlsx";
    saveAs(data, fileName);
  };

  const handleImport = ($event) => {
    const files = $event.target.files;
    if (files && files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const importedRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const headerRow = importedRows[0];
        const idColumnIndex = headerRow.indexOf("memberID");

        const rows = importedRows.slice(1).map((row, index) => ({
          memberID: row[idColumnIndex],
          fullName: row[1],
          memberFullName: row[2],
          memberIdCard: row[3],
          memberBirthDate: row[4],
          memberAddress: row[5],
          memberSex: row[6],
          memberNation: row[7],
          relationship: row[8],
        }));

        const response = await fetch("http://localhost:3001/member/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rows),
        });

        if (response.ok) {
          console.log("Import successful");
          window.location.reload();
        } else {
          console.error("Import failed");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Box sx={{ padding: "0 10px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}> 
        <Button variant="contained" color="primary" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>Quay lại</Button> 
      <Typography variant="h4" gutterBottom>
        Danh sách thành viên
      </Typography>
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button variant="contained" onClick={handleAddNew} color="secondary" startIcon={<Add />}>
            Thêm mới thành viên
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={exportToExcel}color="secondary" startIcon={<GetApp />}>Xuất file Excel</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" component="label" color="secondary" startIcon={<CloudUpload />}>Nhập file Excel<input type="file" hidden onChange={handleImport} /></Button>
        </Grid>
        <Grid item>
          <TextField
            label="Tìm kiếm"
            value={searchQuery}
            onChange={handleSearch}
            size="small"
            InputProps={{
              endAdornment: <Search />,
            }}
          />
        </Grid>
      </Grid>
      <Routes>
        <Route
          path="/"
          element={
            <DataGrid
            rows={rows} getRowId={(row) => row.memberID}
              columns={columns}
              pageSize={10}
              autoHeight
              disableSelectionOnClick
            />
          }
        />
      </Routes>
    </Box>
  );
};

export default Members;
