const API_URL = 'http://localhost:3000';

// Tự động load cả 2 khi mở trang
window.onload = () => {
    LoadData('posts', 'table-body');
    LoadData('comments', 'comment-body');
};

// ==================== HÀM DÙNG CHUNG ====================

// 1. Hàm Load dữ liệu chung cho cả Post và Comment
async function LoadData(endpoint, tableId) {
    try {
        let res = await fetch(`${API_URL}/${endpoint}`);
        let data = await res.json();
        let body = document.getElementById(tableId);
        body.innerHTML = "";
        
        data.forEach(item => {
            const isDeletedClass = item.isDeleted ? "deleted" : "";
            
            // Nội dung hàng tùy thuộc vào là post hay comment
            let rowContent = `<td>${item.id}</td>`;
            if (endpoint === 'posts') {
                rowContent += `<td>${item.title}</td><td>${item.views}</td>`;
            } else {
                rowContent += `<td>${item.text}</td><td>${item.postId}</td>`;
            }

            body.innerHTML += `
            <tr class="${isDeletedClass}">
                ${rowContent}
                <td>
                    <button class="btn-edit" onclick="Edit('${endpoint}', '${item.id}')">Sửa</button>
                    ${!item.isDeleted ? 
                        `<button class="btn-delete" onclick="SoftDelete('${endpoint}', '${item.id}')">Xóa mềm</button>` : 
                        `<span>Đã xóa</span>`
                    }
                </td>
            </tr>`;
        });
    } catch (error) { console.error(`Lỗi Load ${endpoint}:`, error); }
}

// 2. Hàm Lưu chung (Xử lý ID tự tăng Max + 1 và PATCH/POST)
async function SaveGeneric(endpoint) {
    // Xác định lấy dữ liệu từ form nào dựa vào endpoint
    let isPost = (endpoint === 'posts');
    let id = document.getElementById(isPost ? "id_txt" : "cmt_id_txt").value;
    
    // Tạo object dữ liệu tùy theo loại
    let payload = isPost ? {
        title: document.getElementById("title_txt").value,
        views: document.getElementById("views_txt").value
    } : {
        text: document.getElementById("cmt_text_txt").value,
        postId: document.getElementById("cmt_postId_txt").value
    };

    if (id === "") {
        // TỰ TĂNG ID (MAX + 1)
        let resAll = await fetch(`${API_URL}/${endpoint}`);
        let allItems = await resAll.json();
        let maxId = allItems.reduce((max, item) => Math.max(max, parseInt(item.id) || 0), 0);
        
        payload.id = (maxId + 1).toString();
        payload.isDeleted = false;

        await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } else {
        // CẬP NHẬT
        await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    }
    
    // Reset form và load lại
    isPost ? resetFormPost() : resetFormComment();
    LoadData('posts', 'table-body');
    LoadData('comments', 'comment-body');
}

// 3. Hàm Xóa mềm dùng chung
async function SoftDelete(endpoint, id) {
    if (confirm(`Bạn muốn xóa ${endpoint} này?`)) {
        await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isDeleted: true })
        });
        LoadData(endpoint, endpoint === 'posts' ? 'table-body' : 'comment-body');
    }
}

// ==================== CÁC HÀM HỖ TRỢ FORM ====================

// Khi nhấn Sửa, đổ dữ liệu vào form tương ứng
async function Edit(endpoint, id) {
    let res = await fetch(`${API_URL}/${endpoint}/${id}`);
    let item = await res.json();
    
    if (endpoint === 'posts') {
        document.getElementById("id_txt").value = item.id;
        document.getElementById("title_txt").value = item.title;
        document.getElementById("views_txt").value = item.views;
    } else {
        document.getElementById("cmt_id_txt").value = item.id;
        document.getElementById("cmt_text_txt").value = item.text;
        document.getElementById("cmt_postId_txt").value = item.postId;
    }
}

// Hàm làm mới cho Bài viết
function resetFormPost() {
    document.getElementById("id_txt").value = "";
    document.getElementById("title_txt").value = "";
    document.getElementById("views_txt").value = "";
    console.log("Đã làm mới form Post");
}

// Hàm làm mới cho Bình luận
function resetFormComment() {
    document.getElementById("cmt_id_txt").value = "";
    document.getElementById("cmt_text_txt").value = "";
    document.getElementById("cmt_postId_txt").value = "";
    console.log("Đã làm mới form Comment");
}