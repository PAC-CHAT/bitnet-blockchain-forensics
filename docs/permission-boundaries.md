# เอกสารสิทธิ์และขอบเขตการดำเนินงาน

เอกสารฉบับนี้บันทึกสิทธิ์ที่จำเป็นสำหรับการพัฒนา repository
`PAC-CHAT/bitnet-blockchain-forensics` และขอบเขตของสิทธิ์ในงานพัฒนาปัจจุบัน

## 1. สรุปสถานะสิทธิ์ปัจจุบัน

- Repository ที่ตรวจสอบ: `PAC-CHAT/bitnet-blockchain-forensics`
- Repository ID: `1155956018`
- Branch งาน: `copilot/backend-api-security-boundaries`
- Commit อ้างอิง: `a7439b73e48bb1e9bd34b1d02127039bde4fb75acf`
- ชื่อผู้ใช้ที่ยืนยันในบริบท: `PAC-CHAT`
- สถานะบัญชี: มีสิทธิ์ repository ในระดับอ่านและบริหารจัดการเนื้อหาที่ได้รับอนุญาต
- สถานะ push: **ไม่มีสิทธิ์เขียน branch ในเซสชันนี้**
- ผลที่ได้รับ: GitHub API คืน `You don't have permission to push to PAC-CHAT/bitnet-blockchain-forensics.`
- การสร้าง branch สำเร็จ: `copilot/backend-api-security-boundaries`
- การ commit หรือ push ไฟล์ยังไม่เกิดขึ้น

## 2. สิทธิ์ repository ขั้นต่ำ

สำหรับงานแก้ไขโค้ดและ PR ต้องกำหนดสิทธิ์อย่างน้อยดังนี้:

| สิทธิ์ | จำเป็น | เหตุผล |
|---|---:|---|
| Read repository and metadata | ใช่ | อ่านไฟล์, commit, branch และเปิด/อ้างอิง pull request |
| Write contents | ใช่ | สร้างหรือแก้ไขไฟล์บน branch ที่อนุญาต |
| Create branches | ใช่ | สร้าง branch สำหรับงานอัตโนมัติ |
| Create commit | ใช่ | บันทึกการแก้ไขเป็น commit |
| Read/Write pull requests | ใช่ | เปิดและอัปเดต PR พร้อมสรุปการเปลี่ยนแปลง |
| Read actions and checks | แนะนำ | ตรวจ build, tests และ CI ก่อนสรุปผล |
| Read discussions/issues | ตามความต้องการ | เชื่อม PR กับ issue และอ้างอิงข้อสรุป |

ไม่จำเป็นต้องขอสิทธิ์ admin ของ repository หากใช้ write access บน branch และสิทธิ์ create pull request เท่านั้น

## 3. สิทธิ์ GitHub ในระดับบัญชี

### PAT แบบคลาสสิก

ใช้ Fine-grained PAT จะปลอดภัยกว่าแบบคลาสสิก โดยอย่างน้อยต้องมี:

- Repository: เฉพาะ `PAC-CHAT/bitnet-blockchain-forensics`
- Actions: read-only
- Contents: read and write
- Issues: read and write เฉพาะกรณีต้องอัปเดต issue
- Metadata: read-only
- Pull requests: read and write
- Commit statuses: read-only หรือ read and write ถ้าต้องอัปเดตสถานะ

อย่าเลือกสิทธิ์ `Administration`, `Organization`, `Workflows` หรือสิทธิ์ repository อื่น เว้นแต่จำเป็นจริง

### GitHub App

ถ้าใช้ GitHub App ให้กำหนด Repository permissions:

- Actions: read
- Contents: read and write
- Metadata: read
- Pull requests: read and write
- Commit statuses: read หรือ read and write
- Issues: read and write เมื่อต้องเชื่อม issue กับ PR

และติดตั้งเฉพาะ repository เป้าหมาย

## 4. สิทธิ์ actions และ secrets

งานพัฒนาปัจจุบันไม่ควรใช้ repository secrets สำหรับการแก้ไขโค้ด

สิทธิ์ที่ควรลดเหลือน้อยสุด:

