export const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    width: "24rem",
    height: "3rem",
    borderRadius: "8px",
    borderColor: state.isFocused ? " #f4f4f8" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 1px  #f4f4f8" : "none",
    "&:hover": {
      borderColor: "#ccc",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? " #f4f4f8" : "transparent",
    color: state.isSelected ? "#000" : "#000",
    "&:hover": {
      backgroundColor: " #f4f4f8",
      color: "#000",
      cursorPointer: "pointer",
    },
    width: "94%",
    margin: "auto",
    marginTop: "4px",
    borderRadius: "10px",
    cursor: "pointer",
  }),
  menu: (provided: any) => ({
    ...provided,
    overflowY: "auto",
    borderRadius: "16px",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
  }),
};
export const selectStylesSearch = {
  control: (provided: any, state: any) => ({
    ...provided,
    width: "17rem",
    height: "3rem",
    borderRadius: "8px",
    borderColor: state.isFocused ? " #f4f4f8" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 1px  #f4f4f8" : "none",
    "&:hover": {
      borderColor: "#ccc",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? " #f4f4f8" : "transparent",
    color: state.isSelected ? "#000" : "#000",
    "&:hover": {
      backgroundColor: " #f4f4f8",
      color: "#000",
      cursorPointer: "pointer",
    },
    width: "94%",
    margin: "auto",
    marginTop: "4px",
    borderRadius: "10px",
    cursor: "pointer",
  }),
  menu: (provided: any) => ({
    ...provided,
    overflowY: "auto",
    borderRadius: "16px",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
  }),
};

export const selectStylesMulti = {
  menu: (provided: any) => ({
    ...provided,
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
    borderRadius: "16px",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    width: "24rem",
    minHeight: "3rem",
    borderRadius: "8px",
    borderColor: state.isFocused ? "#f4f4f8" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 1px #f4f4f8" : "none",
    "&:hover": {
      borderColor: "#ccc",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#f4f4f8" : "transparent",
    color: state.isSelected ? "#000" : "#000",
    "&:hover": {
      backgroundColor: "#f4f4f8",
      color: "#000",
      cursor: "pointer", // Updated from "cursorPointer"
    },
    width: "94%",
    margin: "auto",
    marginTop: "4px",
    borderRadius: "10px",
    cursor: "pointer", // Updated from "cursorPointer"
  }),

  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#f4f4f8",
    borderRadius: "9999px",
    padding: "4px 12px",
    marginRight: "8px",
    marginBottom: "8px",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#000",
    fontWeight: 500,
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#ccc",
    cursor: "pointer",
    "&:hover": {
      color: "#000",
      backgroundColor: "#f1f1f1",
      borderRadius: "9999px",
    },
  }),
};
