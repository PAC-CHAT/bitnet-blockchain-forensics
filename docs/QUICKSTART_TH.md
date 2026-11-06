# BitNet Blockchain Forensics — คู่มือเริ่มต้นอย่างรวดเร็ว (ภาษาไทย)

---

## 1. ติดตั้งและรันบนเครื่องตัวเอง

```bash
# 1. โคลนโปรเจกต์
git clone https://github.com/PAC-CHAT/bitnet-blockchain-forensics.git
cd bitnet-blockchain-forensics

# 2. ติดตั้งแพ็กเกจ
npm install

# 3. เปิดเซอร์ฟเวอร์พัฒนา
npm run dev
```

เปิดเบราว์เซอร์ไปที่ **http://localhost:3000**

---

## 2. Build สำหรับ Production

```bash
npm run build
npm run preview   # ทดสอบก่อน Deploy จริง
```

---

## 3. Deploy แบบเร็วที่สุด (แนะนำ)

### วิธีที่ 1: Vercel (ง่ายที่สุด)

```bash
npm i -g vercel
vercel login
vercel --prod
```

### วิธีที่ 2: Docker

```bash
docker compose up -d
# เปิด http://localhost:8080
```

### วิธีที่ 3: Netlify

```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 4. โมดูลหลักที่ใช้งานได้ทันที

| แท็บ | URL Path | ใช้ทำอะไร |
|-----------------------|---------------------------|---------|
| Forensics Overview | `/` | วิเคราะห์ธุรกรรม + คะแนนความเสี่ยง + กราฟ |
| News Scraper | `/ui/news-scraper` | ดึงข่าวบล็อกเชน |
| Sales Dashboard | `/ui/sales-dashboard` | ดูยอดขายและกราฟ |
| Security Review | `/ui/security-review` | ตรวจหา Secrets / HTTP ไม่ปลอดภัย |
| API Docs Generator | `/ui/api-docs-generator` | สร้างเอกสาร API |
| Platform Architecture | `/docs/platform` | ดูโครงสร้างความสามารถของระบบ |

---

## 5. ไฟล์เอกสารสำคัญ

- `DEPLOYMENT_TH.md` → คู่มือ Deploy ฉบับเต็ม
- `USER_GUIDE_TH.md` → คู่มือการใช้งานแต่ละโมดูล
- `README_TH.md` → README ภาษาไทย

---

## 6. ปัญหาที่พบบ่อย

| อาการ | วิธีแก้ |
|-------|--------|
| หน้าว่างหลัง Deploy | ต้องมี rewrite ไปที่ `index.html` |
| 404 เมื่อรีเฟรช `/ui/...` | ตั้งค่า SPA fallback |
| พอร์ต 3000 ถูกใช้แล้ว | `npm run dev -- --port 3001` |

---

**พร้อมใช้งานแล้ว!**  
หากต้องการความช่วยเหลือเพิ่มเติม สามารถเปิด Issue ได้ที่ repository
