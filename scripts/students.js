// Main function for rendering the student page
function renderStudentPage() {
  let cols = [
    { key: "id", label: "#", style: "index-cell" },
    { key: "student_id", label: "Student Id", style: "student-id" },
    { key: "name", label: "Name" },
    { key: "surname", label: "Surname" },
    { key: "courses", label: "Courses" },
  ];

  const pageHeader = pageLayoutHandler(
    "Students",
    "You can add, edit, and delete students here."
  );

  const pageActions = pageActionsHandler([
    {
      label: "Add Student",
      handler: "addClickHandler()",
    },
    {
      label: "Edit Student",
      handler: "editClickHandler()",
    },
    {
      label: "Delete Student",
      handler: "deleteClickHandler()",
    },
    {
      label: "Edit Grades",
      handler: "editGradesClickHandler()",
    },
  ]);

  const pageFooter = pageFooterHandler(state.students);

  return (
    pageHeader + pageActions + generateTable(state.students, cols) + pageFooter
  );
}

// Function to handle the row clicks for student table
function studentRowClickHandler() {
  const rows = document.querySelectorAll("tbody tr");

  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener("click", function () {
      const checkboxes = document.querySelectorAll(".index-cell input");
      checkboxes[i].checked = !checkboxes[i].checked;
      if (checkboxes[i].checked) {
        rows[i].classList.add("selected");
      } else {
        rows[i].classList.remove("selected");
      }
    });
  }
}

// Function to handle the click event of the add button
function addClickHandler() {
  const fields = [
    { label: "Name", type: "text", id: "name" },
    { label: "Surname", type: "text", id: "surname" },
  ];
  for (let i = 0; i < state.courses.length; i++) {
    fields.push({
      label: state.courses[i].code,
      type: "checkbox",
      id: state.courses[i].code,
    });
  }
  const form = createForm(fields, "saveStudent()");

  openModal("Add student", form);
}

// Function to handle the click event of the edit button
function editClickHandler() {
  // Get all inputs with type checkbox and checked and class index-cell-checkbox
  const checked = document.querySelectorAll(
    "input[type=checkbox].index-cell-checkbox:checked"
  );
  // If there is no checked input, do nothing
  if (checked.length === 0) return;
  // If there are more than one checked input, do nothing
  if (checked.length > 1) return;
  // Get the id attribute of the checked input
  const id = checked[0].id;
  // Get the student with the id
  const student = state.students[id];
  // Create the form fields
  const fields = [
    {
      label: "Student Id",
      type: "text",
      id: "student_id",
      value: student.student_id,
      readonly: true,
    },
    { label: "Name", type: "text", id: "name", value: student.name },
    { label: "Surname", type: "text", id: "surname", value: student.surname },
  ];
  for (let i = 0; i < state.courses.length; i++) {
    fields.push({
      label: state.courses[i].code,
      type: "checkbox",
      id: state.courses[i].code,
      checked: student.courses.find(
        (course) => course.code === state.courses[i].code
      ),
    });
  }
  // Create the form
  const form = createForm(
    fields,
    `editStudent('${student.student_id}')`,
    (isEditForm = true)
  );

  openModal("Edit student", form);
}

// Function to handle the click event of the delete button
function deleteClickHandler() {
  // Get all inputs with type checkbox and checked
  const checked = document.querySelectorAll("input[type=checkbox]:checked");
  // If there is no checked input, do nothing
  if (checked.length === 0) return;
  let modalQuestion = "Are you sure you want to delete the student?";
  if (checked.length > 1) {
    modalQuestion = `Are you sure you want to delete ${checked.length} students?`;
  }
  const dialog = createDialog(
    modalQuestion,
    (desc = "This action can not be undone!"),
    "deleteStudent()",
    "deleteCancelHandler()"
  );
  openModal("Delete student", dialog);
}

