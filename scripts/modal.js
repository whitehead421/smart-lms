function openModal(title, content) {
  const modal = document.getElementById("modal-bg");
  modal.classList.add("open");

  const modalTitle = document.getElementById("modal-title");
  modalTitle.innerHTML = title;

  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = content;
}

function closeModal() {
  const modal = document.getElementById("modal-bg");
  const modalContent = document.getElementById("modal-content");

  modalContent.innerHTML = "";

  modal.classList.remove("open");
}
