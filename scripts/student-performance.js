function renderStudentPerformance() {
  const INPUTS = [
    {
      placeholder: "Student ID",
      type: "text",
      id: "student-id",
      button: "Find By ID",
      by: "id",
    },
    {
      placeholder: "Student Name",
      type: "text",
      id: "student-fullname",
      button: "Find By Name",
      by: "name",
    },
  ];

  const performanceGetters = document.createElement("div");
  performanceGetters.classList.add("student-performance-search-container");

  INPUTS.forEach((input) => {
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container");

    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", input.type);
    inputElement.setAttribute("placeholder", input.placeholder);
    inputElement.setAttribute("id", input.id);

    const inputButton = document.createElement("button");
    inputButton.setAttribute("type", "button");
    inputButton.setAttribute("onclick", `findStudentOrThrow(by='${input.by}')`);
    inputButton.classList.add("btn", "btn-primary");
    inputButton.style.marginLeft = "0.5rem";
    inputButton.innerHTML = input.button;

    inputContainer.appendChild(inputElement);
    inputContainer.appendChild(inputButton);
    performanceGetters.appendChild(inputContainer);
  });

  return performanceGetters.outerHTML;
}

function findStudentOrThrow(by) {
  let elID;
  if (by === "id") {
    elID = "student-id";
  } else {
    elID = "student-fullname";
  }

  const input = document.getElementById(elID);
  if (!input.value) {
    if (by === "id") {
      alert("Please enter a student ID!");
    } else {
      alert("Please enter a student name!");
    }
    return;
  }

  let student;
  if (by === "id") {
    student = state.students.find(
      (student) => student.student_id === input.value
    );
  } else {
    student = state.students.find(
      (student) =>
        student.name.toLowerCase() + " " + student.surname.toLowerCase() ===
        input.value.toLowerCase()
    );
  }
  if (!student) {
    alert("Student not found!");
    return;
  } else {
    const contentContainer = document.querySelector(".analytics-content");
    contentContainer.innerHTML = "";
  }
  input.value = "";
  createStudentPerformanceCard(student);
}

function createStudentPerformanceCard(student) {
  const contentContainer = document.querySelector(".analytics-content");

  const studentInfoCard = document.createElement("div");
  studentInfoCard.classList.add("student-info-card");

  const studentName = document.createElement("h3");
  studentName.innerHTML = `${student.name} ${student.surname}`;

  const studentId = document.createElement("div");
  studentId.classList.add("student-id");
  studentId.innerHTML = `${student.student_id}`;

  studentInfoCard.appendChild(studentName);
  studentInfoCard.appendChild(studentId);

  const overviewCardsContainer = document.createElement("div");
  overviewCardsContainer.classList.add("overview-cards-container");

  const cards = [
    {
      img: "assets/icons/star.svg",
      label: "GPA",
      value: calculateGPA(student.courses),
    },
    {
      img: "./assets/icons/book.svg",
      label: "Courses",
      value: student.courses.length,
    },
  ];

  cards.forEach((card) => {
    const overviewCard = document.createElement("div");
    overviewCard.classList.add("overview-card");

    // Image container
    const overviewCardImageContainer = document.createElement("div");
    overviewCardImageContainer.classList.add("overview-card-image-container");

    const overviewCardImage = document.createElement("img");
    overviewCardImage.setAttribute("src", card.img);

    overviewCardImageContainer.appendChild(overviewCardImage);

    // Text container
    const overviewCardTextContainer = document.createElement("div");
    overviewCardTextContainer.classList.add("overview-card-text-container");

    const overviewCardLabel = document.createElement("p");
    overviewCardLabel.classList.add("overview-card-label");
    overviewCardLabel.innerHTML = card.label;

    const overviewCardValue = document.createElement("h3");
    overviewCardValue.classList.add("overview-card-value");
    overviewCardValue.innerHTML = card.value;

    overviewCardTextContainer.appendChild(overviewCardLabel);
    overviewCardTextContainer.appendChild(overviewCardValue);

    overviewCard.appendChild(overviewCardImageContainer);
    overviewCard.appendChild(overviewCardTextContainer);

    overviewCardsContainer.appendChild(overviewCard);
  });

  studentInfoCard.appendChild(overviewCardsContainer);

  contentContainer.appendChild(studentInfoCard);

  // List courses and grades
  student.courses.forEach((course) => {
    // Find course base
    const courseObject = state.courses.find(
      (courseItem) => courseItem.code === course.code
    );

    const courseCard = document.createElement("div");
    courseCard.classList.add("student-performance-course");

    const courseName = document.createElement("h4");
    courseName.innerHTML =
      course.code +
      " - " +
      courseObject.name +
      " - (" +
      courseObject.base +
      ")";

    const courseGrades = document.createElement("div");
    courseGrades.classList.add("student-performance-course-grades");

    const midtermGrade = document.createElement("div");
    midtermGrade.classList.add("student-performance-course-grade");

    const midtermGradeLabel = document.createElement("p");
    midtermGradeLabel.innerHTML = "Midterm";

    const midtermGradeValue = document.createElement("p");
    midtermGradeValue.innerHTML = course.grades[0];

    midtermGrade.appendChild(midtermGradeLabel);
    midtermGrade.appendChild(midtermGradeValue);

    const finalGrade = document.createElement("div");
    finalGrade.classList.add("student-performance-course-grade");

    const finalGradeLabel = document.createElement("p");
    finalGradeLabel.innerHTML = "Final";

    const finalGradeValue = document.createElement("p");
    finalGradeValue.innerHTML = course.grades[1];

    finalGrade.appendChild(finalGradeLabel);
    finalGrade.appendChild(finalGradeValue);

    const letterGrade = document.createElement("div");
    letterGrade.classList.add("student-performance-course-grade");

    const letterGradeLabel = document.createElement("p");
    letterGradeLabel.innerHTML = "Letter Grade";

    const letterGradeValue = document.createElement("p");
    let calculatedLetterGrade = calculateLetterGrade(
      course.grades[0],
      course.grades[1],
      courseObject.base
    );
    letterGradeValue.innerHTML = calculatedLetterGrade;
    if (calculatedLetterGrade == "F") {
      letterGradeValue.style.color = "#eb3434";
    }

    letterGrade.appendChild(letterGradeLabel);
    letterGrade.appendChild(letterGradeValue);

    courseGrades.appendChild(midtermGrade);
    courseGrades.appendChild(finalGrade);
    courseGrades.appendChild(letterGrade);

    courseCard.appendChild(courseName);
    courseCard.appendChild(courseGrades);

    contentContainer.appendChild(courseCard);
  });
}
