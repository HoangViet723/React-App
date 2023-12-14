import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

const EditUsers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [idCardError, setIdCardError] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/${id}`)
      .then((response) => {
        setUser(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setIsLoading(false);
      });
  }, [id]);

  
  const validateIdCard = () => {
    // Kiểm tra số căn cước có đúng 12 chữ số không
    if (user.idCard.length !== 12) {
      setIdCardError(true);
      return false;
    }
  
    // Kiểm tra 3 số đầu tiên của căn cước có khớp với thông tin địa chỉ không
    const firstThreeDigits = user.idCard.substring(0, 3);
    const addressCode = getAddressCode(user.address);
  
    if (firstThreeDigits !== addressCode) {
      setIdCardError(true);
      return false;
    }

    //Kiểm tra số vị trí thứ 4
// Chuyển đổi user.birthDate thành một đối tượng Date
    const birthDate = new Date(user.birthDate);
    const birthDateYear = birthDate.getFullYear();
    const birthCentury = Math.floor((birthDateYear - 1) / 100) + 1;
    const sex = user.sex === "Nam" ? 0 : 1;
    
    let expectedDigit;
    if (birthCentury === 20) {
      expectedDigit = sex === 0 ? "0" : "1";
    } else if (birthCentury === 21) {
      expectedDigit = sex === 0 ? "2" : "3";
    } else if (birthCentury === 22) {
      expectedDigit = sex === 0 ? "4" : "5";
    } else if (birthCentury === 23) {
      expectedDigit = sex === 0 ? "6" : "7";
    } else if (birthCentury === 24) {
      expectedDigit = sex === 0 ? "8" : "9";
    }
    const actualDigit = user.idCard[3];

    if (actualDigit !== expectedDigit) {
      setIdCardError(true);
      return false;
    }
    
    // Kiểm tra chữ số ở vị trí thứ 5 và 6 có đúng là 2 chữ số cuối của năm sinh không
    const birthYear = user.birthDate.substring(2, 4);
    const fifthAndSixthDigits = user.idCard.substring(4, 6);
  
    if (fifthAndSixthDigits !== birthYear) {
      setIdCardError(true);
      return false;
    }
  
    setIdCardError(false);
    return true;
  };

  const getAddressCode = (address) => {
    switch (address) {
      case "Hà Nội":
        return "001";
      case "Thái Bình":
        return "034";
      case "Đắk Nông":
        return "067";
      case "Hà Giang":
        return "002";
      case "Hà Nam":
        return "035";
      case "Lâm Đồng":
        return "068";
      case "Cao Bằng":
        return "004";
      case "Nam Định":
        return "036";
      case "Bình Phước":
        return "070";
      case "Bắc Kạn":
        return "006";
      case "Ninh Bình":
        return "037";
      case "Tây Ninh":
        return "072";
      case "Tuyên Quang":
        return "008";
      case "Thanh Hóa":
        return "038";
      case "Bình Dương":
        return "074";
      case "Lào Cai":
        return "010";
      case "Nghệ An":
        return "040";
      case "Đồng Nai":
        return "075";
      case "Điện Biên":
        return "011";
      case "Hà Tĩnh":
        return "042";
      case "Bà Rịa - Vũng Tàu":
        return "077";
      case "Lai Châu":
        return "012";
      case "Quảng Bình":
        return "044";
      case "TP Hồ Chí Minh":
        return "079";
      case "Sơn La":
        return "014";
      case "Quảng Trị":
        return "045";
      case "Long An":
        return "080";
      case "Yên Bái":
        return "015";
      case "Thừa Thiên Huế":
        return "046";
      case "Tiền Giang":
        return "082";
      case "Hòa Bình":
        return "017";
      case "Đà Nẵng":
        return "048";
      case "Bến Tre":
        return "083";
      case "Thái Nguyên":
        return "019";
      case "Quảng Nam":
        return "049";
      case "Trà Vinh":
        return "084";
      case "Lạng Sơn":
        return "020";
      case "Quảng Ngãi":
        return "051";
      case "Vĩnh Long":
        return "086";
      case "Quảng Ninh":
        return "022";
      case "Bình Định":
        return "052";
      case "Đồng Tháp":
        return "087";
      case "Bắc Giang":
        return "024";
      case "Phú Yên":
        return "054";
      case "An Giang":
        return "089";
      case "Phú Thọ":
        return "025";
      case "Khánh Hòa":
        return "056";
      case "Kiên Giang":
        return "091";
      case "Vĩnh Phúc":
        return "026";
      case "Ninh Thuận":
        return "058";
      case "Cần Thơ":
        return "092";
      case "Bắc Ninh":
        return "027";
      case "Bình Thuận":
        return "060";
      case "Hậu Giang":
        return "093";
      case "Hải Dương":
        return "030";
      case "Kon Tum":
        return "062";
      case "Sóc Trăng":
        return "094";
      case "Hải Phòng":
        return "031";
      case "Gia Lai":
        return "064";
      case "Bạc Liêu":
        return "095";
      case "Hưng Yên":
        return "033";
      case "Đắk Lắk":
        return "066";
      case "Cà Mau":
        return "096";
      default:
        return "";
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  
  const handleAddressChange = (event, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      address: value
    }));
  };

  const handleSexChange = (event, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      sex: value
    }));
  };

  const handleSave = () => {
    // Kiểm tra các thuộc tính bị bỏ trống
    if (!user.fullName || !user.idCard || !user.birthDate || !user.address || !user.sex || !user.nation) {
      setOpenSnackbar(true);
      return;
    }

    // Kiểm tra dữ liệu căn cước công dân
    const isIdCardValid = validateIdCard();
    if (!isIdCardValid) {
      setOpenSnackbar(true);
      return;
    }

    axios
      .patch(`http://localhost:3001/user/${id}`, user)
      .then((response) => {
        console.log("User updated successfully:", response.data);
        navigate("/user");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ maxWidth: 400 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}> 
        <Button variant="contained" color="primary" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>Quay lại</Button> 
          <Typography variant="h4" gutterBottom>
            Sửa
          </Typography>
        </Box>
        <TextField
          name="fullName"
          label="Tên chủ hộ"
          value={user.fullName}
          onChange={handleFieldChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="idCard"
          label="Căn cước công dân"
          value={user.idCard}
          onChange={handleFieldChange}
          fullWidth
          margin="normal"
          error={idCardError} // Thêm thuộc tính error để hiển thị lỗi
          helperText={idCardError && "Căn cước công dân không hợp lệ"} // Hiển thị thông báo lỗi
        />
        <TextField
          name="birthDate"
          label="Ngày sinh"
          type="date" // Thêm dòng này
          value={user.birthDate}
          onChange={handleFieldChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true, // Đảm bảo rằng nhãn không chồng lên lên trên giá trị ngày
          }}
        />
        <Autocomplete
          name="address"
          options={["An Giang", "Bà Rịa – Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái" ]} // Thay thế bằng danh sách địa chỉ thực tế của bạn
          value={user.address}
          onChange={handleAddressChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Địa chỉ"
              fullWidth
              margin="normal"
            />
          )}
        />
        <Autocomplete
          name="sex"
          options={["Nam", "Nữ"]}
          value={user.sex}
          onChange={handleSexChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Giới tính"
              fullWidth
              margin="normal"
            />
          )}
        />
        <TextField
          name="nation"
          label="Dân tộc"
          value={user.nation}
          onChange={handleFieldChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleSave}>
          Lưu
        </Button>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error">
            Vui lòng điền đầy đủ thông tin
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default EditUsers;
