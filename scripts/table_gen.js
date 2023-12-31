/*
 * cols: array of objects [{key: "name", label: "Name"}, ...]
 * data: array of objects [{name: "John", ...}, ...]
 */
function generateTable(data, cols, index = false) {
  // This container makes table scrollable
  let tableContainer = document.createElement("div");
  tableContainer.classList.add("table-container");

  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  thead.insertRow();
  for (let i = 0; i < cols.length; i++) {
    thead.rows[0].insertCell();
    thead.rows[0].cells[i].innerHTML = cols[i].label;
  }

  for (let i = 0; i < data.length; i++) {
    let row = tbody.insertRow();

    for (let j = 0; j < cols.length; j++) {
      if (j === 0 && !index) {
        row.insertCell();
        const checkbox = document.createElement("input");

        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", i);
        checkbox.setAttribute("readonly", true);
        checkbox.classList.add("index-cell-checkbox");
        row.cells[j].innerHTML = checkbox.outerHTML;
        row.cells[j].classList.add("index-cell");

        continue;
      } else if (data[i][cols[j].key] instanceof Array) {
        // To color student courses in the student table
        row.insertCell();
        const courses = document.createElement("div");
        courses.classList.add("courses");
        // For every course
        data[i][cols[j].key].map((course) => {
          // Create a span element
          let courseEl = document.createElement("span");
          courseEl.classList.add("course-item");
          // Set the background color of the span element to the color of the course
          const backgroundColor = state.courses.find((c) => {
            return c.code == course.code;
          }).color;
          courseEl.style.backgroundColor = backgroundColor;
          courseEl.style.color = giveTextColor(backgroundColor);
          courseEl.innerText = course.code;
          courses.appendChild(courseEl);
        });
        row.cells[j].innerHTML = courses.outerHTML;
        row.cells[j].classList.add("courses-cell");
        continue;
      } else if (cols[j].key === "color") {
        // To color courses in the courses table
        row.insertCell();
        const color = document.createElement("div");
        color.classList.add("course-color-cell");
        color.style.backgroundColor = data[i][cols[j].key];
        color.style.border = "1px solid";
        color.style.borderColor = giveTextColor(data[i][cols[j].key]);
        row.cells[j].innerHTML = color.outerHTML;
        continue;
      } else if (cols[j].key === "student_count") {
        let studentCount = 0;
        state.students.map((student) => {
          if (student.courses.find((course) => course.code === data[i].code)) {
            studentCount++;
          }
        });
        row.insertCell();
        row.cells[j].innerHTML = studentCount;
        continue;
      }
      row.insertCell();
      row.cells[j].innerHTML = data[i][cols[j].key];
      if (cols[j].style) row.cells[j].classList.add(cols[j].style);
    }
  }

  table.appendChild(thead);
  table.appendChild(tbody);

  tableContainer.appendChild(table);

  return tableContainer.outerHTML;
}
