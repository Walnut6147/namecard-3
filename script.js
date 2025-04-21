//https://script.google.com/macros/s/AKfycbxV7R1bCpxS2j-9UD_F8lx7z296aMMwlXboFmdmqYRvHTKszp-JMsgQSA0U_tAXMfejuQ/exec
const apiUrl = "https://script.google.com/macros/s/AKfycbxV7R1bCpxS2j-9UD_F8lx7z296aMMwlXboFmdmqYRvHTKszp-JMsgQSA0U_tAXMfejuQ/exec"; // 替換為你的 API 網址

const form = document.getElementById("recordForm");
const recordsContainer = document.getElementById("records");

// 讀取 Google Sheets 的記帳紀錄並顯示
async function loadRecords(selectedMonth = null) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        recordsContainer.innerHTML = "";

        let total = 0;

        for (let i = 1; i < data.length; i++) {
            const [date, category, amount, note] = data[i];
            const recordMonth = date.slice(0, 7); // 取得 YYYY-MM

            // 如果有指定月份，才顯示該月資料
            if (selectedMonth && selectedMonth !== recordMonth) continue;

            total += Number(amount);

            const recordElement = document.createElement("div");
            recordElement.classList.add("record");
            recordElement.innerHTML = `
                <p><strong>日期：</strong>${date}</p>
                <p><strong>類別：</strong>${category}</p>
                <p><strong>金額：</strong>${amount}</p>
                <p><strong>備註：</strong>${note}</p>
            `;
            recordsContainer.appendChild(recordElement);
        }

        document.getElementById("monthlyTotal").textContent =
            `該月總支出：${total} 元`;
    } catch (error) {
        console.error("載入紀錄失敗：", error);
    }
}


// 新增記帳資料
form.addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amount = Number(document.getElementById("amount").value);
    const note = document.getElementById("note").value;
  
    const newRecord = {
      action: "add", // 告訴 Apps Script：這是新增行為
      date,
      category,
      amount,
      note
    };
  
    await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(newRecord),
      headers: { "Content-Type": "application/json" }
    });
  
    form.reset();
    alert("記帳成功！");
    setTimeout(loadRecords, 2000);
  });
  const monthFilter = document.getElementById("monthFilter");
monthFilter.addEventListener("change", () => {
    const selectedMonth = monthFilter.value; // 格式為 YYYY-MM
    loadRecords(selectedMonth);
});

  

// **網頁載入時自動載入記帳紀錄**
window.addEventListener("load", loadRecords);
