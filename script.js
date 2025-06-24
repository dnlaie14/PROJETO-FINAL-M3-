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
  return petsStr ? JSON.parse(petsStr).map(p => new Pet(p.id, p.name, p.owner, p.date, p.description, p.image, p.type)) : [];
}

function savePets(pets) {
  localStorage.setItem("pets", JSON.stringify(pets));
}

const url = window.location.pathname.split("/").pop();

if (url === "index.html" || url === "") {
  const pets = getPets();
  let editId = null;
}