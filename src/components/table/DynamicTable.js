import React, { useState, useEffect } from 'react';
import './DynamicTable.css';

import { FiPlus, FiUpload, FiX } from 'react-icons/fi';
import DynamicTableServices from '../../services/DynamicTableServices';
import { notifySuccess, notifyError } from '../../utils/toast';


const DynamicTable = () => {
  const [name, setName] = useState("");
  const [rowCount, setRowCount] = useState(3);
  const [colCount, setColCount] = useState(3);
  const [tableHeight, setTableHeight] = useState(50);
  const [tableWidth, setTableWidth] = useState(600);
  const [tableData, setTableData] = useState([]);

  const initialWidth = tableWidth / colCount;
  const [tableWidths, setTableWidths] = useState([]);
  const [tableHeights, setTableHeights] = useState([]);
  // const [tableWidths, setTableWidths] = useState(Array.from({ length: colCount }, () => initialWidth));
  // const [tableHeights, setTableHeights] = useState(Array.from({ length: rowCount }, () => 45));
  const [cellImages, setCellImages] = useState(Array.from({ length: rowCount }, () =>
    Array.from({ length: colCount }, () => '')
  ));
  useEffect(() => {
    setCellImages(prevCellImages => {
      const updatedCellImages = [...prevCellImages];

      // Add or remove rows based on the new rowCount
      while (updatedCellImages.length < rowCount) {
        updatedCellImages.push(Array.from({ length: colCount }, () => ''));
      }
      while (updatedCellImages.length > rowCount) {
        updatedCellImages.pop();
      }

      return updatedCellImages;
    });
  }, [rowCount, colCount]);


  const handleOnLoad = async () => {
    const tableRes = await DynamicTableServices.getAllTableData();
    const tableData = tableRes.data;
    setTableData(tableData);

    // Set the initial state values based on the selected date
    if (tableData.length > 0) {
      const selectedDate = tableData[0]; // Change this to the appropriate index or selection logic
      setName(selectedDate.name);
      setRowCount(selectedDate.rowCount);
      setColCount(selectedDate.colCount);
      setTableHeight(selectedDate.tableHeight);
      setTableWidth(selectedDate.tableWidth);
      setTableWidths(selectedDate.tableWidths);
      setTableHeights(selectedDate.tableHeights); // Update the tableHeights state
      setCellImages(selectedDate.cellImages);
    }
  };

  const handleSetAllData = (selectedDate) => {
    console.log('selectedDate', selectedDate);
    console.log('tableData', tableData);

    const selectedData = tableData.filter((item) => item.name == selectedDate);
    console.log('selecteddata', selectedData);

    selectedData.map((row) => {
      setName(row.name);
      setRowCount(row.rowCount);
      setColCount(row.colCount);
      setTableHeight(row.tableHeight);
      setTableWidth(row.tableWidth);
      for (let i = 0; i < row.tableWidths.length; i++) {

        setTableWidths(row.tableWidths[i]);
      }
      for (let i = 0; i < row.tableHeights.length; i++) {

        setTableHeights(row.tableHeights[i]);
      }
      setCellImages(row.cellImages);
    });
  };

  const handleWidthChange = (index, value) => {
    const newWidths = [...tableWidths];
    newWidths[index] = parseInt(value);
    setTableWidths(newWidths);

    const sumWidth = newWidths.reduce((acc, curr) => acc + curr, 0);
    setTableWidth(sumWidth);
  };

  const handleHeightChange = (index, value) => {
    const newHeights = [...tableHeights];
    newHeights[index] = parseInt(value);
    setTableHeights(newHeights);

    const sumHeight = newHeights.reduce((acc, curr) => acc + curr, 0);
    setTableHeight(sumHeight);
  };

  const handleUploadImage = (colIndex, rowIndex, event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCellImages = [...cellImages];
        newCellImages[rowIndex][colIndex] = reader.result;
        setCellImages(newCellImages);
      };
      reader.readAsDataURL(file);
    }
  };
  // const handleUpdateChanges = async () => {
  //   const selectedData = tableData.filter((item) => item.name == name);
  //   console.log('selecteddata', selectedData);
  //   console.log('Table Name:', name);
  //   console.log('Table Heights:', tableHeights);
  //   console.log('Table Widths:', tableWidths);
  //   console.log('Cell Images:', cellImages);
  //   console.log('rowCount Images:', rowCount);
  //   console.log('colCount Images:', colCount);
  //   console.log('tableHeight Images:', tableHeight);
  //   console.log('tableWidth Images:', tableWidth);
  //   const res = await DynamicTableServices.updateTableData({
  //     data: {
  //       name,
  //       tableHeights,
  //       tableWidths,
  //       cellImages,
  //       rowCount,
  //       colCount,
  //       tableHeight,
  //       tableWidth
  //     }
  //   }).then((res)=>console.log('resbaşarı',res)
  //   .catch((err)=>console.log('err',err)));
  //   if (res.success)
  //     notifySuccess(res.message)
  //   else
  //     notifyError(res.message)
  //   handleOnLoad();
  // };
  const handleSaveChanges = async () => {
    // Performing the save operation here
    console.log('Saving changes...');
    console.log('Table Name:', name);
    console.log('Table Heights:', tableHeights);
    console.log('Table Widths:', tableWidths);
    console.log('Cell Images:', cellImages);
    console.log('rowCount Images:', rowCount);
    console.log('colCount Images:', colCount);
    console.log('tableHeight Images:', tableHeight);
    console.log('tableWidth Images:', tableWidth);
    const res = await DynamicTableServices.addTableData({
      data: {
        name,
        tableHeights,
        tableWidths,
        cellImages,
        rowCount,
        colCount,
        tableHeight,
        tableWidth
      }
    });
    notifySuccess(res.message)
    handleOnLoad();
  };
  const removeItem = async (id) => {
    console.log('ididid', id);

    const res = await DynamicTableServices.deleteTableData(id);
    console.log('resdsa', res);
    notifySuccess(res.message)
    if (res) {
      const updatedList = tableData.filter((item) => item.id !== id);
      setTableData(updatedList);
    }
    handleOnLoad();

  };


  return (
    <div >
      <div
        className='top-container'

      >
        <div className='left-top'>
          <h5>Enter Name Of the Table:</h5>
          <label>
            Name:{"\t"}
            <input
              type="text"
              className="header-input"
              value={name}
              required={true}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <hr class="solid"></hr>
          <h5>Enter The Table Width And Height:</h5>
          <label>
            Height:
            <input
              type="number"
              className="header-input"
              value={tableHeight}
              onChange={(e) => setTableHeight(parseInt(e.target.value))}
            />{" "}
            px
          </label>
          <label> | </label>

          <label>
            Width:
            <input
              type="number"
              className="header-input"
              value={tableWidth}
              onChange={(e) => setTableWidth(parseInt(e.target.value))}
            />{" "}
            px
          </label>
          <hr class="solid"></hr>
          <h5>Enter The Row And Columns:</h5>
          <label>
            Rows:
            <input
              type="number"
              className="header-input"

              value={rowCount}
              onChange={(e) => setRowCount(parseInt(e.target.value))}
            />
          </label>
          <label>
            Columns:
            <input
              type="number"
              className="header-input"
              value={colCount}
              onChange={(e) => setColCount(parseInt(e.target.value))}
            />
          </label>
        </div>


        <div className='right-top'>
          <div>
            <button
              className="upload-icon"
              onClick={() => {
                handleOnLoad()
              }}
            >
              <span className="mr-3">Load Data{"   \t"}
                <FiUpload />
              </span>
            </button>
            <select
              className='select'
              value={name}
              onChange={(e) => handleSetAllData(e.target.value)}
            >
              {tableData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className='list'>
            {tableData.map((item) => (
              <div className='item' key={item._id}>
                <span className='item-name'>{item.name}</span>
                <button
                  className='delete-button'
                  onClick={() => removeItem(item._id)}
                >
                  <span className="mr-3">
                    <FiX />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>




      </div>

      <div style={{
        marginLeft: "25px",
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '10px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        width: `${tableWidth + 150}px`,
      }}>
        <button className='save-button'
          onClick={handleSaveChanges}>
          Save
        </button>
        {/* <button className='update-button'
          onClick={handleUpdateChanges}>
          Update
        </button> */}

        <table
          style={{
            width: `${tableWidth}px`,
            height: `${tableHeight}px`,
            borderStyle: 'none',
            borderColor: 'black',
          }}
          className="card-table"

        >
          <thead>
            <tr>
              <th style={{ borderStyle: 'none' }}></th>
              {Array.from({ length: colCount }, (_, colIndex) => (
                <th key={colIndex} style={{ borderStyle: 'none', borderColor: 'black' }}>
                  <label>
                    y{colIndex + 1}
                    <input
                      type="number"
                      className="header-input"
                      value={tableWidths[colIndex]}
                      onChange={(e) => handleWidthChange(colIndex, e.target.value)}
                    />
                  </label>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, rowIndex) => (
              <tr style={{ alignItems: 'center' }} key={rowIndex}>
                <th
                  style={{ width: `${tableWidths[rowIndex]}px`, borderStyle: 'none', borderColor: 'black' }}
                >
                  <label>
                    x{rowIndex + 1}
                    <input
                      type="number"
                      className="header-input"
                      value={tableHeights[rowIndex]}
                      onChange={(e) => handleHeightChange(rowIndex, e.target.value)}
                    />
                  </label>
                </th>
                {Array.from({ length: colCount }, (_, colIndex) => (
                  <td
                    style={{
                      width: `${tableWidths[colIndex]}px`,
                      height: `${tableHeights[rowIndex]}px`,
                      borderStyle: 'none',
                      borderColor: 'black',
                      position: 'relative',
                      padding: '8px'
                    }}
                    key={colIndex}
                  >
                    <div
                      style={{

                        border: '1px solid black',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3s)',
                        width: `${tableWidths[colIndex]}px`,
                        height: `${tableHeights[rowIndex]}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {Array.isArray(cellImages[rowIndex]) && cellImages[rowIndex].length > 0 && (
                        <img
                          src={cellImages[rowIndex][colIndex]}
                          alt={`${rowIndex + 1}-${colIndex + 1}`}
                          style={{ width: '100%', height: '100%' }}
                        />
                      )}


                      <input
                        type="file"
                        id={`upload-button-${rowIndex}-${colIndex}`}
                        style={{ display: 'none' }}
                        onChange={(e) => handleUploadImage(colIndex, rowIndex, e)}
                      />

                      <div
                        className="w-full md:w-56 lg:w-56 xl:w-56"
                        style={{
                          position: 'absolute',
                          top: '0',
                          right: '0',
                        }}
                      >
                        <button
                          className="add-button"
                          onClick={() => {
                            const fileInput = document.getElementById(`upload-button-${rowIndex}-${colIndex}`);
                            fileInput.click();
                          }}
                        >

                          <span className="mr-3">
                            <FiPlus />
                          </span>
                        </button>

                        {cellImages[rowIndex][colIndex] && (
                          <button
                            className="delete-icon"
                            onClick={() => {
                              const newCellImages = [...cellImages];
                              newCellImages[rowIndex][colIndex] = '';
                              setCellImages(newCellImages);
                            }}
                          >
                            <span className="mr-3">
                              <FiX />
                            </span>
                          </button>
                        )}
                      </div>
                    </div>


                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default DynamicTable;
