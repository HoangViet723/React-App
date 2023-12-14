import React from "react";
import { Box } from "@mui/material";
import Users from "./scenes/user";
import Members from "./scenes/member";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Contacts from "./scenes/contacts";
import Sidebar from "./scenes/global/Sidebar";
import Invoices from "./scenes/invoices";
import Form from "./scenes/form";
import Calendar from "./scenes/calendar";
import FAQ from "./scenes/faq";
import Bar from "./scenes/bar";
import Pie from "./scenes/Pie";
import Line from "./scenes/line";
import Geography from "./scenes/geography";
import Main from "./scenes/main";
import EditUsers from "./scenes/edituser";
import AddUsers from "./scenes/adduser";
import AddMembers from "./scenes/addmember";
import EditMembers from "./scenes/editmember";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Topbar setIsSidebar={setIsSidebar} />
          <main className="content" style={{ display: "flex" }}>
            {isSidebar && <Sidebar isSidebar={isSidebar} />}
            <Box flexGrow={1}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/user" element={<Users />} />
                <Route path="/member" element={<Members />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/edituser/:id" element={<EditUsers />} />
                <Route path="/adduser" element={<AddUsers />} />
                <Route path="/addmember" element={<AddMembers />} />
                <Route path="/editmember/:id" element={<EditMembers />} />
              </Routes>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
