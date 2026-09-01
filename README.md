# ZANE AI Studio

Web mobile-first yang mengikuti desain screenshot:
- Halaman awal dengan 4 fitur.
- Prompt dari foto: upload sampai 4 foto + instruksi tambahan.
- Tempel prompt: membuat prompt fotografi dari ide teks.
- Face Swap dan HDR: UI disiapkan sebagai menu, tetapi provider khusus diperlukan untuk pemrosesan nyata.

## Jalankan lokal

```bash
npm install
cp .env.example .env.local
# isi OPENAI_API_KEY di .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Deploy ke Vercel

1. Upload project ini ke GitHub.
2. Import repository ke Vercel.
3. Tambahkan Environment Variable:
   - Name: `OPENAI_API_KEY`
   - Value: API key OpenAI milikmu.
4. Deploy.

Jangan pernah memasukkan API key ke file frontend atau meng-commit `.env.local`.

## API

Route `/api/prompt` menggunakan OpenAI Responses API dan model `gpt-5.6-luna` untuk menganalisis input gambar dan menghasilkan prompt teks.


## Versi perbaikan
Project ini memakai Next.js 15.5.24, versi maintenance yang sudah menerima patch keamanan untuk lini 15.5. Model OpenAI dapat diubah melalui `OPENAI_MODEL`; default-nya `gpt-5.6-luna`.
