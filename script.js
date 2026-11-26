/* =========================================================
   DỮ LIỆU GÓI CƯỚC
   ⚠️ Giá/data chỉ mang tính tham khảo, cập nhật theo thực tế
   ========================================================= */
const CARRIERS = {
  viettel:  { name: "Viettel",      accent: "#e11d2e", smsNumber: "191",  ussd: "*098#" },
  vinaphone:{ name: "VinaPhone",    accent: "#1f6feb", smsNumber: "888",  ussd: "*111#" },
  mobifone: { name: "MobiFone",     accent: "#0ea5a4", smsNumber: "9084", ussd: "*090#" },
  vietnamobile: { name: "Vietnamobile", accent: "#f59e0b", smsNumber: "999", ussd: null }
};

const PLANS = [
  /* ---------- VIETTEL ---------- */
  { carrier: "viettel", name: "MI2K",  price: 2000,  data: "50MB",       duration: "1 ngày",  sms: "MI2K" },
  { carrier: "viettel", name: "MI3K",  price: 3000,  data: "100MB",      duration: "1 ngày",  sms: "MI3K" },
  { carrier: "viettel", name: "ST5K",  price: 5000,  data: "200–500MB",  duration: "1 ngày",  sms: "ST5K" },
  { carrier: "viettel", name: "ST5KM", price: 5000,  data: "1GB",        duration: "1 ngày",  sms: "ST5KM" },
  { carrier: "viettel", name: "MI7D",  price: 7000,  data: "700MB",      duration: "1 ngày",  sms: "MI7D" },
  { carrier: "viettel", name: "ST70K", price: 70000, data: "15GB",       duration: "30 ngày", sms: "ST70K" },
  { carrier: "viettel", name: "SD70",  price: 70000, data: "1GB/ngày",   duration: "30 ngày", sms: "SD70" },

  /* ---------- VINAPHONE ---------- */
  { carrier: "vinaphone", name: "TikTok", price: 3000, data: "Data TikTok không giới hạn", duration: "1 ngày", sms: "TIKTOK" },
  { carrier: "vinaphone", name: "Shopee", price: 4000, data: "Data Shopee + voucher",      duration: "1 ngày", sms: "SHOPEE" },
  { carrier: "vinaphone", name: "1GB",    price: 5000, data: "1GB",                        duration: "1 ngày", sms: "1GB" },
  { carrier: "vinaphone", name: "Game",   price: 5000, data: "Data game (LQ, FF...)",      duration: "1 ngày", sms: "GAME" },
  { carrier: "vinaphone", name: "1.2GB",  price: 7000, data: "1.2GB",                      duration: "1 ngày", sms: "1.2GB" },
  { carrier: "vinaphone", name: "BIG200", price: 200000, data: "4GB/ngày (120GB)",         duration: "30 ngày", sms: "BIG200" },

  /* ---------- MOBIFONE ---------- */
  { carrier: "mobifone", name: "D5",   price: 5000, data: "1GB",           duration: "1 ngày",  sms: "DK D5" },
  { carrier: "mobifone", name: "AD5",  price: 5000, data: "1GB",           duration: "1 ngày",  sms: "DK AD5" },
  { carrier: "mobifone", name: "KMD5", price: 5000, data: "2GB (giới hạn)", duration: "1 ngày", sms: "DK KMD5" },
  { carrier: "mobifone", name: "SD",   price: 5000, data: "500MB–1GB + thoại", duration: "1 ngày", sms: "DK SD" },
  { carrier: "mobifone", name: "NA70", price: 70000, data: "10GB",         duration: "30 ngày", sms: "DK NA70" },
  { carrier: "mobifone", name: "MXH80",price: 80000, data: "1GB/ngày + MXH free", duration: "30 ngày", sms: "DK MXH80" },

  /* ---------- VIETNAMOBILE ---------- */
  { carrier: "vietnamobile", name: "4GD4",  price: 4000,  data: "4GB",           duration: "1 ngày",  sms: "4GD4" },
  { carrier: "vietnamobile", name: "4GD6",  price: 6000,  data: "8GB",           duration: "1 ngày",  sms: "4GD6" },
  { carrier: "vietnamobile", name: "MRD",   price: 7000,  data: "1GB Mobi + 1GB VNM", duration: "1 ngày", sms: "MRD" },
  { carrier: "vietnamobile", name: "DU1",   price: 10000, data: "Không giới hạn", duration: "1 ngày",  sms: "DU1" },
  { carrier: "vietnamobile", name: "MAX70", price: 70000, data: "4GB/ngày (120GB)", duration: "30 ngày", sms: "MAX70" },
  { carrier: "vietnamobile", name: "MAX99", price: 99000, data: "6GB/ngày (180GB)", duration: "30 ngày", sms: "MAX99" }
];

