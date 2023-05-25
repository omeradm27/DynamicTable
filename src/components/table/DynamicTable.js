import React, { useState } from 'react';

const DynamicTable = () => {
  const [rowCount, setRowCount] = useState(3);
  const [colCount, setColCount] = useState(3);
  const [tableHeight, setTableHeight] = useState(50);
  const [tableWidth, setTableWidth] = useState(720);

  const [tableWidths, setTableWidths] = useState(Array.from({ length: colCount }, () => 70));
  const [tableHeights, setTableHeights] = useState(Array.from({ length: rowCount }, () => 45));
  const [cellImages, setCellImages] = useState(Array.from({ length: rowCount }, () =>
    Array.from({ length: colCount }, () => '')
  ));


  const handleWidthChange = (index, value) => {
    const newWidths = [...tableWidths];
    console.log('newWidths', newWidths);

    newWidths[index] = parseInt(value);
    setTableWidths(newWidths);
  };

  const handleHeightChange = (index, value) => {
    const newHeights = [...tableHeights];
    newHeights[index] = parseInt(value);
    setTableHeights(newHeights);
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

  return (
    <div>
      <h5>Enter The Table Width And Height:</h5>
      <label>
        {"\t"}Height:
        <input
          type="number"
          style={{ width: "50px" }}
          value={tableHeight}
          onChange={(e) => setTableHeight(parseInt(e.target.value))}
        /> px
      </label>
      <label>
        {"\t"}Width:
        <input
          type="number"
          style={{ width: "50px" }}
          value={tableWidth}
          onChange={(e) => setTableWidth(parseInt(e.target.value))}
        /> px
      </label>
      <br />
      <h5>Enter The Row And Columns:</h5>

      <label>
        {"\t"}Rows:
        <input
          type="number"
          style={{ width: "50px" }}
          value={rowCount}
          onChange={(e) => setRowCount(parseInt(e.target.value))}
        />
      </label>
      <label>
        {"\t"}Columns:
        <input
          type="number"
          style={{ width: "50px" }}
          value={colCount}
          onChange={(e) => setColCount(parseInt(e.target.value))}
        />
      </label>
      <br />
      <br />

      <table style={{ width: `${tableWidth}px`, height: `${tableHeight}px`, borderStyle: 'dotted', borderColor: "black" }}>
        <thead>
          <tr>
            <th style={{ borderStyle: 'dotted', borderColor: "black" }}></th>
            {Array.from({ length: colCount }, (_, colIndex) => (
              <th key={colIndex} style={{ borderStyle: 'dotted', borderColor: "black" }}>
                <label>
                  {"\t"}y{colIndex + 1}
                  <input
                    type="number"
                    style={{ width: "50px" }}
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
              <th style={{ borderStyle: 'dotted', borderColor: "black" }}>
                <label>
                  {"\t"}x{rowIndex + 1}
                  <input
                    type="number"
                    style={{ width: "50px" }}
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
                    borderStyle: 'dotted',
                    borderColor: "black",
                  }}
                  key={colIndex}
                >
                  <img src={cellImages[rowIndex][colIndex]} alt={`${rowIndex + 1}-${colIndex + 1}`} style={{ width: '100%', height: '100%' }} />
                  <input
                    type="file"
                    id={`upload-button-${rowIndex}-${colIndex}`}
                    onClick={(e) => handleUploadImage(colIndex, rowIndex, e)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
