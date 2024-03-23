const { createContext, useState } = require("react");

const ClickedRowCountContext = createContext({
  rowCountArr: [],
  setRowCount: () => {},
});
export default ClickedRowCountContext;