/* =========================================================
   STATE
   ========================================================= */
let state = {
  carrier: "all",
  query: ""
};

/* =========================================================
   HELPERS
   ========================================================= */
const formatPrice = (n) =>
  n.toLocaleString("vi-VN") + "đ";

const smsHref = (number, body) =>
  `sms:${number}?&body=${encodeURIComponent(body)}`;

/* =========================================================
   RENDER BỘ LỌC
   ========================================================= */
const filtersEl = document.getElementById("filters");
const planListEl = document.getElementById("plan-list");
const emptyEl = document.getElementById("empty");
const searchEl = document.getElementById("search");

const carrierKeys = ["all", ...Object.keys(CARRIERS)];

carrierKeys.forEach((key) => {
  const chip = document.createElement("button");
  chip.className = "chip" + (key === "all" ? " active" : "");
  chip.textContent = key === "all" ? "Tất cả" : CARRIERS[key].name;
  chip.dataset.carrier = key;
  chip.addEventListener("click", () => {
    state.carrier = key;
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    render();
  });
  filtersEl.appendChild(chip);
});

/* =========================================================
   TÌM KIẾM
   ========================================================= */
searchEl.addEventListener("input", (e) => {
  state.query = e.target.value.trim().toLowerCase();
  render();
});

/* =========================================================
   RENDER DANH SÁCH
   ========================================================= */
function render() {
  // 1. Lọc
  let list = PLANS.filter((p) => {
    const matchCarrier = state.carrier === "all" || p.carrier === state.carrier;
    const matchQuery =
      !state.query ||
      p.name.toLowerCase().includes(state.query) ||
      p.data.toLowerCase().includes(state.query) ||
      CARRIERS[p.carrier].name.toLowerCase().includes(state.query);
    return matchCarrier && matchQuery;
  });

  // 2. Sắp xếp theo giá tăng dần
  list.sort((a, b) => a.price - b.price);

  // 3. Render
  planListEl.innerHTML = "";
  emptyEl.hidden = list.length > 0;

  list.forEach((plan) => {
    const carrier = CARRIERS[plan.carrier];

    const card = document.createElement("article");
    card.className = "plan";
    card.style.setProperty("--accent", carrier.accent);

    card.innerHTML = `
      <div class="plan-head">
        <div class="plan-title">
          <div class="plan-carrier">
            <span class="dot"></span>${carrier.name}
          </div>
          <div class="plan-name">${plan.name}</div>
          <div class="plan-data">${plan.data} · ${plan.duration}</div>
        </div>
        <div class="plan-price">
          <span class="price-num">${formatPrice(plan.price)}</span>
          <span class="price-dur">/${plan.duration}</span>
        </div>
      </div>
      <div class="plan-actions">
        <button class="btn btn-sms" data-action="sms">📩 Đăng ký SMS</button>
        <button class="btn btn-copy" data-action="copy" title="Copy cú pháp">📋</button>
      </div>
    `;

    card.querySelector('[data-action="sms"]').addEventListener("click", () => {
      window.location.href = smsHref(carrier.smsNumber, plan.sms);
    });

    card.querySelector('[data-action="copy"]').addEventListener("click", async (e) => {
      const text = `${plan.sms} → ${carrier.smsNumber}`;
      try {
        await navigator.clipboard.writeText(text);
        const btn = e.currentTarget;
        const old = btn.textContent;
        btn.textContent = "✅";
        setTimeout(() => (btn.textContent = old), 1200);
      } catch {
        alert("Cú pháp: " + text);
      }
    });

    planListEl.appendChild(card);
  });
}

/* Khởi động */
render();
