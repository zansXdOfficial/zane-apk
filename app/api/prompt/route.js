import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY belum dipasang di environment server." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const images = Array.isArray(body.images) ? body.images.slice(0, 4) : [];
    const extra = String(body.extra || "").slice(0, 8000);

    const content = [
      {
        type: "input_text",
        text: `Kamu adalah ahli prompt fotografi realistis.
Tugas: analisis foto referensi yang diberikan lalu buat SATU prompt foto yang sangat detail dan siap dipakai pada image generator.

Jelaskan secara visual: subjek/orang, perkiraan usia tanpa identitas, pose, ekspresi, rambut, pakaian, aksesori, lingkungan, komposisi, framing, perspektif kamera, focal length yang masuk akal, depth of field, pencahayaan, warna, tekstur kulit yang natural, kualitas smartphone/kamera, suasana, dan detail latar.
Jika ada manusia, jangan menebak nama/identitas orang tersebut.
Jangan mengubah ciri visual utama kecuali diminta.
Gunakan bahasa Indonesia yang natural namun istilah fotografi boleh memakai bahasa Inggris.
Jangan memberi penjelasan panjang di luar prompt. Output hanya prompt siap salin.

Instruksi tambahan pengguna:
${extra || "(tidak ada)"}`
      }
    ];

    for (const image of images) {
      if (typeof image === "string" && image.startsWith("data:image/")) {
        content.push({
          type: "input_image",
          image_url: image,
          detail: "high"
        });
      }
    }

    const response = await client.responses.create({
      model: MODEL,
      input: [{ role: "user", content }]
    });

    return Response.json({ prompt: response.output_text || "" });
  } catch (error) {
    console.error("prompt API error:", error);
    return Response.json(
      { error: error?.message || "Terjadi kesalahan saat membuat prompt." },
      { status: 500 }
    );
  }
}