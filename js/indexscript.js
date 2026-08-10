
        // Modal işlemleri için JavaScript
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);
                document.body.style.overflow = 'hidden';
            }
        }

        function closeModal() {
            const modals = document.querySelectorAll('.expertise-modal');
            modals.forEach(modal => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
            document.body.style.overflow = '';
        }

        // Dışarı tıklanınca modalı kapat
        window.addEventListener('click', (e) => {
            const modals = document.querySelectorAll('.expertise-modal');
            modals.forEach(modal => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        });

        // ESC tuşuna basılınca modalı kapat
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // ScrollReveal Animasyonları
        document.addEventListener('DOMContentLoaded', function() {
            const expertiseCards = document.querySelectorAll('.expertise-card');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.3
            });

            expertiseCards.forEach(card => {
                observer.observe(card);
            });
        });

        document.addEventListener('DOMContentLoaded', function () {
            const quizSection = document.querySelector('.needs-analysis-section');
            if (!quizSection) {
                return;
            }

            const optionButtons = quizSection.querySelectorAll('.analysis-option');
            const submitButton = document.getElementById('analysisSubmit');
            const resetButton = document.getElementById('analysisReset');
            const resultTitle = document.getElementById('analysisResultTitle');
            const analysisStatus = document.getElementById('analysisStatus');
            const resultText = document.getElementById('analysisResultText');
            const resultList = document.getElementById('analysisResultList');
            const selectedAnswers = {
                1: null,
                2: null,
                3: null,
                4: null
            };

            const areaMeta = {
                'Aile Danışmanlığı': {
                    title: 'Sizin için en uygun alan: Aile Danışmanlığı',
                    text: 'Aile içi iletişim, sınırlar ve ortak çözüm üretme konuları ön planda görünüyor.',
                    items: ['İletişim kalıplarını netleştirme', 'Aile içi çatışmaları azaltma', 'Ortak çözüm planı oluşturma']
                },
                'Çocuk ve Ergen Danışmanlığı': {
                    title: 'Sizin için en uygun alan: Çocuk ve Ergen Danışmanlığı',
                    text: 'Davranış, okul süreci veya ergenlik dönemine dair destek ihtiyacı öne çıkıyor.',
                    items: ['Davranış ve rutin desteği', 'Okul uyumu ve motivasyon', 'Aile-çocuk iletişimini güçlendirme']
                },
                'Evlilik ve Çift Danışmanlığı': {
                    title: 'Sizin için en uygun alan: Evlilik ve Çift Danışmanlığı',
                    text: 'İlişkinizi güçlendirme, anlaşmazlıkları yönetme ve ortak dil kurma ihtiyacı baskın.',
                    items: ['Çatışma çözümü', 'İlişkiyi yeniden yapılandırma', 'Güven ve iletişim çalışmaları']
                },
                'Bireysel Danışmanlık': {
                    title: 'Sizin için en uygun alan: Bireysel Danışmanlık',
                    text: 'Stres, kaygı, özgüven ve kişisel denge üzerine odaklanmanız faydalı görünüyor.',
                    items: ['Kaygı ve stres yönetimi', 'Özgüven güçlendirme', 'Kişisel hedef netleştirme']
                },
                'Eğitim Danışmanlığı': {
                    title: 'Sizin için en uygun alan: Eğitim Danışmanlığı',
                    text: 'Akademik motivasyon ve öğrenme düzeniyle ilgili destek ihtiyacı öne çıkıyor.',
                    items: ['Ders rutini oluşturma', 'Sınav kaygısını yönetme', 'Öğrenme planı hazırlama']
                }
            };

            const SERVICE_QUESTIONS = ['1', '2', '3'];

            function setSelectedOption(button) {
                const question = button.closest('.analysis-question');
                if (!question) {
                    return;
                }

                question.querySelectorAll('.analysis-option').forEach(option => option.classList.remove('is-selected'));
                button.classList.add('is-selected');
                const questionNumber = question.dataset.question;
                if (questionNumber === '4') {
                    selectedAnswers[4] = button.dataset.format || button.textContent.trim();
                } else {
                    selectedAnswers[questionNumber] = button.dataset.area || button.textContent.trim();
                }

                updateResultCard();
            }

            function renderResult(area) {
                const meta = areaMeta[area] || areaMeta['Aile Danışmanlığı'];
                resultTitle.textContent = meta.title;
                resultText.textContent = meta.text;
                resultList.innerHTML = meta.items.map(item => `<li>${item}</li>`).join('');
            }

            function getAnsweredServiceCount() {
                return SERVICE_QUESTIONS.filter(questionNumber => Boolean(selectedAnswers[questionNumber])).length;
            }

            function setDefaultResult(message) {
                const answeredCount = getAnsweredServiceCount();
                resultTitle.textContent = answeredCount > 0 ? `${answeredCount}/3 soru tamamlandı` : 'Testi tamamlayın';
                resultText.textContent = message || 'İlk 3 soruyu tamamladığınızda size en uygun danışmanlık alanını göstereceğim.';
                resultList.innerHTML = '<li>Doğru alanı daha hızlı bulursunuz.</li><li>İlk görüşmeye daha hazırlıklı gelirsiniz.</li><li>Ücretsiz ön görüşmeye tek tıkla geçebilirsiniz.</li>';
            }

            function getBestArea() {
                const votes = [selectedAnswers[1], selectedAnswers[2], selectedAnswers[3]].filter(Boolean);
                if (!votes.length) {
                    return null;
                }

                const counts = votes.reduce((accumulator, area) => {
                    accumulator[area] = (accumulator[area] || 0) + 1;
                    return accumulator;
                }, {});

                return Object.entries(counts)
                    .sort((first, second) => {
                        if (second[1] !== first[1]) {
                            return second[1] - first[1];
                        }

                        return votes.indexOf(first[0]) - votes.indexOf(second[0]);
                    })[0][0];
            }

            function updateStatusText(area) {
                if (!analysisStatus) {
                    return;
                }

                const answeredCount = getAnsweredServiceCount();

                if (area) {
                    const formatText = selectedAnswers[4] ? ` Görüşme tercihi: ${selectedAnswers[4]}.` : '';
                    analysisStatus.textContent = `Şu anki öneri ${area}.${formatText}`;
                    return;
                }

                if (answeredCount > 0) {
                    const formatText = selectedAnswers[4] ? ` Görüşme tercihi: ${selectedAnswers[4]}.` : '';
                    analysisStatus.textContent = `${answeredCount}/3 soru tamamlandı.${formatText} Son öneri için 3. soruyu da yanıtlayın.`;
                    return;
                }

                analysisStatus.textContent = 'İlk 3 soruyu yanıtlayın, size en uygun alanı hemen göstereyim.';
            }

            function updateResultCard() {
                const bestArea = getBestArea();
                const answeredCount = getAnsweredServiceCount();

                if (bestArea && answeredCount >= 3) {
                    renderResult(bestArea);
                    updateStatusText(bestArea);
                    return;
                }

                setDefaultResult(answeredCount > 0 ? `${answeredCount}/3 soru tamamlandı. Sonucu görmek için bir soru daha seçin.` : undefined);
                updateStatusText(null);
            }

            optionButtons.forEach(button => {
                button.addEventListener('click', () => setSelectedOption(button));
            });

            submitButton.addEventListener('click', () => {
                const bestArea = getBestArea();
                if (!bestArea || getAnsweredServiceCount() < 3) {
                    setDefaultResult('Sonucu görmek için ilk 3 sorunun tamamını cevaplayın.');
                    updateStatusText(null);
                    return;
                }

                renderResult(bestArea);
                updateStatusText(bestArea);
                resultTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            resetButton.addEventListener('click', () => {
                selectedAnswers[1] = null;
                selectedAnswers[2] = null;
                selectedAnswers[3] = null;
                selectedAnswers[4] = null;
                optionButtons.forEach(button => button.classList.remove('is-selected'));
                setDefaultResult();
                updateStatusText(null);
            });

            updateResultCard();
        });

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

    // Hoşgeldiniz modalı otomatik açılır
    document.addEventListener('DOMContentLoaded', function() {
        var hosgeldinizModal = new bootstrap.Modal(document.getElementById('hosgeldinizModal'));
        setTimeout(() => hosgeldinizModal.show(), 800);
    });

    // Kısa psikolojik test sonucu
    function testSonucu() {
        var q1 = document.getElementById('q1').value;
        var q2 = document.getElementById('q2').value;
        var puan = 0;
        if (q1 === "Bazen") puan += 1;
        if (q1 === "Sıkça") puan += 2;
        if (q2 === "Bazen") puan += 1;
        if (q2 === "Sıkça") puan += 2;

        var sonuc = "";
        if (puan <= 1) sonuc = "Anksiyete düzeyiniz düşük görünüyor.";
        else if (puan <= 3) sonuc = "Orta düzeyde anksiyete belirtileri gözlemlenebilir.";
        else sonuc = "Yüksek düzeyde anksiyete belirtileri var. Destek almanız önerilir.";

        document.getElementById('testResult').textContent = sonuc;
    }




    // Bio bölümü animasyonları
    const bioSection = document.querySelector('.bio-section');
    const bioContainer = document.querySelector('.bio-container');
    const bioContent = document.querySelector('.bio-content');
    const bioTexts = document.querySelectorAll('.bio-text');
    const bioHighlights = document.querySelectorAll('.bio-highlight-item');

    // Daha geniş görünürlük alanı için
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const bioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                entry.target.classList.add('visible');
                if (entry.target === bioSection) {
                    bioContainer.classList.add('visible');
                    bioContent.classList.add('visible');
                    bioTexts.forEach((text, index) => {
                        setTimeout(() => {
                            text.classList.add('visible');
                        }, 300 * (index + 1));
                    });
                    bioHighlights.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, 200 * (index + 1));
                    });
                    // Bir kez çalıştıktan sonra observer'ı kaldır
                    bioObserver.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Tüm bileşenleri gözlemle
    bioObserver.observe(bioSection);
    bioTexts.forEach(text => bioObserver.observe(text));
    bioHighlights.forEach(item => bioObserver.observe(item));

    // Expertise bölümünde otomatik geçiş
        document.addEventListener('DOMContentLoaded', function() {
            const expertiseItems = document.querySelectorAll('.expertise-item');
            let currentIndex = 0;

            function showNextExpertise() {
                expertiseItems.forEach(item => {
                    item.classList.remove('active');
                });

                currentIndex = (currentIndex + 1) % expertiseItems.length;
                expertiseItems[currentIndex].classList.add('active');
            }

            // İlk öğeyi aktif yap
            expertiseItems[0].classList.add('active');

            // Her 5 saniyede bir değiştir
            setInterval(showNextExpertise, 5000);
        });

                        // Expertise Slider Initialization
                        document.addEventListener('DOMContentLoaded', function() {
                            const sourceGrid = document.getElementById('expertise-grid');
                            const sliderTrack = document.getElementById('expertiseSliderTrack');
                            const prevBtn = document.getElementById('expertiseSliderPrev');
                            const nextBtn = document.getElementById('expertiseSliderNext');
                            
                            if (sourceGrid && sliderTrack) {
                                // Tüm kartları slider'a kopyala
                                const cards = sourceGrid.querySelectorAll('.expertise-card');
                                cards.forEach(card => {
                                    const clonedCard = card.cloneNode(true);
                                    const sliderItem = document.createElement('div');
                                    sliderItem.className = 'expertise-slider-item';
                                    sliderItem.appendChild(clonedCard);
                                    sliderTrack.appendChild(sliderItem);
                                });
                                
                                // Slider state
                                let currentPosition = 0;
                                const gap = 48; // 3rem = 48px
                                const totalCards = cards.length;
                                
                                function computeVisible() {
                                    return window.innerWidth > 1200 ? 3 : (window.innerWidth > 768 ? 2 : 1);
                                }

                                function computeItemWidth() {
                                    const container = sliderTrack.parentElement;
                                    if (!container) return 400;
                                    
                                    const containerWidth = container.clientWidth;
                                    const visibleCount = computeVisible();
                                    const totalGap = gap * (visibleCount - 1);
                                    const cardWidth = (containerWidth - totalGap) / visibleCount;
                                    
                                    return cardWidth + gap;
                                }
                                
                                let visibleCards = computeVisible();
                                let itemWidth = computeItemWidth();
                                let maxScroll = Math.max(0, totalCards - visibleCards);
                                
                                window.expertiseSliderMove = function(direction) {
                                    currentPosition += direction;
                                    currentPosition = Math.max(0, Math.min(currentPosition, maxScroll));
                                    
                                    const offset = -currentPosition * itemWidth;
                                    sliderTrack.style.transform = `translateX(${offset}px)`;
                                    
                                    // Button states
                                    prevBtn.disabled = currentPosition === 0;
                                    nextBtn.disabled = currentPosition === maxScroll;
                                };
                                
                                // Recompute on resize
                                window.addEventListener('resize', function() {
                                    visibleCards = computeVisible();
                                    itemWidth = computeItemWidth();
                                    maxScroll = Math.max(0, totalCards - visibleCards);
                                    currentPosition = Math.max(0, Math.min(currentPosition, maxScroll));
                                    const offset = -currentPosition * itemWidth;
                                    sliderTrack.style.transform = `translateX(${offset}px)`;
                                    prevBtn.disabled = currentPosition === 0;
                                    nextBtn.disabled = currentPosition === maxScroll;
                                });
                                
                                // Initialize button states
                                window.expertiseSliderMove(0);
                            }
                        });

                function toggleFaq(element) {
                    const faqItem = element.parentElement;
                    const wasActive = faqItem.classList.contains('active');
                    
                    // Tüm FAQ öğelerini kapat
                    document.querySelectorAll('.faq-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // Tıklanan öğeyi aç (eğer zaten açık değilse)
                    if (!wasActive) {
                        faqItem.classList.add('active');
                    }
                }

                    // Problems Slider Initialization — Uzmanlık bölümündeki mantıkla eşit davranış sağlar
                    function initProblemsSlider() {
                        const sourceGrid = document.getElementById('problems-grid');
                        const sliderTrack = document.getElementById('problemsSliderTrack');
                        const prevBtn = document.getElementById('problemsSliderPrev');
                        const nextBtn = document.getElementById('problemsSliderNext');

                        console.log('initProblemsSlider çağrıldı');
                        console.log('sourceGrid:', sourceGrid);
                        console.log('sliderTrack:', sliderTrack);

                        if (sourceGrid && sliderTrack) {
                            const cards = sourceGrid.querySelectorAll('.problem-card');
                            console.log('Bulunan kartlar:', cards.length);

                            cards.forEach((card, index) => {
                                const cloned = card.cloneNode(true);
                                // Kopyalanan kartlara visible class'ı ekle
                                cloned.classList.add('visible');
                                const sliderItem = document.createElement('div');
                                sliderItem.className = 'problems-slider-item';
                                sliderItem.appendChild(cloned);
                                sliderTrack.appendChild(sliderItem);
                                console.log('Kart kopyalandı:', index + 1);
                            });

                            // Slider state
                            let currentPosition = 0;
                            const gap = 48; // 3rem
                            const totalCards = cards.length;

                            function computeVisible() {
                                return window.innerWidth > 1200 ? 3 : (window.innerWidth > 768 ? 2 : 1);
                            }

                            function computeItemWidth() {
                                const container = sliderTrack.parentElement;
                                if (!container) return 400;
                                
                                const containerWidth = container.clientWidth;
                                const visibleCount = computeVisible();
                                const totalGap = gap * (visibleCount - 1);
                                const cardWidth = (containerWidth - totalGap) / visibleCount;
                                
                                return cardWidth + gap;
                            }

                            let visibleCards = computeVisible();
                            let itemWidth = computeItemWidth();
                            let maxScroll = Math.max(0, totalCards - visibleCards);

                            window.problemsSliderMove = function(direction) {
                                currentPosition += direction;
                                currentPosition = Math.max(0, Math.min(currentPosition, maxScroll));

                                const offset = -currentPosition * itemWidth;
                                sliderTrack.style.transform = `translateX(${offset}px)`;

                                prevBtn.disabled = currentPosition === 0;
                                nextBtn.disabled = currentPosition === maxScroll;
                            };

                            // Recompute on resize
                            window.addEventListener('resize', function() {
                                visibleCards = computeVisible();
                                itemWidth = computeItemWidth();
                                maxScroll = Math.max(0, totalCards - visibleCards);
                                // Ensure position still valid
                                currentPosition = Math.max(0, Math.min(currentPosition, maxScroll));
                                const offset = -currentPosition * itemWidth;
                                sliderTrack.style.transform = `translateX(${offset}px)`;
                                prevBtn.disabled = currentPosition === 0;
                                nextBtn.disabled = currentPosition === maxScroll;
                            });

                            // Initialize
                            window.problemsSliderMove(0);
                            console.log('Problems slider başlatıldı');
                        } else {
                            console.log('sourceGrid veya sliderTrack bulunamadı');
                        }
                    }

                    // DOM yüklendikten sonra başlat
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', initProblemsSlider);
                    } else {
                        // Sayfa zaten yüklenmişse hemen çalıştır
                        initProblemsSlider();
                    }

                    // Ayrıca sayfanın tamamen yüklenmesinden sonra da dene
                    window.addEventListener('load', initProblemsSlider);

    document.addEventListener('DOMContentLoaded', function() {
        const items = document.querySelectorAll('.expertise-item');
        const dots = document.querySelectorAll('.expertise-dot');
        let current = 0;
        function showExpertise(idx) {
            items.forEach((el, i) => {
                el.classList.toggle('active', i === idx);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === idx);
            });
            current = idx;
        }
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => showExpertise(i));
        });
        setInterval(() => {
            let next = (current + 1) % items.length;
            showExpertise(next);
        }, 3500);
        showExpertise(0);
    });

    /* filepath: c:\Users\Lenovo\Desktop\Yeni klasör\ailedan-man-emine-main\index.html */
    /* problems-grid reveal ve erişilebilirlik JS - DOMContentLoaded altında çalıştırılacak */
    document.addEventListener('DOMContentLoaded', function () {
        const problemsGrid = document.getElementById('problems-grid');
        if (!problemsGrid) return;
    
        // IntersectionObserver ile kademeli görünür yap
        const cards = problemsGrid.querySelectorAll('.problem-card');
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.18 });
    
        cards.forEach((card, i) => {
            // klavye erişimi için tabindex
            card.setAttribute('tabindex', '0');
            obs.observe(card);
        });
    
        // Fareyle veya klavye ile açılan linklerin odak yönetimi için
        problemsGrid.addEventListener('click', (e) => {
            const link = e.target.closest('.problem-link');
            if (!link) return;
            // Bootstrap modal tetikleniyorsa normal davranış yeterli
        });
    
        // Eğer CSS veya başka scriptler inline "display:none" eklemişse (önceden) kaldırmak için:
        problemsGrid.style.display = problemsGrid.style.display === 'none' ? '' : problemsGrid.style.display;
    });

