// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔑 Ganti dengan config projek Firebase awak
const firebaseConfig = {
  apiKey: "AIzaSyBRdNHDe1eic347-in5nPYhTjt12mxYhHk",
  authDomain: "rmt-skbbs-d782f.firebaseapp.com",
  projectId: "rmt-skbbs-d782f",
  storageBucket: "rmt-skbbs-d782f.firebasestorage.app",
  messagingSenderId: "759836577120",
  appId: "1:759836577120:web:07666c7b474d5c42ac6205"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elemen HTML
const tarikhInput = document.getElementById("tarikh");
const namaInput = document.getElementById("nama");
const kelasInput = document.getElementById("kelas");
const hadirBtn = document.getElementById("hadirBtn");
const takHadirBtn = document.getElementById("takHadirBtn");
const senarai = document.getElementById("senarai");

// Simpan kehadiran
async function simpanKehadiran(status) {
  const tarikh = tarikhInput.value;
  const nama = namaInput.value.trim();
  const kelas = kelasInput.value.trim();

  if (!tarikh || !nama || !kelas) {
    alert("Sila isi tarikh, nama dan kelas!");
    return;
  }

  try {
    await addDoc(collection(db, "kehadiran"), {
      tarikh,
      nama,
      kelas,
      status,
      masa: new Date().toISOString()
    });
    alert("✅ Kehadiran berjaya disimpan!");
    paparSenarai();
    namaInput.value = "";
    kelasInput.value = "";
  } catch (e) {
    console.error("❌ Ralat simpan: ", e);
  }
}

// Papar senarai ikut tarikh
async function paparSenarai() {
  senarai.innerHTML = "";
  const tarikh = tarikhInput.value;
  if (!tarikh) return;

  const q = query(collection(db, "kehadiran"), where("tarikh", "==", tarikh));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    senarai.innerHTML = "<li>Tiada rekod kehadiran.</li>";
    return;
  }

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.nama} (${data.kelas}) → ${data.status}`;
    senarai.appendChild(li);
  });
}

// Event
hadirBtn.addEventListener("click", () => simpanKehadiran("Hadir"));
takHadirBtn.addEventListener("click", () => simpanKehadiran("Tak Hadir"));
tarikhInput.addEventListener("change", paparSenarai);
