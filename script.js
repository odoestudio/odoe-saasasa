document.addEventListener('DOMContentLoaded', () => {
    const profiles = [
        { id: 1, name: 'Jenna', age: 28, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=600&w=600', bio: 'Loves art galleries and rainy days. Looking for someone to share a large pizza with.' },
        { id: 2, name: 'Mike', age: 32, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=600&w=600', bio: 'Hiking enthusiast and dog lover. My golden retriever is my best friend.' },
        { id: 3, name: 'Chloe', age: 25, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=600&w=600', bio: 'Musician and bookworm. I can probably beat you at Mario Kart.' },
        { id: 4, name: 'Alex', age: 30, image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=600&w=600', bio: 'Just a simple guy who loves to cook and travel. Tell me your favorite dish!' },
        { id: 5, name: 'Sophia', age: 29, image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=600&w=600', bio: 'Tech geek with a passion for vintage films. Let\'s talk about anything but work.' },
    ];

    let currentProfileIndex = 0;
    const matches = [];

    const cardStack = document.getElementById('card-stack');
    const noMoreProfiles = document.getElementById('no-more-profiles');
    const discoverBtn = document.getElementById('discover-btn');
    const matchesBtn = document.getElementById('matches-btn');
    const swipeView = document.getElementById('swipe-view');
    const matchesView = document.getElementById('matches-view');
    const matchesGrid = document.getElementById('matches-grid');
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    const matchModal = document.getElementById('match-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    function createProfileCard(profile) {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.innerHTML = `
            <div class="swipe-overlay like">Like</div>
            <div class="swipe-overlay nope">Nope</div>
            <div class="card-image-container flex-shrink-0">
                <img src="${profile.image}" alt="${profile.name}" class="card-image">
            </div>
            <div class="card-info flex-grow flex flex-col">
                <h3 class="font-kalam text-3xl font-bold">${profile.name}, <span class="font-light">${profile.age}</span></h3>
                <p class="font-gochi text-gray-600 text-lg mt-2 flex-grow">${profile.bio}</p>
                <div class="card-rating mt-4 text-center">
                    <span class="star" data-value="1"><i class="far fa-star"></i></span>
                    <span class="star" data-value="2"><i class="far fa-star"></i></span>
                    <span class="star" data-value="3"><i class="far fa-star"></i></span>
                    <span class="star" data-value="4"><i class="far fa-star"></i></span>
                    <span class="star" data-value="5"><i class="far fa-star"></i></span>
                </div>
            </div>
        `;
        addCardEventListeners(card);
        addRatingListeners(card);
        return card;
    }

    function loadProfiles() {
        cardStack.innerHTML = '';
        if (currentProfileIndex >= profiles.length) {
            noMoreProfiles.classList.remove('hidden');
            noMoreProfiles.classList.add('flex');
            return;
        }
        noMoreProfiles.classList.add('hidden');
        noMoreProfiles.classList.remove('flex');

        const fragment = document.createDocumentFragment();
        const profilesToShow = profiles.slice(currentProfileIndex, currentProfileIndex + 3).reverse();
        profilesToShow.forEach((profile, index) => {
            const card = createProfileCard(profile);
            card.style.zIndex = profilesToShow.length - index;
            card.style.transform = `translateY(${index * -10}px) scale(${1 - index * 0.05})`;
            fragment.appendChild(card);
        });
        cardStack.appendChild(fragment);
    }

    function addCardEventListeners(card) {
        let isDragging = false;
        let startX, startY, offsetX, offsetY;

        const likeOverlay = card.querySelector('.swipe-overlay.like');
        const nopeOverlay = card.querySelector('.swipe-overlay.nope');

        function onPointerDown(e) {
            if (e.target.closest('.star')) return;
            isDragging = true;
            startX = e.clientX;
            card.classList.add('dragging');
            card.setPointerCapture(e.pointerId);
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            offsetX = e.clientX - startX;
            const rotation = offsetX / 20;
            card.style.transform = `translateX(${offsetX}px) rotate(${rotation}deg)`;

            const opacity = Math.min(Math.abs(offsetX) / 100, 1);
            if (offsetX > 0) {
                likeOverlay.style.opacity = opacity;
                nopeOverlay.style.opacity = 0;
            } else {
                nopeOverlay.style.opacity = opacity;
                likeOverlay.style.opacity = 0;
            }
        }

        function onPointerUp(e) {
            if (!isDragging) return;
            isDragging = false;
            card.classList.remove('dragging');
            card.releasePointerCapture(e.pointerId);

            if (Math.abs(offsetX) > card.offsetWidth / 4) {
                swipe(offsetX > 0 ? 'right' : 'left');
            } else {
                card.style.transform = '';
                likeOverlay.style.opacity = 0;
                nopeOverlay.style.opacity = 0;
            }
        }

        card.addEventListener('pointerdown', onPointerDown);
        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerup', onPointerUp);
        card.addEventListener('pointercancel', onPointerUp);
    }

    function addRatingListeners(card) {
        const stars = card.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.dataset.value;
                stars.forEach(s => {
                    s.classList.toggle('selected', s.dataset.value <= rating);
                    s.innerHTML = s.dataset.value <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
                });
            });
        });
    }

    function swipe(direction) {
        const currentCard = cardStack.querySelector('.profile-card:last-of-type');
        if (!currentCard) return;

        const flyoutX = (direction === 'right' ? 1 : -1) * (window.innerWidth / 2 + currentCard.offsetWidth);
        const rotation = (direction === 'right' ? 1 : -1) * 30;
        currentCard.style.transition = 'transform 0.5s ease-out';
        currentCard.style.transform = `translateX(${flyoutX}px) rotate(${rotation}deg)`;

        if (direction === 'right') {
            // Randomly decide if it's a match
            if (Math.random() > 0.5) {
                const matchedProfile = profiles[currentProfileIndex];
                matches.push(matchedProfile);
                showMatchModal(matchedProfile);
                renderMatches();
            }
        }

        currentProfileIndex++;
        setTimeout(() => {
            currentCard.remove();
            if (currentProfileIndex < profiles.length) {
                const nextProfile = profiles[currentProfileIndex + 2];
                if (nextProfile) {
                    const newCard = createProfileCard(nextProfile);
                    newCard.style.zIndex = 0;
                    newCard.style.transform = `translateY(-20px) scale(0.9)`;
                    cardStack.prepend(newCard);
                }
            }
            if (cardStack.childElementCount === 0) {
                noMoreProfiles.classList.remove('hidden');
                noMoreProfiles.classList.add('flex');
            }
        }, 500);
    }

    function showMatchModal(profile) {
        document.getElementById('match-name').textContent = profile.name;
        document.getElementById('user-avatar').src = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200'; // Placeholder for user's own avatar
        document.getElementById('match-avatar').src = profile.image;
        matchModal.classList.remove('hidden');
        matchModal.classList.add('flex');
    }

    function renderMatches() {
        matchesGrid.innerHTML = '';
        matches.forEach(profile => {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            const randomRotate = (Math.random() - 0.5) * 10;
            matchCard.style.setProperty('--random-rotate', randomRotate);
            matchCard.innerHTML = `
                <img src="${profile.image}" alt="${profile.name}" class="w-full h-32 object-cover rounded-t-lg">
                <p class="font-kalam text-lg mt-1">${profile.name}</p>
            `;
            matchesGrid.appendChild(matchCard);
        });
    }

    // Navigation
    discoverBtn.addEventListener('click', () => {
        swipeView.classList.remove('hidden');
        matchesView.classList.add('hidden');
        discoverBtn.classList.add('active');
        matchesBtn.classList.remove('active');
    });

    matchesBtn.addEventListener('click', () => {
        swipeView.classList.add('hidden');
        matchesView.classList.remove('hidden');
        discoverBtn.classList.remove('active');
        matchesBtn.classList.add('active');
    });

    // Button controls
    likeBtn.addEventListener('click', () => swipe('right'));
    dislikeBtn.addEventListener('click', () => swipe('left'));
    closeModalBtn.addEventListener('click', () => {
        matchModal.classList.add('hidden');
        matchModal.classList.remove('flex');
    });

    // Initial Load
    loadProfiles();
});
