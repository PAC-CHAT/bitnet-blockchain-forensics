# BitNet Blockchain Forensics — คู่มือการ Deploy

**เวอร์ชัน:** 2.0.0 (React Edition)  
**เทคโนโลยี:** React 19 · TypeScript · Vite 6 · Tailwind CSS 4  
**สัญญาอนุญาต:** Apache 2.0

---

## สารบัญ

1. [ข้อกำหนดเบื้องต้น](#1-ข้อกำหนดเบื้องต้น)
2. [การพัฒนาบนเครื่องตัวเอง (Local)](#2-การพัฒนาบนเครื่องตัวเอง-local)
3. [การ Build สำหรับ Production](#3-การ-build-สำหรับ-production)
4. [ตัวเลือกการ Deploy](#4-ตัวเลือกการ-deploy)
   - [Vercel (แนะนำ)](#41-vercel-แนะนำ)
   - [Netlify](#42-netlify)
   - [GitHub Pages](#43-github-pages)
   - [Docker](#44-docker)
   - [VPS / โฮสต์เองด้วย Nginx](#45-vps--โฮสต์เองด้วย-nginx)
   - [Railway / Render](#46-railway--render)
5. [ตัวแปรสภาพแวดล้อม (Environment Variables)](#5-ตัวแปรสภาพแวดล้อม-environment-variables)
6. [API Mock กับ Backend จริง](#6-api-mock-กับ-backend-จริง)
7. [โดเมนกำหนดเองและ HTTPS](#7-โดเมนกำหนดเองและ-https)
8. [CI/CD ด้วย GitHub Actions](#8-cicd-ด้วย-github-actions)
9. [แก้ไขปัญหาที่พบบ่อย](#9-แก้ไขปัญหาที่พบบ่อย)
10. [เช็กลิสต์ความปลอดภัย](#10-เช็กลิสต์ความปลอดภัย)

---

## 1. ข้อกำหนดเบื้องต้น

| เครื่องมือ | เวอร์ชันขั้นต่ำ | หมายเหตุ |
|------------|-----------------|----------|
| Node.js    | 18.x หรือ 20.x LTS | แนะนำใช้ 20.x |
| npm        | 9 ขึ้นไป        | หรือใช้ pnpm / yarn ก็ได้ |
| Git        | 2.30 ขึ้นไป     | |

```bash
node -v   # ควรได้ค่า >= 18
npm -v
```

---

## 2. การพัฒนาบนเครื่องตัวเอง (Local)

```bash
# โคลนโปรเจกต์
git clone https://github.com/PAC-CHAT/bitnet-blockchain-forensics.git
cd bitnet-blockchain-forensics

# ติดตั้ง dependencies
npm install

# เปิดเซิร์ฟเวอร์สำหรับพัฒนา (http://localhost:3000)
npm run dev
```

เซิร์ฟเวอร์ Vite จะมี **API Mock Middleware** อยู่ภายใน (`vite.config.ts`) ซึ่งจำลอง endpoint ดังนี้:

| Endpoint                  | Method | คำอธิบาย                     |
|---------------------------|--------|------------------------------|
| `/health`                 | GET    | ตรวจสอบสถานะระบบ             |
| `/api/sales/metrics`      | GET    | ข้อมูลแดชบอร์ดยอดขาย         |
| `/api/news/scrape`        | GET    | จำลองการ scrape ข่าว         |
| `/api/security/review`    | POST   | ตรวจสอบความปลอดภัยแบบ heuristic |
| `/api/docs/markdown`      | GET    | เอกสาร API แบบ Markdown      |

---

## 3. การ Build สำหรับ Production

```bash
# ตรวจสอบ TypeScript + Build
npm run build

# ดูผลลัพธ์ Production บนเครื่องตัวเอง
npm run preview
```

ไฟล์ที่พร้อมใช้งานจะอยู่ในโฟลเดอร์ `dist/`

---

## 4. ตัวเลือกการ Deploy

### 4.1 Vercel (แนะนำ)

Vercel เป็นตัวเลือกที่ง่ายและเสถียรที่สุดสำหรับแอป Vite + React

**วิธีใช้ CLI:**

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# เข้าสู่ระบบและ Deploy
vercel

# Deploy ขึ้น Production
vercel --prod
```

**วิธีเชื่อมกับ GitHub (แนะนำสำหรับการ Deploy อัตโนมัติ):**

1. เข้า [vercel.com](https://vercel.com) → New Project
2. Import repository `PAC-CHAT/bitnet-blockchain-forensics`
3. Framework Preset: เลือก **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. กด **Deploy**

**ไฟล์ `vercel.json` (วางที่ root ของโปรเจกต์):**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> ไฟล์นี้จำเป็นเพื่อให้ Client-side Routing ทำงานได้กับ path อย่าง `/ui/news-scraper`

---

### 4.2 Netlify

```bash
# ติดตั้ง Netlify CLI
npm i -g netlify-cli

netlify login
netlify init
netlify deploy --prod
```

**ไฟล์ `netlify.toml`:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 4.3 GitHub Pages

1. ติดตั้ง `gh-pages`:

```bash
npm install --save-dev gh-pages
```

2. เพิ่มใน `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://PAC-CHAT.github.io/bitnet-blockchain-forensics"
}
```

3. แก้ `vite.config.ts`:

```ts
export default defineConfig({
  base: '/bitnet-blockchain-forensics/',   // สำคัญมากสำหรับ GitHub Pages
  // ... คอนฟิกอื่น ๆ
});
```

4. Deploy:

```bash
npm run deploy
```

---

### 4.4 Docker

**Dockerfile** (แบบ Multi-stage สำหรับ Production):

```dockerfile
# ขั้น Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ขั้น Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**ไฟล์ `nginx.conf`:**

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # สำคัญสำหรับ SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache ไฟล์ static
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**สั่ง Build และรัน:**

```bash
docker build -t bitnet-forensics .
docker run -d -p 8080:80 --name bitnet bitnet-forensics
```

เปิดเบราว์เซอร์ไปที่ → http://localhost:8080

**ไฟล์ `docker-compose.yml`:**

```yaml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

---

### 4.5 VPS / โฮสต์เองด้วย Nginx

```bash
# บนเซิร์ฟเวอร์
git clone https://github.com/PAC-CHAT/bitnet-blockchain-forensics.git
cd bitnet-blockchain-forensics
npm ci
npm run build

# คัดลอกไฟล์ไปยัง web root
sudo cp -r dist/* /var/www/bitnet/
```

**คอนฟิก Nginx (`/etc/nginx/sites-available/bitnet`):**

```nginx
server {
    listen 80;
    server_name forensics.yourdomain.com;

    root /var/www/bitnet;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/bitnet /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

### 4.6 Railway / Render

**Railway:**
1. New Project → Deploy from GitHub
2. เลือก repository
3. Build Command: `npm run build`
4. Start Command: `npx serve -s dist -l $PORT`

**Render:**
1. New → Static Site
2. เชื่อม repository
3. Build Command: `npm run build`
4. Publish Directory: `dist`

---

## 5. ตัวแปรสภาพแวดล้อม (Environment Variables)

ปัจจุบัน React Edition ใช้ **API Mock** เท่านั้น  
เมื่อเชื่อมต่อ Backend จริงในอนาคต ให้สร้างไฟล์ `.env`:

```bash
# .env.example
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_TITLE=BitNet Blockchain Forensics
VITE_ENABLE_MOCK=false
```

เรียกใช้ในโค้ด:

```ts
const apiBase = import.meta.env.VITE_API_BASE_URL;
```

> หมายเหตุ: มีเฉพาะตัวแปรที่ขึ้นต้นด้วย `VITE_` เท่านั้นที่จะถูกส่งไปยังฝั่ง Client

---

## 6. API Mock กับ Backend จริง

| โหมด              | วิธีการทำงาน                          | ใช้เมื่อไร          |
|-------------------|---------------------------------------|---------------------|
| **Mock (ปัจจุบัน)** | Middleware ใน `vite.config.ts`       | พัฒนาและสาธิต       |
| **Backend จริง**  | เปลี่ยนไปชี้ไปยัง FastAPI / Node API | การใช้งานจริง       |

วิธีเปลี่ยนไปใช้ Backend จริง:

1. ปิดหรือลบ `apiMockPlugin()` ใน `vite.config.ts`
2. ปรับ `src/services/forensics.ts` ให้ชี้ไปยัง API จริง
3. ตั้งค่า CORS ให้ถูกต้องบน Backend

---

## 7. โดเมนกำหนดเองและ HTTPS

- **Vercel / Netlify**: เพิ่มโดเมนใน Dashboard → ได้ HTTPS อัตโนมัติจาก Let's Encrypt
- **โฮสต์เอง**: ใช้ Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d forensics.yourdomain.com
```

---

## 8. CI/CD ด้วย GitHub Actions

สร้างไฟล์ `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install & Build
        run: |
          npm ci
          npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 9. แก้ไขปัญหาที่พบบ่อย

| ปัญหา                          | วิธีแก้ |
|--------------------------------|--------|
| หน้าว่างหลัง Deploy            | ตรวจสอบค่า `base` ใน `vite.config.ts` และกฎ rewrite ของ SPA |
| 404 เมื่อรีเฟรชหน้า `/ui/...`  | เพิ่ม rewrite ไปที่ `index.html` (ดูคอนฟิก Vercel/Netlify/Nginx) |
| API Mock ไม่ทำงานใน Production | Mock ทำงานเฉพาะตอน `vite dev` เท่านั้น ต้องใช้ Backend จริงหรือ mock แบบ static |
| Error TypeScript ตอน Build     | รัน `npm run lint` บนเครื่องตัวเองก่อน |
| พอร์ตถูกใช้งานแล้ว             | ใช้คำสั่ง `npm run dev -- --port 3001` |

---

## 10. เช็กลิสต์ความปลอดภัย

- [ ] ไม่มี Secrets ถูก commit ลงในซอร์สโค้ด
- [ ] บังคับใช้ HTTPS ใน Production
- [ ] จำกัด CORS ให้อนุญาตเฉพาะ origin ที่เชื่อถือได้
- [ ] ตั้งค่า Content-Security-Policy headers
- [ ] อัปเดต dependencies เป็นประจำ (`npm audit`)
- [ ] Sandboxed Executor มีการ redacted path และ token แล้ว (มีอยู่ในระบบ)

---

## สรุปคำสั่งเริ่มต้นอย่างรวดเร็ว

```bash
git clone https://github.com/PAC-CHAT/bitnet-blockchain-forensics.git
cd bitnet-blockchain-forensics
npm install
npm run dev          # → http://localhost:3000
npm run build        # → dist/
vercel --prod        # หรือ netlify deploy --prod / docker build ...
```

---

**ผู้ดูแล:** PAC-CHAT  
**Repository:** https://github.com/PAC-CHAT/bitnet-blockchain-forensics  
**สัญญาอนุญาต:** Apache 2.0
