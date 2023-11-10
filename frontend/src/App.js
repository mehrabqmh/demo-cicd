import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MainSeacrh from "./MainSeacrh";
import Fileinput from "./Fileinput";
import { Route, Routes, useNavigate } from "react-router-dom";

function App() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [noDataMessage, setNoDataMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [details, setDetails] = useState([]);
  const [fetchedDocument, setFetchedDocument] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("document");
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsLoading(true); // Set loading to true when uploading starts
      try {
        const formData = new FormData();
        formData.append("zipFiles", selectedFile);

        const response = await axios.post(
          "http://localhost:4000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          const apiSuccessMessage = response.data.message;
          setSuccessMessage(apiSuccessMessage);
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        } else {
          const apiErrorMessage = response.data.message;
          setErrorMessage(apiErrorMessage);
        }
      } catch (error) {
        const apiErrorMessage = error.response.data.message;
        setErrorMessage(apiErrorMessage);
        console.error("Error retrieving data:", error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getDetails = async () => {
    try {
      const response = await axios.get("http://localhost:4000/ocr_documents");

      if (response.status === 200) {
        const responseData = response.data.data;
        const responseMessage = response.data.message;

        if (Array.isArray(responseData) && responseData.length > 0) {
          setDetails(responseData);
        } else {
          setNoDataMessage(responseMessage);
        }
      } else {
        const apiErrorMessage = response.data.message;
        setErrorMessage(apiErrorMessage);
      }
    } catch (error) {
      const apiErrorMessage =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(apiErrorMessage);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = details.slice(startIndex, endIndex);

  const totalPages = Math.ceil(details.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchValue("");
  };

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const fetchData = async () => {
    try {
      let response;
      if (searchType === "document") {
        response = await axios.get(
          `http://localhost:4000/document-one/${searchValue}`
        );
      } else if (searchType === "driver") {
        response = await axios.get(`http://localhost:4000/${searchValue}`);
      }

      if (response.status === 200) {
        const responseData = response.data.data;
        if (responseData && responseData.length > 0) {
          setFetchedDocument(responseData);
          setDataFetched(true);
          navigate("/fileinput");
        } else {
          setNoDataMessage("No data found");
        }
      }
    } catch (error) {
      navigate("/fileinput");
      const apiErrorMessage = error.response.data.message;
      setErrorMessage(apiErrorMessage, "jhgjfhg");
      console.error("Error retrieving data:", error.response.data.message);
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <MainSeacrh
              searchType={searchType}
              noDataMessage={noDataMessage}
              successMessage={successMessage}
              isLoading={isLoading}
              handleSearchTypeChange={handleSearchTypeChange}
              errorMessage={errorMessage}
              searchValue={searchValue}
              handleSearchValueChange={handleSearchValueChange}
              fetchData={fetchData}
              handleFileChange={handleFileChange}
              selectedFile={selectedFile}
              handleUpload={handleUpload}
              handlePageChange={handlePageChange}
              currentItems={currentItems}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          }
        />
        <Route
          path="/fileinput"
          element={
            isLoading ? (
              <div className="loader">Uploading...</div>
            ) : (
              <Fileinput
                dataFetched={dataFetched}
                errorMessage={errorMessage}
                fetchedDocument={fetchedDocument}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                totalPages={totalPages}
              />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
