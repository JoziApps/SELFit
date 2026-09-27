const negativePrompt = `(text), low-quality, deformed, extra limbs, blurry, bad art, (logo), watermark, blurred, cut off, extra fingers, bad quality, distortion of proportions, deformed face, matte, poorly drawn face, poorly drawn hands, poorly drawn feet, poorly drawn fingers, too many fingers, fused fingers, long neck, malformed limbs, mutated hands, mutated legs, mutation, mutilated, poorly lit, bad shadow, disfigured, cross-eyed, body out of frame, blurry, censored, black bars, (nsfw)`;

const variants = [
    {
        id: 1,
        title: "Variant 1: Realistic Portrait (Natural Golden Hour)",
        style: "Realistic Image",
        positive: "highly realistic, realistic portrait, sfw, anatomically correct, realistic photograph, real colors, award winning photo, detailed face, realistic eyes, beautiful, sharp focus, cinematic lighting, golden hour, soft lighting, professional photography, high quality, intricate details",
        negative: negativePrompt
    },
    {
        id: 2,
        title: "Variant 2: Professional Studio Photo",
        style: "Professional Photo",
        positive: "highly realistic, realistic portrait, sfw, anatomically correct, realistic photograph, real colors, award winning photo, detailed face, realistic eyes, beautiful, sharp focus, studio lighting, professional headshot, white background, high quality, intricate details",
        negative: negativePrompt
    },
    {
        id: 3,
        title: "Variant 3: Cinematic Atmospheric Portrait",
        style: "Cinematic",
        positive: "highly realistic, realistic portrait, sfw, anatomically correct, realistic photograph, real colors, award winning photo, detailed face, realistic eyes, beautiful, sharp focus, cinematic lighting, atmospheric, moody lighting, professional cinematography, high quality, intricate details",
        negative: negativePrompt
    },
    {
        id: 4,
        title: "Variant 4: Environmental Professional Portrait",
        style: "Professional Photo / Outdoor",
        positive: "highly realistic, realistic portrait, sfw, anatomically correct, realistic photograph, real colors, award winning photo, detailed face, realistic eyes, beautiful, sharp focus, outdoor setting, natural lighting, environmental portrait, professional photography, high quality, intricate details",
        negative: negativePrompt
    },
    {
        id: 5,
        title: "Variant 5: Cinematic Night Street Scene",
        style: "Cinematic / Night",
        positive: "highly realistic, realistic portrait, sfw, anatomically correct, realistic photograph, real colors, award winning photo, detailed face, realistic eyes, beautiful, sharp focus, night lighting, street lighting, neon glow, cinematic atmosphere, professional cinematography, high quality, intricate details",
        negative: negativePrompt
    }
];

let toastTimer = null;

function showToast(message = "Copied to clipboard!") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    
    // Clear previous timer to prevent overlapping toasts
    if (toastTimer) clearTimeout(toastTimer);
    
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        toastTimer = null;
    }, 2000);
}

function copyToClipboard(text, typeName) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${typeName} copied!`);
    }).catch(err => {
        showToast("Failed to copy");
    });
}

// Use DocumentFragment to batch DOM insertions for better performance
const container = document.getElementById("prompts-container");
const fragment = document.createDocumentFragment();

variants.forEach(variant => {
    const card = document.createElement("div");
    card.className = "card";
    
    // Use data attributes for event delegation instead of inline handlers
    card.innerHTML = `
        <div class="card-header">
            <span class="card-title">${variant.title}</span>
            <span class="tag">${variant.style}</span>
        </div>
        
        <div class="section-title">Positive Prompt</div>
        <div class="prompt-box">${variant.positive}</div>

        <div class="section-title">Negative Prompt</div>
        <div class="prompt-box">${variant.negative}</div>

        <div class="btn-copy-group">
            <button class="btn" data-prompt-text="${escapeHtml(variant.positive)}" data-prompt-type="Positive prompt">
                Copy Positive Prompt
            </button>
            <button class="btn" data-prompt-text="${escapeHtml(variant.negative)}" data-prompt-type="Negative prompt">
                Copy Negative Prompt
            </button>
        </div>
    `;
    
    fragment.appendChild(card);
});

// Single append with fragment - more efficient than multiple appendChild calls
container.appendChild(fragment);

// Event delegation: handle all button clicks with a single listener
container.addEventListener("click", event => {
    const button = event.target.closest("button[data-prompt-text]");
    if (!button) return;
    
    const promptText = unescapeHtml(button.dataset.promptText);
    const promptType = button.dataset.promptType;
    copyToClipboard(promptText, promptType);
});

// Helper functions for safe HTML attribute values
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function unescapeHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}
