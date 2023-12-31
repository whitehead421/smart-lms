function renderSettingsPage() {
  const pageHeader = pageLayoutHandler(
    "Settings",
    "You can change the settings here."
  );

  const pageActions = pageActionsHandler([
    {
      label: "Seed System With Dummy Data",
      handler: "seedSystem()",
    },
    {
      label: "Reset System",
      handler: "resetSystem()",
    },
    {
      label: "Toggle Dark Mode",
      handler: "toggleDarkMode()",
    },
  ]);

  return pageHeader + pageActions;
}

function toggleDarkMode() {
  const body = document.querySelector("body");
  body.classList.toggle("dark");
  state.preferences.darkMode = !state.preferences.darkMode;
  localStorage.setItem("state", JSON.stringify(state));
}

function setTheme() {
  const body = document.querySelector("body");
  if (state.preferences.darkMode) {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }
}
