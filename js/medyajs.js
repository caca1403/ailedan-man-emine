
    document.addEventListener('DOMContentLoaded', function () {
        // --- Helper for the separate WhatsApp modal (if it exists) ---
        const sendWhatsAppButton = document.getElementById('sendWhatsAppButton');
        if (sendWhatsAppButton) {
            const nameInput = document.getElementById('name');
            const messageInput = document.getElementById('message');
            const phoneNumber = '905455521485';

            sendWhatsAppButton.addEventListener('click', function () {
                const name = nameInput.value.trim();
                const message = messageInput.value.trim();
                if (name && message) {
                    const newMessage = `Merhaba, benim adım ${name}. Mesajım: ${message}`;
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(newMessage)}`;
                    window.open(whatsappUrl, '_blank');
                    nameInput.value = '';
                    messageInput.value = '';
                } else {
                    alert('Lütfen adınızı ve mesajınızı yazınız!');
                }
            });
        }

        // --- Main Appointment Modal Logic ---
        const randevuModalEl = document.getElementById('randevuModal');
        if (!randevuModalEl) return; // Stop if the main modal is not on this page

        const randevuModal = new bootstrap.Modal(randevuModalEl);
        const previewModalEl = document.getElementById('previewModal');
        const previewModal = previewModalEl ? new bootstrap.Modal(previewModalEl) : null;

        // Form Elements
        const formInputs = {
            name: document.getElementById('randevuName'),
            phone: document.getElementById('randevuPhone'),
            date: document.getElementById('randevuDate'),
            time: document.getElementById('randevuTime'),
            area: document.getElementById('randevuArea'),
            type: document.getElementById('randevuType'),
            note: document.getElementById('randevuNote'),
            reminder: document.getElementById('hatirlatmaIstiyorum')
        };

        // Validation Icons
        const validationIcons = {
            name: document.getElementById('nameValidationIcon'),
            phone: document.getElementById('phoneValidationIcon'),
            date: document.getElementById('dateValidationIcon'),
            time: document.getElementById('timeValidationIcon'),
            area: document.getElementById('areaValidationIcon'),
            type: document.getElementById('typeValidationIcon')
        };

        // Buttons
        const previewButton = document.getElementById('previewButton');
        const confirmButton = document.getElementById('confirmFromPreview');

        // Draft Elements
        const draftNotification = document.getElementById('draft-notification');
        const loadDraftButton = document.getElementById('load-draft');
        const discardDraftButton = document.getElementById('discard-draft');
        
        // Other UI
        const selectedDayEl = document.getElementById('selectedDay');
        const formErrorEl = document.getElementById('form-error');

        // Constants
        const DRAFT_KEY = 'appointmentDraft';
        const WHATSAPP_NUMBER = '905455521485';
        const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

        // --- State Management ---
        let validationState = {
            name: false,
            phone: false,
            date: false,
            time: false,
            area: false,
            type: false
        };

        // --- Functions ---

        const updateValidationUI = (field, isValid) => {
            const icon = validationIcons[field];
            if (!icon) return;

            if (isValid) {
                icon.innerHTML = '✅';
                icon.style.color = 'green';
            } else {
                icon.innerHTML = '❌';
                icon.style.color = 'red';
            }
            validationState[field] = isValid;
            checkFormValidity();
        };

        const checkFormValidity = () => {
            const isFormValid = Object.values(validationState).every(Boolean);
            previewButton.disabled = !isFormValid;
        };

        const saveDraft = () => {
            const draft = {
                name: formInputs.name.value,
                phone: formInputs.phone.value,
                date: formInputs.date.value,
                time: formInputs.time.value,
                area: formInputs.area.value,
                type: formInputs.type.value,
                note: formInputs.note.value,
                reminder: formInputs.reminder.checked
            };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        };

        const loadDraft = () => {
            const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
            if (!draft) return;

            formInputs.name.value = draft.name || '';
            formInputs.phone.value = draft.phone || '';
            formInputs.date.value = draft.date || '';
            formInputs.time.value = draft.time || '';
            formInputs.area.value = draft.area || '';
            formInputs.type.value = draft.type || '';
            formInputs.note.value = draft.note || '';
            formInputs.reminder.checked = draft.reminder || false;

            // Trigger validation on loaded fields
            Object.keys(formInputs).forEach(key => {
                const event = new Event('input', { bubbles: true });
                formInputs[key].dispatchEvent(event);
            });
        };

        const clearDraft = () => {
            localStorage.removeItem(DRAFT_KEY);
        };

        // --- Event Listeners ---

        // Modal open: Check for draft
        randevuModalEl.addEventListener('show.bs.modal', () => {
            if (localStorage.getItem(DRAFT_KEY)) {
                draftNotification.style.display = 'flex';
            }
        });

        // Draft buttons
        loadDraftButton.addEventListener('click', () => {
            loadDraft();
            draftNotification.style.display = 'none';
        });
        discardDraftButton.addEventListener('click', clearDraft);


        // Real-time validation and draft saving
        formInputs.name.addEventListener('input', e => {
            const isValid = e.target.value.trim().length > 2;
            updateValidationUI('name', isValid);
            saveDraft();
        });

        formInputs.phone.addEventListener('input', e => {
            // Auto-format phone number
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            if (!x) return;
            e.target.value = !x[2] ? x[1] : (x[1] || '0') + ' (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? ' ' + x[4] : '') + (x[5] ? ' ' + x[5] : '');
            
            const phoneRegex = /^0 \(\d{3}\) \d{3} \d{2} \d{2}$/;
            const isValid = phoneRegex.test(e.target.value);
            updateValidationUI('phone', isValid);
            saveDraft();
        });

        formInputs.date.addEventListener('input', e => {
            const selectedDate = new Date(e.target.value);
            const dayIndex = selectedDate.getUTCDay();
            let isValid = true;

            if (dayIndex === 0 || dayIndex === 6) {
                document.getElementById('weekendAlert').style.display = 'block';
                setTimeout(() => { document.getElementById('weekendAlert').style.display = 'none'; }, 3000);
                e.target.value = '';
                if(selectedDayEl) selectedDayEl.textContent = '';
                isValid = false;
            } else {
                if(selectedDayEl) selectedDayEl.textContent = `Seçilen gün: ${DAYS[dayIndex]}`;
            }
            updateValidationUI('date', isValid);
            saveDraft();
        });

        formInputs.time.addEventListener('input', e => {
            const isValid = e.target.value !== '';
            updateValidationUI('time', isValid);
            saveDraft();
        });

        formInputs.area.addEventListener('input', e => {
            const isValid = e.target.value !== '';
            updateValidationUI('area', isValid);
            saveDraft();
        });

        formInputs.type.addEventListener('input', e => {
            const isValid = e.target.value !== '';
            updateValidationUI('type', isValid);
            saveDraft();
        });
        
        formInputs.note.addEventListener('input', saveDraft);
        formInputs.reminder.addEventListener('change', saveDraft);

        // Set min date for date input
        const today = new Date().toISOString().split('T')[0];
        formInputs.date.setAttribute('min', today);

        // Preview button click
        previewButton.addEventListener('click', function () {
            if (previewModal) {
                const selectedDate = new Date(formInputs.date.value);
                const dayName = DAYS[selectedDate.getUTCDay()];

                document.getElementById('previewName').textContent = formInputs.name.value;
                document.getElementById('previewPhone').textContent = formInputs.phone.value;
                document.getElementById('previewDate').textContent = formInputs.date.value;
                document.getElementById('previewDay').textContent = dayName;
                document.getElementById('previewTime').textContent = formInputs.time.value;
                document.getElementById('previewArea').textContent = formInputs.area.value;
                document.getElementById('previewType').textContent = formInputs.type.value;
                document.getElementById('previewNote').textContent = formInputs.note.value || 'Yok';
                
                previewModal.show();
            }
        });

        // Final confirmation and submission
        if (confirmButton) {
            confirmButton.addEventListener('click', function () {
                const modalBody = this.closest('.modal-content').querySelector('.modal-body');
                const modalFooter = this.closest('.modal-content').querySelector('.modal-footer');

                if (modalBody) {
                    modalBody.innerHTML = `
                        <div class="text-center p-4">
                            <i class="fas fa-check-circle fa-3x text-success mb-3" style="animation: pulse 1.5s infinite;"></i>
                            <h4>Harika! Talebiniz Alındı.</h4>
                            <p class="text-muted">Mesajınızı göndermek için şimdi WhatsApp'a yönlendiriliyorsunuz...</p>
                        </div>`;
                }
                if (modalFooter) modalFooter.style.display = 'none';

                setTimeout(() => {
                    const name = formInputs.name.value.trim();
                    const phone = formInputs.phone.value.trim();
                    const date = formInputs.date.value;
                    const time = formInputs.time.value;
                    const area = formInputs.area.value;
                    const type = formInputs.type.value;
                    const note = formInputs.note.value.trim();
                    const reminderText = formInputs.reminder.checked ? 'Evet, hatırlatma yapılsın.' : 'Hayır';
                    const dayName = DAYS[new Date(date).getUTCDay()];

                    const whatsappMessage = `*Yeni Randevu Talebi*%0A-----------------------------------%0A*Danışan Bilgileri:*%0A👤 *Ad Soyad:* ${name}%0A📞 *Telefon:* ${phone}%0A%0A*Randevu Detayları:*%0A🗓️ *Tarih:* ${date} (${dayName})%0A🕑 *Saat:* ${time}%0A🎯 *Danışmanlık Alanı:* ${area}%0A👥 *Konsültasyon Türü:* ${type}%0A⏰ *Hatırlatma:* ${reminderText}%0A%0A*Ek Notlar:*%0A📝 ${note || "Not belirtilmedi"}%0A-----------------------------------%0A_Bu mesaj randevu formu aracılığıyla otomatik olarak gönderilmiştir._`;
                    
                    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
                    
                    clearDraft(); // Clear the draft on successful submission
                    window.open(whatsappUrl, '_blank');

                    setTimeout(() => {
                        if (previewModal) previewModal.hide();
                        randevuModal.hide();
                        window.location.reload();
                    }, 1500);

                }, 2500);
            });
        }
        
        // Initial check in case of browser autofill
        checkFormValidity();
    });