- ไม่ควรใช้ `GITHUB_TOKEN` write permission ใน job ที่ไม่จำเป็น
- workflow สำหรับ build/test ควรใช้ `contents: read`
- PR จาก fork ต้องไม่รับ secrets
- ไม่ควรเพิ่ม personal credential, PAT หรือ cloud token ลง source
- OAuth client secret และ signing secret ต้องเก็บใน secret manager
- artifact upload ต้องชัดเจนว่าไม่มี secret log

ตัวอย่าง permission สำหรับ workflow ทั่วไป:

```yaml
permissions:
  contents: read
```

เมื่อต้องมีการอัปเดต PR หรือ comment ให้กำหนดเฉพาะแยก job ตามหลัก least privilege

## 5. สิทธิ์แยกตาม capability

### 5.1 Backend/API

สิทธิ์ที่จำเป็น:

- เขียนไฟล์โค้ด backend
- เขียน test
- แก้ไข Vite proxy หรือ service configuration
- เพิ่ม lockfile และ dependency manifest
- ตรวจ CI logs

สิทธิ์ที่ไม่จำเป็นตอนนี้:

- สิทธิ์ admin repository
- สิทธิ์ organization
- สิทธิ์จัดการ members หรือ deploy keys
- สิทธิ์เข้าถึง production secrets

### 5.2 Automated testing

สิทธิ์ที่จำเป็น:

- Contents read/write
- Pull request read/write
- Checks read

สิทธิ์ที่ไม่ควรมี:

- Secrets สำหรับ cloud หรือ external systems
- สิทธิ์ลบ branch หรือประวัติ
- สิทธิ์ merge PR โดยอัตโนมัติ

### 5.3 Security review

สิทธิ์ปัจจุบันที่ควรใช้:

- เขียนและแก้โค้ด scanner
- เขียน unit/API tests
- อ่าน CI results
- เปิด/แก้ PR

Scanner นี้เป็น heuristic ระดับ static ไม่ควรได้รับสิทธิ์:

- execute arbitrary code
- ขึ้นเครือข่ายภายนอก
- อ่าน production credentials
- เข้าถึง secrets
- ทำ deployment

### 5.4 News scraping

จนกว่าจะออกแบบ hardening และแยก provider adapter ให้ชัดเจน:

- ไม่ควรเปิด outbound arbitrary URL
- ไม่ควรเพิ่ม network role ให้ API process
- ไม่ควรเก็บคำตอบ scrape ลง credential หรือ PII
- ต้องมี SSRF, DNS rebinding, timeout, redirect, size และ allowlist control

### 5.5 GitHub integration

หากจะเปิดใช้งานภายหลัง ต้องแยกสิทธิ์ provider เป็นรายขอบเขต:

- อ่าน repository metadata
- อ่านหรือเขียนเฉพาะ issue/PR ที่อนุญาต
- รับ/ตรวจ webhook
- OAuth/App credential แยกจาก source
- webhook secret ต้องเก็บใน secret manager
- ห้ามเก็บ PAT ลงไฟล์ `.env`, log หรือ browser bundle
- ใช้ fine-grained GitHub App installation scopes

### 5.6 In-app code edits

ความสามารถนี้ต้องถือเป็น privileged operation:

- patch ไม่ควร apply โดยอัตโนมัติโดยไม่มี approval
- runner ต้องไม่ใช้ไฟล์หรือ process หลัก
- ต้องไม่มี production secret
- network ปิดเป็นค่าเริ่มต้น
- เขียนเฉพาะ path ที่อนุญาต
- ไฟล์ base checkout และ dependency cache ต้องเป็น read-only หรือ ephemeral
- ต้องรองรับ audit trail และ rollback
- ผู้ดูแลต้องอนุมัติก่อนเปิดให้ user submit patch

## 6. สิทธิ์เชิงปฏิบัติการสำหรับงานนี้

งานในรอบนี้ต้องการสิทธิ์ขั้นต่ำดังนี้:

1. อ่าน repository
2. สร้างและเขียน branch
3. สร้าง commit
4. เปิด/แก้ pull request
5. อ่าน CI และ status checks

เหตุผลขอปฏิบัติการ:

- แยก API HTTP จาก Vite mocks
- เพิ่ม automated tests
- แก้ security scanner
- เพิ่มเอกสาร architecture
- แก้ workflow ให้ตรง TypeScript/Node
- จัด boundary สำหรับ capability ที่อันตรายหรือยังไม่ implement

สิทธิ์ที่ไม่มีในรอบนี้:

