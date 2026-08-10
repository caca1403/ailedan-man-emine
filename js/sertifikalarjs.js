document.addEventListener('DOMContentLoaded', function () {
    const certificateModal = document.getElementById('certificateModal');
    const modalImage = document.getElementById('modalImage');
    const certificateImages = document.querySelectorAll('.certificate-image');

    certificateImages.forEach(image => {
        image.addEventListener('click', function () {
            if (!certificateModal || !modalImage) {
                return;
            }

            modalImage.src = this.src;
            certificateModal.style.display = 'block';
        });
    });

    if (certificateModal) {
        certificateModal.addEventListener('click', function () {
            certificateModal.style.display = 'none';
        });
    }

    const locationModal = document.getElementById('locationModal');
    const closeLocation = document.querySelector('.close-location');

    if (closeLocation && locationModal) {
        closeLocation.addEventListener('click', function () {
            locationModal.style.display = 'none';
        });
    }

    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            if (certificateModal) {
                certificateModal.style.display = 'none';
            }
            if (locationModal) {
                locationModal.style.display = 'none';
            }
        }
    });
});