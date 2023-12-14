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
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

const Users = () => {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:3001/user")
      .then((response) => {
        // Tạo một bản sao của dữ liệu trả về
        const data = [...response.data];
        // Đảo ngược thứ tự của mảng
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
    window.location.href = `/edituser/${id}`;
  };
  
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/user/${id}`)
      .then((response) => {
        // Xóa dòng có id tương ứng khỏi danh sách
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        console.log("Row deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting row:", error);
      });
  };

  const handleAddNew = () => {
    navigate("/adduser"); // Điều hướng đến trang "/adduser"
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
    { field: "id", headerName: "Số sổ hộ khẩu" },
    { field: "fullName", headerName: "Tên chủ hộ", flex: 1 },
    { field: "idCard", headerName: "Căn cước công dân", flex: 1 },
    { field: "birthDate", headerName: "Ngày sinh", flex: 1 },
    { field: "address", headerName: "Địa chỉ", flex: 1 },
    { field: "sex", headerName: "Giới tính", flex: 1 },
    { field: "nation", headerName: "Dân tộc", flex: 1 },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 1,
      renderCell: ({ row }) => (
        <>
          <button onClick={() => handleEdit(row.id)}>Sửa</button>
          <button onClick={() => handleDelete(row.id)}>Xóa</button>
        </>
      ),
    },
  ];
  
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách hộ gia đình");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = "danh_sach_ho_gia_dinh.xlsx";
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
  
        // Lấy cột id từ importedRows
        const headerRow = importedRows[0];
        const idColumnIndex = headerRow.indexOf("id");
  
        // Tạo rows từ importedRows, sử dụng giá trị trong cột id làm id duy nhất
        const rows = importedRows.slice(1).map((row, index) => ({
          id: row[idColumnIndex],
          fullName: row[1],
          idCard: row[2],
          birthDate: row[3],
          address: row[4],
          sex: row[5],
          nation: row[6],
        }));
  
        // Gửi dữ liệu lên phía server
        const response = await fetch("http://localhost:3001/user/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rows),
        });
  
        if (response.ok) {
          console.log("Import successful");
          // Reload lại trang sau khi lưu trữ thành công
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
        Danh sách chủ hộ gia đình
      </Typography>
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button variant="contained" onClick={handleAddNew} color="secondary" startIcon={<Add />}>
            Thêm mới chủ hộ gia đình
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
              rows={filteredRows}
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

export default Users;