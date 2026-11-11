import { afterEach, describe, expect, it, vi } from "vitest";
import { askGemini, sanitize } from "../src/lib/server";
import { retrieve } from "../src/lib/retrieval";

afterEach(() => vi.unstubAllGlobals());

describe("máy chủ", () => {
  it("bỏ số điện thoại, email trước khi lưu câu hỏi", () => {
    expect(sanitize("Gọi em 0912 345 678 hoặc a.b@gmail.com nhé")).toBe("Gọi em [số điện thoại] hoặc [email] nhé");
    expect(sanitize("x".repeat(900)).length).toBe(500);
  });

  it("chỉ giữ nguồn có thật trong các đoạn đã đưa cho AI", async () => {
    process.env.GEMINI_API_KEY = "test";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify({ answered: true, answer: "Năm 2027 không được.", sources: ["app-drivers", "bịa-ra"] }) }] } }]
    })));
    vi.stubGlobal("fetch", fetchMock);
    const docs = retrieve("xe ôm công nghệ 2027");
    const r = await askGemini("xe ôm công nghệ 2027 vào Hoàn Kiếm được không", docs, "vi");
    expect(r).toEqual({ answered: true, answer: "Năm 2027 không được.", sources: ["app-drivers"] });
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.contents[0].parts[0].text).toContain("[app-drivers]");
    expect(body.systemInstruction.parts[0].text).toContain("Chỉ dùng thông tin trong phần TÀI LIỆU");
  });
});
