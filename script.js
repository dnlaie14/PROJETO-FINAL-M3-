
  class Pet {
  constructor(id, name, owner, date, description, image, type) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.date = date;
    this.description = description;
    this.image = image;
    this.type = type;
  }

  getTypeIcon() {
    switch (this.type) {
      case "dog": return "🐶";
      case "cat": return "🐱";
      default: return "🐾";
    }
  }
}

function getPets() {
  const petsStr = localStorage.getItem("pets");
  return petsStr
    ? JSON.parse(petsStr).map(
        p => new Pet(p.id, p.name, p.owner, p.date, p.description, p.image, p.type)
      )
    : [];
}

function savePets(pets) {
  localStorage.setItem("pets", JSON.stringify(pets));
}

// Verifica se está na tela principal
const url = window.location.pathname.split("/").pop();
if (url === "index.html" || url === "") {
  const pets = getPets();
  let editId = null;

  // Seletores de elementos
  const form = document.getElementById("petForm");
  const nameInput = document.getElementById("name");
  const ownerInput = document.getElementById("owner");
  const dateInput = document.getElementById("date");
  const descInput = document.getElementById("description");
  const imgInput = document.getElementById("image");
  const typeInput = document.getElementById("type");
  const petList = document.getElementById("petList");
  const cancelEditBtn = document.getElementById("cancelEdit");
  const cepInput = document.getElementById("cep");
  const buscarBtn = document.getElementById("buscarCEP");
  const resultadoDiv = document.getElementById("resultado");
  const erroSpan = document.getElementById("erro");

  function renderPets() {
    petList.innerHTML = "";
    pets.forEach(pet => {
      const card = document.createElement("div");
      card.className = "pet-card";
      card.innerHTML = `
        <img src="${pet.image}" alt="Imagem do Pet" />
        <h3><span class="pet-icon">${pet.getTypeIcon()}</span> ${pet.name}</h3>
        <p><strong>Dono:</strong> ${pet.owner}</p>
        <p><strong>Nascimento:</strong> ${pet.date}</p>
        <p>${pet.description}</p>
        <div class="buttons">
          <button type="button" class="edit-btn" data-id="${pet.id}">Editar</button>
          <button type="button" class="delete-btn" data-id="${pet.id}">Deletar</button>
        </div>
      `;
      petList.appendChild(card);
    });
  }

  function resetForm() {
    form.reset();
    editId = null;
    cancelEditBtn.style.display = "none";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const owner = ownerInput.value.trim();
    const date = dateInput.value;
    const description = descInput.value.trim();
    const image = imgInput.value.trim();
    const type = typeInput.value;

    if (editId) {
      const index = pets.findIndex(p => p.id === editId);
      if (index !== -1) {
        pets[index] = new Pet(editId, name, owner, date, description, image, type);
      }
    } else {
      const id = Date.now();
      pets.push(new Pet(id, name, owner, date, description, image, type));
    }

    savePets(pets);
    renderPets();
    resetForm();
  });

  cancelEditBtn.addEventListener("click", () => resetForm());

  petList.addEventListener("click", (e) => {
    const id = Number(e.target.getAttribute("data-id"));
    if (e.target.classList.contains("edit-btn")) {
      const pet = pets.find(p => p.id === id);
      if (pet) {
        nameInput.value = pet.name;
        ownerInput.value = pet.owner;
        dateInput.value = pet.date;
        descInput.value = pet.description;
        imgInput.value = pet.image;
        typeInput.value = pet.type;
        editId = pet.id;
        cancelEditBtn.style.display = "inline-block";
      }
    } else if (e.target.classList.contains("delete-btn")) {
      if (confirm("Deseja realmente deletar este pet?")) {
        const index = pets.findIndex(p => p.id === id);
        if (index !== -1) {
          pets.splice(index, 1);
          savePets(pets);
          renderPets();
          if (editId === id) resetForm();
        }
      }
    }
  });

  renderPets(); // Chama ao carregar a página
}
