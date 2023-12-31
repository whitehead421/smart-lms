function renderCourseOverview() {
  const courseSelector = document.createElement("select");
  courseSelector.setAttribute("id", "course-overview-course-selector");

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerHTML = "Select a course";
  defaultOption.setAttribute("disabled", true);
  defaultOption.setAttribute("selected", true);
  courseSelector.appendChild(defaultOption);

  state.courses.forEach((course) => {
    const courseOption = document.createElement("option");
    courseOption.value = course.code;
    courseOption.innerHTML = course.code + " - " + course.name;
    courseSelector.appendChild(courseOption);
  });

  const courseOverview = document.createElement("div");
  courseOverview.classList.add("course-overview-container");

  return courseSelector.outerHTML + courseOverview.outerHTML;
}

function courseChangeHandler() {
  const courseSelector = document.querySelector(
    "#course-overview-course-selector"
  );

  courseSelector.addEventListener("change", (event) => {
    renderCourse(event.target.value);
  });
}

function renderCourse(course_code) {
  const course = state.courses.find((course) => course.code === course_code);
  const statistics = getStatisticsForCourse(course);

  // Empty the course overview container
  const courseOverview = document.querySelector(".course-overview-container");
  courseOverview.innerHTML = "";

  // Create an checkbox input the show only failed students
  const failedStudentsCheckboxContainer = document.createElement("div");
  failedStudentsCheckboxContainer.classList.add("form-group-row");

  const failedStudentsCheckbox = document.createElement("input");
  failedStudentsCheckbox.setAttribute("type", "checkbox");
  failedStudentsCheckbox.setAttribute("id", "failed-students-checkbox");
  failedStudentsCheckbox.setAttribute(
    "onchange",
    "failedStudentsCheckboxHandler(event)"
  );
  if (state.analytics.failedStudents) failedStudentsCheckbox.checked = true;

  const failedStudentsCheckboxLabel = document.createElement("label");
  failedStudentsCheckboxLabel.innerHTML = "Show only failed students";

  failedStudentsCheckboxContainer.appendChild(failedStudentsCheckbox);
  failedStudentsCheckboxContainer.appendChild(failedStudentsCheckboxLabel);

  // Create the course overview header
  const courseHeader = document.createElement("div");
  courseHeader.classList.add("course-overview-header");

  const courseTitle = document.createElement("h2");
  courseTitle.innerHTML = course.code + " - " + course.name;

  const courseStatistics = document.createElement("div");
  courseStatistics.classList.add("course-statistics");

  const courseStatisticsItems = [
    {
      label: "Mean Score",
      value: statistics.meanScore,
      color: getColorByValue(statistics.meanScore),
    },
    {
      label: "Pass Rate",
      value: statistics.passRate,
    },
    {
      label: "Passed Students",
      value: statistics.passedStudents,
      color: "green",
    },
    {
      label: "Failed Students",
      value: statistics.failedStudents,
      color: "red",
    },
  ];

  courseStatisticsItems.forEach((item) => {
    const courseStatisticsItem = document.createElement("div");
    courseStatisticsItem.classList.add("course-statistics-item");

    const courseStatisticsItemLabel = document.createElement("span");
    courseStatisticsItemLabel.classList.add("course-statistics-item-label");

    const courseStatisticsItemValue = document.createElement("span");
    courseStatisticsItemValue.classList.add("course-statistics-item-value");
    if (item.color) courseStatisticsItemValue.style.color = item.color;

    courseStatisticsItemLabel.innerHTML = item.label;
    courseStatisticsItemValue.innerHTML = item.value;

    courseStatisticsItem.appendChild(courseStatisticsItemLabel);
    courseStatisticsItem.appendChild(courseStatisticsItemValue);

    courseStatistics.appendChild(courseStatisticsItem);
  });

  courseHeader.appendChild(courseTitle);
  courseHeader.appendChild(failedStudentsCheckboxContainer);
  courseHeader.appendChild(courseStatistics);
  courseOverview.appendChild(courseHeader);

  // Find students who take the course
  const studentsWhoTakeTheCourse = [];
  state.students.forEach((student) => {
    let stdCourse = student.courses.find((c) => c.code === course.code);

    if (stdCourse) {
      let letter_grade = calculateLetterGrade(
        stdCourse.grades[0],
        stdCourse.grades[1],
        stdCourse.base
      );
      if (state.analytics.failedStudents && letter_grade === "F") {
        studentsWhoTakeTheCourse.push({
          student_id: student.student_id,
          full_name: student.name + " " + student.surname,
          midterm: stdCourse.grades[0],
          final: stdCourse.grades[1],
          letter_grade: calculateLetterGrade(
            stdCourse.grades[0],
            stdCourse.grades[1],
            stdCourse.base
          ),
        });
      } else if (!state.analytics.failedStudents) {
        studentsWhoTakeTheCourse.push({
          student_id: student.student_id,
          full_name: student.name + " " + student.surname,
          midterm: stdCourse.grades[0],
          final: stdCourse.grades[1],
          letter_grade: calculateLetterGrade(
            stdCourse.grades[0],
            stdCourse.grades[1],
            stdCourse.base
          ),
        });
      }
    }
  });

  studentsWhoTakeTheCourse.sort((a, b) => {
    if (a.letter_grade < b.letter_grade) return -1;
    if (a.letter_grade > b.letter_grade) return 1;
    return 0;
  });

  // Create the course overview content
  const courseContent = document.createElement("div");
  courseContent.classList.add("course-overview-content");

  const cols = [
    { key: "student_id", label: "Student Id" },
    { key: "full_name", label: "Studet Name" },
    { key: "midterm", label: "Midterm" },
    { key: "final", label: "Final" },
    { key: "letter_grade", label: "Letter Grade" },
  ];

  const studentsTable = generateTable(
    studentsWhoTakeTheCourse,
    cols,
    (index = true)
  );

  courseContent.innerHTML += studentsTable;

  courseOverview.appendChild(courseContent);
}

