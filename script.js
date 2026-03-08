let explosionIcon = "💗";
let isGifting = false;
let giftInterval = null;
let isMessaging = false;
let messageInterval = null;

let messages = [
  "Anh yêu em",
  "I love you",
  "Em là duy nhất",
  "Thương em",
  "Always with you",
];

let customImages = [];

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("msgs")) {
  try {
    const rawMsgs = urlParams.get("msgs");
    let msgsParam;
    try {
      msgsParam = decodeURIComponent(atob(rawMsgs));
    } catch (e) {
      msgsParam = rawMsgs;
    }

    if (msgsParam.trim() !== "") {
      messages = msgsParam
        .split("|")
        .map((msg) => msg.trim())
        .filter((msg) => msg !== "");
    }
  } catch (e) {
    console.error("Invalid string in msgs param", e);
  }
}
if (urlParams.has("imgs")) {
  try {
    const rawImgs = urlParams.get("imgs");
    let imgsParam;
    try {
      // Hỗ trợ link cũ dùng Base64
      imgsParam = decodeURIComponent(atob(rawImgs));
    } catch (e) {
      // Hỗ trợ link mới dùng trực tiếp URL ảnh máy chủ
      imgsParam = rawImgs;
    }

    if (imgsParam.trim() !== "") {
      customImages = imgsParam.split("||");
    }
  } catch (e) {
    console.error("Invalid string in imgs param", e);
  }
}

const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const giftBtn = document.getElementById("giftBtn");
const messageBtn = document.getElementById("messageBtn");
const menuTrigger = document.getElementById("menuTrigger");
const menuOptions = document.getElementById("menuOptions");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const pinModal = document.getElementById("pinModal");
const closePinModalBtn = document.getElementById("closePinModal");
const pinInputs = document.querySelectorAll(".pin-box");
const pinError = document.getElementById("pinError");
const messageInput = document.getElementById("messageInput");
const saveIconBtn = document.getElementById("saveIcon");
const closeModalBtn = document.getElementById("closeModal");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const shortenExternalBtn = document.getElementById("shortenExternalBtn");
const popSound = document.getElementById("popSound");
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
let tempCustomImages = [];

const IMGBB_API_KEY = "8fda56be923a93c5718efb7cbb017ac8";

imageUpload.addEventListener("change", async (e) => {
  const files = e.target.files;
  tempCustomImages = [];
  imagePreview.innerHTML = '<p style="font-size: 12px; color: #f672b0;">Đang tải ảnh lên máy chủ...</p>';

  if (files.length > 2) {
    showToast("Bạn chỉ có thể chọn tối đa 2 ảnh.");
  }

  const filesToProcess = Array.from(files).slice(0, 2);

  for (const file of filesToProcess) {
    try {
      // Chuẩn bị dữ liệu gửi lên ImgBB
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        const imageUrl = result.data.url;
        tempCustomImages.push(imageUrl);

        // Cập nhật preview khi có từng ảnh thành công
        if (tempCustomImages.length === 1) imagePreview.innerHTML = "";
        const previewImg = document.createElement("img");
        previewImg.src = imageUrl;
        imagePreview.appendChild(previewImg);
      } else {
        showToast("Lỗi khi tải ảnh lên máy chủ.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Không thể kết nối với máy chủ lưu trữ ảnh.");
    }
  }

  if (tempCustomImages.length === 0) {
    imagePreview.innerHTML = "";
  }
});

const introOverlay = document.getElementById("introOverlay");
const mainContent = document.getElementById("mainContent");

function playPopSound() {
  if (popSound) {
    popSound.currentTime = 0;
    popSound.play().catch((err) => console.log("Sound play blocked"));
  }
}

function showToast(message) {
  let toast = document.querySelector(".toast-notification");
  if (toast) toast.remove();

  toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 1500);
}

function startExperience() {
  playPopSound();
  introOverlay.classList.add("fade-out");
  mainContent.classList.remove("hidden");
  document.body.classList.remove("container");

  bgMusic
    .play()
    .then(() => {
      musicBtn.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';
    })
    .catch((err) => console.log("Music play blocked"));

  setTimeout(() => {
    introOverlay.remove();
  }, 1000);
}

