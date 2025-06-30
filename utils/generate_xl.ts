import * as xlsx from "xlsx";

interface ExcelTemplate<T> {
  headers: string[];
  data: T[];
  sheetName?: string;
  fileName: string;
}

export function generateExcelFile<T>({
  headers,
  data,
  sheetName = "Sheet1",
  fileName,
}: ExcelTemplate<T>) {
  // Function to map header to corresponding key in data
  const mapHeaderToKey = (header: string) =>
    header.toLowerCase().replace(/ /g, "_"); // Convert "Registration Number" to "registration_number"

  // Prepare header-to-key mapping
  const headerKeyMap = headers.reduce((acc, header) => {
    acc[header] = mapHeaderToKey(header);
    return acc;
  }, {} as Record<string, string>);

  // Preprocess data to match headers
  const filteredData = data.map((item) => {
    const filteredRow: any = {};
    headers.forEach((header) => {
      const key = headerKeyMap[header]; // e.g., 'registration_number'
      // @ts-ignore
      filteredRow[header] = item[key] || ""; // Populate with value or empty string
    });
    return filteredRow;
  });

  // Prepare worksheet with filtered data
  const worksheet = xlsx.utils.json_to_sheet(filteredData);

  // Insert headers at the top
  xlsx.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

  // Create a workbook and add the worksheet
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Convert workbook to a blob
  const excelBuffer = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}