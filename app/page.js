"use client";

import { useMemo, useState } from "react";

const menus = {
  home: {
    title: "Pilih Fitur Studio",
    subtitle: "Pilih salah satu menu di bawah ini"
  },
  image: {
    title: "ChatGPT Image Generator",
    subtitle: "Mode Hemat Memori / Anti Lag"
  },
  prompt: {
    title: "Buat Prompt Foto",
    subtitle: "Ubah foto referensi menjadi prompt detail."
  },
  face: {
    title: "Face Swap AI",
    subtitle: "Single & Multi Target AI"
  },
  hdr: {
    title: "HDR Foto Enhancer",
    subtitle: "Tingkatkan kejernihan, kontras, & detail foto"
  }
};

export default function Home() {
  const [screen, setScreen] = useState("home");
  const [promptText, setPromptText] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [images, setImages] = useState([]);
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [swapMode, setSwapMode] = useState("single");

  const title = useMemo(() => menus[screen]?.title ?? "ZANE AI Studio", [screen]);

  function go(next) {
    setScreen(next);
    setGenerated("");
    setCopied(false);
  }

  function handleImages(files) {
    const list = Array.from(files).slice(0, 4);
    Promise.all(list.map(fileToDataUrl)).then(setImages);
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function generatePrompt() {
    if (!images.length) return;
    setLoading(true);
    setGenerated("");
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images,
          extra: promptText
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat prompt.");
      setGenerated(data.prompt);
    } catch (err) {
      setGenerated(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function generateImageFromText() {
    if (!imagePrompt.trim()) return;
    setLoading(true);
    setGenerated("");
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: [],
          extra: `Buat prompt fotografi yang siap dipakai untuk generator gambar berdasarkan ide pengguna berikut:\n${imagePrompt}`
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat prompt.");
      setGenerated(data.prompt);
    } catch (err) {
      setGenerated(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function copyPrompt() {
    if (!generated) return;
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (screen === "home") {
    return (
      <main className="shell home">
        <div className="hero">
          <div className="pill">CEPAT &amp; RINGAN</div>
          <h1>Pilih Fitur Studio</h1>
          <p>Pilih salah satu menu di bawah ini</p>
        </div>

        <div className="menu-grid">
          <Feature color="green" icon="◉" eyebrow="CHATGPT IMAGE" title="TEMPEL PROMPT" desc="Buat foto dari prompt." onClick={() => go("image")} />
          <Feature color="cyan" icon="♧" eyebrow="GEMINI VISION" title="PROMPT DARI FOTO" desc="Ubah foto ke prompt." onClick={() => go("prompt")} />
          <Feature color="purple" icon="♙" eyebrow="FACE SWAP AI" title="TUKAR WAJAH" desc="Single & Multi Target AI." onClick={() => go("face")} />
          <Feature color="gold" icon="ϟ" eyebrow="HDR ENHANCER" title="HDR FOTO" desc="Tingkatkan detail foto." onClick={() => go("hdr")} />
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
      <header className="topbar">
        <button className="back" onClick={() => go("home")} aria-label="Kembali">‹</button>
        <h1>{title}</h1>
      </header>

      {screen === "prompt" && (
        <section className="page">
          <div className="info-card cyan-card">
            <div className="mini-icon">AI</div>
            <div>
              <b>Buat Prompt Foto</b>
              <span>Analisis foto dan ubah menjadi prompt fotografi detail</span>
            </div>
          </div>

          <label className="label cyan-text">UNGGAH FOTO REFERENSI</label>
          <div className="upload-big" onClick={() => document.getElementById("prompt-file").click()}>
            {images.length ? (
              <div className="thumb-grid">
                {images.map((src, i) => <img key={i} src={src} alt={`Referensi ${i + 1}`} />)}
              </div>
            ) : (
              <>
                <div className="upload-icon cyan">▧</div>
                <b>Klik untuk Unggah Foto</b>
                <span>Otomatis dikompres agar ringan · maksimal 4 foto</span>
              </>
            )}
            <input id="prompt-file" hidden type="file" accept="image/*" multiple onChange={e => handleImages(e.target.files)} />
          </div>

          <label className="label">Tambahan instruksi <small>(Opsional)</small></label>
          <textarea value={promptText} onChange={e => setPromptText(e.target.value)} placeholder="Contoh: pertahankan wajah, buat bahu sedikit lebih lebar, gaya candid malam hari..." />

          <button className="primary cyan-btn" disabled={!images.length || loading} onClick={generatePrompt}>
            {loading ? "Menganalisis Foto..." : "Generate Prompt Foto"}
          </button>

          <Result text={generated} copied={copied} onCopy={copyPrompt} />
        </section>
      )}

      {screen === "image" && (
        <section className="page">
          <div className="info-card green-card">
            <div className="mini-icon">AI</div>
            <div>
              <b>ChatGPT Image Generator</b>
              <span>Mode Hemat Memori / Anti Lag</span>
            </div>
          </div>

          <label className="label green-text">TEMPEL PROMPT DI SINI</label>
          <textarea className="prompt-box" value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} placeholder="Tempel deskripsi foto di sini..." />
          <div className="counter">0 / 4000 karakter</div>
          <label className="label">Foto Referensi <small>(Opsional)</small></label>

          <div className="four-grid">
            {[0,1,2,3].map(i => (
              <div key={i} className="slot" onClick={() => document.getElementById("image-ref").click()}>
                {images[i] ? <img src={images[i]} alt="" /> : "+"}
              </div>
            ))}
          </div>
          <input id="image-ref" hidden type="file" accept="image/*" multiple onChange={e => handleImages(e.target.files)} />

          <button className="primary green-btn" disabled={!imagePrompt.trim() || loading} onClick={generateImageFromText}>
            {loading ? "Memproses..." : "Generate Foto Sekarang"}
          </button>

          <Result text={generated} copied={copied} onCopy={copyPrompt} />
        </section>
      )}

      {screen === "face" && (
        <section className="page">
          <div className="tabs">
            <button className={swapMode === "single" ? "active purple" : ""} onClick={() => setSwapMode("single")}>Single Target (1 Wajah)</button>
            <button className={swapMode === "multi" ? "active purple" : ""} onClick={() => setSwapMode("multi")}>Multi Target (Banyak Wajah)</button>
          </div>
          <div className="two-col">
            <UploadCard label="1. FOTO WAJAH ANDA" text="Unggah Wajah" />
            <UploadCard label={`2. FOTO TARGET (${swapMode === "single" ? "1 WAJAH" : "BANYAK WAJAH"})`} text="Unggah Target" />
          </div>
          <button className="primary purple-btn" onClick={() => alert("Face Swap membutuhkan provider image-edit/face-swap khusus. UI sudah disiapkan.")}>Tukar Wajah Sekarang</button>
          <div className="notice purple-notice">UI siap. Untuk face swap nyata, sambungkan provider khusus yang mendukung face swap.</div>
        </section>
      )}

      {screen === "hdr" && (
        <section className="page">
          <div className="info-card gold-card">
            <div className="mini-icon">HD</div>
            <div>
              <b>HDR Foto Enhancer</b>
              <span>Tingkatkan kejernihan, kontras, &amp; detail foto</span>
            </div>
          </div>
          <label className="label gold-text">UNGGAH FOTO YANG INGIN DITAJAMKAN</label>
          <UploadCard label="" text="Pilih Foto" />
          <button className="primary gold-btn" onClick={() => alert("HDR enhancement membutuhkan image-edit/enhancement provider. UI sudah disiapkan.")}>Tingkatkan Kualitas HDR</button>
          <div className="notice gold-notice">UI siap. Untuk enhancement HDR nyata, sambungkan provider image editing.</div>
        </section>
      )}
    </main>
  );
}

function Feature({ color, icon, eyebrow, title, desc, onClick }) {
  return (
    <button className={`feature ${color}`} onClick={onClick}>
      <div className="feature-icon">{icon}</div>
      <div className="eyebrow">{eyebrow}</div>
      <div className="feature-title">{title}</div>
      <div className="feature-desc">{desc}</div>
    </button>
  );
}

function UploadCard({ label, text }) {
  return (
    <div>
      {label && <label className="label purple-text">{label}</label>}
      <div className="upload-big compact">
        <div className="upload-icon purple">+</div>
        <b>{text}</b>
        <span>JPG, PNG, WEBP</span>
      </div>
    </div>
  );
}

function Result({ text, copied, onCopy }) {
  if (!text) return null;
  return (
    <div className="result">
      <div className="result-head">
        <b>HASIL PROMPT</b>
        <button onClick={onCopy}>{copied ? "Tersalin ✓" : "Copy Prompt"}</button>
      </div>
      <pre>{text}</pre>
    </div>
  );
}