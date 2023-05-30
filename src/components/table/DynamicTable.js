import React, { useState, useEffect } from 'react';
import './DynamicTable.css';
import { FiPlus, FiUpload, FiX } from 'react-icons/fi';
import DynamicTableServices from '../../services/DynamicTableServices';
import { notifySuccess, notifyError } from '../../utils/toast';


const DynamicTable = () => {

  const [colWidths, setColumnWidths] = useState([0]);
  const [rowHeights, setRowHeights] = useState([0]);
  const [name, setName] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [colCount, setColCount] = useState(0);
  const [tableHeight, setTableHeight] = useState();
  const [tableWidth, setTableWidth] = useState();
  const [tableData, setTableData] = useState([]);

  const [tableWidths, setTableWidths] = useState(Array.from({ length: colCount }, () => 0));
  const [tableHeights, setTableHeights] = useState(Array.from({ length: rowCount }, () => 0));
  const [cellImages, setCellImages] = useState(Array.from({ length: rowCount }, () =>
    Array.from({ length: colCount }, () => '')
  ));

  const handleNumRowsChange = (event) => {
    const newNumRows = parseInt(event.target.value);
    setRowCount(newNumRows);

    const newRowHeights = Array.from({ length: newNumRows }, (_, index) =>
      index < rowHeights.length ? rowHeights[index] : 0
    );
    setRowHeights(newRowHeights);
  };

  const handleNumColumnsChange = (event) => {
    const newNumColumns = parseInt(event.target.value);
    setColCount(newNumColumns);

    const newColumnWidths = Array.from({ length: newNumColumns }, (_, index) =>
      index < colWidths.length ? colWidths[index] : 0
    );
    setColumnWidths(newColumnWidths);
  };

  const handleRowHeightChange = (index, value) => {
    const updatedHeights = [...rowHeights];
    updatedHeights[index] = parseInt(value);
    setRowHeights(updatedHeights);

    const previousSum = updatedHeights.slice(0, index).reduce((a, b) => a + b, 0);

    setTableHeights(updatedHeights.concat([tableWidth - previousSum - parseInt(value)]))
  };

  const handleColumnWidthChange = (index, value) => {
    const updatedColumnWidths = [...colWidths];
    updatedColumnWidths[index] = parseInt(value);

    setColumnWidths(updatedColumnWidths);

    const previousSum = updatedColumnWidths.slice(0, index).reduce((a, b) => a + b, 0);

    setTableWidths(updatedColumnWidths.concat([tableHeight - previousSum - parseInt(value)]))
  };

  const handleWidthRect = (e) => {
    setTableWidth(e)
  }

  const handleHeightRect = (e) => {
    setTableHeight(e)
  }

  useEffect(() => {
    setCellImages(prevCellImages => {
      const updatedCellImages = [...prevCellImages];
      if (rowCount > prevCellImages.length) {
        for (let i = prevCellImages.length; i <= rowCount; i++) {
          updatedCellImages.push(Array.from({ length: colCount }, () => ''));
        }
      }
      return updatedCellImages;
    });
  }, [rowCount, colCount]);

  const handleOnLoad = async () => {
    const tableRes = await DynamicTableServices.getAllTableData();
    const tableData = tableRes.data;
    console.log('tableTasüdsad', tableData);

    setTableData(tableData);

    // Set the initial state values based on the selected date
    if (tableData.length > 0) {
      const selectedDate = tableData[0];
      console.log('selectedDate', selectedDate);
      // Change this to the appropriate index or selection logic
      setName(selectedDate.name);
      setRowCount(selectedDate.rowCount);
      setColCount(selectedDate.colCount);

      setTableHeight(selectedDate.tableHeight);
      setTableWidth(selectedDate.tableWidth);
      setRowHeights(selectedDate.tableWidths);
      setColumnWidths(selectedDate.tableHeights); // Update the tableHeights state
      console.log('selectedDate.tableHeights', selectedDate.tableHeights);

      setCellImages(selectedDate.cellImages);
    }
  };

  const handleSetAllData = (selectedDate) => {
    console.log('selectedDate2', selectedDate);
    console.log('tableData',);

    const selectedData = tableData.filter((item) => {
      console.log('iteasdsad', item);

      return item.name == selectedDate
    });
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

  const handleUploadImage = (colIndex, rowIndex, event) => {
    console.log('buradayıdoa', colIndex, rowIndex, event);

    const files = event.target.files;
    console.log('files', files);

    if (files?.length > 0) {
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
  const handleUpdateChanges = async () => {
    const selectedData = tableData.filter((item) => item.name == name);
    const res = await DynamicTableServices.updateTableData(selectedData[0]._id, {
      data: {
        name,
        colWidths,
        rowHeights,
        cellImages,
        rowCount,
        colCount,
        tableHeight,
        tableWidth
      }
    })
    if (res.success)
      notifySuccess(res.message)
    else
      notifyError(res.message)
    handleOnLoad();
  };
  const handleSaveChanges = async () => {
    // Performing the save operation here
    const res = await DynamicTableServices.addTableData({
      data: {
        name,
        tableHeights,
        tableWidths,
        cellImages,
        rowCount,
        colCount,
        tableHeight,
        tableWidth,
      }
    });
    notifySuccess(res.message)
    handleOnLoad();
  };
  const removeItem = async (id) => {
    const res = await DynamicTableServices.deleteTableData(id);
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
        className='top-container'>
        <div className='left-top'>
          <h5>Dikdörtgenin İsmini Giriniz:</h5>
          <label>
            İsim{"\t"}
            <input
              type="text"
              className="header-input"
              value={name}
              required={true}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <hr class="solid"></hr>
          <h5>Dikdörtgenin Yükseklik Ve Genişliğini Giriniz:</h5>

          <div>
            <label htmlFor="width_rect"> Genişlik:</label>
            <input
              id="width_rect"
              type="number"
              value={tableWidth}
              onChange={(e) => handleWidthRect(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="high_rect"> Yükseklik:</label>
            <input
              id="high_rect"
              type="number"
              value={tableHeight}
              onChange={(e) => handleHeightRect(e.target.value)}
            />
          </div>
          <hr class="solid"></hr>

          <div className='column_row_info'>

            <div className='row_info'>
              <div>
                <label htmlFor="rowCount">Yatay Çizgi Sayısı:</label>
                <input
                  id="rowCount"
                  type="number"
                  value={rowCount}
                  onChange={handleNumRowsChange}
                />
              </div>
              <br />

              {rowHeights?.map((height, index) => (
                <div key={index}>
                  <label htmlFor={`rowHeight-${index}`}>x-{index + 1}:</label>
                  <input
                    id={`rowHeight-${index}`}
                    type="number"
                    value={height}
                    onChange={(e) => handleRowHeightChange(index, e.target.value)}
                  />
                </div>
              ))}
              <br />
            </div>

            <div className='column_info'>
              <div>
                <label htmlFor="colCount">Dikey Çizgi Sayısı:</label>
                <input
                  id="colCount"
                  type="number"
                  value={colCount}
                  onChange={handleNumColumnsChange}
                />
              </div>
              <br />

              {colWidths?.map((width, index) => (
                <div key={index}>
                  <label htmlFor={`rowHeight-${index}`}>y-{index + 1}:</label>
                  <input
                    id={`rowHeight-${index}`}
                    type="number"
                    value={width}
                    onChange={(e) => handleColumnWidthChange(index, e.target.value)}
                  />
                </div>

              ))}

            </div>
          </div>
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
        width: `${tableWidth}px`,
      }}>
        <button className='save-button'
          onClick={handleSaveChanges}>
          Save
        </button>
        <button className='update-button'
          onClick={handleUpdateChanges}>
          Update
        </button>
        <div style={{
          paddingLeft: '10px',
          paddingTop: '40px',
        }}>

          {tableWidth && tableHeight &&
            <div>
              <div
                style={{
                  width: `${tableWidth}px`,
                  height: `${tableHeight}px`,
                  border: '1px solid black',
                  position: 'relative',

                }}
              >
                {tableHeights?.map((height, index) => (
                  <div
                    key={index}
                    style={{
                      width: '100%',
                      height: `${height}px`,
                      borderTop: '1px solid black',
                      position: 'relative',
                      bottom: '0',
                      cursor: 'pointer',
                    }}
                  />
                ))}

                {tableWidths?.map((width, index) => (
                  <div
                    key={index + "-" + index}
                    style={{
                      width: `${width}px`,
                      height: '100%',
                      borderLeft: '1px solid black',
                      position: 'absolute',
                      top: '0',
                      left: `${colWidths.slice(0, index).reduce((a, b) => a + b, 0)}px`,
                      cursor: 'pointer',
                    }}
                  />
                ))}

                {tableHeights.map((height, h_idx) => (
                  <div key={h_idx} style={{ lineHeight: '0' }}>
                    {tableWidths.map((width, w_idx) => (
                      <div
                        key={w_idx}
                        style={{
                          width: `${width}px`,
                          height: `${height}px`,
                          display: 'inline-block',
                          textAlign: 'center',
                          position: 'absolute',
                          cursor: 'pointer',
                          top: `${tableHeights.slice(0, h_idx).reduce((a, b) => a + b, 0)}px`,
                          left: `${tableWidths.slice(0, w_idx).reduce((a, b) => a + b, 0)}px`,
                          overflow: 'hidden', // Add this line to hide any overflow
                        }}
                      >
                        <div
                          style={{
                            position: 'relative', // Add this line to make it a positioned container
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <img
                            src={cellImages[h_idx] && cellImages[h_idx][w_idx]}
                            alt={`${w_idx + 1}-${h_idx + 1}`}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'cover',
                            }}
                          />

                          <div
                            style={{
                              position: 'absolute',
                              top: '0',
                              right: '0',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                              justifyContent: 'flex-start',
                              padding: '5px',
                            }}
                          >
                            {cellImages[h_idx] && cellImages[h_idx][w_idx] && (
                              <button
                                className="delete-icon"
                                onClick={() => {
                                  const newCellImages = [...cellImages];
                                  newCellImages[h_idx][w_idx] = '';
                                  setCellImages(newCellImages);
                                }}
                              >
                                <span>
                                  <FiX />
                                </span>
                              </button>
                            )}

                            <button
                              className="add-button"
                              onClick={() => {
                                const fileInput = document.getElementById(`upload-button-${w_idx}-${h_idx}`);
                                fileInput.click();
                              }}
                            >
                              <span>
                                <FiPlus />
                              </span>
                            </button>
                          </div>
                        </div>

                        <input
                          type="file"
                          id={`upload-button-${w_idx}-${h_idx}`}
                          style={{
                            display: 'none',
                          }}
                          onChange={(e) => handleUploadImage(w_idx, h_idx, e)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
