import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function BasicFilterDemo({ data, columns }) {
  return (
    <div className="card">
      <DataTable
        value={data}
        tableStyle={{ minWidth: "50rem" }}
        paginator
        rows={20}
        scrollHeight="700px"
        scrollable
      >
        {columns.map((col, i) => (
          <Column key={col.field} field={col.field} header={col.header} />
        ))}
      </DataTable>
    </div>
  );
}
