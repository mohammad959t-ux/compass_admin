# سكريبت لتشغيل السيرفر مع VPN
# يتحقق من IP ويشغل السيرفر

Write-Host "🚀 تشغيل السيرفر مع VPN..." -ForegroundColor Cyan
Write-Host ""

# فحص IP الحالي
Write-Host "🔍 فحص IP الحالي..." -ForegroundColor Yellow
try {
    $currentIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -TimeoutSec 5).Content
    Write-Host "📍 IP الحالي: $currentIP" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠️  لا يمكن الحصول على IP - سأتابع التشغيل" -ForegroundColor Yellow
    Write-Host ""
}

# تعيين متغيرات البيئة
$env:MONGO_URI = if ($env:MONGO_URI) { $env:MONGO_URI } else { "mongodb+srv://mohammad95970:Aoo956930@cluster0.bacz36i.mongodb.net/?retryWrites=true&w=majority" }
$env:JWT_SECRET = if ($env:JWT_SECRET) { $env:JWT_SECRET } else { "your-jwt-secret-here" }
$env:NODE_ENV = if ($env:NODE_ENV) { $env:NODE_ENV } else { "development" }
$env:PORT = if ($env:PORT) { $env:PORT } else { "4000" }

Write-Host "⚙️  إعدادات البيئة:" -ForegroundColor Cyan
Write-Host "  MONGO_URI: $($env:MONGO_URI -replace ':[^:@]+@', ':****@')" -ForegroundColor Gray
Write-Host "  NODE_ENV: $env:NODE_ENV" -ForegroundColor Gray
Write-Host "  PORT: $env:PORT" -ForegroundColor Gray
Write-Host ""

# التحقق من الاتصال بقاعدة البيانات
Write-Host "🔄 اختبار الاتصال بـ MongoDB..." -ForegroundColor Yellow
$connectionTest = node test-connection.js 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ الاتصال بـ MongoDB نجح!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 بدء تشغيل السيرفر..." -ForegroundColor Cyan
    Write-Host ""
    
    # تشغيل السيرفر
    npm run dev
} else {
    Write-Host "❌ فشل الاتصال بـ MongoDB!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 الحلول المتاحة:" -ForegroundColor Yellow
    Write-Host "1. تأكد من إضافة IP الحالي ($currentIP) إلى MongoDB Atlas Network Access" -ForegroundColor White
    Write-Host "2. أو استخدم 'Allow Access from Anywhere' (0.0.0.0/0) للاختبار" -ForegroundColor White
    Write-Host "3. افتح: https://cloud.mongodb.com/ → Security → Network Access" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 رابط MongoDB Atlas:" -ForegroundColor Cyan
    Write-Host "https://cloud.mongodb.com/security/network/whitelist" -ForegroundColor White
    Write-Host ""
    
    $continue = Read-Host "هل تريد المتابعة على أي حال؟ (y/n)"
    if ($continue -eq "y" -or $continue -eq "Y") {
        Write-Host ""
        Write-Host "🚀 بدء تشغيل السيرفر (قد يفشل الاتصال بقاعدة البيانات)..." -ForegroundColor Yellow
        Write-Host ""
        npm run dev
    }
}
