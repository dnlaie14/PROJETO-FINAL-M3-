// Define a classe Pet, representando um pet com suas propriedades
class Pet {
  constructor(id, name, owner, date, description, image, type) {
    this.id = id;               // Identificador único do pet
    this.name = name;           // Nome do pet
    this.owner = owner;         // Nome do dono
    this.date = date;           // Data de nascimento
    this.description = description; // Descrição do pet
    this.image = image;         // URL da imagem do pet
    this.type = type;           // Tipo do pet (ex: dog, cat)
  }

  // Retorna um emoji correspondente ao tipo do pet
  getTypeIcon() {
    switch (this.type) {
      case "dog": return "🐶";
      case "cat": return "🐱";
      default: return "🐾"; // Padrão caso o tipo não seja conhecido
    }
  }
}

// Função que recupera os pets armazenados no localStorage
function getPets() {
  const petsStr = localStorage.getItem("pets"); // Lê os dados da chave "pets"
  return petsStr
    ? JSON.parse(petsStr).map( // Se existir, transforma em objetos Pet
        p => new Pet(p.id, p.name, p.owner, p.date, p.description, p.image, p.type)
      )
    : []; // Se não houver pets, retorna array vazio
}

// Função que salva o array de pets no localStorage como string JSON
function savePets(pets) {
  localStorage.setItem("pets", JSON.stringify(pets));
}

// Verifica se o script está sendo executado na página principal (index.html ou raiz)
const url = window.location.pathname.split("/").pop();
if (url === "index.html" || url === "") {

  // Inicializa a lista de pets e variável para controle de edição
  const pets = getPets();
  let editId = null;

  // Seletores de elementos do DOM (formulário e campos)
  const form = document.getElementById("petForm");
  const nameInput = document.getElementById("name");
  const ownerInput = document.getElementById("owner");
  const dateInput = document.getElementById("date");
  const descInput = document.getElementById("description");
  const imgInput = document.getElementById("image");
  const typeInput = document.getElementById("type");
  const petList = document.getElementById("petList");
  const cancelEditBtn = document.getElementById("cancelEdit");

  // Elementos opcionais para CEP (não usados diretamente aqui)
  const cepInput = document.getElementById("cep");
  const buscarBtn = document.getElementById("buscarCEP");
  const resultadoDiv = document.getElementById("resultado");
  const erroSpan = document.getElementById("erro");

  // Função para renderizar todos os pets na tela
  function renderPets() {
    petList.innerHTML = ""; // Limpa o conteúdo atual
    pets.forEach(pet => {
      // Cria o card para cada pet
      const card = document.createElement("div");
      card.className = "pet-card"; // Classe para estilização
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
      petList.appendChild(card); // Adiciona o card à lista de pets
    });
  }

  // Reseta o formulário e oculta botão de cancelar edição
  function resetForm() {
    form.reset();                // Limpa campos
    editId = null;              // Remove o ID de edição
    cancelEditBtn.style.display = "none"; // Esconde botão "Cancelar Edição"
  }

  // Evento ao enviar o formulário (adicionar ou editar pet)
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Impede recarregamento da página

    // Coleta os valores dos campos
    const name = nameInput.value.trim();
    const owner = ownerInput.value.trim();
    const date = dateInput.value;
    const description = descInput.value.trim();
    const image = imgInput.value.trim();
    const type = typeInput.value;

    // Se estiver editando um pet existente
    if (editId) {
      const index = pets.findIndex(p => p.id === editId);
      if (index !== -1) {
        // Atualiza os dados do pet
        pets[index] = new Pet(editId, name, owner, date, description, image, type);
      }
    } else {
      // Caso contrário, adiciona novo pet com ID baseado no timestamp
      const id = Date.now();
      pets.push(new Pet(id, name, owner, date, description, image, type));
    }

    // Salva no localStorage e atualiza a lista na tela
    savePets(pets);
    renderPets();
    resetForm(); // Limpa formulário
  });

  // Evento para cancelar a edição (botão "Cancelar")
  cancelEditBtn.addEventListener("click", () => resetForm());

  // Evento para clique em botões de editar ou deletar
  petList.addEventListener("click", (e) => {
    const id = Number(e.target.getAttribute("data-id")); // ID do pet
    if (e.target.classList.contains("edit-btn")) {
      // Ação de edição
      const pet = pets.find(p => p.id === id);
      if (pet) {
        // Preenche o formulário com os dados do pet
        nameInput.value = pet.name;
        ownerInput.value = pet.owner;
        dateInput.value = pet.date;
        descInput.value = pet.description;
        imgInput.value = pet.image;
        typeInput.value = pet.type;
        editId = pet.id; // Define ID de edição
        cancelEditBtn.style.display = "inline-block"; // Mostra botão "Cancelar"
      }
    } else if (e.target.classList.contains("delete-btn")) {
      // Ação de deletar
      if (confirm("Deseja realmente deletar este pet?")) {
        const index = pets.findIndex(p => p.id === id);
        if (index !== -1) {
          pets.splice(index, 1);     // Remove pet do array
          savePets(pets);           // Salva nova lista
          renderPets();             // Atualiza visual
          if (editId === id) resetForm(); // Cancela edição se necessário
        }
      }
    }
  });

  renderPets(); // Renderiza os pets ao carregar a página
}

