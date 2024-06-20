import "./App.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "/node_modules/primeflex/primeflex.css";
import { Button } from "primereact/button";
import BasicFilterDemo from "./Table";
import { useState } from "react";
import { useCSVReader } from "react-papaparse";
import { useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { TabView, TabPanel } from "primereact/tabview";
import { Dropdown } from "primereact/dropdown";
function App() {
  const { CSVReader } = useCSVReader();
  const stepperRef = useRef(null);

  const [transformedRows, setTransformedRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const [fullyMatchedtransformedRows, setFullyMatchedtransformedRows] =
    useState([]);
  const [fuzzyMatchedtransformedRows, setFuzzyMatchedtransformedRows] =
    useState([]);
  const [notMatchedtransformedRows, setNotMatchedtransformedRows] = useState(
    []
  );
  const [matchedColumns, setMatchedColumns] = useState([]);

  const API_URL =
    "https://la-er-ed-dev-team4.azurewebsites.net:443/api/DataMatch/triggers/When_a_HTTP_request_is_received/invoke?api-version=2022-05-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=z1Wnimc6hwJcn4ipnDJGTxsaltt_Z6K7DxrtKpXmAWQ";
  const catalogList = [
    { name: "Global", code: "G" },
    { name: "Netherlands", code: "NL" },
  ];
  const [selectedCatalog, setSelectedCatalog] = useState();

  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  const getPercentage = (x, y) => {
    console.log("x,y", x, y);

    return Math.round((x * 100) / y);
  };
  //eriks data, add column target data
  //NOTE: use the new post data format
  const postMock = [
    ["Partno. Customer", "Description", "Category", "Cuurent Supplier Partno."],
    ["51.10001", "SKF LAGER 6003", "bearings", "3046760"],
    ["51.10005", "SKF LAGER 6011", "bearings", "3046838"],
  ];

  // const responseMock = [
  //   {
  //     materialNo: 1,
  //     materialDescription: "abc",
  //     matchType: "matched",
  //   },
  //   {
  //     materialNo: 144,
  //     materialDescription: "abc2",
  //     matchType: "matched",
  //   },
  //   {
  //     materialNo: 2,
  //     materialDescription: "def",
  //     matchType: "fuzzyMatched",
  //     score: 10,
  //   },
  //   {
  //     materialNo: 1,
  //     materialDescription: "sdf",
  //     matchType: "notMatched",
  //   },
  // ];
  const responseMock = [
    {
      MaterialNoShort: "12345",
      MaterialDescription: "ABCDEF",
      Score: "100",
      MatchType: "Exact",
    },
    {
      MaterialNoShort: "12345",
      MaterialDescription: "ABCDEF",
      Score: "100",
      MatchType: "Exact",
    },
    {
      MaterialNoShort: "12345",
      MaterialDescription: "ABCDEF",
      Score: "100",
      MatchType: "Exact",
    },
  ];

  // const transpormResponse = (tableData, responseData) => {
  //   const final = {};
  //   final['matched']=tableData.filter(responseData)
  //   const mergeData = tableData.map(t=>t.push)
  //   return final;
  // };
  return (
    <>
      <div className="container">
        <div className="flex justify-content-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 586 179.84"
            width={200}
          >
            <path
              d="M262.71 34C269 34 272 39.05 272 45.34V135c0 6.29-3.07 11.4-9.32 11.4v31.86H323v-31.9c-6.26 0-9.32-5.11-9.32-11.4V45.34c0-6.29 3.06-11.39 9.32-11.39V2.09h-60.29ZM519.76 45.61a8.58 8.58 0 0 1 8.9-8.34c6.13 0 15.31 5.9 15.31 24.78h29.73v-60H548s.47 7-4.62 7C537.11 9.06 532 0 514.66 0c-24.45 0-40.12 19.53-40.12 47.75 0 51.66 67.05 52.91 67.05 82.36 0 6.73-3.57 12.12-11.66 12.12-6.68 0-19.28-4.58-22.11-27.64h-30.89v63.63h25.64s-.47-7 4.63-7c6.29 0 12 8.6 31.18 8.6 28.42 0 47.62-21.24 47.62-49.73 0-59.27-66.24-62.15-66.24-84.48ZM242.25 135c0-38.06-17.08-46.84-33.63-46.84 28.36-4.43 39.09-22.28 39.09-39.78v-.13c.18-13.8-3.59-24.78-11.21-32.69-12.61-13.12-29.91-13.47-31.38-13.47h-78.61V34c6.25 0 9.32 5.1 9.32 11.39V135c0 6.29-3.07 11.4-9.32 11.4v31.88h61.39v-31.92c-1.78-.1-2.79-.33-5.12-2.37s-3.35-4.73-3.41-8.32v-31.52c3.07 0 13.28-.35 17.8 6.31 3.89 5.62 3 25.75 3 25.75 0 30.58 11.78 42 24.69 42h26.67v-31.85c-6.21 0-9.28-5.11-9.28-11.36Zm-42-80.57c0 17.53-13.08 17.57-13.08 17.57h-7.82V34h7.82s13.1 0 13.08 17.57ZM0 34c6.25 0 9.32 5.1 9.32 11.39V135c0 6.29-3.07 11.4-9.32 11.4v31.86h115.38v-63.67H79.24V135c0 6.29-3.06 11.4-9.32 11.4H50.35v-42.57c5.61 0 10.17 4.63 10.28 10.8h13.89V65.84H60.67C60.55 72 56 76.64 50.38 76.64V33.95h19.54c6.26 0 9.32 5.1 9.32 11.39v20.5h36.14V2.09H0ZM405.51 34c3.59 0 4.62 3.58 4.62 5.65 0 2.54-.93 5.57-3.55 9.09L385 77.66V45.34c0-6.29 3.07-11.39 9.32-11.39V2.09H334.1V34c6.26 0 9.32 5.1 9.32 11.39V135c0 6.3-3.06 11.4-9.32 11.4v31.86h60.26v-31.9c-6.25 0-9.32-5.1-9.32-11.4v-10.67l12.7-16.41 10 25.23s3.65 7.59-2.26 13.25v31.86h60.28v-31.86c-9.36-.13-12.22-9.24-12.22-9.24L429.39 67 450 40.39S454.43 34 465.79 34V2.09h-60.28Z"
              fill="#005ca9"
            />
          </svg>
        </div>
        <h3 style={{ color: "#015ca9", textAlign: "center" }}>
          Product data matching
        </h3>
        <div className="card flex justify-content-center">
          <Stepper ref={stepperRef} style={{ flexBasis: "100%" }}>
            <StepperPanel header="Upload Project">
              <div className="flex flex-column h-12rem">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <CSVReader
                    accept="text/csv, .csv, application/vnd.ms-excel"
                    onUploadAccepted={(results) => {
                      console.log("parse CSV to JSON", results);

                      if (results.data.length > 0) {
                        const headers = results.data[0];
                        const rows = results.data.slice(1);

                        const products = rows.map((row) =>
                          row.reduce((acc, value, index) => {
                            acc[headers[index]] = value;
                            return acc;
                          }, {})
                        );

                        const cols = headers.map((header) => ({
                          field: header,
                          header: header,
                        }));

                        setTransformedRows(products);
                        setColumns(cols);

                        // after API call
                        setMatchedColumns([
                          ...cols,
                          {
                            field: "Eriks",
                            header: "Eriks",
                          },
                        ]);
                        const transformObjectToString = (obj) => {
                          return Object.keys(obj)
                            .map((key) => `${key}: ${obj[key]}`)
                            .join(", ");
                        };

                        //for testing only the first 3 items of the table
                        const matchedDataRows = products
                          .slice(0, 3)
                          .map((t, i) => {
                            return {
                              ...t,
                              Eriks: transformObjectToString(responseMock[i]),
                            };
                          });

                        // console.log("matchedDataColumn", matchedDataColumn);
                        console.log("matchedDataRows", matchedDataRows);

                        const x = matchedDataRows.filter((i) =>
                          i["Eriks"].includes("MatchType: Exact")
                        );
                        setFullyMatchedtransformedRows(x);

                        const y = matchedDataRows.filter((i) =>
                          i["Eriks"].includes("matchType: fuzzyMatched")
                        );
                        setFuzzyMatchedtransformedRows(y);

                        const z = matchedDataRows.filter((i) =>
                          i["Eriks"].includes("matchType: notMatched")
                        );
                        setNotMatchedtransformedRows(z);

                        console.log("fullMatchDataRow", x);
                        console.log("fuzzyMatchDataRow", y);
                        console.log("notMatchDataRow", z);

                        // postData(API_URL, transformedRows).then((data) => {
                        //   console.log("results from data matching API", data);

                        // });
                      }
                    }}
                  >
                    {({
                      getRootProps,
                      acceptedFile,
                      ProgressBar,
                      getRemoveFileProps,
                    }) => (
                      <>
                        <div className="align-items-center flex flex-column justify-content-center">
                          <div>
                            <button
                              className="p-button p-component p-fileupload-choose"
                              type="button"
                              {...getRootProps()}
                            >
                              Browse file
                            </button>
                          </div>

                          <div className="mt-2">
                            {acceptedFile && acceptedFile.name}
                          </div>
                          <ProgressBar />
                        </div>
                      </>
                    )}
                  </CSVReader>
                </div>
              </div>
              <div className="flex pt-4 justify-content-end">
                <Button
                  label="Next"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => stepperRef.current.nextCallback()}
                  disabled={transformedRows.length === 0}
                />
              </div>
            </StepperPanel>
            <StepperPanel header="Project Data">
              <div className="flex pb-4 justify-content-between ">
                <Dropdown
                  value={selectedCatalog}
                  onChange={(e) => setSelectedCatalog(e.value)}
                  options={catalogList}
                  optionLabel="name"
                  placeholder="Select a Catalog"
                  className="w-full md:w-14rem "
                />{" "}
                <Button
                  label="Next"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => stepperRef.current.nextCallback()}
                />
              </div>
              <div></div>
              <div className="flex flex-column">
                <div className="border-2 border-dashed surface-border border-round surface-ground justify-content-center align-items-center font-medium">
                  {transformedRows?.length > 0 && (
                    <BasicFilterDemo data={transformedRows} columns={columns} />
                  )}
                </div>
              </div>
            </StepperPanel>
            <StepperPanel header="Matching">
              <div className="flex flex-column h-12rem">
                <div className="border-2 border-dashed surface-border border-round surface-ground justify-content-center align-items-center font-medium p-0">
                  <TabView>
                    <TabPanel
                      header={`Full Match (${getPercentage(
                        fullyMatchedtransformedRows.length,
                        4
                      )}%)`}
                    >
                      {fullyMatchedtransformedRows?.length > 0 && (
                        <BasicFilterDemo
                          data={fullyMatchedtransformedRows}
                          columns={matchedColumns}
                        />
                      )}
                    </TabPanel>
                    <TabPanel
                      header={`Fuzzy Match (${getPercentage(
                        fuzzyMatchedtransformedRows.length,
                        4
                      )}%)`}
                    >
                      {fuzzyMatchedtransformedRows?.length > 0 && (
                        <BasicFilterDemo
                          data={fuzzyMatchedtransformedRows}
                          columns={matchedColumns}
                        />
                      )}
                    </TabPanel>
                    <TabPanel
                      header={`No Match (${getPercentage(
                        notMatchedtransformedRows.length,
                        4
                      )}%)`}
                    >
                      {notMatchedtransformedRows?.length > 0 && (
                        <BasicFilterDemo
                          data={notMatchedtransformedRows}
                          columns={matchedColumns}
                        />
                      )}
                    </TabPanel>
                  </TabView>
                </div>
              </div>
            </StepperPanel>
          </Stepper>
        </div>

        {/* <InputText type="text" placeholder="Integers" />
        <Dropdown
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.value)}
          options={cities}
          optionLabel="name"
          placeholder="Select a City"
          className="w-full md:w-14rem"
        />
        <Button
          label="Show"
          icon="pi pi-external-link"
          onClick={() => setVisible(true)}
        />
        <Dialog
          header="Header"
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => {
            if (!visible) return;
            setVisible(false);
          }}
        >
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Dialog> */}
      </div>
    </>
  );
}

export default App;
