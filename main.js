fetch("db.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Không load được db.json");
    }
    return response.json();
  })
  .then(data => {
    const list = document.getElementById("productList");
    list.innerHTML = "";

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <img src="${item.images[0]}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p><strong>Danh mục:</strong> ${item.category.name}</p>
        <p class="price">$${item.price}</p>
      `;

      list.appendChild(div);
    });
  })
  .catch(error => {
    document.getElementById("productList").innerText =
      "Lỗi khi tải dữ liệu!";
    console.error(error);
  });
