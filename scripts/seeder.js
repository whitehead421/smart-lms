function generateHighRandomGrade() {
  return Math.floor(Math.random() * 81) + 20;
}

function generateLowRandomGrade() {
  return Math.floor(Math.random() * 41) + 40;
}

function generateRandomCourses(courseList) {
  const numberOfCourses = Math.floor(Math.random() * 3) + 3;
  const selectedCourses = [];
  for (let i = 0; i < numberOfCourses; i++) {
    const randomCourse =
      courseList[Math.floor(Math.random() * courseList.length)];
    if (selectedCourses.map((c) => c.code).includes(randomCourse.code)) {
      i--;
      continue;
    }
    selectedCourses.push({
      code: randomCourse.code,
      grades: [generateHighRandomGrade(), generateHighRandomGrade()],
    });
  }
  return selectedCourses;
}

function generateRandomStudent(studentId, name, surname, courseList) {
  return {
    student_id: studentId,
    name,
    surname,
    courses: generateRandomCourses(courseList),
  };
}

const studentIds = [];

function createFakeStudentId() {
  const id =
    "100" +
    (Math.floor(Math.random() * 900) + 100) +
    (Math.floor(Math.random() * 900) + 100);

  if (studentIds.includes(id)) {
    return createFakeStudentId();
  }
  studentIds.push(id);
}

for (let i = 0; i < 87; i++) {
  createFakeStudentId();
}

const generatedStudents = studentNames.map((fullname, index) => {
  const studentId = studentIds[index];
  const name = fullname.name;
  const surname = fullname.surname;
  return generateRandomStudent(
    studentId,
    name,
    surname,
    computerScienceEngineeringCourses
  );
});

const seedSystem = () => {
  state.courses = computerScienceEngineeringCourses;
  state.students = generatedStudents;

  localStorage.setItem("state", JSON.stringify(state));

  const successDialog = createDialog(
    "System has been seeded successfully!",
    "",
    "closeModal()",
    ""
  );

  openModal("Success", successDialog);
  renderMain();
};

const resetSystem = () => {
  const studentCount = state.students.length;
  const courseCount = state.courses.length;

  localStorage.removeItem("state");

  state = {
    menu: 5,
    students: [],
    courses: [],
    analytics: {
      tab: 1,
      failedStudents: false,
    },
    preferences: {
      darkMode: true,
    },
  };

  const successDialog = createDialog(
    "System has been reset successfully!",
    `There were ${studentCount} students and ${courseCount} courses in the system.`,
    "closeModal()",
    ""
  );

  openModal("Success", successDialog);
  renderMain();
};