introOverlay.addEventListener("click", startExperience);
introOverlay.addEventListener("touchstart", (e) => {
  startExperience();
  if (e.cancelable) e.preventDefault();
});

function autoPlayMusic() {
  if (bgMusic.paused) {
    bgMusic
      .play()
      .then(() => {
        musicBtn.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';
      })
      .catch((err) => {
        console.log("Browser blocked autoplay. Waiting for user interaction.");
      });
  }
}

function toggleMenu(e) {
  e.stopPropagation();
  playPopSound();
  menuOptions.classList.toggle("active");
  autoPlayMusic();
}

menuTrigger.addEventListener("click", toggleMenu);
menuTrigger.addEventListener("touchstart", (e) => {
  toggleMenu(e);
  if (e.cancelable) e.preventDefault();
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".menu-container")) {
    menuOptions.classList.remove("active");
  }
});

function toggleMusic(e) {
  e.stopPropagation();
  playPopSound();
  if (bgMusic.paused) {
    bgMusic
      .play()
      .catch((err) => console.log("Music play blocked by browser."));
    musicBtn.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';
  } else {
    bgMusic.pause();
    musicBtn.innerHTML = '<i class="fa-regular fa-circle-play"></i>';
  }
}

musicBtn.addEventListener("click", toggleMusic);
musicBtn.addEventListener("touchstart", (e) => {
  toggleMusic(e);
  if (e.cancelable) e.preventDefault();
});

function toggleFallingImages(e) {
  e.stopPropagation();
  playPopSound();
  isGifting = !isGifting;

  if (isGifting) {
    giftBtn.classList.add("active");
    createFallingImage();
    giftInterval = setInterval(createFallingImage, 1000);
  } else {
    giftBtn.classList.remove("active");
    clearInterval(giftInterval);
  }

  menuOptions.classList.remove("active");
}

function createFallingImage() {
  if (!isGifting) return;

  const img = document.createElement("img");
  if (customImages.length > 0) {
    img.src = customImages[Math.floor(Math.random() * customImages.length)];
  } else {
    const randomNum = Math.floor(Math.random() * 20) + 1;
    img.src = `hot-girl.jpg`;
  }
  img.className = "falling-image";

  const width = window.innerWidth;
  const size = width < 600 ? Math.random() * 40 + 50 : Math.random() * 60 + 60;
  const startX = Math.random() * (width - size);
  const duration = Math.random() * 4 + 4;

  img.style.left = startX + "px";
  img.style.width = size + "px";
  img.style.height = "auto";
  img.style.animationDuration = duration + "s";

  document.body.appendChild(img);

  setTimeout(() => {
    img.remove();
  }, duration * 1000);
}

giftBtn.addEventListener("click", toggleFallingImages);
giftBtn.addEventListener("touchstart", (e) => {
  toggleFallingImages(e);
  if (e.cancelable) e.preventDefault();
});

function toggleFallingMessages(e) {
  e.stopPropagation();
  playPopSound();
  isMessaging = !isMessaging;

  if (isMessaging) {
    messageBtn.classList.add("active");
    createFallingMessage();
    messageInterval = setInterval(createFallingMessage, 1500);
  } else {
    messageBtn.classList.remove("active");
    clearInterval(messageInterval);
  }

  menuOptions.classList.remove("active");
}

