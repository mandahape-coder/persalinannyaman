// ===== Util: Log helper
const log = (msg) => {
  const li = document.createElement('li');
  li.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  document.getElementById('log').prepend(li);
};

// ===== Camera handling
const video = document.getElementById('camera');
const canvas = document.getElementById('snapshot');
let stream;

document.getElementById('start-camera').addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    log('Kamera dimulai.');
  } catch (e) {
    alert('Izin kamera dibutuhkan.'); console.error(e);
  }
});

document.getElementById('take-photo').addEventListener('click', () => {
  if (!stream) { alert('Mulai kamera dulu.'); return; }
  const w = video.videoWidth, h = video.videoHeight;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, w, h);
  log('Foto diambil untuk analisis.');
  // ---- Dummy deteksi skala nyeri (contoh). Ganti dengan model Anda jika ada.
  const scale = Math.min(10, Math.max(0, Math.round((Math.random() * 10))));
  updatePain(scale);
});

// ===== Pain Scale + Intervensi
const painScaleEl = document.getElementById('pain-scale');
const painEmojiEl = document.getElementById('pain-emoji');
const painNoteEl  = document.getElementById('pain-note');
const intervensi  = document.getElementById('intervensi');

function emojiFor(scale){
  // 0-10
  if (scale <= 1) return '😊';
  if (scale <= 3) return '🙂';
  if (scale <= 5) return '😐';
  if (scale <= 7) return '😣';
  if (scale <= 8) return '😖';
  return '😭';
}

function noteFor(scale){
  if (scale <= 1) return 'Nyeri sangat ringan — observasi rutin.';
  if (scale <= 3) return 'Nyeri ringan — edukasi napas & posisi.';
  if (scale <= 5) return 'Nyeri sedang — mulai intervensi relaksasi.';
  if (scale <= 7) return 'Nyeri sedang-berat — intervensi + dukungan intens.';
  if (scale <= 8) return 'Nyeri berat — intervensi intens & pantau ketat.';
  return 'Nyeri sangat berat — siapkan eskalasi & panggil bidan.';
}

function updatePain(scale){
  painScaleEl.textContent = scale;
  painEmojiEl.textContent = emojiFor(scale);
  painNoteEl.textContent = noteFor(scale);
  log(`Skala nyeri terdeteksi: ${scale}/10`);

  // Munculkan Intervensi saat ada nilai (>=0)
  intervensi.classList.remove('hidden');

  // Auto-play musik relaks jika nyeri >=5 (optional)
  if (scale >= 5) tryPlayMusic();
}

// ===== Musik Klasik (user-provided file) =====
const musik = document.getElementById('musik-klasik');
const btnPlay = document.getElementById('play-music');
const btnStop = document.getElementById('stop-music');
const fileInput = document.getElementById('music-file');

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    musik.src = url;
    log(`File musik dimuat: ${file.name}`);
  }
});

btnPlay.addEventListener('click', () => tryPlayMusic());
btnStop.addEventListener('click', () => { musik.pause(); musik.currentTime = 0; });

async function tryPlayMusic(){
  try {
    if (musik.src) {
      await musik.play();
      log('Musik relaksasi diputar.');
    } else {
      log('Muat file musik klasik terlebih dahulu.');
    }
  } catch (e) {
    console.warn(e);
  }
}

// ===== Emergency Alarm (Web Audio API + Vibrate)
let audioCtx, alarmOsc, alarmGain, alarmInterval;
const alarmEl = document.getElementById('alarm');
const emergencyBtn = document.getElementById('emergency');

emergencyBtn.addEventListener('click', () => {
  startAlarm();
  log('TOMBOL DARURAT ditekan! Panggil bidan.');
  // Getar jika ada
  if (navigator.vibrate) navigator.vibrate([300,100,300,100,300]);
  // Fokus ke layar
  alert('PANGGIL BIDAN! Alarm berbunyi.');
});

function startAlarm(){
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  stopAlarm(); // pastikan bersih

  alarmGain = audioCtx.createGain();
  alarmGain.gain.value = 0.001; // mulai kecil (hindari kejutan)
  alarmGain.connect(audioCtx.destination);

  alarmOsc = audioCtx.createOscillator();
  alarmOsc.type = 'square';
  alarmOsc.frequency.value = 880; // nada tinggi
  alarmOsc.connect(alarmGain);
  alarmOsc.start();

  // Naikkan volume cepat lalu sirene naik-turun
  let up = true;
  alarmInterval = setInterval(() => {
    const now = audioCtx.currentTime;
    const freq = up ? 1200 : 600;
    alarmOsc.frequency.setTargetAtTime(freq, now, 0.05);
    alarmGain.gain.setTargetAtTime(0.35, now, 0.05);
    up = !up;
  }, 400);

  // Auto-stop setelah 30 detik untuk keamanan
  setTimeout(stopAlarm, 30000);
}

function stopAlarm(){
  if (alarmInterval){ clearInterval(alarmInterval); alarmInterval = null; }
  if (alarmOsc){ try{ alarmOsc.stop(); }catch{} alarmOsc.disconnect(); alarmOsc = null; }
  if (alarmGain){ alarmGain.disconnect(); alarmGain = null; }
}

// ===== Accessibility: stop alarm with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') stopAlarm();
});