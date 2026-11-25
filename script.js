// ⚠️ Cú pháp bên dưới chỉ là ví dụ — cập nhật theo gói cước thực tế
const carriers = [
  {
    name: "Viettel",
    smsNumber: "191",
    smsBody: "X2",        // ví dụ gói Super 4G
    ussdCode: "*098#"
  },
  {
    name: "VinaPhone",
    smsNumber: "888",
    smsBody: "D7",        // ví dụ gói D7
    ussdCode: "*111#"
  },
  {
    name: "MobiFone",
    smsNumber: "9084",
    smsBody: "DK D90",    // ví dụ gói D90
    ussdCode: "*090#"
  },
  {
    name: "Vietnamobile",
    smsNumber: "999",
    smsBody: "MO ...",    // điền theo gói thực tế
    ussdCode: null
  }
];

const listEl = document.getElementById("carrier-list");

carriers.forEach((c) => {
  const card = document.createElement("div");
  card.className = "card";

  const h2 = document.createElement("h2");
  h2.textContent = c.name;

  const info = document.createElement("p");
  info.className = "info";
  info.textContent = `Gửi: "${c.smsBody}" → ${c.smsNumber}`;

  const actions = document.createElement("div");
  actions.className = "actions";

  const smsBtn = document.createElement("button");
  smsBtn.className = "btn btn-sms";
  smsBtn.textContent = "Đăng ký qua SMS";
  smsBtn.addEventListener("click", () => openSms(c));

  actions.appendChild(smsBtn);

  if (c.ussdCode) {
    const ussdBtn = document.createElement("button");
    ussdBtn.className = "btn btn-ussd";
    ussdBtn.textContent = "Mở USSD";
    ussdBtn.addEventListener("click", () => openUssd(c.ussdCode));
    actions.appendChild(ussdBtn);
  }

  card.append(h2, info, actions);
  listEl.appendChild(card);
});

function openSms(carrier) {
  // smsto: hoạt động trên Android / iOS để mở app SMS
  const url = `sms:${carrier.smsNumber}?&body=${encodeURIComponent(carrier.smsBody)}`;
  window.location.href = url;
}

function openUssd(code) {
  // tel: mở dialer với mã đã encode (%23 = #)
  window.location.href = `tel:${encodeURIComponent(code)}`;
}
