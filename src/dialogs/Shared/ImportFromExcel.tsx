import { useForm } from "@/custom-hooks/useForm";
import React, { CSSProperties, useState } from "react";
import BaseDialog from "../BaseDialog";

import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";
import {
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";

const styles = {
  zone: {
    alignItems: "center",
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    padding: 20,
  } as CSSProperties,
  file: {
    background: "linear-gradient(to bottom, #EEE, #DDD)",
    borderRadius: 20,
    display: "flex",
    height: 120,
    width: 120,
    position: "relative",
    zIndex: 10,
    flexDirection: "column",
    justifyContent: "center",
  } as CSSProperties,
  info: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: "0.5em",
    justifyContent: "center",
    display: "flex",
  } as CSSProperties,
  name: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: "0.5em",
  } as CSSProperties,
  progressBar: {
    bottom: 14,
    position: "absolute",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  zoneHover: {
    borderColor: GREY_DIM,
  } as CSSProperties,
  default: {
    borderColor: GREY,
  } as CSSProperties,
  remove: {
    height: 23,
    position: "absolute",
    right: 6,
    top: 6,
    width: 23,
  } as CSSProperties,
};

const AllowedDelimiters = [
  { text: "Comma", name: "comma", value: "," },
  { text: "Semi-Colon", name: "semicolon", value: ";" },
  { text: "Pipe", name: "pipe", value: "|" },
  { text: "Tab", name: "tab", value: "    " },
];

function ImportFromExcel<T>({
  submitUrl,
  initialValues,
  successCallback,
}: {
  submitUrl: string;
  initialValues: T;
  successCallback: () => void;
}) {
  const [fileMeta, setFileMeta] = useState({
    file_type: "csv",
    delimiter: ",",
  });
  const { submitForm, setValueExplicitly } = useForm(initialValues, submitUrl);
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  const handleFileMeta = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileMeta({
      ...fileMeta,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <BaseDialog
      submitForm={submitForm}
      name={`Import from Excel`}
      successCallback={successCallback}
    >
      <Grid
        item
        sx={{
          margin: "1rem",
          fontSize: "0.9rem",
        }}
      >
        <FormLabel id="demo-radio-buttons-group-label">File Type:</FormLabel>
        <RadioGroup
          aria-labelledby="import-choice-radio-buttons-group-label"
          defaultValue="csv"
          name="file_type"
          value={fileMeta["file_type"]}
          onChange={handleFileMeta}
          sx={{
            flexDirection: "row",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <FormControlLabel
            value="csv"
            control={<Radio />}
            label="Import from CSV"
            sx={{
              "span.Mui-checked": {
                color: "var(--primary-color)",
              },
            }}
          />
          <FormControlLabel
            value="excel"
            control={<Radio />}
            label="Import from Excel"
            sx={{
              "span.Mui-checked": {
                color: "var(--primary-color)",
              },
            }}
          />
        </RadioGroup>
        {fileMeta["file_type"] === "csv" ? (
          <>
            <FormLabel id="demo-radio-buttons-group-label">
              Delimiter:
            </FormLabel>
            <RadioGroup
              aria-labelledby="delimiter-radio-buttons-group-label"
              defaultValue=","
              name="delimiter"
              onChange={handleFileMeta}
              value={fileMeta["delimiter"]}
              sx={{
                flexDirection: "row",
                width: "100%",
                marginBottom: "1rem",
              }}
            >
              {AllowedDelimiters.map((delimiter) => {
                return (
                  <FormControlLabel
                    key={delimiter.value}
                    value={delimiter.value}
                    control={<Radio />}
                    label={delimiter.text}
                    sx={{
                      "span.Mui-checked": {
                        color: "var(--primary-color)",
                      },
                    }}
                  />
                );
              })}
            </RadioGroup>
          </>
        ) : (
          <></>
        )}
        <div>
          <CSVReader
            delimiter={fileMeta["delimiter"]}
            config={{
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true,
            }}
            onUploadAccepted={(results: any) => {
              setValueExplicitly("data", results?.data);
              setZoneHover(false);
            }}
            onDragOver={(event: DragEvent) => {
              event.preventDefault();
              setZoneHover(true);
            }}
            onDragLeave={(event: DragEvent) => {
              event.preventDefault();
              setZoneHover(false);
            }}
          >
            {({
              getRootProps,
              acceptedFile,
              ProgressBar,
              getRemoveFileProps,
              Remove,
            }: any) => (
              <>
                <div
                  {...getRootProps()}
                  style={Object.assign(
                    {},
                    styles.zone,
                    zoneHover && styles.zoneHover
                  )}
                >
                  {acceptedFile ? (
                    <>
                      <div style={styles.file}>
                        <div style={styles.info}>
                          <span style={styles.size}>
                            {formatFileSize(acceptedFile.size)}
                          </span>
                          <span style={styles.name}>{acceptedFile.name}</span>
                        </div>
                        <div style={styles.progressBar}>
                          <ProgressBar />
                        </div>
                        <div
                          {...getRemoveFileProps()}
                          style={styles.remove}
                          onMouseOver={(event: Event) => {
                            event.preventDefault();
                            setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                          }}
                          onMouseOut={(event: Event) => {
                            event.preventDefault();
                            setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                          }}
                        >
                          <Remove color={removeHoverColor} />
                        </div>
                      </div>
                    </>
                  ) : (
                    "Drop CSV file here or click to upload"
                  )}
                </div>
              </>
            )}
          </CSVReader>
        </div>
      </Grid>
    </BaseDialog>
  );
}

export default ImportFromExcel;
