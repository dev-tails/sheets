import { addRow, getAllRows } from "./db";

async function run() {
  // const db = await addRow({
  //   columns: [
  //     "Test",
  //     "https://medlineplus.gov/images/Xray_share.jpg",
  //   ],
  // });
  // return;

  const rows = await getAllRows();

  const root = document.createElement("div");

  document.body.append(root);

  const sheet = {
    dataTypes: [
      { name: "Name", type: "text" },
      { name: "Image", type: "image" },
    ],
  };

  const table = document.createElement("table");
  table.style.overflowX = "auto";
  table.style.display = "block";

  const row = document.createElement("tr");

  for (const column of sheet.dataTypes) {
    const columnElement = document.createElement("td");
    
    columnElement.style.borderBottom = "1px solid black";
    columnElement.style.width = "200px";

    columnElement.innerText = column.name;

    row.append(columnElement);
  }
  table.append(row);

  function ColImage(imgSrc: string) {
    const image = document.createElement("img");
    image.style.width = "100px";
    image.style.height = "100px";
    image.style.objectFit = "contain";
    image.src = imgSrc;
    return image;
  }

  for (let i = 0; i < 1000; i++) {
    const dataRow = rows[i];
    
    const rowEl = document.createElement("tr");
    rowEl.style.borderBottom = "1px solid black";

    for (let j = 0; j < sheet.dataTypes.length; j++) {
      const dataType = sheet.dataTypes[j];
      if (!dataType) {
        continue;
      }

      const colEl = document.createElement("td");
      colEl.style.borderBottom = "1px solid black";
      colEl.style.minWidth = "200px";
      colEl.style.maxWidth = "200px";

      if (dataType.type === "image") {
        if (dataRow?.columns) {
          colEl.append(ColImage(dataRow?.columns[j]));
        }
        colEl.addEventListener("dragover", (e) => {
          e.preventDefault();
        });
        colEl.addEventListener("drop", (ev) => {
          ev.preventDefault();
          if (!ev.dataTransfer) {
            return;
          }

          if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            [...ev.dataTransfer.items].forEach((item, i) => {
              // If dropped items aren't files, reject them
              if (item.kind === "file") {
                const file = item.getAsFile();
                if (file) {
                  const reader = new FileReader();

                  reader.onload = function (e) {
                    colEl.innerHTML = "";
                    colEl.append(ColImage(e.target?.result as string));
                  };

                  reader.readAsDataURL(file);
                }
                console.log(`1 file[${i}].name = ${file?.name}`);
              }
            });
          } else {
            // Use DataTransfer interface to access the file(s)
            [...ev.dataTransfer.files].forEach((file, i) => {
              console.log(`2 file[${i}].name = ${file.name}`);
            });
          }
        });
        colEl.addEventListener("click", () => {
          console.log("click");
        });
      } else {
        colEl.contentEditable = "true";
        colEl.style.outline = "none";
        colEl.innerHTML = dataRow?.columns[j] || "";
      }

      rowEl.append(colEl);
    }

    table.append(rowEl);
  }

  root.append(table);
}

run();
