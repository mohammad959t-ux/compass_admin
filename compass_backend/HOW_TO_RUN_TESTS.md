# كيفية تشغيل الاختبارات

## إعداد MongoDB Atlas

### الخطوة 1: إضافة IP إلى Whitelist

1. افتح: https://cloud.mongodb.com/
2. اختر Cluster الخاص بك → **Security** → **Network Access**
3. اضغط **Add IP Address**
4. اختر **Allow Access from Anywhere** (`0.0.0.0/0`) للاختبار
   - أو أضف IP الحالي يدوياً إذا كنت تريد الأمان أكثر
5. انتظر 1-2 دقيقة

### الخطوة 2: تشغيل الاختبارات

بعد إضافة IP، شغل الاختبارات:

```powershell
cd compass_backend
npm test
```

أو إذا كنت تستخدم متغيرات البيئة:

```powershell
cd compass_backend
$env:MONGO_URI="mongodb+srv://mohammad95970:Aoo956930@cluster0.bacz36i.mongodb.net/compass_test?retryWrites=true&w=majority"
npm test
```
Uploads are stored under the local `UPLOADS_DIR` (defaults to `uploads`), so no cloud credentials are required for tests.

## الاختبارات المتاحة

- ✅ **Health Endpoint** - 1 اختبار
- ✅ **Auth Endpoints** - 8 اختبارات (login, me, logout)
- ✅ **Public Endpoints** - 14 اختبارات (services, projects, packages, reviews, leads)

**المجموع: 23 اختبار**

## الأوامر المتاحة

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل الاختبارات مع مراقبة التغييرات
npm run test:watch

# تشغيل واجهة الاختبارات التفاعلية
npm run test:ui

# تشغيل الاختبارات مع تقرير التغطية
npm run test:coverage
```

## ملاحظات

- تأكد من أن IP مضاف إلى MongoDB Atlas Network Access
- إذا ظهرت رسالة "IP not whitelisted"، اتبع الخطوات أعلاه
- قد يستغرق تطبيق التغييرات في Atlas 1-2 دقيقة
