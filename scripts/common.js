// Function to hadle page layout
function pageLayoutHandler(title, description) {
  const pageHeader = document.createElement("header");
  pageHeader.classList.add("page-header");

  const pageTitle = document.createElement("h2");
  pageTitle.innerText = title;

  const pageDesc = document.createElement("p");
  pageDesc.innerText = description;

  pageHeader.appendChild(pageTitle);
  pageHeader.appendChild(pageDesc);

  return pageHeader.outerHTML;
}

// Function to handle page actions
function pageActionsHandler(actions) {
  const pageActions = document.createElement("div");
  pageActions.classList.add("page-actions");

  for (let i = 0; i < actions.length; i++) {
    const action = document.createElement("button");
    action.innerHTML = actions[i].label;
    action.classList.add("btn");
    action.setAttribute("onclick", actions[i].handler);

    pageActions.appendChild(action);
  }

  return pageActions.outerHTML;
}

// Function to handle page footer
function pageFooterHandler(tableData) {
  const pageFooter = document.createElement("footer");
  pageFooter.classList.add("page-footer");

  const pageFooterInfo = document.createElement("p");
  pageFooterInfo.classList.add("page-footer-info");
  pageFooterInfo.innerHTML = `Showing ${tableData.length} entries`;

  pageFooter.appendChild(pageFooterInfo);

  return pageFooter.outerHTML;
}

// Function to create form from fields
function createForm(fields, action, isEditForm = false) {
  const form = document.createElement("form");

  const checkboxesContainer = document.createElement("div");
  checkboxesContainer.classList.add("checkboxes-container");

  for (let i = 0; i < fields.length; i++) {
    const field = document.createElement("div");
    field.classList.add("form-group");

    const label = document.createElement("label");
    label.innerHTML = fields[i].label;

    const input = document.createElement("input");
    input.setAttribute("type", fields[i].type);
    input.setAttribute("id", fields[i].id);
    if (fields[i].type === "radio") {
      input.setAttribute("name", fields[i].name);
    }
    if (fields[i].readonly) {
      input.setAttribute("disabled", true);
    }

    if (isEditForm) {
      if (
        (fields[i].type === "checkbox" || fields[i].type === "radio") &&
        fields[i]?.checked
      ) {
        input.setAttribute("checked", fields[i].checked);
      } else {
        input.setAttribute("value", fields[i].value);
      }
    }

    field.appendChild(label);
    field.appendChild(input);

    if (fields[i].type === "checkbox") {
      checkboxesContainer.appendChild(field);
      form.appendChild(checkboxesContainer);
    } else if (fields[i].type === "radio") {
      const radioContainer = document.createElement("div");
      radioContainer.classList.add("radio-container");
      radioContainer.appendChild(field);
      form.appendChild(radioContainer);
    } else {
      form.appendChild(field);
    }
  }

  const submit = document.createElement("button");
  submit.setAttribute("type", "button");
  submit.classList.add("btn");
  submit.innerHTML = "Submit";
  submit.setAttribute("onclick", action);

  form.appendChild(submit);

  return form.outerHTML;
}

// Function to create dialog
function createDialog(message, desc = "", okHandler, cancelHandler) {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog");

  const dialogMessage = document.createElement("p");
  dialogMessage.innerHTML = message;

  if (desc !== "") {
    const dialogDesc = document.createElement("p");
    dialogDesc.innerHTML = desc;
    dialogDesc.classList.add("dialog-desc");
    dialogMessage.appendChild(dialogDesc);
  }

  const dialogActions = document.createElement("div");
  dialogActions.classList.add("dialog-actions");

  const dialogConfirm = document.createElement("button");
  dialogConfirm.classList.add("btn", "btn-danger");
  dialogConfirm.innerHTML = "Confirm";
  dialogConfirm.setAttribute("onclick", okHandler);

  dialogActions.appendChild(dialogConfirm);

  if (cancelHandler !== "") {
    const dialogCancel = document.createElement("button");
    dialogCancel.classList.add("btn");
    dialogCancel.innerHTML = "Cancel";
    dialogCancel.setAttribute("onclick", cancelHandler);
    dialogActions.appendChild(dialogCancel);
  }

  dialog.appendChild(dialogMessage);
  dialog.appendChild(dialogActions);

  return dialog.outerHTML;
}

// Function to create unique student id
function createStudentId() {
  const id =
    "100" +
    (Math.floor(Math.random() * 900) + 100) +
    (Math.floor(Math.random() * 900) + 100);

  if (state.students.find((student) => student.id === id)) {
    return createStudentId();
  }
  return id;
}