// Function to save the student to the state
function saveStudent() {
  const id = createStudentId();
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;

  if (name === "" || surname === "") {
    alert("Name and surname can not be empty!");
    return;
  }

  const courses = [];
  for (let i = 0; i < state.courses.length; i++) {
    if (document.getElementById(state.courses[i].code).checked) {
      courses.push({ code: state.courses[i].code, grades: [0, 0] });
    }
  }

  state.students.push({ student_id: id, name, surname, courses });
  localStorage.setItem("state", JSON.stringify(state));
  renderMain();
  closeModal();
}

function editStudent(studentId) {
  const student_id = document.getElementById("student_id").value;
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const courses = [];

  if (name === "" || surname === "") {
    alert("Name and surname can not be empty!");
    return;
  }

  const studentGrades = state.students.find(
    (student) => student.student_id === studentId
  ).courses;

  for (let i = 0; i < state.courses.length; i++) {
    if (document.getElementById(state.courses[i].code).checked) {
      const grades = studentGrades.find(
        (course) => course.code === state.courses[i].code
      )?.grades || [0, 0];
      courses.push({ code: state.courses[i].code, grades });
    }
  }

  state.students.forEach((student) => {
    if (student.student_id === studentId) {
      student.student_id = student_id;
      student.name = name;
      student.surname = surname;
      student.courses = courses;
    }
  });

  localStorage.setItem("state", JSON.stringify(state));
  renderMain();
  closeModal();
}

// Function to delete the student from the state
function deleteStudent() {
  // Get all inputs with type checkbox and checked
  const checked = document.querySelectorAll("input[type=checkbox]:checked");
  // Get id attribute of each checked input in an array
  const ids = Array.from(checked).map((el) => el.id);
  // Delete the students with the ids
  state.students = state.students.filter(
    (el, i) => !ids.includes(i.toString())
  );
  // Update the local storage
  localStorage.setItem("state", JSON.stringify(state));
  // Render the main content
  renderMain();
  // Close the modal
  closeModal();
}

// Function to handle the delete cancel button in the dialog modal
function deleteCancelHandler() {
  closeModal();
}

function editGradesClickHandler() {
  // Get all inputs with type checkbox and checked and class index-cell-checkbox
  const checked = document.querySelectorAll(
    "input[type=checkbox].index-cell-checkbox:checked"
  );
  // If there is no checked input, do nothing
  if (checked.length === 0) return;
  // If there are more than one checked input, do nothing
  if (checked.length > 1) return;
  // Get the id attribute of the checked input
  const id = checked[0].id;
  // Get the student with the id
  const student = state.students[id];

  editStudentGrades(student.student_id);
}

function editStudentGrades(studentId) {
  // Get the student with the id
  const student = state.students.find(
    (student) => student.student_id === studentId
  );
  // Create the form fields
  const courses = student.courses;
  const courseGradeFields = [];
  for (let i = 0; i < courses.length; i++) {
    courseGradeFields.push({
      course: courses[i].code,
      color: state.courses.find((course) => course.code === courses[i].code)
        ?.color,
      gradeFields: [
        {
          type: "number",
          id: `${courses[i].code}-midterm`,
          label: "Midterm",
          value: courses[i].grades[0],
        },
        {
          type: "number",
          id: `${courses[i].code}-final`,
          label: "Final",
          value: courses[i].grades[1],
        },
      ],
    });
  }

  const form = createStudentGradeForm(
    courseGradeFields,
    `saveStudentGrades('${studentId}')`
  );
  openModal("Edit student grades", form);
}

function saveStudentGrades(studentId) {
  const student = state.students.find(
    (student) => student.student_id === studentId
  );
  const courses = student.courses;

  for (let i = 0; i < courses.length; i++) {
    const midterm = document.getElementById(`${courses[i].code}-midterm`).value;
    const final = document.getElementById(`${courses[i].code}-final`).value;

    if (!validateGrade(midterm) || !validateGrade(final)) {
      alert("Invalid grade!");
      return;
    }

    courses[i].grades = [+midterm, +final];
  }

  localStorage.setItem("state", JSON.stringify(state));
  renderMain();
  closeModal();
}
