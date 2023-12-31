// Defining state object
let state;

// If there is a state in the local storage, get it
if (localStorage.getItem("state")) {
  state = JSON.parse(localStorage.getItem("state"));
} else {
  state = {
    analytics: {
      tab: 1,
      failedStudents: false,
    },
    menu: 1,
    students: [],
    courses: [],
    preferences: {
      darkMode: false,
    },
  };
}

setTheme();

// Registering a listener to listen keydown event on the document to close the modal when the escape key is pressed
document.body.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

// Add event listener to search input lazily
const systemSearchInput = document.querySelector("#system-search-input");
const searchResults = document.querySelector("#search-results");
const searchResultsList = document.querySelector("#search-results-list");

systemSearchInput.addEventListener("keyup", debounce(searchHandler, 500));

// A handler function for the search input
function searchHandler(e) {
  if (e.target.value === "") {
    searchResultsList.innerHTML = "";
    searchResults.style.display = "none";
    return;
  }

  searchResults.style.display = "block";

  const studentResults = state.students
    .filter((student) => {
      if (
        student.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        student.surname.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        return true;
      }
    })
    .map((student) => {
      return {
        name: student.name + " " + student.surname,
        id: student.student_id,
      };
    });

  const courseResults = state.courses
    .filter((course) => {
      if (
        course.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        course.code.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        return true;
      }
    })
    .map((course) => {
      return {
        name: course.code + " " + course.name.slice(0, 10) + "...",
        id: course.code,
      };
    });

  searchResultsList.innerHTML = "";

  const studentDivider = document.createElement("li");
  studentDivider.classList.add("search-results-list-divider");
  studentDivider.innerHTML = "Students";
  searchResultsList.appendChild(studentDivider);

  studentResults.forEach((result) => {
    const li = document.createElement("li");
    li.setAttribute("onclick", `handleStudentClick('${result.id}')`);
    li.innerHTML = result.name;
    searchResultsList.appendChild(li);
  });

  const courseDivider = document.createElement("li");
  courseDivider.classList.add("search-results-list-divider");
  courseDivider.innerHTML = "Courses";
  searchResultsList.appendChild(courseDivider);

  courseResults.forEach((result) => {
    const li = document.createElement("li");
    li.setAttribute("onclick", `handleCourseClick('${result.id}')`);
    li.innerHTML = result.name;
    searchResultsList.appendChild(li);
  });
}

// A handler function for the click event of the search results
function handleStudentClick(student_id) {
  searchResultsList.innerHTML = "";
  searchResults.style.display = "none";

  changeMenu(2);

  let studentIndex = state.students.findIndex((student) => {
    return student.student_id === student_id;
  });

  const checkbox = document.querySelector(`input[id='${studentIndex}']`);
  checkbox.checked = true;

  editClickHandler();
}

// A handler function for the click event of the search results
function handleCourseClick(course_id) {
  searchResultsList.innerHTML = "";
  searchResults.style.display = "none";

  changeMenu(3);

  let courseIndex = state.courses.findIndex((course) => {
    return course.code === course_id;
  });

  const checkbox = document.querySelector(`input[id='${courseIndex}']`);
  checkbox.checked = true;

  editCourseClickHandler();
}

function debounce(func, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), delay);
  };
}

// A handler function for the click event of the menu items
function changeMenu(menu) {
  // If the menu is the same, do nothing
  // if (menu === state.menu) return;

  // Select all menu items
  const menus = document.querySelectorAll(".menu-item");
  // Remove active class from the current menu
  if (state.menu !== -1) menus[state.menu - 1].classList.remove("menu-active");
  // Set the new menu
  state.menu = menu;
  // Add active class to the new menu
  menus[state.menu - 1].classList.add("menu-active");
  // Update the local storage
  localStorage.setItem("state", JSON.stringify(state));
  // Render the main content
  renderMain();
}

// A handler function for rendering the main content for the selected menu
function renderMain() {
  let main = document.querySelector("main");
  if (state.menu === 1) {
    main.innerHTML = HOME_PAGE_HTML;
  } else if (state.menu === 2) {
    main.innerHTML = renderStudentPage();
    studentRowClickHandler();
  } else if (state.menu === 3) {
    main.innerHTML = renderCoursesPage();
    courseRowClickHandler();
  } else if (state.menu === 4) {
    main.innerHTML = renderAnalyticsPage();
    renderAnalyticsContent();
  } else if (state.menu === 5) {
    main.innerHTML = renderSettingsPage();
  }
}

// Changing function but actually setting initial menu
changeMenu(state.menu);
