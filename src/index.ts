const root = document.createElement("div");

document.body.append(root);

const sheet = {
  dataTypes: [
    { _id: '1', name: "Name", type: 'text' },
    { _id: '2', name: "Date", type: 'date' },
    { _id: '3', name: "Notes", type: 'text' },
    { _id: '4', name: "Image", type: 'image' },
  ],
  data: [
    {
      1: "Test Name",
      2: "2022-10-30",
      3: "Some notes",
    }
  ]
}

const table = document.createElement("table");
table.style.overflowX = "auto";
table.style.display = "block";


const row = document.createElement("tr");

for (const column of sheet.dataTypes) {
  const columnElement = document.createElement("td");
  columnElement.style.width = "200px";

  columnElement.innerText = column.name;

  row.append(columnElement);
}
table.append(row);

function ColImage(imgSrc: string) {
  const image = document.createElement("img");
  image.style.width = '300px'
  image.style.height = '300px'
  image.style.objectFit = 'contain'
  image.src = imgSrc;
  return image
}

for (const dataRow of sheet.data) {
  const rowEl = document.createElement("tr");

  for (const field of Object.keys(dataRow)) {
    const dataType = sheet.dataTypes.find((dt) => {
      return dt._id === field
    })
    if (!dataType) {
      continue;
    }

    const colEl = document.createElement("td");
    colEl.style.minWidth = "200px"
    colEl.style.maxWidth = "200px"

    if (dataType.type === "image") {
      colEl.append(ColImage(dataRow[field]));
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
                  colEl.innerHTML = '';
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
      colEl.contentEditable = 'true'
      colEl.style.outline = 'none'
      colEl.innerHTML = dataRow[field];
    }

    rowEl.append(colEl);
  }

  table.append(rowEl);
}

root.append(table);
