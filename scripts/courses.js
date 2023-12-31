// Main function for rendering the courses page
function renderCoursesPage() {
  let cols = [
    { key: "id", label: "#", style: "index-cell" },
    { key: "code", label: "Course Code" },
    { key: "name", label: "Course Name" },
    { key: "base", label: "Base" },
    { key: "student_count", label: "Student Count" },
    { key: "color", label: "Color", style: "color-cell" },
  ];

  const pageHeader = pageLayoutHandler(
    "Courses",
    "You can add, edit, and delete courses here."
  );

  const pageActions = pageActionsHandler([
    {
      label: "Add Course",
      handler: "addCourseClickHandler()",
    },
    {
      label: "Edit Course",
      handler: "editCourseClickHandler()",
    },
    {
      label: "Delete Course",
      handler: "deleteCourseClickHandler()",
    },
    {
      label: "Assign Grades",
      handler: "assignGradesClickHandler()",
    },
  ]);

  const pageFooter = pageFooterHandler(state.courses);

  return (
    pageHeader + pageActions + generateTable(state.courses, cols) + pageFooter
  );
}

// Function to handle the row clicks for courses table
function courseRowClickHandler() {
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

// Function to handle the click event of the add button for courses
function addCourseClickHandler() {
  const fields = [
    { label: "Course Code", type: "text", id: "courseCode" },
    { label: "Course Name", type: "text", id: "name" },
    { label: "Color", type: "text", id: "color" },
    { label: "Base 7", type: "radio", name: "grade_base", id: "base_7" },
    { label: "Base 10", type: "radio", name: "grade_base", id: "base_10" },
  ];

  const form = createForm(fields, "saveCourse()");

  openModal("Add Course", form);
}

// Function to handle the click event of the edit button for courses
function editCourseClickHandler() {
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
  // Get the course with the id
  const course = state.courses[id];
  // Create the form fields
  const fields = [
    {
      label: "Course Name",
      type: "text",
      id: "courseCode",
      value: course.code,
    },
    {
      label: "Description",
      type: "text",
      id: "name",
      value: course.name,
    },
    {
      label: "Color",
      type: "text",
      id: "color",
      value: course.color,
    },
    {
      label: "Base 7",
      type: "radio",
      name: "grade_base",
      id: "base_7",
      checked: course.base === 7,
    },
    {
      label: "Base 10",
      type: "radio",
      name: "grade_base",
      id: "base_10",
      checked: course.base === 10,
    },
  ];
  // Create the form
  const form = createForm(
    fields,
    `editCourse('${course.code}', '${course.name}', '${course.color}', '${course.base}')`,
    true
  );

  openModal("Edit Course", form);
}

// Function to handle the click event of the delete button for courses
function deleteCourseClickHandler() {
  // Get all inputs with type checkbox and checked
  const checked = document.querySelectorAll("input[type=checkbox]:checked");
  // If there is no checked input, do nothing
  if (checked.length === 0) return;

  let modalQuestion = "Are you sure you want to delete the course?";
  let desc =
    "This will also delete the course from students and their grades. This action can not be undone!";
  if (checked.length > 1) {
    modalQuestion = `Are you sure you want to delete ${checked.length} courses?`;
  }
  const dialog = createDialog(
    modalQuestion,
    desc,
    "deleteCourse()",
    "deleteCourseCancelHandler()"
  );
  openModal("Delete Course", dialog);
}

// Function to save the course to the state
function saveCourse() {
  const code = document.getElementById("courseCode").value;
  const name = document.getElementById("name").value;
  const color = document.getElementById("color").value;
  const base = document.querySelector("input[name=grade_base]:checked");

  if (!code || !name || !color) {
    alert("Please fill all the fields!");
    return;
  }

  if (!base) {
    alert("Please select a base!");
    return;
  }

  if (validateHexColor(color) === false) {
    alert("Please enter a valid hex color!");
    return;
  }

  let baseValue = base.id === "base_7" ? 7 : 10;

  // If name exists in the state, do nothing
  if (
    state.courses.find((course) => course.name === name) ||
    state.courses.find((course) => course.code === code)
  ) {
    alert("Course already exists!");
    return;
  }

  state.courses.push({ code, name, color, base: baseValue });
  localStorage.setItem("state", JSON.stringify(state));
  renderMain();
  closeModal();
}

// Function to edit the course in the state
function editCourse(oldCode, oldName, oldColor, oldBase) {
  const code = document.getElementById("courseCode").value;
  const name = document.getElementById("name").value;
  const color = document.getElementById("color").value;
  const base = document.querySelector("input[name=grade_base]:checked");

  const newBase = base.id === "base_7" ? 7 : 10;
  // If nothing changed, do nothing
  if (
    oldCode === code &&
    oldName === name &&
    oldColor === color &&
    oldBase === newBase
  ) {
    closeModal();
    return;
  }

  if (!code || !name || !color) {
    alert("Please fill all the fields!");
    return;
  }

  if (validateHexColor(color) === false) {
    alert("Please enter a valid hex color!");
    return;
  }

  if (!base) {
    alert("Please select a base!");
    return;
  }

  // Users are connected to courses by course code
  // If course code changes, change the course code on the students who take the course
  // But never let edit the course code to an existing course code except itself
  if (oldCode !== code) {
    if (state.courses.find((course) => course.code === code)) {
      alert(`Course already exists with the code ${code}!`);
      return;
    }
    state.students.forEach((student) => {
      student.courses.forEach((course) => {
        if (course.code === oldCode) {
          course.code = code;
        }
      });
    });
  }

  // Update the course on state.courses array
  state.courses.forEach((course) => {
    if (course.code === oldCode) {
      course.code = code;
      course.name = name;
      course.color = color;
      course.base = base.id === "base_7" ? 7 : 10;
    }
  });

  localStorage.setItem("state", JSON.stringify(state));
  renderMain();
  closeModal();
}

// Function to delete the course from the state
function deleteCourse() {
  // Get all inputs with type checkbox and checked
  const checked = document.querySelectorAll("input[type=checkbox]:checked");
  // Get id attribute of each checked input in an array
  const ids = Array.from(checked).map((el) => el.id);
  // Get the course names for id's
  const courseCodes = ids.map((id) => state.courses[+id].code);
  // Delete the courses from the students
  state.students.forEach((student) => {
    student.courses = student.courses.filter(
      (course) => !courseCodes.includes(course.code)
    );
  });
  // Delete the courses with the ids
  state.courses = state.courses.filter((_, i) => !ids.includes(i.toString()));
  // // Update the local storage
  localStorage.setItem("state", JSON.stringify(state));
  // // Render the main content
  renderMain();
  // Close the modal
  closeModal();
}

// Function to handle the delete cancel button in the dialog modal for courses
function deleteCourseCancelHandler() {
  closeModal();
}

// Function to handle the click event of the grade entry button for courses
function assignGradesClickHandler() {
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
  // Get the course with the id
  const course = state.courses[id];

  const studentsWhoTakeTheCourse = state.students.filter((student) => {
    // If students doesnt take the course, return false
    return student.courses.find(
      (studentCourse) => studentCourse.code === course.code
    );
  });

  // If there is no student who takes the course, alert the user and return
  if (studentsWhoTakeTheCourse.length < 1) {
    alert("There is no student who takes this course.");
    return;
  }

  // Create the form fields for every student who takes the course
  // Field template will be like:
  // STUDENT: <STUDENT ID>        MIDTERM: <GRADE>      FINAL: <GRADE>
  const fields = studentsWhoTakeTheCourse.map((student) => {
    const studentCourse = student.courses.find(
      (studentCourse) => studentCourse.code === course.code
    );

    const gradeFields = [];
    for (let i = 0; i < 2; i++) {
      gradeFields.push({
        label: i === 0 ? "Midterm" : "Final",
        type: "number",
        id: student.student_id + "_" + i,
        value: studentCourse.grades[i],
        readonly: false,
      });
    }

    return {
      label: `${student.name} ${student.surname}`,
      type: "text",
      id: student.student_id,
      value: student.student_id,
      readonly: true,
      gradeFields,
    };
  });

  // Create the form
  const form = createGradeForm(fields, "saveGrade()");

  openModal("Assign Grades", form);
}

function saveGrade() {
  if (!validateGradeInputs()) {
    return;
  }
  // Get all inputs with type checkbox and checked
  const checked = document.querySelectorAll("input[type=checkbox]:checked");
  // Get id attribute of each checked input in an array
  const id = Array.from(checked).map((el) => el.id);
  // Get the course names for id's
  const courseCode = state.courses[+id[0]].code;
  state.students.forEach((student) => {
    student.courses.forEach((course) => {
      if (course.code === courseCode) {
        course.grades = [];
        for (let i = 0; i < 2; i++) {
          course.grades.push(
            +document.getElementById(student.student_id + "_" + i).value
          );
        }
      }
    });
  });

  localStorage.setItem("state", JSON.stringify(state));
  renderMain();
  closeModal();
}

function validateGrade(grade) {
  if (grade < 0 || grade > 100 || grade == NaN) return false;
  return true;
}

function validateGradeInputs() {
  const regex = /\b\d{9}_[01]\b/;

  const elements = document.querySelectorAll("input[type=number]");
  for (const element of elements) {
    if (regex.test(element.id)) {
      const grade = +element.value;
      if (!validateGrade(grade)) {
        alert(
          "Invalid grade at '" +
            splitId(element.id).studentFullName +
            "s " +
            splitId(element.id).gradeType +
            "' input!"
        );
        return false;
      }
    }
  }
  return true;
}

function splitId(id) {
  const splitted = id.split("_");
  const gradeTypes = {
    0: "midterm",
    1: "final",
  };
  let student = state.students.find(
    (student) => student.student_id === splitted[0]
  );
  let studentFullName = student.name + " " + student.surname;
  return { studentFullName, gradeType: gradeTypes[splitted[1]] };
}