function failedStudentsCheckboxHandler(e) {
  const courseSelector = document.querySelector(
    "#course-overview-course-selector"
  );
  const course_code = courseSelector.value;
  state.analytics.failedStudents = e.target.checked;
  localStorage.setItem("state", JSON.stringify(state));
  renderCourse(course_code);
}

function getStatisticsForCourse(course) {
  let statistics = {};
  // Number of passed students.
  const passedStudents = state.students.filter((student) => {
    let stdCourse = student.courses.find((c) => c.code === course.code);
    if (stdCourse) {
      let letter_grade = calculateLetterGrade(
        stdCourse.grades[0],
        stdCourse.grades[1],
        stdCourse.base
      );
      if (letter_grade !== "F") return true;
    }
  });

  const allStudents = state.students.filter((student) => {
    let stdCourse = student.courses.find((c) => c.code === course.code);
    if (stdCourse) return true;
  });
  // Mean score of the entire class
  const meanScore =
    allStudents.reduce((acc, student) => {
      let stdCourse = student.courses.find((c) => c.code === course.code);
      return acc + stdCourse.grades[0] * 0.4 + stdCourse.grades[1] * 0.6;
    }, 0) / allStudents.length;

  statistics.meanScore = parseFloat(meanScore.toFixed(2)) || 0;
  statistics.passRate =
    (parseFloat(
      ((passedStudents.length / allStudents.length).toFixed(2) * 100).toFixed(2)
    ) || 0) + "%";
  statistics.passedStudents = passedStudents.length;
  statistics.failedStudents = allStudents.length - passedStudents.length;

  return statistics;
}

function getColorByValue(value) {
  if (value >= 0 && value < 50) return "#FF0000";
  if (value >= 50 && value < 70) return "#FFA500";
  if (value >= 70 && value < 80) return "#ADFF2F";
  if (value >= 80 && value <= 100) return "#008000";
}
