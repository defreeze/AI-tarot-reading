// preloadImages.js

const imageUrls = [
    "/AI_tarot_final1_wise_woman.png",
    "/AI_tarot_final1_wise_woman_animation.png",
    "/spell-visual1.png",
    //"/AI_tarot_final1_female.png",
    //"/AI_tarot_final1_female_animation.png",
    "/AI_tarot_final1.png",
    "/AI_tarot_final1_purple.png",
    "/tarotstar2.png",
    "/AI_tarot_final1_young_womanv2.png",
    "AI_tarot_final1_young_womanv2_animation.png"
];

export const preloadImages = () => {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
};
