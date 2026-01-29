let products = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 10;

/* ===== LOAD DATA ===== */
fetch("db.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    filteredProducts = [...products];
    renderTable();
    renderPagination();
  });

/* ===== RENDER TABLE ===== */
function renderTable() {
  const tbody = document.getElementById("productList");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredProducts.slice(start, end);

  pageData.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${start + index + 1}</td>

      <td class="text-center">
        <img
          src="${item.images[0]}"
          width="80"
          height="60"
          data-bs-toggle="tooltip"
          title="${item.description}"
        >
      </td>

      <td data-bs-toggle="tooltip" title="${item.description}">
        ${item.title}
      </td>

      <td>${item.category.name}</td>
      <td class="text-danger fw-bold">$${item.price}</td>

      <td>
        <button class="btn btn-sm btn-warning me-1"
          onclick="editProduct(${item.id})">
          Sửa
        </button>

        <button class="btn btn-sm btn-danger"
          onclick="deleteProduct(${item.id})">
          Xóa
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach(el => new bootstrap.Tooltip(el));
}

/* ===== PAGINATION ===== */
function renderPagination() {
  const totalPage = Math.ceil(filteredProducts.length / pageSize);
  const ul = document.getElementById("pagination");
  ul.innerHTML = "";

  for (let i = 1; i <= totalPage; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<button class="page-link">${i}</button>`;
    li.onclick = () => {
      currentPage = i;
      renderTable();
    };
    ul.appendChild(li);
  }
}

/* ===== SEARCH ===== */
function searchByName(keyword) {
  currentPage = 1;
  filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(keyword.toLowerCase())
  );
  renderTable();
  renderPagination();
}

/* ===== SORT ===== */
function sortData(type) {
  if (type === "name-asc")
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));

  if (type === "name-desc")
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title));

  if (type === "price-asc")
    filteredProducts.sort((a, b) => a.price - b.price);

  if (type === "price-desc")
    filteredProducts.sort((a, b) => b.price - a.price);

  renderTable();
}

/* ===== PAGE SIZE ===== */
function changePageSize(size) {
  pageSize = Number(size);
  currentPage = 1;
  renderTable();
  renderPagination();
}

/* ===== EDIT ===== */
function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const newName = prompt("Tên sản phẩm:", p.title);
  const newPrice = prompt("Giá:", p.price);

  if (newName !== null && newPrice !== null) {
    p.title = newName;
    p.price = Number(newPrice);
    filteredProducts = [...products];
    renderTable();
  }
}

/* ===== DELETE ===== */
function deleteProduct(id) {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

  products = products.filter(p => p.id !== id);
  filteredProducts = [...products];
  renderTable();
  renderPagination();
}