function createFallingMessage() {
  if (!isMessaging) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = "falling-message";
  msgDiv.innerText = messages[Math.floor(Math.random() * messages.length)];

  // Cute color palette
  const colors = [
    { text: "#ff69b4", border: "#ffb6c1" }, // Pink
    { text: "#9370db", border: "#e6e6fa" }, // Purple
    { text: "#40e0d0", border: "#afeeee" }, // Turquoise
    { text: "#ff8c00", border: "#ffe4b5" }, // Orange
    { text: "#20b2aa", border: "#e0ffff" }, // Light Sea Green
    { text: "#ff1493", border: "#ffc0cb" }, // Deep Pink
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const width = window.innerWidth;
  const padding = 20;
  const startX = Math.random() * (width - 180 - padding * 2) + padding;
  const duration = Math.random() * 5 + 5; // 5s to 10s
  const fontSize =
    width < 600 ? Math.random() * 4 + 14 : Math.random() * 6 + 16;

  msgDiv.style.left = Math.max(padding, startX) + "px";
  msgDiv.style.fontSize = fontSize + "px";
  msgDiv.style.color = randomColor.text;
  msgDiv.style.borderColor = randomColor.border;
  msgDiv.style.animationDuration = duration + "s";

  document.body.appendChild(msgDiv);

  setTimeout(() => {
    msgDiv.remove();
  }, duration * 1000);
}

messageBtn.addEventListener("click", toggleFallingMessages);
messageBtn.addEventListener("touchstart", (e) => {
  toggleFallingMessages(e);
  if (e.cancelable) e.preventDefault();
});

function openPinModal(e) {
  e.stopPropagation();
  playPopSound();
  pinModal.classList.add("active");
  pinInputs.forEach((input) => (input.value = ""));
  pinError.style.display = "none";
  menuOptions.classList.remove("active");
  setTimeout(() => pinInputs[0].focus(), 100);
}

settingsBtn.addEventListener("click", openPinModal);
settingsBtn.addEventListener("touchstart", (e) => {
  openPinModal(e);
  if (e.cancelable) e.preventDefault();
});

closePinModalBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  playPopSound();
  pinModal.classList.remove("active");
});

pinInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    if (e.target.value.length === 1) {
      if (index < pinInputs.length - 1) {
        pinInputs[index + 1].focus();
      } else {
        checkPin();
      }
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      pinInputs[index - 1].focus();
    }
  });
});
function updateLiveLink() {
  const currentUrl = window.location.href.split("?")[0];
  const currentMessages = messageInput.value
    .split(",")
    .map((msg) => msg.trim())
    .filter((msg) => msg !== "");

  const msgsParam = encodeURIComponent(currentMessages.join("|"));
  let newUrl = `${currentUrl}?msgs=${msgsParam}`;

  if (tempCustomImages.length > 0) {
    const imgsParam = encodeURIComponent(tempCustomImages.join("||"));
    newUrl += `&imgs=${imgsParam}`;
  } else if (customImages.length > 0) {
    const imgsParam = encodeURIComponent(customImages.join("||"));
    newUrl += `&imgs=${imgsParam}`;
  }

  const urlDisplay = document.getElementById("urlDisplay");
  if (urlDisplay) urlDisplay.value = newUrl;
  return newUrl;
}

messageInput.addEventListener("input", updateLiveLink);


function checkPin() {
  const enteredPin = Array.from(pinInputs)
    .map((i) => i.value)
    .join("");
  if (enteredPin === "0803") {
    pinModal.classList.remove("active");
    settingsModal.classList.add("active");
    messageInput.value = messages.join(", ");
    updateLiveLink();
  } else {
    pinError.style.display = "block";
    pinInputs.forEach((input) => {
      input.value = "";
      input.style.borderColor = "red";
    });
    setTimeout(() => {
      pinInputs.forEach(
        (input) => (input.style.borderColor = "rgba(255, 255, 255, 0.2)"),
      );
      pinInputs[0].focus();
    }, 1000);
  }
}

const xClosePin = document.getElementById("xClosePin");
const xCloseSettings = document.getElementById("xCloseSettings");

if (xClosePin) {
  xClosePin.addEventListener("click", (e) => {
    e.stopPropagation();
    playPopSound();
    pinModal.classList.remove("active");
  });
}

if (xCloseSettings) {
  xCloseSettings.addEventListener("click", (e) => {
    e.stopPropagation();
    playPopSound();
    settingsModal.classList.remove("active");
  });
}

function program(delay = 200) {
  (function () {
    const _b = (s) => decodeURIComponent(escape(atob(s)));
    const _d = [
      "QuG6o24gcXV54buBbiB0aHXhu5ljIHbhu4IgRHIuR2lmdGVy",
      "VGlrdG9rOiBodHRwczovL3d3dy50aWt0b2suY29tL0Bkci5naWZ0ZXIzMDY=",
      "R2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vRHJHaWZ0ZXI=",
    ];

    setTimeout(() => {
      _d.forEach((x) => console.log(_b(x)));
    }, delay);
  })();
}

closeModalBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  playPopSound();
  settingsModal.classList.remove("active");
});

saveIconBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  playPopSound();
  if (messageInput.value.trim() !== "") {
    messages = messageInput.value
      .split(",")
      .map((msg) => msg.trim())
      .filter((msg) => msg !== "");
  }
  if (tempCustomImages.length > 0) {
    customImages = [...tempCustomImages];
  } else if (imageUpload.files.length === 0 && customImages.length === 0) {
    customImages = [];
  }
  // Vẫn giữ lại việc đóng modal khi nhấn Lưu để hoàn tất quá trình cài đặt
  settingsModal.classList.remove("active");
});

copyLinkBtn.addEventListener("click", async (e) => {
  e.stopPropagation();
  playPopSound();

  const urlDisplay = document.getElementById("urlDisplay");
  const longUrl = urlDisplay.value;

  const originalIcon = copyLinkBtn.innerHTML;
  copyLinkBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
  copyLinkBtn.disabled = true;

  const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";

  // Hàm rút gọn link
  const getShortUrl = async (url) => {
    if (isLocal) return url;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    try {
      const resp = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(
          "https://is.gd/create.php?format=simple&url=" + encodeURIComponent(url)
        )}`, { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      if (resp.ok) {
        const result = await resp.text();
        if (result.startsWith("http")) return result;
      }
    } catch (err) {
      console.warn("Shortening failed", err);
    }
    return url;
  };

  const finalUrl = await getShortUrl(longUrl);
  urlDisplay.value = finalUrl;

  const doCopy = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) { }
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let success = false;
    try {
      success = document.execCommand("copy");
    } catch (err) { }
    document.body.removeChild(textArea);
    return success;
  };

  const copySuccess = await doCopy(finalUrl);
  if (copySuccess) {
    showToast("Đã copy link thành công!");
  } else {
    window.prompt("Hãy copy link của bạn:", finalUrl);
  }

  copyLinkBtn.innerHTML = originalIcon;
  copyLinkBtn.disabled = false;
});

shortenExternalBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  playPopSound();
  window.open("https://by.com.vn/", "_blank");
});

shortenExternalBtn.addEventListener("touchstart", (e) => {
  e.stopPropagation();
  playPopSound();
  window.open("https://by.com.vn/", "_blank");
  if (e.cancelable) e.preventDefault();
});

document.querySelectorAll(".modal-content").forEach((content) => {
  content.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

document.addEventListener("click", (e) => {
  autoPlayMusic();
  playPopSound();

  if (e.target.closest(".menu-container") || e.target.closest(".modal-content"))
    return;

  // Nếu đang mở modal thì chặn click ra ngoài để tạo tim
  if (settingsModal.classList.contains("active") || pinModal.classList.contains("active")) return;

  createHearts(e.clientX, e.clientY);
});

document.addEventListener("touchstart", (e) => {
  autoPlayMusic();
  playPopSound();

  if (e.target.closest(".menu-container") || e.target.closest(".modal-content"))
    return;

  // Nếu đang mở modal thì chặn touch ra ngoài
  if (settingsModal.classList.contains("active") || pinModal.classList.contains("active")) return;

  createHearts(e.touches[0].clientX, e.touches[0].clientY);
});

function createHearts(x, y) {
  const numHearts = 15;
  const icons = Array.from(explosionIcon).filter((char) => char.trim() !== "");

  for (let i = 0; i < numHearts; i++) {
    const heart = document.createElement("div");
    heart.innerHTML = icons[Math.floor(Math.random() * icons.length)] || "💗";
    heart.className = "heart";

    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 150;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    heart.style.setProperty("--x", dx);
    heart.style.setProperty("--y", dy);
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    heart.style.fontSize = Math.random() * 20 + 10 + "px";
    heart.style.setProperty("--r", Math.random() * 360 - 180 + "deg");

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1000);
  }
}

program();