// Function to decide text color based on background color
function giveTextColor(colorCode) {
  const hexColor = colorCode.replace("#", "");

  const fullHexColor =
    hexColor.length === 3
      ? hexColor
          .split("")
          .map((char) => char + char)
          .join("")
      : hexColor;

  const r = parseInt(fullHexColor.substring(0, 2), 16);
  const g = parseInt(fullHexColor.substring(2, 4), 16);
  const b = parseInt(fullHexColor.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (luminance > 0.5) {
    return "black";
  } else {
    return "white";
  }
}

// Function to validate hex color code
function validateHexColor(colorCode) {
  const regex = /^#([0-9a-f]{3}){1,2}$/i;
  return regex.test(colorCode);
}

// Function to create grade form
function createGradeForm(fields, action, isEditForm = false) {
  const form = document.createElement("form");

  for (let i = 0; i < fields.length; i++) {
    const field = document.createElement("div");
    field.classList.add("grade-form-group");

    const student = document.createElement("div");
    student.classList.add("input-group");

    const studentLabel = document.createElement("label");
    studentLabel.innerHTML = fields[i].label;

    const studentInput = document.createElement("input");
    studentInput.setAttribute("type", fields[i].type);
    studentInput.setAttribute("id", fields[i].id);
    studentInput.setAttribute("value", fields[i].value);
    if (fields[i].readonly) {
      studentInput.setAttribute("disabled", true);
    }

    student.appendChild(studentLabel);
    student.appendChild(studentInput);

    const gradeFields = document.createElement("div");
    gradeFields.classList.add("grade-input-container");

    for (let j = 0; j < fields[i].gradeFields.length; j++) {
      const gradeField = document.createElement("div");
      gradeField.classList.add("input-group", "number-input");

      const gradeLabel = document.createElement("label");
      gradeLabel.innerHTML = fields[i].gradeFields[j].label;

      const gradeInput = document.createElement("input");
      gradeInput.setAttribute("type", fields[i].gradeFields[j].type);
      gradeInput.setAttribute("id", fields[i].gradeFields[j].id);
      gradeInput.setAttribute("value", fields[i].gradeFields[j].value);
      gradeInput.setAttribute("min", 0);
      gradeInput.setAttribute("max", 100);
      if (fields[i].gradeFields[j].readonly) {
        gradeInput.setAttribute("disabled", true);
      }

      gradeField.appendChild(gradeLabel);
      gradeField.appendChild(gradeInput);

      gradeFields.appendChild(gradeField);
    }

    field.appendChild(student);
    field.appendChild(gradeFields);

    form.appendChild(field);
  }

  const submit = document.createElement("button");
  submit.setAttribute("type", "button");
  submit.classList.add("btn");
  submit.innerHTML = "Submit";
  submit.setAttribute("onclick", action);

  form.appendChild(submit);

  return form.outerHTML;
}

// Function to create student based grade form
function createStudentGradeForm(fields, action) {
  const form = document.createElement("form");

  for (let i = 0; i < fields.length; i++) {
    const field = document.createElement("div");
    field.classList.add("grade-form-group");
    field.style.alignItems = "center";

    const courseLabel = document.createElement("label");
    courseLabel.innerText = fields[i].course;
    courseLabel.classList.add("course-item");
    courseLabel.style.backgroundColor = fields[i].color;
    courseLabel.style.color = giveTextColor(fields[i].color);

    const gradeFieldsContainer = document.createElement("div");
    gradeFieldsContainer.classList.add("form-group-row");

    for (const iterator of fields[i].gradeFields) {
      const courseFormGroup = document.createElement("div");
      courseFormGroup.classList.add("form-group");

      const gradeLabel = document.createElement("label");
      gradeLabel.innerText = iterator.label;

      const gradeInput = document.createElement("input");
      gradeInput.setAttribute("id", iterator.id);
      gradeInput.setAttribute("value", iterator.value);
      gradeInput.style.maxWidth = "6rem";

      courseFormGroup.appendChild(gradeLabel);
      courseFormGroup.appendChild(gradeInput);

      gradeFieldsContainer.appendChild(courseFormGroup);
    }
    field.appendChild(courseLabel);
    field.appendChild(gradeFieldsContainer);

    form.appendChild(field);
  }

  const submit = document.createElement("button");
  submit.setAttribute("type", "button");
  submit.classList.add("btn");
  submit.innerHTML = "Submit";
  submit.setAttribute("onclick", action);

  form.appendChild(submit);

  return form.outerHTML;
}

// Function to calculate letter grade based on midterm, final and base
function calculateLetterGrade(midterm, final, base) {
  const average = midterm * 0.4 + final * 0.6;
  if (base == 10) {
    if (average >= 90) return "A";
    else if (average >= 80) return "B";
    else if (average >= 70) return "C";
    else if (average >= 60) return "D";
    else return "F";
  } else {
    if (average >= 93) return "A";
    else if (average >= 85) return "B";
    else if (average >= 77) return "C";
    else if (average >= 70) return "D";
    else return "F";
  }
}

// Function to calculate GPA without credit
function calculateGPA(courses) {
  let gpa = 0;
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const average = course.grades[0] * 0.4 + course.grades[1] * 0.6;
    gpa += average;
  }

  let result = (gpa / courses.length).toFixed(2);
  return (result / 25).toFixed(2);
}
