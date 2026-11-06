# BitNet Blockchain Forensics (React Edition)

**แพลตฟอร์มตรวจสอบข้อมูลบล็อกเชนด้วย AI**

สร้างด้วย **React 19 · TypeScript · Vite 6 · Tailwind CSS 4**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-cyan.svg)](RELEASE_NOTES_v2.0.0.md)

---

## ภาพรวม

BitNet Blockchain Forensics เป็นแพลตฟอร์มเว็บแบบโมดูลาร์ ที่ช่วยให้คุณ:

- วิเคราะห์และ normalize ธุรกรรม
- คำนวณคะแนนความเสี่ยงของที่อยู่
- จัดกลุ่มเอนทิตีและแสดงการไหลของเงินทุน
- ตรวจสอบความปลอดภัยแบบ heuristic อัตโนมัติ
- ดึงข่าวและดูแดชบอร์ดการดำเนินงาน

เวอร์ชัน React นี้เป็นพอร์ตประสิทธิภาพสูงจากสถาปัตยกรรม BitNet b1.58 เดิม (Python/FastAPI)

---

## เริ่มต้นอย่างรวดเร็ว

```bash
git clone https://github.com/PAC-CHAT/bitnet-blockchain-forensics.git
cd bitnet-blockchain-forensics
npm install
npm run dev
```

เปิดเบราว์เซอร์ไปที่ → **http://localhost:3000**

---

## ฟีเจอร์หลัก

| โมดูล | Path | คำอธิบาย |
|----------|-----------------------------|-----------------------------------------------|
| **Forensics Overview** | `/` | Normalize ธุรกรรม, คะแนนความเสี่ยง, กราฟคลัสเตอร์, Sandboxed Executor |
| **News Scraper** | `/ui/news-scraper` | ดึงข่าวบล็อกเชน (CoinDesk, Decrypt ฯลฯ) |
| **Sales Dashboard** | `/ui/sales-dashboard` | เมตริกรายได้และออเดอร์พร้อมกราฟ |
| **Security Review** | `/ui/security-review` | ตรวจจับ HTTP ไม่ปลอดภัย, Secrets, CORS กว้างเกินไป |
| **API Docs Generator** | `/ui/api-docs-generator` | สร้างเอกสาร API แบบ Markdown + ทดสอบสด |
| **Platform Architecture**| `/docs/platform` | สำรวจความสามารถของแพลตฟอร์มแบบ interactive |

---

## เอกสาร

| เอกสาร | คำอธิบาย |
|--------|----------|
| [**DEPLOYMENT_TH.md**](docs/DEPLOYMENT_TH.md) | คู่มือ Deploy ฉบับสมบูรณ์ (Vercel, Netlify, Docker, VPS, CI/CD) |
| [**USER_GUIDE_TH.md**](docs/USER_GUIDE_TH.md) | คู่มือการใช้งานแต่ละโมดูล |
| [RELEASE_NOTES_v2.0.0.md](RELEASE_NOTES_v2.0.0.md) | บันทึกการเปลี่ยนแปลงเวอร์ชัน 2.0.0 |
| [docs/](docs/) | สถาปัตยกรรม, workflow ของ agent, การแก้ปัญหา |

---

## คำสั่งสำหรับพัฒนา

```bash
npm run dev       # เปิด Vite dev server (พอร์ต 3000)
npm run build     # ตรวจสอบ TypeScript + Build สำหรับ Production → dist/
npm run preview   # ดูผลลัพธ์ Production บนเครื่องตัวเอง
npm run lint      # ตรวจสอบ TypeScript เท่านั้น
```

---

## เทคโนโลยีที่ใช้

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **API (ตอนพัฒนา):** Mock middleware ใน Vite

---

## โครงสร้างโปรเจกต์

```
bitnet-blockchain-forensics/
├── src/
│   ├── components/          # โมดูล UI
│   ├── services/            # ตัวช่วยข้อมูลและ API
│   ├── types/               # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── docs/                    # คู่มือและสถาปัตยกรรม
├── examples/
├── notebooks/
├── vite.config.ts           # Vite + API mock plugin
├── package.json
└── ...
```

---

## การ Deploy (ฉบับย่อ)

| แพลตฟอร์ม | คำสั่ง / วิธี |
|-----------------|---------------|
| **Vercel** (แนะนำ) | `vercel --prod` หรือเชื่อม GitHub |
| **Netlify** | `netlify deploy --prod` |
| **Docker** | `docker compose up -d` → พอร์ต 8080 |
| **GitHub Pages**| `npm run deploy` (หลังตั้งค่า) |
| **VPS + Nginx** | Build แล้วคัดลอก `dist/` + ตั้ง SPA rewrite |

ดูรายละเอียดทั้งหมดได้ที่ **[docs/DEPLOYMENT_TH.md](docs/DEPLOYMENT_TH.md)**

---

## สัญญาอนุญาต

Apache License 2.0 — ดูรายละเอียดใน [LICENSE](LICENSE)

---

## ผู้ดูแล

**PAC-CHAT**  
Repository: https://github.com/PAC-CHAT/bitnet-blockchain-forensics
