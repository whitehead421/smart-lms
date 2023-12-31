// Main function for rendering the analytics page
function renderAnalyticsPage() {
  const pageHeader = pageLayoutHandler(
    "Analytics",
    "You can see the analytics here."
  );

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("analytics-content");

  return pageHeader + renderAnalyticsTabs() + contentContainer.outerHTML;
}

function renderAnalyticsTabs() {
  const tabsContainer = document.createElement("div");
  tabsContainer.classList.add("analytics-tabs");

  const tabs = [
    {
      id: 1,
      name: "Course Overview",
    },
    {
      id: 2,
      name: "Student Performance",
    },
  ];

  tabs.forEach((tab) => {
    const tabElement = document.createElement("div");
    tabElement.classList.add("analytics-tab");
    tabElement.setAttribute("onclick", `changeAnalyticsTab(${tab.id})`);
    tabElement.innerHTML = `<span>${tab.name}</span>`;
    if (tab.id === state.analytics.tab)
      tabElement.classList.add("analytics-tab-active");

    tabsContainer.appendChild(tabElement);
  });

  return tabsContainer.outerHTML;
}

function changeAnalyticsTab(tab) {
  const tabs = document.querySelectorAll(".analytics-tab");
  tabs[state.analytics.tab - 1].classList.remove("analytics-tab-active");
  state.analytics.tab = tab;
  tabs[state.analytics.tab - 1].classList.add("analytics-tab-active");
  localStorage.setItem("state", JSON.stringify(state));

  renderAnalyticsContent();
  renderAnalyticsPage();
}

function renderAnalyticsContent() {
  const contentContainer = document.querySelector(".analytics-content");
  const tab = state.analytics.tab;
  if (tab === 1) {
    contentContainer.innerHTML = renderCourseOverview();
    courseChangeHandler();
  } else if (tab === 2) contentContainer.innerHTML = renderStudentPerformance();
}
