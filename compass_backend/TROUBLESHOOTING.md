# 🔧 حل المشاكل الشائعة في الاختبارات

## المشكلة 1: MongoDB Atlas IP Whitelist ❌

### الأعراض:
```
Failed to connect to test database: Could not connect to any servers in your MongoDB Atlas cluster.
One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

### السبب:
عنوان IP الحالي غير مسموح في MongoDB Atlas Network Access.

### الحل:
1. افتح: https://cloud.mongodb.com/
2. سجل دخول إلى حسابك
3. اختر **Cluster** الخاص بك
4. اذهب إلى: **Security** → **Network Access**
5. اضغط **Add IP Address**
6. اختر **Allow Access from Anywhere** (`0.0.0.0/0`)
   - ⚠️ هذا للاختبار فقط، في الإنتاج استخدم IP محدد
7. انتظر **1-2 دقيقة** حتى يتم تطبيق التغييرات
8. أعد تشغيل الاختبارات

### التحقق:
```powershell
cd compass_backend
npm test
```

---

## المشكلة 2: جميع الاختبارات متوقفة ⏸️

### الأعراض:
```
Test Files  3 failed (3)
Tests  23 skipped (23)
```

### السبب:
عندما يفشل `beforeAll` في الاتصال بقاعدة البيانات، يتم تخطي جميع الاختبارات.

### الحل:
- حل المشكلة 1 أولاً (MongoDB Atlas IP Whitelist)
- أو استخدم MongoDB محلي
- أو استخدم MongoDB Memory Server

---

## المشكلة 3: متغيرات البيئة لا تُقرأ 📝

### الأعراض:
?? ??? ??????? `MONGO_URI` ?? ?????????? ??? ??????? ??? ?????? ??? `UPLOADS_DIR`.

### الحل 1: استخدام متغيرات البيئة مباشرة
```powershell
cd compass_backend
$env:MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/compass_test"
npm test
```

### الحل 2: إنشاء ملف .env.test
```bash
# compass_backend/.env.test
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/compass_test
JWT_SECRET=test-secret
```

---

## المشكلة 4: MongoDB Memory Server لا يعمل 💾

### الأعراض:
```
MongoDB Memory Server not available
```

### السبب:
الحزمة `mongodb-memory-server` غير مثبتة أو بها مشكلة.

### الحل:
```bash
cd compass_backend
npm install --save-dev mongodb-memory-server
```

**ملاحظة:** قد تكون هناك مشاكل في التثبيت على Windows. إذا فشل:
- أغلق جميع البرامج التي تستخدم MongoDB
- أعد تشغيل PowerShell كمسؤول
- حاول مرة أخرى

---

## المشكلة 5: Timeout في الاتصال ⏱️

### الأعراض:
```
Hook timed out in 20000ms
```

### السبب:
الاتصال بقاعدة البيانات يستغرق وقتاً طويلاً.

### الحل:
- تأكد من أن MongoDB Atlas متاح
- تحقق من اتصال الإنترنت
- زد timeout في `vitest.config.ts`:
  ```typescript
  hookTimeout: 30000, // 30 ثانية
  ```

---

## ✅ التحقق من أن كل شيء يعمل

### 1. تحقق من الاتصال بقاعدة البيانات:
```powershell
# تحقق من MONGO_URI
echo $env:MONGO_URI

# أو شغل Node.js مباشرة
node -e "console.log(process.env.MONGO_URI)"
```

### 2. شغل اختبار واحد فقط:
```powershell
cd compass_backend
npx vitest run src/test/health.test.ts
```

### 3. شغل جميع الاختبارات:
```powershell
cd compass_backend
npm test
```

---

## 📊 حالة الاختبارات المتوقعة بعد الحل:

```
✓ src/test/health.test.ts (1 test)
✓ src/test/auth.test.ts (8 tests)
✓ src/test/public.test.ts (14 tests)

Test Files  3 passed (3)
Tests  23 passed (23)
```

---

## 🆘 إذا استمرت المشاكل:

1. تحقق من أن MongoDB Atlas يعمل:
   - افتح MongoDB Compass
   - جرب الاتصال بنفس connection string

2. تحقق من أن جميع الحزم مثبتة:
   ```bash
   npm install
   ```

3. امسح الـ cache وأعد التثبيت:
   ```bash
   rm -rf node_modules
   npm install
   ```

4. تحقق من إصدار Node.js:
   ```bash
   node --version
   # يجب أن يكون v18 أو أحدث
   ```
