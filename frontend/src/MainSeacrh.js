import React from 'react'

export default function MainSeacrh({searchType,noDataMessage ,isLoading,successMessage, errorMessage,handleSearchTypeChange ,searchValue ,handleSearchValueChange ,fetchData ,handleFileChange ,selectedFile ,handleUpload ,handlePageChange ,currentItems,currentPage ,totalPages}) {
  return (
    <div>
       <div className="search-options">
        <h2>Search Options</h2>
        
        <div className='Search-option'>
            <div>
          <label>
            <input
              type="radio"
              value="document"
              checked={searchType === 'document'}
              onChange={() => handleSearchTypeChange('document')}
            />
            Search by Document ID
          </label>
          <label>
            <input
              type="radio"
              value="driver"
              checked={searchType === 'driver'}
              onChange={() => handleSearchTypeChange('driver')}
            />
            Search by Driver ID
          </label>
          </div>
        </div>
      </div>
<div className='inputdiv'>
      <div className="search-input">
        <label htmlFor="searchValue">Enter ID to Fetch Data: </label>
        <input
          type="text"
          id="searchValue"
          value={searchValue}
          onChange={handleSearchValueChange}
        />
      </div>

      <div className="search-btn">
        <button className='search-button' onClick={fetchData}>Fetch Data</button>
      </div>
      </div>
     

    
  
      {isLoading ? (
  <div className="loader">Uploading...</div>
) : successMessage ? (
  <div className="success-message">{successMessage}</div>
) : errorMessage ? (
  <div className="error-message">{errorMessage}</div>
) : noDataMessage ? (
  <div className="no-data-message">{noDataMessage}</div>
) : (
  <div className="container">
  <h2>Select File</h2>
  <div className="input-container">
    <input
      type="file"
      id="file-input"
      className="file-input"
      onChange={handleFileChange}
    />
    <label htmlFor="file-input" className="labell">
      Click here to select a file
    </label>
  </div>
  {selectedFile && (
    <div className="selected-file">
      <h3>Selected File:</h3>
      <p>Name: {selectedFile.name}</p>
      <p>Type: {selectedFile.type}</p>
      <p>Size: {selectedFile.size} bytes</p>
    </div>
  )}
  <div >
     <button className="upload-button" onClick={handleUpload}>Upload File</button>
  </div>
</div>
)}


      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Driver ID</th>
              <th>Files</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td>{item._id}</td>
                <td>{item.driverId}</td>
                <td>{item.files}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            className="Button1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pag-bottom">Page {currentPage} of {totalPages}</span>
          <button
            className="Button1"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
