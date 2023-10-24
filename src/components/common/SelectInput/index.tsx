import { Options } from "@/types";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Chip
} from "@mui/material";
import { Close } from '@mui/icons-material';
import React, { useState } from "react";

type Props = {
  value: string | number | string[] | undefined;
  name?: string;
  onChange: (event: SelectChangeEvent<any> | {}) => void;
  options: Options[];
  label: string;
  className?: string;
  error?: boolean;
  helperText?: string | string[];
  style?: React.CSSProperties;
  multiple?: boolean;
  required?: boolean;
};

function SelectInput(props: Props) {
  const {
    className,
    label,
    options,
    value,
    name,
    onChange,
    error,
    helperText,
    style,
    multiple = false,
    required = true
  } = props;
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (event) => {
    if (event.target instanceof SVGElement || event.target instanceof SVGClipPathElement) return;
    setOpen(true);
  };

  const handleDelete = (valueToDelete: string) => {
    if (Array.isArray(value)) {
      const newValue = value.filter((item) => item !== valueToDelete);
      onChange({
        target: {
          name: name,
          value: newValue
        }
      });
    }
  };

  const handleChange = (event: SelectChangeEvent<string | number | any[]>) => {
    onChange(event);
  };

  return (
    <>
      <FormControl style={style} required={required} className={className}>
        <InputLabel id={`controlled-open-select-${label}`}>{label}</InputLabel>
        <Select
          multiple={multiple}
          labelId={`controlled-open-select-${label}`}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={value || (multiple ? [] : "")}
          name={name}
          label={label}
          onChange={handleChange}
          MenuProps={{ PaperProps: { sx: { maxHeight: 400 } } }}
          renderValue={multiple ? (selected) => (
            <div style={{display: 'flex', width: '100%', flexWrap: 'wrap'}}>
              {(selected as string[]).map((value) => (
                <Chip 
                  key={value}
                  style={{margin: '2px'}}
                  label={options.find(option => option.value === value)?.label}
                  onDelete={() => handleDelete(value)}
                  deleteIcon={<Close />}
                />
              ))}
            </div>
          ) : undefined}
          error={error}
        >
          {options.map((option, idx) => (
            <MenuItem
              key={idx}
              value={option.value}
              disabled={option.valid === false}
              className={`${option.valid === true && "Mui-valid"} ${
                option.valid === false && "Mui-invalid"
              }`}
              sx={{
                "&.MuiMenuItem-root.Mui-disabled.Mui-invalid": {
                  color: "red",
                  opacity: 1,
                },
                "&.MuiMenuItem-root.Mui-valid": {
                  color: "green",
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={error}>{helperText}</FormHelperText>
      </FormControl>
    </>
  );
}

export default SelectInput;
