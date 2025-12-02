# Panduan Setup EmailJS untuk Form Order

Untuk mengaktifkan fitur pengiriman email pada form order, ikuti langkah-langkah berikut:

## 1. Buat Akun EmailJS

1. Kunjungi [https://www.emailjs.com/](https://www.emailjs.com/)
2. Klik "Sign Up" dan buat akun gratis
3. Verifikasi email Anda

## 2. Setup Email Service

1. Login ke dashboard EmailJS
2. Klik "Add New Service"
3. Pilih provider email Anda (Gmail, Outlook, dll)
4. Ikuti instruksi untuk menghubungkan email Anda
5. Catat **Service ID** yang diberikan

## 3. Buat Email Template

1. Di dashboard, klik "Email Templates"
2. Klik "Create New Template"
3. Gunakan template berikut:

```
Subject: Pesanan Website Baru dari {{from_name}}

Halo Admin,

Ada pesanan website baru:

Nama: {{from_name}}
Email: {{from_email}}
No. WhatsApp: {{phone}}
Perusahaan: {{company}}
Paket: {{package}}
Jenis Website: {{website_type}}

Deskripsi Kebutuhan:
{{message}}

---
Email ini dikirim otomatis dari website.
```

4. Catat **Template ID** yang diberikan

## 4. Dapatkan Public Key

1. Di dashboard, klik "Account" > "General"
2. Catat **Public Key** Anda

## 5. Update Kode

Buka file `src/pages/OrderPage.jsx` dan update baris 30-32:

```javascript
const serviceId = 'YOUR_SERVICE_ID'; // Ganti dengan Service ID Anda
const templateId = 'YOUR_TEMPLATE_ID'; // Ganti dengan Template ID Anda
const publicKey = 'YOUR_PUBLIC_KEY'; // Ganti dengan Public Key Anda
```

Dan baris 42:
```javascript
to_email: 'email-anda@example.com', // Ganti dengan email tujuan Anda
```

## 6. Test Form

1. Jalankan website dengan `npm run dev`
2. Buka halaman order di `/order`
3. Isi form dan submit
4. Cek inbox email Anda

## Catatan Penting

- EmailJS gratis untuk 200 email per bulan
- Pastikan email service Anda sudah terverifikasi
- Jika ada error, cek console browser untuk detail error
- Untuk production, pertimbangkan upgrade ke plan berbayar

## Troubleshooting

**Error: "Service ID not found"**
- Pastikan Service ID sudah benar
- Pastikan service sudah aktif di dashboard

**Email tidak terkirim**
- Cek spam folder
- Verifikasi template ID sudah benar
- Pastikan public key sudah benar

**CORS Error**
- EmailJS sudah menangani CORS, tidak perlu konfigurasi tambahan
