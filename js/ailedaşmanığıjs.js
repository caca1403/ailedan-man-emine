
 document.addEventListener('DOMContentLoaded', function () {
    const sendWhatsAppButton = document.getElementById('sendWhatsAppButton'); // Gönder butonu
    const nameInput = document.getElementById('name'); // Ad Textarea
    const messageInput = document.getElementById('message'); // Mesaj Textarea
    const phoneNumber = '905455521485'; // WhatsApp telefon numarası

    sendWhatsAppButton.addEventListener('click', function () {
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (name && message) {
            // Dinamik mesaj oluştur
            const newMessage = `Merhaba, benim adım ${name}. Mesajım: ${message}`;
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(newMessage)}`;

            // WhatsApp'ı yeni sekmede aç
            window.open(whatsappUrl, '_blank');

            // Form alanlarını temizle
            nameInput.value = '';
            messageInput.value = '';
        } else {
            alert('Lütfen adınızı ve mesajınızı yazınız!');
        }
    });
});

 document.addEventListener('DOMContentLoaded', function () {
  const previewButton = document.getElementById('previewButton');
  const confirmButton = document.getElementById('confirmFromPreview');


  const randevuName = document.getElementById('randevuName');
  const randevuPhone = document.getElementById('randevuPhone');
  const randevuDate = document.getElementById('randevuDate');
  const randevuTime = document.getElementById('randevuTime');
  const randevuNote = document.getElementById('randevuNote');
  const hatirlatmaIstiyorum = document.getElementById('hatirlatmaIstiyorum');
  const selectedDay = document.getElementById('selectedDay');
  const randevuPhoneNumber = '905455521485'; // WhatsApp numaran

  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  // Bugünden önce tarih seçilmesin
  const today = new Date().toISOString().split('T')[0];
  randevuDate.setAttribute('min', today);

  // Tarih seçilince gün adı göster + hafta sonu kontrol
  randevuDate.addEventListener('change', function () {
    const selectedDate = new Date(this.value);
    const dayIndex = selectedDate.getDay();
    const dayName = days[dayIndex];

    if (dayIndex === 0 || dayIndex === 6) { // Pazar veya Cumartesi
        const weekendAlert = document.getElementById('weekendAlert');
        weekendAlert.style.display = 'block';

        this.value = '';
        selectedDay.textContent = '';

        // 3 saniye sonra uyarıyı kapat
        setTimeout(function() {
            weekendAlert.style.display = 'none';
        }, 3000);
    } else {
        selectedDay.textContent = `Seçilen gün: ${dayName}`;
    }
});


  // Önizleme Butonu
  previewButton.addEventListener('click', function () {
    if (randevuName.value && randevuPhone.value && randevuDate.value && randevuTime.value) {
      const selectedDate = new Date(randevuDate.value);
      const dayIndex = days[selectedDate.getDay()];

      document.getElementById('previewName').textContent = randevuName.value;
      document.getElementById('previewPhone').textContent = randevuPhone.value;
      document.getElementById('previewDate').textContent = randevuDate.value;
      document.getElementById('previewDay').textContent = dayIndex;
      document.getElementById('previewTime').textContent = randevuTime.value;
      document.getElementById('previewNote').textContent = randevuNote.value || 'Yok';

      new bootstrap.Modal(document.getElementById('previewModal')).show();
    } else {
      alert('Lütfen tüm zorunlu alanları doldurunuz.');
    }
  });

  confirmButton.addEventListener('click', function () {
    const name = randevuName.value.trim();
    const phone = randevuPhone.value.trim();
    const date = randevuDate.value;
    const time = randevuTime.value;
    const note = randevuNote.value.trim() || 'Yok';
    const selectedDate = new Date(date);
    const dayName = days[selectedDate.getDay()];

    // Başarı mesajı
    const successAlert = document.getElementById('successAlert');
    successAlert.style.display = 'block';

    // .ics dosyası oluştur
    const startDateTime = `${date}T${time.replace(':', '')}00`;
    const alarmMinutes = hatirlatmaIstiyorum.checked ? 1440 : 0;

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Randevu - ${name}
DTSTART:${startDateTime}
DTEND:${startDateTime}
DESCRIPTION:Telefon: ${phone} - Not: ${note}
${alarmMinutes > 0 ? `BEGIN:VALARM\nTRIGGER:-P1D\nDESCRIPTION:Randevu Hatırlatma\nEND:VALARM` : ''}
END:VEVENT
END:VCALENDAR`.trim();

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'randevu.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Hemen WhatsApp mesajı hazırla ve yönlendir
    const newMessage = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃           RANDEVU ONAYI              ┃
┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┃
┃ Ad         : ${name}
┃ Telefon    : ${phone}
┃ Tarih      : ${date} (${dayName})
┃ Saat       : ${time}
┃ Not        : ${note || "Belirtilmedi"}
┃ Referans   : #${Math.floor(100000 + Math.random() * 900000)}
┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┃
┃ Randevunuz başarıyla kaydedilmiştir.
┃ Lütfen randevu saatinizden 5-10 dakika
┃ önce hazır bulununuz.
┃ 
┃ Saygılarımızla,
┃ Empaz Aile Danışmanlığı Ekibi
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`;

    const whatsappUrl = `https://wa.me/${randevuPhoneNumber}?text=${encodeURIComponent(newMessage)}`;
    window.location.href = whatsappUrl; // 🔁 Tarayıcı engeli olmayan garantili yol

    // Formu sıfırla
    randevuName.value = '';
    randevuPhone.value = '';
    randevuDate.value = '';
    randevuTime.value = '';
    randevuNote.value = '';
    hatirlatmaIstiyorum.checked = false;
    selectedDay.textContent = '';
});

  // Başarı mesajı için alert
  const successAlert = document.createElement('div');
  successAlert.id = 'successAlert';
  successAlert.className = 'alert alert-success mt-3';
  successAlert.textContent = 'Randevunuz başarıyla kaydedildi. WhatsApp üzerinden onay mesajı gönderildi.';
  successAlert.style.display = 'none'; // Başlangıçta gizli
  document.querySelector('.modal-body').appendChild(successAlert);
});
    