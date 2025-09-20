const packages = [{
    id: 'goa_beach',
    destination: 'Goa',
    package: 'Beach Tour',
    durationDays: 4,
    basePrice: 12500,
    season: 'monsoon'
}, {
    id: 'himachal_adventure',
    destination: 'Himachal',
    package: 'Adventure Tour',
    durationDays: 6,
    basePrice: 22000,
    season: 'winter'
}, {
    id: 'europe_luxury',
    destination: 'Europe',
    package: 'Luxury Tour',
    durationDays: 8,
    basePrice: 120000,
    season: 'summer'
}, ];

function calculateFinalPrice(basePrice, season) {
    let finalPrice = basePrice;
    let seasonalMultiplier = 1;

    switch (season) {
        case 'monsoon':
            seasonalMultiplier = 0.9;
            break;
        case 'winter':
            seasonalMultiplier = 1.15;
            break;
        case 'summer':
            seasonalMultiplier = 1.05;
            break;
    }

    finalPrice *= seasonalMultiplier;

    return Math.round(finalPrice);
}

function highlightActiveNav() {
    const navLinks = document.querySelectorAll('.navbar a');
    const currentPage = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNav();

    if (document.querySelector('.packages-table')) {
        const tableBody = document.querySelector('.packages-table tbody');
        packages.forEach(pkg => {
            const finalPrice = calculateFinalPrice(pkg.basePrice, pkg.season);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pkg.destination} - ${pkg.package}</td>
                <td>${pkg.durationDays} days</td>
                <td>₹${pkg.basePrice}</td>
                <td class="price">₹${finalPrice}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    if (document.querySelector('.booking-form')) {
        const form = document.querySelector('.booking-form');
        const destinationSelect = document.getElementById('destination');
        const packageSelect = document.getElementById('package');
        const travelDateInput = document.getElementById('date');
        const guestsInput = document.getElementById('guests');
        const promoCodeInput = document.getElementById('promoCode');
        const priceEstimate = document.getElementById('priceEstimate');
        const submitButton = document.querySelector('.booking-form button[type="submit"]');

        const uniqueDestinations = [...new Set(packages.map(p => p.destination))];
        uniqueDestinations.forEach(dest => {
            const option = document.createElement('option');
            option.value = dest.toLowerCase();
            option.textContent = dest;
            destinationSelect.appendChild(option);
        });

        destinationSelect.addEventListener('change', () => {
            packageSelect.innerHTML = '<option value="">--Select--</option>';
            const selectedDest = destinationSelect.value;
            if (selectedDest) {
                const filteredPackages = packages.filter(p => p.destination.toLowerCase() === selectedDest);
                filteredPackages.forEach(pkg => {
                    const option = document.createElement('option');
                    option.value = pkg.id;
                    option.textContent = pkg.package;
                    packageSelect.appendChild(option);
                });
            }
            updatePriceEstimate();
        });

        form.addEventListener('change', updatePriceEstimate);
        form.addEventListener('input', updatePriceEstimate);

        function updatePriceEstimate() {
            let total = 0;
            const selectedPackageId = packageSelect.value;
            const selectedPackage = packages.find(p => p.id === selectedPackageId);

            if (selectedPackage) {
                total = calculateFinalPrice(selectedPackage.basePrice, selectedPackage.season);

                const guests = parseInt(guestsInput.value);
                if (guests > 2) {
                    total *= 1.20;
                }

                const promoCode = promoCodeInput.value.toUpperCase();
                switch (promoCode) {
                    case 'EARLYBIRD':
                        total *= 0.90;
                        break;
                }
            }

            priceEstimate.textContent = `₹${Math.round(total)}`;
            validateForm();
        }

        function validateForm() {
            const isValid = form.checkValidity();
            submitButton.disabled = !isValid;
        }

        updatePriceEstimate();
    }

    if (document.querySelector('.gallery-grid')) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const modal = document.getElementById('modal');
        const modalImage = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        const closeModal = document.querySelector('.close');

        galleryItems.forEach(item => {
            const thumbnail = item.querySelector('img');
            thumbnail.addEventListener('click', () => {
                modal.style.display = 'block';
                modalImage.src = thumbnail.getAttribute('data-large');
                modalCaption.textContent = thumbnail.alt;
            });
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});