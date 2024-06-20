import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function BasicFilterDemo({ data, columns }) {
  console.log("table data", data);
  console.log("table columns", columns);

  function parseEriksString(str) {
    if (typeof str === "undefined") return;
    return str.split(", ").map((pair) => {
      const [key, value] = pair.split(": ");
      return { key, value };
    });
  }
  const eriksBodyTemplate = (rowData) => {
    const parsedEriks = parseEriksString(rowData.Eriks);
    return (
      <div>
        {parsedEriks?.map((item, index) => (
          <div key={index}>
            <strong>{item.key}:</strong> {item.value}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="card">
      <DataTable
        value={data}
        paginator
        rows={20}
        scrollHeight="700px"
        scrollable
      >
        {columns.map((col, i) => {
          console.log();
          return col.field === "Eriks" ? (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              body={eriksBodyTemplate}
            />
          ) : (
            <Column key={col.field} field={col.field} header={col.header} />
          );
        })}
      </DataTable>
    </div>
  );
}