- Merge และ close PR
- เปลี่ยน branch protection
- เปลี่ยน repository settings
- จัดการ collaborator หรือ deploy key
- เข้าถึง secrets
- deploy ไป production
- เปิดหรือยกเลิก capability ทางการเงินหรือการคุมสิทธิ์

## 7. สิ่งที่ตรวจพบหลังยืนยัน

สร้าง branch สำเร็จ:

```text
copilot/backend-api-security-boundaries
```

Commit base:

```text
a7439b73e48bb1e9bd34b1d02127039bde4fb75acf
```

การ push ล้มเหลวด้วยข้อความ:

```text
You don't have permission to push to PAC-CHAT/bitnet-blockchain-forensics.
```

เนื่องจากไม่มี write permission จึงยังไม่เกิดไฟล์ change, commit หรือ pull request

## 8. วิธีแก้สิทธิ์

### กรณี repository owner/account

ให้เจ้าของ repository ทำอย่างหนึ่งอย่างใด:

1. เพิ่มผู้พัฒนาเป็น `Write` หรือ `Maintain` collaborator
2. ติดตั้ง GitHub App ที่อนุญาต repository นี้
3. ใช้ Fine-grained PAT ของเจ้าของ repository ที่อนุญาต Contents และ Pull requests
4. เปิดใช้งานสิทธิ์สำหรับ Copilot coding agent ที่ใช้ commit/push เป็นครั้งคราว

ไม่ควรให้สิทธิ์ `Admin` เพื่อแก้โค้ดทั่วไป

### การตรวจสิทธิ์ผู้ดูแล

ผู้ดูแลควรยืนยัน:

- Repository settings -> Collaborators and teams
- Repository permissions
- Branch protection rules
- Fine-grained PAT repository access
- GitHub App installation
- Actions workflow permissions
- Organization policy และ environment restrictions

## 9. ข้อกำหนดก่อนใช้งาน production

- ต้องมี authentication และ authorization
- ต้องลด secret exposure
- ต้องเพิ่ม API rate limiting
- ต้องเปิด CORS/CSP แบบมีขอบเขต
- ต้องกำหนด audit log และ retention
- ต้องมี lockfile และ dependency review
- ต้องเปิดใช้ branch protection และ required status checks
- ต้องแยก dev/demo และ production data
- ต้องปิด arbitrary outbound request จนกว่าจะแฮร์ดไนต์
- ต้องมี security review ต่อเนื่อง ไม่ใช้ heuristic เพียงอย่างเดียว

## 10. สิทธิ์ของผู้ดำเนินงานต่อระบบ

ผู้ดำเนินงานได้รับอนุญาตเฉพาะงานดังต่อไปนี้:

- แก้ source บน branch ที่อนุญาต
- เพิ่มไฟล์ที่เกี่ยวกับ architecture/API/tests/docs
- สร้าง commit โดยไม่ลบหรือ rewrite ประวัติ
- เปิด pull request ที่อธิบายการเปลี่ยนแปลง
- รัน build/tests/read-only inspection
- รัน CI ที่ repository ตั้งไว้

ผู้ดำเนินงานไม่มีอำนาจ:

- merge หรือ close PR
- bypass branch protection
- ลบ branch หรือ commit ประวัติ
- เปลี่ยน repository visibility
- เปลี่ยน collaborators หรือ access policy
- เข้าถึง production secrets
- เปิด domain หรือ DNS
- ใช้ GitHub credential เพื่อติดตั้ง integration ที่ยังไม่อนุมัติ
- รันโค้ดจากผู้ใช้โดยไม่แยก sandbox
- ทำเชิงธุรกรรมทางการเงินหรือ chain deployment

## 11. ประกาศความรับผิดชอบ

เอกสารนี้บันทึกสิทธิ์ที่เสนอและสิทธิ์ที่ตรวจพบเท่านั้น ไม่ใช่การยืนยันว่าผู้พัฒนาได้รับสิทธิ์ production หรือเปิดใช้งานระบบจริงแล้ว

การเพิ่มสิทธิ์เป็นหน้าที่ของเจ้าของ repository หรือผู้ดูแลที่ได้รับอนุญาต การปฏิเสธหรือลดยศ/สิทธิ์ใด ๆ ไม่ถือว่าเป็นความผิดหรือผลกระทบทางการเงิน
