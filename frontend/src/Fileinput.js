import React from 'react';
import { FaArrowLeft } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
const Fileinput = ({ dataFetched, fetchedDocument, currentPage, handlePageChange, totalPages, errorMessage }) => {
  return (
    <div className="fetched-data">

      
      <div >
      <Link to="/" className='linkk'>
         <button className='backhome'><FaArrowLeft /> Home</button>  </Link> </div>
      <h2>Fetched Data</h2>
      {dataFetched ? (
        <div>
        
          {Array.isArray(fetchedDocument) ? (
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Driver ID</th>
                    <th>Document ID</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchedDocument.map((item, index) => (
                    <tr key={item._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                      <td>{item._id}</td>
                      <td>{item.driverId}</td>
                      <td>{item.docId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

          
            </div>
          ) : (
            <div>
           
              <p className='documentid'>Document ID: {fetchedDocument.docId}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default Fileinput;

